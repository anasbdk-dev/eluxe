import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  // Common
  "common.back": "Back",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.loading": "Loading…",
  "common.search": "Search",
  "common.all": "All",
  "common.actions": "Actions",
  "common.submit": "Submit",
  "common.signOut": "Sign out",
  "common.signIn": "Sign in",
  "common.continue": "Continue Browsing",
  "common.confirm": "Confirm",
  "common.live": "live",
  "common.preview": "Preview",
  "common.browseMode": "Browse Mode",
  "common.unavailable": "Unavailable",

  // Landing
  "landing.experience": "Experience",
  "landing.reserve": "Reserve",
  "landing.staffSignIn": "Staff Sign-In",
  "landing.tagline": "The Restaurant OS",
  "landing.heroLine1": "Where every",
  "landing.heroLine2": "table",
  "landing.heroLine3": "becomes",
  "landing.heroLine4": "an experience.",
  "landing.heroBody": "AURALIS is the operating system behind the world's most demanding kitchens — instant QR ordering, real-time kitchen orchestration, and an enterprise-grade admin built for the calm precision of fine dining.",
  "landing.exploreMenu": "Explore Menu",
  "landing.reserveTable": "Reserve a Table",
  "landing.staffPortal": "Staff Portal",
  "landing.tonight": "Tonight at AURALIS",
  "landing.omakase": "Seven-course Omakase",
  "landing.omakaseBody": "An evolving menu shaped by tonight's market and the chef's intuition. Reserved for thirty guests.",
  "landing.courses": "Courses",
  "landing.returning": "Returning",
  "landing.michelin": "Michelin",
  "landing.experienceTag": "The Experience",
  "landing.experienceTitle": "end to end ecosystem.",
  "landing.qrTitle": "Smart QR Tables",
  "landing.qrBody": "Each table has its own QR. One scan opens the menu — table identity flows automatically into every order.",
  "landing.kitchenTitle": "Live Kitchen Display",
  "landing.kitchenBody": "Tickets land instantly with timers, table context, and status pipeline tuned for tablet-mounted kitchens.",
  "landing.adminTitle": "Enterprise Admin",
  "landing.adminBody": "Menu, orders, tables, reservations, and revenue analytics in one cohesive command center.",
  "landing.footer": "AURALIS Hospitality Systems. Crafted for fine dining.",

  // Admin nav
  "nav.dashboard": "Dashboard",
  "nav.menu": "Menu",
  "nav.orders": "Orders",
  "nav.tables": "Tables",
  "nav.reservations": "Reservations",
  "nav.kitchen": "Kitchen",
  "nav.loggedIn": "Logged in",

  // Dashboard
  "dash.title": "Tonight at a glance.",
  "dash.revenue": "Total revenue",
  "dash.orders": "Orders",
  "dash.avg": "Avg ticket",
  "dash.activeTables": "Active tables",
  "dash.revenueToday": "Revenue today",
  "dash.hourly": "Hourly breakdown",
  "dash.menuMix": "Menu mix",
  "dash.byCategory": "By category",
  "dash.weekly": "Weekly revenue",
  "dash.last7": "Last 7 days",
  "dash.topSelling": "Top selling",
  "dash.dishes": "dishes",
  "dash.noOrders": "No orders yet.",
  "dash.sold": "sold",

  // Orders
  "orders.title": "Service queue",
  "orders.searchPh": "Search by table or id…",
  "orders.table": "Table",
  "orders.order": "Order",
  "orders.placed": "Placed",
  "orders.ago": "ago",
  "orders.subtotal": "Subtotal",
  "orders.service": "Service",
  "orders.tax": "Tax",
  "orders.noMatch": "No orders match.",
  "status.all": "All",
  "status.new": "New",
  "status.preparing": "Preparing",
  "status.ready": "Ready",
  "status.delivered": "Delivered",
  "status.cancelled": "Cancelled",

  // Products
  "products.title": "Dishes & beverages",
  "products.new": "New dish",
  "products.searchPh": "Search dishes…",
  "products.dish": "Dish",
  "products.category": "Category",
  "products.badges": "Badges",
  "products.price": "Price",
  "products.active": "Active",
  "products.noMatch": "No dishes match.",
  "products.editDish": "Edit dish",
  "products.newDish": "New dish",
  "products.name": "Name",
  "products.description": "Description",
  "products.image": "Image URL",
  "products.calories": "Calories",
  "products.prepTime": "Prep time (min)",
  "products.available": "Available",
  "products.vipOnly": "VIP only",
  "products.confirmDelete": "Delete this dish?",
  "products.removed": "Dish removed",
  "products.saved": "Dish saved",

  // Tables
  "tables.title": "QR codes & seating",
  "tables.name": "Name",
  "tables.namePh": "Table 8 / VIP 3",
  "tables.seats": "Seats",
  "tables.vip": "VIP",
  "tables.add": "Add table",
  "tables.added": "Table added",
  "tables.removed": "Table removed",
  "tables.rename": "Rename table",
  "tables.confirmDelete": "Delete {name}?",
  "tables.seatsLabel": "seats",
  "tables.revenue": "Revenue",

  // Reservations
  "res.title": "Upcoming bookings",
  "res.empty": "No reservations yet.",
  "res.removed": "Reservation removed",

  // Reserve
  "reserve.tag": "Reservations",
  "reserve.title": "Reserve your evening.",
  "reserve.body": "Tell us when you'd like to dine and we'll make sure your table is set.",
  "reserve.fullName": "Full name",
  "reserve.phone": "Phone",
  "reserve.guests": "Guests",
  "reserve.date": "Date",
  "reserve.time": "Time",
  "reserve.notes": "Notes (optional)",
  "reserve.notesPh": "Anniversary, allergies, seating preference…",
  "reserve.submit": "Request reservation",
  "reserve.submitting": "Submitting…",
  "reserve.thanks": "Merci, {name}.",
  "reserve.confirm": "Your table for {guests} on {date} at {time} is being confirmed. We'll text you shortly at {phone}.",
  "reserve.received": "Reservation received",
  "reserve.fillAll": "Please complete all required fields.",
  "reserve.returnHome": "Return home",

  // Login
  "login.tag": "Staff Portal",
  "login.title": "Sign in",
  "login.body": "Authorized staff only.",
  "login.email": "Email",
  "login.password": "Password",
  "login.signing": "Signing in…",
  "login.welcome": "Welcome back",
  "login.returnLanding": "← Return to landing",

  // Menu
  "menu.welcome": "Welcome",
  "menu.vipService": "VIP Service",
  "menu.nowServing": "Now serving",
  "menu.alaCarte": "À la carte",
  "menu.tonightsMenu": "Tonight's Menu",
  "menu.tonightsBody": "Curated daily by our chef. Tap any dish to add it to your order.",
  "menu.loadingMenu": "Loading menu…",
  "menu.items": "Items",
  "menu.item": "Item",
  "menu.invalidCode": "Invalid table code",
  "menu.scanTable": "Scan your table",
  "menu.invalidBody": "This QR is no longer active. Please ask our staff for assistance.",
  "menu.scanBody": "Please scan the QR code on your table to view the menu and order.",
  "menu.returnAuralis": "Return to AURALIS",

  // Cart
  "cart.yourOrder": "Your Order",
  "cart.empty": "Your cart is empty",
  "cart.subtotal": "Subtotal",
  "cart.service": "Service (10%)",
  "cart.tax": "Tax (8%)",
  "cart.total": "Total",
  "cart.sending": "Sending…",
  "cart.confirm": "Confirm Order",
  "cart.bonAppetit": "Bon appétit",
  "cart.sentBody": "Your order has been sent to the kitchen. Estimated preparation: 20–25 minutes.",
  "cart.sent": "Order sent to kitchen",
  "cart.failed": "Could not place order",

  // Order modal
  "modal.specialReq": "Special requests",
  "modal.notesPh": "No onions, extra cheese, medium rare…",
  "modal.total": "Total",
  "modal.add": "Add to Order",
  "modal.added": "{name} added",

  // Categories
  "cat.starters": "Starters",
  "cat.mains": "Main Courses",
  "cat.desserts": "Desserts",
  "cat.drinks": "Drinks",
  "cat.specials": "Chef Specials",

  // Badges
  "badge.vip": "VIP",
  "badge.exclusive": "Exclusive",
  "badge.bestseller": "Bestseller",
  "badge.discount": "Discount",
  "badge.new": "New",
  "badge.chef": "Chef Choice",
  "badge.spicy": "Spicy",
  "badge.limited": "Limited",

  // Kitchen
  "kitchen.display": "Kitchen Display",
  "kitchen.cooking": "Cooking",
  "kitchen.noOrders": "No orders in this view.",
  "kitchen.markPrefix": "Mark",
  "kitchen.filters.active": "Active",
};

