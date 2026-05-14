import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, QrCode } from "lucide-react";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import type { Category, Dish } from "@/lib/types";
import { calcTotals, formatPrice, useCart } from "@/lib/store";
import { fetchDishes, fetchTableByToken } from "@/lib/api";
import { DishCard } from "@/components/DishCard";
import { OrderModal } from "@/components/OrderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { Logo } from "@/components/Logo";
import { LanguageToggle, useT } from "@/lib/i18n";

const searchSchema = z.object({
  t: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/menu")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Menu — AURALIS" },
      { name: "description", content: "Order directly from your table." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { t: token } = Route.useSearch();
  const cart = useCart((s) => s.cart);
  const { t } = useT();

  const TABS: Array<{ key: "all" | Category; label: string }> = [
    { key: "all", label: t("common.all") },
    { key: "starters", label: t("cat.starters") },
    { key: "mains", label: t("cat.mains") },
    { key: "desserts", label: t("cat.desserts") },
    { key: "drinks", label: t("cat.drinks") },
    { key: "specials", label: t("cat.specials") },
  ];

  const tableQuery = useQuery({
    queryKey: ["table", token],
    queryFn: () => fetchTableByToken(token!),
    enabled: !!token,
  });

  const dishesQuery = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  });

  const [active, setActive] = useState<"all" | Category>("all");
  const [selected, setSelected] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setWelcome(false), 1800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => { if (token) sessionStorage.setItem("auralis-token", token); }, [token]);

  const table = tableQuery.data;
  const previewMode = !token;
  const filtered = useMemo(() => {
    const list = dishesQuery.data ?? [];
    const visible = list.filter((d) => d.available && (table?.is_vip || !d.isVipOnly));
    return active === "all" ? visible : visible.filter((d) => d.category === active);
  }, [dishesQuery.data, active, table]);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totals = calcTotals(cart);

  if (token && tableQuery.isLoading) return <Loading />;
  if (token && (!table || !table.active)) return <ScanRequired invalid />;

  return (
    <div className="relative min-h-screen pb-32">
      {!previewMode && table && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: welcome ? 1 : 0, pointerEvents: welcome ? "auto" : "none" }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
        >
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t("menu.welcome")}</div>
            <h1 className="mt-3 font-display text-5xl gold-text">{table.name}</h1>
            {table.is_vip && <div className="mt-2 text-[10px] uppercase tracking-[0.4em] text-gold-soft">{t("menu.vipService")}</div>}
            <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </motion.div>
      )}

      <header className="sticky top-0 z-30 border-b hairline glass-strong">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="text-end">
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{previewMode ? t("common.preview") : t("menu.nowServing")}</div>
              <div className="font-display gold-text">{previewMode ? t("common.browseMode") : table?.name}</div>
            </div>
          </div>
        </div>
        <nav className="border-t hairline">
          <div className="mx-auto max-w-7xl">
            <div className="scrollbar-hide flex gap-1 overflow-x-auto px-3 py-3 md:justify-center md:px-6">
              {TABS.map((tab) => {
                const isActive = active === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActive(tab.key)}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${isActive ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      <section className="px-4 pt-10 pb-6 md:px-6 md:pt-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">{t("menu.alaCarte")}</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl text-balance">{t("menu.tonightsMenu")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            {t("menu.tonightsBody")}
          </p>
        </div>
      </section>

      <section className="px-4 md:px-6">
        {dishesQuery.isLoading ? (
          <div className="py-24 text-center text-sm text-muted-foreground">{t("menu.loadingMenu")}</div>
        ) : (
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((d, i) => (
              <DishCard key={d.id} dish={d} index={i} onSelect={setSelected} />
            ))}
          </div>
        )}
      </section>

      {!previewMode && totalQty > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 sm:bottom-8"
        >
          <span className="flex items-center gap-3 rounded-full bg-gold px-6 py-4 font-medium text-primary-foreground shadow-[0_20px_60px_-15px_oklch(0.82_0.13_85_/_0.7)] transition-transform hover:scale-105">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm">{totalQty} {totalQty > 1 ? t("menu.items") : t("menu.item")}</span>
            <span className="h-4 w-px bg-primary-foreground/30" />
            <span className="font-display text-base">{formatPrice(totals.total)}</span>
          </span>
        </button>
      )}

      <OrderModal dish={previewMode ? null : selected} onClose={() => setSelected(null)} />
      {table && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} table={table} />}
    </div>
  );
}

function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="font-display text-2xl gold-text">AURALIS</div>
    </div>
  );
}

function ScanRequired({ invalid }: { invalid?: boolean }) {
  const { t } = useT();
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15">
          <QrCode className="h-8 w-8 text-gold" />
        </div>
        <h1 className="mt-6 font-display text-3xl gold-text">
          {invalid ? t("menu.invalidCode") : t("menu.scanTable")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {invalid ? t("menu.invalidBody") : t("menu.scanBody")}
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-full border hairline px-6 py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
          {t("menu.returnAuralis")}
        </Link>
      </div>
    </div>
  );
}
