import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { CATEGORY_LABELS, type Category, type Dish } from "@/lib/types";
import { calcTotals, formatPrice, useStore } from "@/lib/store";
import { DishCard } from "@/components/DishCard";
import { OrderModal } from "@/components/OrderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { Logo } from "@/components/Logo";

const searchSchema = z.object({
  table: fallback(z.string(), "1").default("1"),
});

export const Route = createFileRoute("/menu")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Menu — AURALIS" },
      { name: "description", content: "Explore tonight's menu and order directly from your table." },
    ],
  }),
  component: MenuPage,
});

const TABS: Array<{ key: "all" | Category; label: string }> = [
  { key: "all", label: "All" },
  { key: "starters", label: CATEGORY_LABELS.starters },
  { key: "mains", label: CATEGORY_LABELS.mains },
  { key: "desserts", label: CATEGORY_LABELS.desserts },
  { key: "drinks", label: CATEGORY_LABELS.drinks },
  { key: "specials", label: CATEGORY_LABELS.specials },
];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MenuPage() {
  const { table } = Route.useSearch();
  const dishes = useStore((s) => s.dishes);
  const cart = useStore((s) => s.cart);
  const setTable = useStore((s) => s.setTable);

  const [active, setActive] = useState<"all" | Category>("all");
  const [selected, setSelected] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [welcome, setWelcome] = useState(true);

  useEffect(() => { setTable(table); }, [table, setTable]);
  useEffect(() => {
    const t = setTimeout(() => setWelcome(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const seed = useMemo(() => Math.floor(Date.now() / (1000 * 60 * 5)), []);
  const filtered = useMemo(() => {
    const list = active === "all" ? dishes : dishes.filter((d) => d.category === active);
    return shuffle(list, seed);
  }, [dishes, active, seed]);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totals = calcTotals(cart);

  return (
    <div className="relative min-h-screen pb-32">
      {/* Welcome flash */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: welcome ? 1 : 0, pointerEvents: welcome ? "auto" : "none" }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase tracking-[0.4em] text-gold"
          >Welcome</motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-3 font-display text-5xl gold-text"
          >Table {table}</motion.h1>
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 1 }}
            className="mx-auto mt-6 h-px w-32 origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </div>
      </motion.div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b hairline glass-strong">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-secondary hover:bg-card">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Logo />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Now serving</div>
            <div className="font-display gold-text">Table {table}</div>
          </div>
        </div>

        {/* Sticky tabs */}
        <nav className="border-t hairline">
          <div className="mx-auto max-w-7xl">
            <div className="scrollbar-hide flex gap-1 overflow-x-auto px-3 py-3 md:justify-center md:px-6">
              {TABS.map((t) => {
                const isActive = active === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    className="relative whitespace-nowrap rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tab"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-gold"
                      />
                    )}
                    <span className={`relative ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Menu hero */}
      <section className="px-4 pt-10 pb-6 md:px-6 md:pt-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">À la carte</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl text-balance">Tonight's Menu</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Curated daily by our chef. Tap any dish to add it to your order — your table is already with us.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((d, i) => (
            <DishCard key={d.id} dish={d} index={i} onSelect={setSelected} />
          ))}
        </div>
      </section>

      {/* Floating cart button */}
      {totalQty > 0 && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 sm:bottom-8"
        >
          <span className="flex items-center gap-3 rounded-full bg-gold px-6 py-4 font-medium text-primary-foreground shadow-[0_20px_60px_-15px_oklch(0.82_0.13_85_/_0.7)] transition-transform hover:scale-105">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm">{totalQty} Item{totalQty > 1 ? "s" : ""}</span>
            <span className="h-4 w-px bg-primary-foreground/30" />
            <span className="font-display text-base">{formatPrice(totals.total)}</span>
          </span>
        </motion.button>
      )}

      <OrderModal dish={selected} onClose={() => setSelected(null)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} table={table} />
    </div>
  );
}
