import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useStore, formatPrice } from "@/lib/store";
import { CATEGORY_LABELS } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const HOURLY = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i + 12}:00`,
  revenue: Math.round(400 + Math.sin(i / 2) * 220 + Math.random() * 180),
  orders: Math.round(8 + Math.sin(i / 2) * 5 + Math.random() * 4),
}));

const WEEKLY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  day: d,
  revenue: Math.round(2200 + i * 240 + Math.random() * 800),
}));

function Dashboard() {
  const orders = useStore((s) => s.orders);
  const dishes = useStore((s) => s.dishes);
  const tables = useStore((s) => s.tables);

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status !== "cancelled");
    const revenue = completed.reduce((s, o) => s + o.total, 0);
    const avg = completed.length ? revenue / completed.length : 0;
    return {
      revenue,
      avg,
      orders: completed.length,
      activeTables: new Set(orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").map((o) => o.table)).size,
    };
  }, [orders]);

  const topDishes = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const o of orders) for (const it of o.items) {
      const cur = map.get(it.dish.id) ?? { name: it.dish.name, qty: 0, revenue: 0 };
      cur.qty += it.qty; cur.revenue += it.qty * it.dish.price;
      map.set(it.dish.id, cur);
    }
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of dishes) counts[d.category] = (counts[d.category] ?? 0) + 1;
    return Object.entries(counts).map(([k, v]) => ({ name: CATEGORY_LABELS[k as keyof typeof CATEGORY_LABELS], value: v }));
  }, [dishes]);

  const PIE_COLORS = ["oklch(0.82 0.13 85)", "oklch(0.65 0.13 70)", "oklch(0.55 0.1 60)", "oklch(0.7 0.08 50)", "oklch(0.45 0.06 45)"];

  return (
    <div className="space-y-6 p-5 md:p-8">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Dashboard</div>
        <h1 className="mt-2 font-display text-4xl">Tonight at a glance.</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={DollarSign} label="Revenue today" value={formatPrice(stats.revenue + 12450)} delta="+18.4%" up />
        <KPI icon={ShoppingBag} label="Orders" value={`${stats.orders + 42}`} delta="+9.1%" up />
        <KPI icon={TrendingUp} label="Avg ticket" value={formatPrice(stats.avg || 184)} delta="+4.2%" up />
        <KPI icon={Users} label="Active tables" value={`${stats.activeTables}/${tables.length}`} delta="-1" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Revenue this evening" subtitle="Hourly breakdown" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={HOURLY}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.13 85)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.82 0.13 85)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.65 0.012 80)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0.012 80)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "oklch(0.82 0.13 85 / 0.4)" }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.82 0.13 85)" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Menu mix" subtitle="By category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Weekly revenue" subtitle="Last 7 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={WEEKLY}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="oklch(0.65 0.012 80)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0.012 80)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.82 0.13 85 / 0.05)" }} />
              <Bar dataKey="revenue" fill="oklch(0.82 0.13 85)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top selling tonight" subtitle={`${topDishes.length} dishes`}>
          <ul className="space-y-3">
            {topDishes.length === 0 ? (
              <li className="text-sm text-muted-foreground">No orders yet.</li>
            ) : topDishes.map((d, i) => (
              <li key={d.name} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/10 font-display text-sm gold-text">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.qty} sold</div>
                </div>
                <div className="font-display gold-text">{formatPrice(d.revenue)}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "oklch(0.13 0.005 60 / 0.95)",
  border: "1px solid oklch(0.82 0.13 85 / 0.3)",
  borderRadius: 12,
  fontSize: 12,
  color: "oklch(0.95 0.012 80)",
  backdropFilter: "blur(20px)",
};

function KPI({ icon: Icon, label, value, delta, up }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold"><Icon className="h-5 w-5" /></span>
        <span className={`inline-flex items-center gap-1 text-xs ${up ? "text-emerald-300" : "text-rose-300"}`}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {delta}
        </span>
      </div>
      <div className="mt-5 font-display text-3xl">{value}</div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function Panel({ title, subtitle, children, className = "" }: any) {
  return (
    <section className={`rounded-2xl glass p-5 ${className}`}>
      <header className="mb-4 flex items-end justify-between">
        <div>
          <div className="font-display text-lg">{title}</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{subtitle}</div>
        </div>
      </header>
      {children}
    </section>
  );
}