const ar: Dict = {
  // Common
  "common.back": "رجوع",
  "common.cancel": "إلغاء",
  "common.save": "حفظ",
  "common.delete": "حذف",
  "common.edit": "تعديل",
  "common.loading": "جارٍ التحميل…",
  "common.search": "بحث",
  "common.all": "الكل",
  "common.actions": "إجراءات",
  "common.submit": "إرسال",
  "common.signOut": "تسجيل الخروج",
  "common.signIn": "تسجيل الدخول",
  "common.continue": "متابعة التصفح",
  "common.confirm": "تأكيد",
  "common.live": "مباشر",
  "common.preview": "معاينة",
  "common.browseMode": "وضع التصفح",
  "common.unavailable": "غير متوفر",

  // Landing
  "landing.experience": "التجربة",
  "landing.reserve": "حجز",
  "landing.staffSignIn": "دخول الموظفين",
  "landing.tagline": "نظام تشغيل المطاعم",
  "landing.heroLine1": "حيث تتحوّل كل",
  "landing.heroLine2": "طاولة",
  "landing.heroLine3": "إلى",
  "landing.heroLine4": "تجربة لا تُنسى.",
  "landing.heroBody": "أوراليس هو نظام التشغيل الذي يقف خلف أكثر المطابخ تطلبًا في العالم — طلب فوري عبر رمز QR، تنسيق المطبخ في الوقت الحقيقي، ولوحة إدارة على مستوى المؤسسات صُممت لدقة المطاعم الراقية.",
  "landing.exploreMenu": "استعرض القائمة",
  "landing.reserveTable": "احجز طاولة",
  "landing.staffPortal": "بوابة الموظفين",
  "landing.tonight": "الليلة في أوراليس",
  "landing.omakase": "أوماكاسي من سبعة أطباق",
  "landing.omakaseBody": "قائمة متجدّدة يصوغها السوق وحدس الشيف. مخصصة لثلاثين ضيفًا فقط.",
  "landing.courses": "أطباق",
  "landing.returning": "عملاء عائدون",
  "landing.michelin": "ميشلان",
  "landing.experienceTag": "التجربة",
  "landing.experienceTitle": "منظومة متكاملة من الألف إلى الياء.",
  "landing.qrTitle": "طاولات QR ذكية",
  "landing.qrBody": "لكل طاولة رمز QR خاص بها. مسحة واحدة تفتح القائمة — وتنتقل هوية الطاولة تلقائيًا إلى كل طلب.",
  "landing.kitchenTitle": "شاشة مطبخ مباشرة",
  "landing.kitchenBody": "تصل الطلبات فورًا مع المؤقتات وسياق الطاولة وخط حالة مُهيأ للمطابخ التي تستخدم الأجهزة اللوحية.",
  "landing.adminTitle": "إدارة احترافية",
  "landing.adminBody": "القائمة والطلبات والطاولات والحجوزات وتحليلات الإيرادات في مركز قيادة موحّد.",
  "landing.footer": "أوراليس لأنظمة الضيافة. صُممت للمطاعم الراقية.",

  // Admin nav
  "nav.dashboard": "لوحة التحكم",
  "nav.menu": "القائمة",
  "nav.orders": "الطلبات",
  "nav.tables": "الطاولات",
  "nav.reservations": "الحجوزات",
  "nav.kitchen": "المطبخ",
  "nav.loggedIn": "مسجّل الدخول",

  // Dashboard
  "dash.title": "نظرة سريعة على الليلة.",
  "dash.revenue": "إجمالي الإيرادات",
  "dash.orders": "الطلبات",
  "dash.avg": "متوسط الفاتورة",
  "dash.activeTables": "طاولات نشطة",
  "dash.revenueToday": "إيرادات اليوم",
  "dash.hourly": "تفصيل بالساعة",
  "dash.menuMix": "توزيع القائمة",
  "dash.byCategory": "حسب الفئة",
  "dash.weekly": "الإيرادات الأسبوعية",
  "dash.last7": "آخر 7 أيام",
  "dash.topSelling": "الأكثر مبيعًا",
  "dash.dishes": "أطباق",
  "dash.noOrders": "لا توجد طلبات بعد.",
  "dash.sold": "مباع",

  // Orders
  "orders.title": "قائمة الخدمة",
  "orders.searchPh": "ابحث برقم الطاولة أو المعرف…",
  "orders.table": "الطاولة",
  "orders.order": "الطلب",
  "orders.placed": "تم الطلب",
  "orders.ago": "مضت",
  "orders.subtotal": "المجموع الفرعي",
  "orders.service": "الخدمة",
  "orders.tax": "الضريبة",
  "orders.noMatch": "لا توجد طلبات مطابقة.",
  "status.all": "الكل",
  "status.new": "جديد",
  "status.preparing": "قيد التحضير",
  "status.ready": "جاهز",
  "status.delivered": "تم التسليم",
  "status.cancelled": "ملغي",

  // Products
  "products.title": "الأطباق والمشروبات",
  "products.new": "طبق جديد",
  "products.searchPh": "ابحث عن طبق…",
  "products.dish": "الطبق",
  "products.category": "الفئة",
  "products.badges": "الشارات",
  "products.price": "السعر",
  "products.active": "مفعّل",
  "products.noMatch": "لا توجد أطباق مطابقة.",
  "products.editDish": "تعديل الطبق",
  "products.newDish": "طبق جديد",
  "products.name": "الاسم",
  "products.description": "الوصف",
  "products.image": "رابط الصورة",
  "products.calories": "السعرات",
  "products.prepTime": "وقت التحضير (دقيقة)",
  "products.available": "متوفر",
  "products.vipOnly": "كبار الشخصيات فقط",
  "products.confirmDelete": "حذف هذا الطبق؟",
  "products.removed": "تم حذف الطبق",
  "products.saved": "تم حفظ الطبق",

  // Tables
  "tables.title": "رموز QR والمقاعد",
  "tables.name": "الاسم",
  "tables.namePh": "طاولة 8 / كبار 3",
  "tables.seats": "المقاعد",
  "tables.vip": "كبار الشخصيات",
  "tables.add": "إضافة طاولة",
  "tables.added": "تمت إضافة الطاولة",
  "tables.removed": "تم حذف الطاولة",
  "tables.rename": "إعادة تسمية الطاولة",
  "tables.confirmDelete": "حذف {name}؟",
  "tables.seatsLabel": "مقاعد",
  "tables.revenue": "الإيراد",

  // Reservations
  "res.title": "الحجوزات القادمة",
  "res.empty": "لا توجد حجوزات بعد.",
  "res.removed": "تم حذف الحجز",

  // Reserve
  "reserve.tag": "الحجوزات",
  "reserve.title": "احجز أمسيتك.",
  "reserve.body": "أخبرنا متى ترغب بتناول العشاء وسنجهّز طاولتك.",
  "reserve.fullName": "الاسم الكامل",
  "reserve.phone": "الهاتف",
  "reserve.guests": "عدد الضيوف",
  "reserve.date": "التاريخ",
  "reserve.time": "الوقت",
  "reserve.notes": "ملاحظات (اختياري)",
  "reserve.notesPh": "ذكرى، حساسية، تفضيل الجلوس…",
  "reserve.submit": "اطلب الحجز",
  "reserve.submitting": "جارٍ الإرسال…",
  "reserve.thanks": "شكرًا، {name}.",
  "reserve.confirm": "طاولتك لـ {guests} في {date} الساعة {time} قيد التأكيد. سنرسل لك رسالة قريبًا على {phone}.",
  "reserve.received": "تم استلام الحجز",
  "reserve.fillAll": "يرجى تعبئة جميع الحقول المطلوبة.",
  "reserve.returnHome": "العودة للرئيسية",

  // Login
  "login.tag": "بوابة الموظفين",
  "login.title": "تسجيل الدخول",
  "login.body": "للموظفين المخوّلين فقط.",
  "login.email": "البريد الإلكتروني",
  "login.password": "كلمة المرور",
  "login.signing": "جارٍ تسجيل الدخول…",
  "login.welcome": "أهلًا بعودتك",
  "login.returnLanding": "← العودة للصفحة الرئيسية",

  // Menu
  "menu.welcome": "مرحبًا",
  "menu.vipService": "خدمة كبار الشخصيات",
  "menu.nowServing": "نخدم الآن",
  "menu.alaCarte": "آ لا كارت",
  "menu.tonightsMenu": "قائمة الليلة",
  "menu.tonightsBody": "ينسّقها شيفنا يوميًا. اضغط أي طبق لإضافته إلى طلبك.",
  "menu.loadingMenu": "جارٍ تحميل القائمة…",
  "menu.items": "أصناف",
  "menu.item": "صنف",
  "menu.invalidCode": "رمز الطاولة غير صالح",
  "menu.scanTable": "امسح طاولتك",
  "menu.invalidBody": "هذا الرمز لم يعد فعّالًا. يرجى طلب المساعدة من الموظفين.",
  "menu.scanBody": "يرجى مسح رمز QR على طاولتك لعرض القائمة وتقديم الطلب.",
  "menu.returnAuralis": "العودة إلى أوراليس",

  // Cart
  "cart.yourOrder": "طلبك",
  "cart.empty": "سلتك فارغة",
  "cart.subtotal": "المجموع الفرعي",
  "cart.service": "الخدمة (10%)",
  "cart.tax": "الضريبة (8%)",
  "cart.total": "الإجمالي",
  "cart.sending": "جارٍ الإرسال…",
  "cart.confirm": "تأكيد الطلب",
  "cart.bonAppetit": "بالهناء والشفاء",
  "cart.sentBody": "تم إرسال طلبك إلى المطبخ. وقت التحضير المتوقع: 20–25 دقيقة.",
  "cart.sent": "تم إرسال الطلب إلى المطبخ",
  "cart.failed": "تعذّر تقديم الطلب",

  // Order modal
  "modal.specialReq": "طلبات خاصة",
  "modal.notesPh": "بدون بصل، جبن إضافي، وسط الاستواء…",
  "modal.total": "الإجمالي",
  "modal.add": "أضف إلى الطلب",
  "modal.added": "تمت إضافة {name}",

  // Categories
  "cat.starters": "المقبلات",
  "cat.mains": "الأطباق الرئيسية",
  "cat.desserts": "الحلويات",
  "cat.drinks": "المشروبات",
  "cat.specials": "أطباق الشيف الخاصة",

  // Badges
  "badge.vip": "كبار الشخصيات",
  "badge.exclusive": "حصري",
  "badge.bestseller": "الأكثر مبيعًا",
  "badge.discount": "خصم",
  "badge.new": "جديد",
  "badge.chef": "اختيار الشيف",
  "badge.spicy": "حار",
  "badge.limited": "محدود",

  // Kitchen
  "kitchen.display": "شاشة المطبخ",
  "kitchen.cooking": "قيد الطهي",
  "kitchen.noOrders": "لا توجد طلبات في هذا العرض.",
  "kitchen.markPrefix": "وضع كـ",
  "kitchen.filters.active": "نشطة",
};

const DICTS: Record<Lang, Dict> = { en, ar };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("auralis-lang")) as Lang | null;
    if (stored === "en" || stored === "ar") setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("auralis-lang", l); } catch {}
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = DICTS[lang][key] ?? DICTS.en[key] ?? key;
    if (vars) for (const k of Object.keys(vars)) s = s.replaceAll(`{${k}}`, String(vars[k]));
    return s;
  };

  return (
    <Ctx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </Ctx.Provider>
  );
}

export function useT() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useT must be used within I18nProvider");
  return c;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useT();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className={`inline-flex items-center gap-1.5 rounded-full border hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold ${className}`}
      aria-label="Toggle language"
    >
      <Languages className="h-3 w-3" />
      {lang === "en" ? "العربية" : "English"}
    </button>
  );
}

// Helper to translate category/badge keys via t()
export function tCategory(t: I18nCtx["t"], cat: string) {
  return t(`cat.${cat}`);
}
export function tBadge(t: I18nCtx["t"], b: string) {
  return t(`badge.${b}`);
}
export function tStatus(t: I18nCtx["t"], s: string) {
  return t(`status.${s}`);
}
