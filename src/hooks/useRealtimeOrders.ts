import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { OrderWithItems } from "@/lib/types";

export const ORDERS_QUERY_KEY = ["orders"] as const;

async function fetchOrders(): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []) as OrderWithItems[];
}

export function useOrders() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ORDERS_QUERY_KEY, queryFn: fetchOrders });

  useEffect(() => {
    const ch = supabase
      .channel(`orders-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => {
        qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  return query;
}
