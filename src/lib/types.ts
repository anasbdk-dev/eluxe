export type Category = "starters" | "mains" | "desserts" | "drinks" | "specials";

export type Badge =
  | "vip"
  | "exclusive"
  | "bestseller"
  | "discount"
  | "new"
  | "chef"
  | "spicy"
  | "limited";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  calories?: number;
  prepTime?: number;
  badges: Badge[];
  available: boolean;
}

export interface CartItem {
  dish: Dish;
  qty: number;
  notes?: string;
}

export type OrderStatus = "new" | "preparing" | "ready" | "delivered" | "cancelled";

export interface Order {
  id: string;
  table: string;
  items: CartItem[];
  subtotal: number;
  service: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  notes?: string;
  createdAt: number;
}

export interface Table {
  id: string;
  name: string;
  seats: number;
  active: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  starters: "Starters",
  mains: "Main Courses",
  desserts: "Desserts",
  drinks: "Drinks",
  specials: "Chef Specials",
};

export const BADGE_LABELS: Record<Badge, string> = {
  vip: "VIP",
  exclusive: "Exclusive",
  bestseller: "Bestseller",
  discount: "Discount",
  new: "New",
  chef: "Chef Choice",
  spicy: "Spicy",
  limited: "Limited",
};
