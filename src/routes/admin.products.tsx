import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Plus, Search, Trash2, X } from "lucide-react";
import { useStore, formatPrice } from "@/lib/store";
import type { Badge, Category, Dish } from "@/lib/types";
import { BADGE_LABELS, CATEGORY_LABELS } from "@/lib/types";
import { BadgePill } from "@/components/BadgePill";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: Products,
});

const ALL_BADGES: Badge[] = ["vip", "exclusive", "bestseller", "discount", "new", "chef", "spicy", "limited"];
const CATS: Category[] = ["starters", "mains", "desserts", "drinks", "specials"];

interface FormData {
  name: string; description: string; price: number;
  category: Category; image: string;
  calories?: number; prepTime?: number;
  badges: Badge[]; available: boolean;
}

const empty: FormData = {
  name: "", description: "", price: 0, category: "mains",
  image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=900&q=80",
  badges: [], available: true,
};

function Products() {
  const dishes = useStore((s) => s.dishes);
  const addDish = useStore((s) => s.addDish);
  const updateDish = useStore((s) => s.updateDish);
  const deleteDish = useStore((s) => s.deleteDish);
  const toggleAvailability = useStore((s) => s.toggleAvailability);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [editing, setEditing] = useState<Dish | "new" | null>(null);

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      if (q && !d.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [dishes, q, cat]);

  return (
    <div className="space-y-6 p-5 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Menu</div>
          <h1 className="mt-2 font-display text-4xl">Dishes & beverages</h1>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> New dish
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes…"
            className="w-full rounded-full border border-border bg-input/60 py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="scrollbar-hide flex gap-1 overflow-x-auto">
          {(["all", ...CATS] as const).map((c) => (
            <button
              key={c} onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] ${cat === c ? "bg-gold text-primary-foreground" : "border hairline text-muted-foreground hover:text-foreground"}`}
            >
              {c === "all" ? "All" : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl glass">
        <table className="w-full">
          <thead className="border-b hairline text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Dish</th>
              <th className="hidden px-3 py-3 text-left md:table-cell">Category</th>
              <th className="hidden px-3 py-3 text-left lg:table-cell">Badges</th>
              <th className="px-3 py-3 text-right">Price</th>
              <th className="px-3 py-3 text-center">Active</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {filtered.map((d) => (
              <tr key={d.id} className="transition-colors hover:bg-secondary/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={d.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{d.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{d.description}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-3 py-3 text-sm text-muted-foreground md:table-cell">{CATEGORY_LABELS[d.category]}</td>
                <td className="hidden px-3 py-3 lg:table-cell">
                  <div className="flex flex-wrap gap-1">{d.badges.slice(0, 3).map((b) => <BadgePill key={b} badge={b} />)}</div>
                </td>
                <td className="px-3 py-3 text-right font-display gold-text">{formatPrice(d.price)}</td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => toggleAvailability(d.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${d.available ? "bg-gold" : "bg-secondary"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${d.available ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => setEditing(d)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { deleteDish(d.id); toast.success("Dish removed"); }} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">No dishes match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <DishForm
            initial={editing === "new" ? empty : toForm(editing)}
            onClose={() => setEditing(null)}
            onSubmit={(d) => {
              if (editing === "new") { addDish(d); toast.success("Dish added"); }
              else { updateDish(editing.id, d); toast.success("Dish updated"); }
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function toForm(d: Dish): FormData {
  return {
    name: d.name, description: d.description, price: d.price,
    category: d.category, image: d.image, calories: d.calories,
    prepTime: d.prepTime, badges: d.badges, available: d.available,
  };
}

function DishForm({ initial, onClose, onSubmit }: { initial: FormData; onClose: () => void; onSubmit: (d: FormData) => void }) {
  const [f, setF] = useState<FormData>(initial);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md sm:items-center" onClick={onClose}>
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl glass-strong p-6 md:p-8"
      >
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-secondary hover:bg-card"><X className="h-4 w-4" /></button>
        <h2 className="font-display text-3xl">{initial.name ? "Edit dish" : "New dish"}</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Name" full><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="adm-input" /></Field>
          <Field label="Price ($)"><input type="number" min={0} step={0.01} value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} className="adm-input" /></Field>
          <Field label="Category">
            <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })} className="adm-input">
              {CATS.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </Field>
          <Field label="Description" full>
            <textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="adm-input resize-none" />
          </Field>
          <Field label="Image URL" full>
            <input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} className="adm-input" placeholder="https://… or upload below" />
            <div className="mt-2 flex items-center gap-3">
              <label className="cursor-pointer rounded-full border hairline px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary">
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => setF({ ...f, image: ev.target?.result as string });
                  reader.readAsDataURL(file);
                }} />
              </label>
              {f.image && <img src={f.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
            </div>
          </Field>
          <Field label="Calories"><input type="number" value={f.calories ?? ""} onChange={(e) => setF({ ...f, calories: e.target.value ? Number(e.target.value) : undefined })} className="adm-input" /></Field>
          <Field label="Prep time (min)"><input type="number" value={f.prepTime ?? ""} onChange={(e) => setF({ ...f, prepTime: e.target.value ? Number(e.target.value) : undefined })} className="adm-input" /></Field>

          <Field label="Badges" full>
            <div className="flex flex-wrap gap-2">
              {ALL_BADGES.map((b) => {
                const on = f.badges.includes(b);
                return (
                  <button type="button" key={b}
                    onClick={() => setF({ ...f, badges: on ? f.badges.filter((x) => x !== b) : [...f.badges, b] })}
                    className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] transition-colors ${on ? "bg-gold text-primary-foreground" : "border hairline text-muted-foreground hover:text-foreground"}`}
                  >{BADGE_LABELS[b]}</button>
                );
              })}
            </div>
          </Field>
          <Field label="Status" full>
            <label className="inline-flex items-center gap-3 text-sm">
              <input type="checkbox" checked={f.available} onChange={(e) => setF({ ...f, available: e.target.checked })} />
              Available on menu
            </label>
          </Field>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border py-3 text-sm hover:bg-secondary">Cancel</button>
          <button onClick={() => onSubmit(f)} className="flex-1 rounded-xl bg-gold py-3 text-sm font-semibold text-primary-foreground hover:bg-gold-soft">Save dish</button>
        </div>
      </motion.div>
      <style>{`.adm-input{width:100%;background:oklch(0.13 0.005 60 / 0.6);border:1px solid var(--color-border);border-radius:10px;padding:10px 14px;font-size:14px;color:var(--color-foreground)} .adm-input:focus{outline:none;border-color:var(--color-gold);box-shadow:0 0 0 3px oklch(0.82 0.13 85 / 0.18)}`}</style>
    </motion.div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
