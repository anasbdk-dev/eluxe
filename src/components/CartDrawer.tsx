import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { calcTotals, formatPrice, useStore } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  table: string;
}

export function CartDrawer({ open, onClose, table }: Props) {
  const cart = useStore((s) => s.cart);
  const updateQty = useStore((s) => s.updateQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const placeOrder = useStore((s) => s.placeOrder);
  const totals = calcTotals(cart);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const submit = () => {
    if (!cart.length) return;
    const o = placeOrder(table);
    setConfirmed(o.id);
    toast.success("Order sent to kitchen");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
          onClick={() => { onClose(); setConfirmed(null); }}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col glass-strong"
          >
            <header className="flex items-center justify-between border-b hairline p-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Your Order</div>
                <div className="font-display text-xl">Table {table}</div>
              </div>
              <button onClick={() => { onClose(); setConfirmed(null); }} className="grid h-9 w-9 place-items-center rounded-full bg-secondary hover:bg-card">
                <X className="h-4 w-4" />
              </button>
            </header>

            {confirmed ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className="grid h-24 w-24 place-items-center rounded-full bg-gold/15 gold-glow"
                >
                  <Sparkles className="h-10 w-10 text-gold" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="font-display text-3xl gold-text">Bon appétit</h3>
                  <p className="text-sm text-muted-foreground text-balance">
                    Your order has been sent to the kitchen successfully. Estimated preparation: 20–25 minutes.
                  </p>
                </div>
                <button
                  onClick={() => { setConfirmed(null); onClose(); }}
                  className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-gold-soft"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">Your cart is empty</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {cart.map((item) => (
                        <motion.li
                          key={item.dish.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          className="flex gap-3 rounded-2xl glass p-3"
                        >
                          <img src={item.dish.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="truncate font-display text-base">{item.dish.name}</h4>
                              <button onClick={() => removeFromCart(item.dish.id)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            {item.notes && <p className="mt-0.5 line-clamp-1 text-xs italic text-muted-foreground">"{item.notes}"</p>}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="inline-flex items-center gap-2 rounded-full bg-secondary p-1">
                                <button onClick={() => updateQty(item.dish.id, item.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-background hover:bg-card">
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-5 text-center text-sm">{item.qty}</span>
                                <button onClick={() => updateQty(item.dish.id, item.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-gold text-primary-foreground hover:bg-gold-soft">
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="font-display gold-text">{formatPrice(item.dish.price * item.qty)}</span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="space-y-4 border-t hairline p-5">
                    <dl className="space-y-1.5 text-sm">
                      <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                      <Row label="Service (10%)" value={formatPrice(totals.service)} />
                      <Row label="Tax (8%)" value={formatPrice(totals.tax)} />
                      <div className="my-2 h-px bg-border" />
                      <Row label="Total" value={formatPrice(totals.total)} large />
                    </dl>
                    <button
                      onClick={submit}
                      className="w-full rounded-xl bg-gold py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-gold-soft hover:shadow-[0_12px_40px_-10px_oklch(0.82_0.13_85_/_0.6)]"
                    >
                      Confirm Order
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className={large ? "font-display text-base" : "text-muted-foreground"}>{label}</dt>
      <dd className={large ? "font-display text-lg gold-text" : "text-foreground"}>{value}</dd>
    </div>
  );
}
