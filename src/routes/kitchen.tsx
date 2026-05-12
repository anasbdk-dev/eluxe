import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, ChefHat, CheckCheck, Clock, X } from "lucide-react";
import { useStore, timeSince } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Kitchen Display — AURALIS" },
      { name: "description", content: "Real-time kitchen orchestration for fine-dining service." },
    ],
  }),
  component: Kitchen,
});

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  new: "preparing",
  preparing: "ready",
  ready: "delivered",
  delivered: null,
  cancelled: null,
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "border-gold/60 bg-gold/10 text-gold",
  preparing: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  ready: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  delivered: "border-border bg-secondary text-muted-foreground",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
};

const FILTERS: Array<{ key: "active" | OrderStatus | "all"; label: string }> = [
  { key: "active", label: "Active" },
  { key: "new", label: "New" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
  { key: "all", label: "All" },
];

function Kitchen() {
  const orders = useStore((s) => s.orders);
  const setOrderStatus = useStore((s) => s.setOrderStatus);
  const cancelOrder = useStore((s) => s.cancelOrder);

  const [, setTick] = useState(0);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("active");
  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set(orders.map((o) => o.id)));

  // re-render every 5s for timers
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(i);
  }, []);

  // notify on new orders
  useEffect(() => {
    const newOnes = orders.filter((o) => !seenIds.has(o.id));
    if (newOnes.length) {
      setSeenIds(new Set(orders.map((o) => o.id)));
    }
  }, [orders, seenIds]);

  const visible = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "active") return orders.filter((o) => o.status === "new" || o.status === "preparing" || o.status === "ready");
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(() => ({
    new: orders.filter((o) => o.status === "new").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  }), [orders]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b hairline glass-strong">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-secondary hover:bg-card">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Logo />
            <span className="hidden md:inline rounded-full border hairline px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
              Kitchen Display
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Stat label="New" value={counts.new} accent="text-gold" />
            <Stat label="Cooking" value={counts.preparing} accent="text-amber-300" />
            <Stat label="Ready" value={counts.ready} accent="text-emerald-300" />
            <span className="hidden sm:grid h-9 w-9 place-items-center rounded-full bg-gold/10 text-gold">
              <Bell className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="border-t hairline">
          <div className="scrollbar-hide mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-4 py-2.5">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${active ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
        {visible.length === 0 ? (
          <div className="grid place-items-center py-32 text-center">
            <ChefHat className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">All caught up. Service flowing smoothly.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((order) => {
                const next = STATUS_FLOW[order.status];
                return (
                  <motion.article
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden rounded-2xl glass gold-border"
                  >
                    <header className="flex items-center justify-between border-b hairline p-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Table</div>
                        <div className="font-display text-2xl gold-text leading-none">{order.table}</div>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${STATUS_STYLE[order.status]}`}>
                        {order.status}
                      </span>
                    </header>
                    <ul className="divide-y hairline">
                      {order.items.map((it) => (
                        <li key={it.dish.id} className="flex items-start gap-3 p-4">
                          <span className="font-display text-lg gold-text">{it.qty}×</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium leading-tight">{it.dish.name}</div>
                            {it.notes && <div className="mt-1 text-xs italic text-amber-300/90">"{it.notes}"</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <footer className="space-y-3 border-t hairline p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" />{timeSince(order.createdAt)} ago</span>
                        <span className="font-display text-base text-foreground">${order.total.toFixed(2)}</span>
                      </div>
                      {(order.status === "new" || order.status === "preparing" || order.status === "ready") && (
                        <div className="flex gap-2">
                          {next && (
                            <button
                              onClick={() => setOrderStatus(order.id, next)}
                              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-gold-soft"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              Mark {next}
                            </button>
                          )}
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="grid h-10 w-10 place-items-center rounded-xl border hairline text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </footer>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border hairline px-3 py-1.5 text-center">
      <div className={`font-display text-lg leading-none ${accent}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}
