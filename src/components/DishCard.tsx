import { Flame, Clock } from "lucide-react";
import type { Dish } from "@/lib/types";
import { BadgePill } from "./BadgePill";
import { formatPrice } from "@/lib/store";
import { useT } from "@/lib/i18n";

interface Props {
  dish: Dish;
  onSelect: (d: Dish) => void;
  index?: number;
}

export function DishCard({ dish, onSelect, index = 0 }: Props) {
  const { t } = useT();
  // Cheap CSS fade-in, capped delay; no framer-motion per card.
  const delay = `${Math.min(index * 30, 240)}ms`;
  return (
    <button
      onClick={() => onSelect(dish)}
      style={{ animationDelay: delay }}
      className="dish-card group relative overflow-hidden rounded-2xl text-left glass hover:gold-glow transition-shadow duration-500 disabled:opacity-50 animate-fade-in motion-reduce:animate-none"
      disabled={!dish.available}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {dish.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {dish.badges.slice(0, 2).map((b) => <BadgePill key={b} badge={b} />)}
          </div>
        )}
        {!dish.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t("common.unavailable")}
          </div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-foreground">{dish.name}</h3>
          <span className="font-display text-xl gold-text shrink-0">{formatPrice(dish.price)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground text-balance">{dish.description}</p>
        <div className="flex items-center gap-3 pt-1 text-[11px] uppercase tracking-wider text-muted-foreground/80">
          {dish.calories != null && (
            <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3" />{dish.calories} kcal</span>
          )}
          {dish.prepTime != null && (
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{dish.prepTime} min</span>
          )}
        </div>
      </div>
    </button>
  );
}
