// src/lib/server/orders.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// ── Order rate limiting (per table token) ──────────────────────────────────
const orderCooldowns = new Map<string, number>();
const ORDER_COOLDOWN_MS = 30_000; // 30s between orders per table
const MAX_ITEMS_PER_ORDER = 30;
const MAX_ITEM_QTY = 20;
const MAX_ORDER_TOTAL = 10_000; // $10,000 sanity cap

const orderItemSchema = z.object({
  dish_id: z.string().uuid(),
  name: z.string().max(200).trim(),
  price: z.number().positive().max(MAX_ORDER_TOTAL),
  qty: z.number().int().min(1).max(MAX_ITEM_QTY),
  notes: z.string().max(500).optional(),
});

const placeOrderSchema = z.object({
  table_id: z.string().uuid(),
  table_name: z.string().max(100).trim(),
  qr_token: z.string().min(10).max(500),
  items: z.array(orderItemSchema).min(1).max(MAX_ITEMS_PER_ORDER),
  subtotal: z.number().positive().max(MAX_ORDER_TOTAL),
  service: z.number().min(0).max(MAX_ORDER_TOTAL),
  tax: z.number().min(0).max(MAX_ORDER_TOTAL),
  total: z.number().positive().max(MAX_ORDER_TOTAL),
  notes: z.string().max(500).optional(),
});

type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const placeOrderSecure = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }: { data: PlaceOrderInput }) => {
    // 1. Verify table exists and is active
    const { data: table, error: tableError } = await supabase
      .from("tables")
      .select("id, name, active, qr_token, is_vip")
      .eq("id", data.table_id)
      .eq("qr_token", data.qr_token)
      .eq("active", true)
      .maybeSingle();

    if (tableError || !table) {
      throw new Error("Invalid or inactive table");
    }

    // 2. Rate limit per table token
    const cooldownKey = data.qr_token;
    const lastOrder = orderCooldowns.get(cooldownKey) ?? 0;
    if (Date.now() - lastOrder < ORDER_COOLDOWN_MS) {
      throw new Error("Order submitted too recently. Please wait before ordering again.");
    }

    // 3. Server-side total recalculation — never trust client totals
    const { data: dishes } = await supabase
      .from("dishes")
      .select("id, price, available, is_vip_only")
      .in("id", data.items.map((i) => i.dish_id));

    if (!dishes) throw new Error("Failed to verify menu items");

    let recalculatedSubtotal = 0;
    for (const item of data.items) {
      const dish = dishes.find((d) => d.id === item.dish_id);
      if (!dish) throw new Error(`Dish ${item.dish_id} not found`);
      if (!dish.available) throw new Error(`Dish is no longer available`);
      if (dish.is_vip_only && !table.is_vip) {
        // Note: table doesn't have is_vip here — adjust query above if needed
        throw new Error("VIP item not available for this table");
      }
      recalculatedSubtotal += Number(dish.price) * item.qty;
    }

    const recalcService = +(recalculatedSubtotal * 0.1).toFixed(2);
    const recalcTax = +(recalculatedSubtotal * 0.08).toFixed(2);
    const recalcTotal = +(recalculatedSubtotal + recalcService + recalcTax).toFixed(2);

    // 4. Validate client totals match server calculation (within $0.02 for floating point)
    if (Math.abs(recalcTotal - data.total) > 0.02) {
      console.warn(`[SECURITY] Price manipulation attempt on table ${data.table_id}: ` +
        `client=${data.total} server=${recalcTotal}`);
      throw new Error("Order total mismatch. Please refresh and try again.");
    }

    // 5. Insert with server-calculated values
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        table_id: data.table_id,
        table_name: table.name, // use DB value, not client value
        subtotal: recalculatedSubtotal,
        service: recalcService,
        tax: recalcTax,
        total: recalcTotal,
        notes: data.notes,
        status: "new",
      })
      .select()
      .single();

    if (error) throw error;

    const items = data.items.map((i) => {
      const dish = dishes.find((d) => d.id === i.dish_id)!;
      return {
        order_id: order.id,
        dish_id: i.dish_id,
        name: i.name,
        price: Number(dish.price), // use DB price
        qty: i.qty,
        notes: i.notes,
        image: "",
      };
    });

    const { error: itemsErr } = await supabase.from("order_items").insert(items);
    if (itemsErr) throw itemsErr;

    // 6. Record cooldown only after successful insertion
    orderCooldowns.set(cooldownKey, Date.now());

    return { orderId: order.id };
  });
