import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useStore, formatPrice, timeSince } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

const STATUSES: Array<OrderStatus | "all"> = ["all", "new", "preparing", "ready", "delivered", "cancelled"];

const STYLE: Record<OrderStatus, string> = {
  new: "bg-gold/10 text-gold",
  preparing: "bg-amber-400/10 text-amber-300",
  ready: "bg-emerald-400/10 text-emerald-300",
  delivered: "bg-secondary text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const cancelOrder = useStore((s) => s.cancelOrder);
  const setStatus = useStore((s) => s.setOrderStatus);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (q && !o.table.toLowerCase().includes(q.toLowerCase()) && !o.id.includes(q)) return false;
    return true;
  }), [orders, q, filter]);

  return (
    <div className="space-y-6 p-5 md:p-8">
      <header>
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Orders</div>
        <h1 className="mt-2 font-display text-4xl">Service queue</h1>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by table or id…"
            className="w-full rounded-full border border-border bg-input/60 py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="scrollbar-hide flex gap-1 overflow-x-auto">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] ${filter === s ? "bg-gold text-primary-foreground" : "border hairline text-muted-foreground hover:text-foreground"}`}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((o) => (
          <article key={o.id} className="rounded-2xl glass p-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Table</div>
                  <div className="font-display text-2xl gold-text">{o.table}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order</div>
                  <div className="text-sm">#{o.id.slice(0, 6)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Placed</div>
                  <div className="text-sm">{timeSince(o.createdAt)} ago</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                  className={`rounded-full border-0 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] ${STYLE[o.status]}`}
                >
                  {(["new", "preparing", "ready", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button onClick={() => { cancelOrder(o.id); toast.success("Order cancelled"); }} className="grid h-8 w-8 place-items-center rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>
            <ul className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
              {o.items.map((it) => (
                <li key={it.dish.id} className="flex justify-between gap-3 rounded-lg bg-background/30 px-3 py-2">
                  <span className="truncate"><span className="text-gold">{it.qty}×</span> {it.dish.name}</span>
                  <span className="text-muted-foreground">{formatPrice(it.dish.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <footer className="mt-4 flex items-center justify-between border-t hairline pt-3 text-xs text-muted-foreground">
              <span>Subtotal {formatPrice(o.subtotal)} • Service {formatPrice(o.service)} • Tax {formatPrice(o.tax)}</span>
              <span className="font-display text-base text-foreground">{formatPrice(o.total)}</span>
            </footer>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl glass p-16 text-center text-sm text-muted-foreground">No orders match.</div>
        )}
      </div>
    </div>
  );
}
