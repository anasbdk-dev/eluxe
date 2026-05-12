import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  Dish,
  Order,
  OrderStatus,
  Reservation,
  Table,
} from "./types";
import {
  SEED_DISHES,
  SEED_ORDERS,
  SEED_RESERVATIONS,
  SEED_TABLES,
} from "./mock-data";

const SERVICE_RATE = 0.1;
const TAX_RATE = 0.08;

interface Totals {
  subtotal: number;
  service: number;
  tax: number;
  total: number;
}

export function calcTotals(items: CartItem[]): Totals {
  const subtotal = items.reduce((s, i) => s + i.dish.price * i.qty, 0);
  const service = +(subtotal * SERVICE_RATE).toFixed(2);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + service + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), service, tax, total };
}

interface State {
  dishes: Dish[];
  tables: Table[];
  orders: Order[];
  reservations: Reservation[];
  cart: CartItem[];
  table: string | null;

  setTable: (t: string | null) => void;
  addToCart: (dish: Dish, qty: number, notes?: string) => void;
  updateQty: (dishId: string, qty: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;

  placeOrder: (table: string) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => void;

  addDish: (d: Omit<Dish, "id">) => void;
  updateDish: (id: string, patch: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  toggleAvailability: (id: string) => void;

  addTable: (name: string, seats: number) => void;
  renameTable: (id: string, name: string) => void;
  removeTable: (id: string) => void;

  addReservation: (r: Omit<Reservation, "id" | "createdAt">) => void;
  removeReservation: (id: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      dishes: SEED_DISHES,
      tables: SEED_TABLES,
      orders: SEED_ORDERS,
      reservations: SEED_RESERVATIONS,
      cart: [],
      table: null,

      setTable: (t) => set({ table: t }),
      addToCart: (dish, qty, notes) =>
        set((s) => {
          const existing = s.cart.find((c) => c.dish.id === dish.id);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.dish.id === dish.id ? { ...c, qty: c.qty + qty, notes: notes ?? c.notes } : c,
              ),
            };
          }
          return { cart: [...s.cart, { dish, qty, notes }] };
        }),
      updateQty: (dishId, qty) =>
        set((s) => ({
          cart: qty <= 0
            ? s.cart.filter((c) => c.dish.id !== dishId)
            : s.cart.map((c) => (c.dish.id === dishId ? { ...c, qty } : c)),
        })),
      removeFromCart: (dishId) =>
        set((s) => ({ cart: s.cart.filter((c) => c.dish.id !== dishId) })),
      clearCart: () => set({ cart: [] }),

      placeOrder: (table) => {
        const items = get().cart;
        const totals = calcTotals(items);
        const order: Order = {
          id: uid(),
          table,
          items,
          ...totals,
          status: "new",
          createdAt: Date.now(),
        };
        set((s) => ({ orders: [order, ...s.orders], cart: [] }));
        return order;
      },
      setOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      cancelOrder: (id) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, status: "cancelled" } : o,
          ),
        })),

      addDish: (d) => set((s) => ({ dishes: [{ ...d, id: uid() }, ...s.dishes] })),
      updateDish: (id, patch) =>
        set((s) => ({
          dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
      deleteDish: (id) =>
        set((s) => ({ dishes: s.dishes.filter((d) => d.id !== id) })),
      toggleAvailability: (id) =>
        set((s) => ({
          dishes: s.dishes.map((d) =>
            d.id === id ? { ...d, available: !d.available } : d,
          ),
        })),

      addTable: (name, seats) =>
        set((s) => ({
          tables: [...s.tables, { id: uid(), name, seats, active: true }],
        })),
      renameTable: (id, name) =>
        set((s) => ({
          tables: s.tables.map((t) => (t.id === id ? { ...t, name } : t)),
        })),
      removeTable: (id) =>
        set((s) => ({ tables: s.tables.filter((t) => t.id !== id) })),

      addReservation: (r) =>
        set((s) => ({
          reservations: [
            { ...r, id: uid(), createdAt: Date.now() },
            ...s.reservations,
          ],
        })),
      removeReservation: (id) =>
        set((s) => ({ reservations: s.reservations.filter((r) => r.id !== id) })),
    }),
    {
      name: "auralis-restaurant",
      partialize: (s) => ({
        dishes: s.dishes,
        tables: s.tables,
        orders: s.orders,
        reservations: s.reservations,
        cart: s.cart,
      }),
    },
  ),
);

export function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export function timeSince(ts: number) {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  return `${hr}h ${min % 60}m`;
}
