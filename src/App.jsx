import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  ScanBarcode,
  UploadCloud,
  Search,
  Plus,
  Minus,
  Trash2,
  Store,
  UtensilsCrossed,
  BookOpen,
  ShoppingCart,
  AlertTriangle,
  PackageX,
  CheckCircle2,
  Printer,
  X,
  Receipt,
  Sparkles,
  ChefHat,
  PackageSearch,
  PackagePlus,
  PlusCircle,
  Download,
  Keyboard,
  History,
  Info,
  FileSpreadsheet,
  Zap,
  Car,
  Wrench,
  Hammer,
  Pill,
  Shirt,
  Briefcase,
  ArrowRight,
  Home as HomeIcon,
  LayoutDashboard,
  Layers,
  Bell,
} from "lucide-react";

/* ═════════════════════════════════════════════════════════════
   BUSINESS PROFILES, ICONS, COLOURS, PAGES
   ═════════════════════════════════════════════════════════════ */

const ICONS = {
  store: Store,
  utensils: UtensilsCrossed,
  book: BookOpen,
  zap: Zap,
  car: Car,
  wrench: Wrench,
  hammer: Hammer,
  pill: Pill,
  shirt: Shirt,
  briefcase: Briefcase,
};
const iconFor = (meta) => ICONS[meta.iconKey] || Briefcase;

const PRESETS = {
  kirana: {
    id: "kirana", label: "Kirana / Grocery", short: "Kirana", iconKey: "store", accent: "emerald", main: true, prefix: "KR", kind: "stock",
    tagline: "Fast billing and expiry-aware shelves for your neighbourhood store.",
    units: ["pcs", "packet", "kg", "g", "litre", "ml", "dozen"],
    categories: ["Snacks", "Dairy", "Beverages", "Staples", "Personal Care", "Instant Food"],
    metaField: "expiry", metaLabel: "Expiry", lowDefault: 5,
    voice: ["Add 25 packets of Maggi", "Sold 3 packets of Parle-G", "Restocked 10 pcs of Amul Butter"],
  },
  restaurant: {
    id: "restaurant", label: "Restaurant & Cafe", short: "Cafe", iconKey: "utensils", accent: "orange", main: true, prefix: "RM", kind: "stock",
    tagline: "Recipe-driven stock. Every dish pulls its raw ingredients automatically.",
    units: ["g", "kg", "ml", "litre", "pcs", "tbsp", "tsp"],
    categories: ["Raw Ingredients", "Dairy", "Spices", "Beverages", "Bakery", "Produce"],
    metaField: "expiry", metaLabel: "Expiry", lowDefault: 500,
    voice: ["Add 2 kg of Tomato", "Used 200 grams of Paneer", "Restocked 500 grams of Butter"],
  },
  book: {
    id: "book", label: "Book Depot", short: "Books", iconKey: "book", accent: "violet", main: true, prefix: "BK", kind: "stock",
    tagline: "ISBN-first catalogue with instant reorder alerts.",
    units: ["copies", "pcs", "set"],
    categories: ["Fiction", "Non-Fiction", "Self-Help", "Academic", "Children", "Stationery"],
    metaField: "isbn", metaLabel: "ISBN", lowDefault: 3,
    voice: ["Restocked 10 copies of Atomic Habits", "Sold 2 copies of 1984", "Add 4 copies of The Alchemist"],
  },
  electrical: {
    id: "electrical", label: "Electrical Shop", short: "Electrical", iconKey: "zap", accent: "sky", main: false, prefix: "EL", kind: "stock",
    tagline: "Wires, switches, fans and fittings with brand and stock tracking.",
    units: ["pcs", "meter", "roll", "box", "kg", "set"],
    categories: ["Wires & Cables", "Switches & Sockets", "MCB & Protection", "Lighting", "Fans & Motors", "Tools & Hardware"],
    metaField: "brand", metaLabel: "Brand", lowDefault: 5,
    voice: ["Add 50 meter of PVC Wire", "Sold 2 pcs of Modular Switch Board"],
  },
  automobile: {
    id: "automobile", label: "Auto Spares & Garage", short: "Automobile", iconKey: "car", accent: "rose", main: false, prefix: "AU", kind: "stock",
    tagline: "Spare parts, oils and accessories for cars and two-wheelers.",
    units: ["pcs", "litre", "set", "pair"],
    categories: ["Engine Parts", "Brakes", "Filters", "Electricals", "Tyres & Wheels", "Oils & Lubricants", "Accessories"],
    metaField: "brand", metaLabel: "Brand / Make", lowDefault: 3,
    voice: ["Sold 2 pcs of Air Filter", "Add 5 litre of Engine Oil"],
  },
  services: {
    id: "services", label: "Service Center", short: "Services", iconKey: "wrench", accent: "teal", main: false, prefix: "SV", kind: "service",
    tagline: "Bill repairs, maintenance and labour. Services have no stock to track.",
    units: ["job", "hour", "visit"],
    categories: ["Repairs", "Maintenance", "Installation", "Consultation", "Labour"],
    metaField: "brand", metaLabel: "Notes", lowDefault: 1,
    voice: [],
  },
  hardware: {
    id: "hardware", label: "Hardware & Tools", short: "Hardware", iconKey: "hammer", accent: "indigo", main: false, prefix: "HW", kind: "stock",
    tagline: "Tools, paint, fasteners and building materials.",
    units: ["pcs", "kg", "box", "bag", "litre"],
    categories: ["Tools", "Paint", "Fasteners", "Plumbing", "Cement & Building", "Safety Gear"],
    metaField: "brand", metaLabel: "Brand", lowDefault: 5,
    voice: [],
  },
  pharmacy: {
    id: "pharmacy", label: "Medical Store", short: "Pharmacy", iconKey: "pill", accent: "amber", main: false, prefix: "PH", kind: "stock",
    tagline: "Expiry-first stock for medicines and surgical items.",
    units: ["strip", "bottle", "pcs", "box"],
    categories: ["Tablets", "Syrups", "Injections", "Surgical", "Vitamins", "Baby Care"],
    metaField: "expiry", metaLabel: "Expiry", lowDefault: 10,
    voice: [],
  },
  clothing: {
    id: "clothing", label: "Garments & Boutique", short: "Clothing", iconKey: "shirt", accent: "fuchsia", main: false, prefix: "CL", kind: "stock",
    tagline: "Sizes, brands and stock for garments and accessories.",
    units: ["pcs", "pair", "set"],
    categories: ["Men", "Women", "Kids", "Footwear", "Accessories"],
    metaField: "brand", metaLabel: "Brand", lowDefault: 3,
    voice: [],
  },
};
const PRESET_ORDER = Object.keys(PRESETS);

const ACCENT = {
  emerald: { bg: "bg-emerald-600", hover: "hover:bg-emerald-700", text: "text-emerald-600", soft: "bg-emerald-50", bar: "bg-emerald-500", hero: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500", tile: "from-emerald-500 to-teal-600" },
  orange: { bg: "bg-orange-600", hover: "hover:bg-orange-700", text: "text-orange-600", soft: "bg-orange-50", bar: "bg-orange-500", hero: "bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500", tile: "from-orange-500 to-amber-600" },
  violet: { bg: "bg-violet-600", hover: "hover:bg-violet-700", text: "text-violet-600", soft: "bg-violet-50", bar: "bg-violet-500", hero: "bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500", tile: "from-violet-500 to-fuchsia-600" },
  sky: { bg: "bg-sky-600", hover: "hover:bg-sky-700", text: "text-sky-600", soft: "bg-sky-50", bar: "bg-sky-500", hero: "bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500", tile: "from-sky-500 to-cyan-600" },
  rose: { bg: "bg-rose-600", hover: "hover:bg-rose-700", text: "text-rose-600", soft: "bg-rose-50", bar: "bg-rose-500", hero: "bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500", tile: "from-rose-500 to-pink-600" },
  teal: { bg: "bg-teal-600", hover: "hover:bg-teal-700", text: "text-teal-600", soft: "bg-teal-50", bar: "bg-teal-500", hero: "bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500", tile: "from-teal-500 to-emerald-600" },
  indigo: { bg: "bg-indigo-600", hover: "hover:bg-indigo-700", text: "text-indigo-600", soft: "bg-indigo-50", bar: "bg-indigo-500", hero: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500", tile: "from-indigo-500 to-blue-600" },
  amber: { bg: "bg-amber-600", hover: "hover:bg-amber-700", text: "text-amber-700", soft: "bg-amber-50", bar: "bg-amber-500", hero: "bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500", tile: "from-amber-500 to-yellow-600" },
  fuchsia: { bg: "bg-fuchsia-600", hover: "hover:bg-fuchsia-700", text: "text-fuchsia-600", soft: "bg-fuchsia-50", bar: "bg-fuchsia-500", hero: "bg-gradient-to-r from-fuchsia-600 via-fuchsia-500 to-pink-500", tile: "from-fuchsia-500 to-pink-600" },
  slate: { bg: "bg-slate-700", hover: "hover:bg-slate-800", text: "text-slate-700", soft: "bg-slate-100", bar: "bg-slate-500", hero: "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500", tile: "from-slate-600 to-slate-800" },
};

const PAGES = [
  { key: "sell", label: "Sell & Bill", icon: ShoppingCart },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "stock", label: "Check Stock", icon: PackageSearch },
  { key: "update", label: "Update Stock", icon: PackagePlus },
  { key: "add", label: "Add New", icon: PlusCircle },
];

const COMMON_UNIT_WORDS = [
  "copies", "copy", "packets", "packet", "pcs", "pieces", "piece", "bottles", "bottle", "dozen", "set", "sets",
  "kg", "kgs", "kilo", "kilos", "kilogram", "kilograms", "g", "gm", "gram", "grams", "ml", "l", "litre", "litres",
  "liter", "liters", "ltr", "meter", "meters", "roll", "rolls", "pair", "pairs", "box", "boxes", "bag", "bags",
  "strip", "strips", "job", "jobs", "hour", "hours", "visit", "visits", "tbsp", "tsp",
];
const STOP_WORDS = new Set([
  "add", "restock", "restocked", "restocking", "sold", "sell", "selling", "used", "use", "of", "the", "to",
  "from", "a", "an", "some", "and", "please", "in", "stock", "received", "got", "bought", "remove", "removed",
  "dispatched", "consumed", ...COMMON_UNIT_WORDS,
]);
const ADD_RE = /\b(add|added|adding|restock|restocked|restocking|received|bought|got)\b/;
const SUB_RE = /\b(sell|sold|selling|used|use|consumed|remove|removed|dispatched)\b/;

const USER_UNIT_FACTOR = {
  kg: 1000, kgs: 1000, kilo: 1000, kilos: 1000, kilogram: 1000, kilograms: 1000,
  g: 1, gm: 1, gram: 1, grams: 1,
  ml: 1, milliliter: 1, milliliters: 1,
  l: 1000, ltr: 1000, litre: 1000, litres: 1000, liter: 1000, liters: 1000,
};
const ITEM_UNIT_FACTOR = { g: 1, kg: 1000, ml: 1, l: 1000, litre: 1000 };
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20, fifty: 50, hundred: 100, half: 0.5,
};

/* ═════════════════════════════════════════════════════════════
   DATES, FORMATTING, HELPERS
   ═════════════════════════════════════════════════════════════ */

const uid = () => Math.random().toString(36).slice(2, 9);
const pad = (n) => String(n).padStart(2, "0");
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const isoDaysFromNow = (n) => {
  const d = startOfToday();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const daysUntil = (iso) => {
  if (!iso || !ISO_RE.test(iso)) return null;
  return Math.round((new Date(`${iso}T00:00:00`) - startOfToday()) / 86400000);
};

const money = (v) => `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const formatStock = (qty, unit) => {
  if ((unit === "g" || unit === "ml") && qty >= 1000) {
    return `${+(qty / 1000).toFixed(2)} ${unit === "g" ? "kg" : "L"}`;
  }
  return `${+Number(qty).toFixed(2)} ${unit}`;
};

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stem = (w) => {
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 3 && w.endsWith("s")) return w.slice(0, -1);
  return w;
};

const getStatus = (item) => {
  if (item.kind === "service") {
    return { service: true, out: false, low: false, expired: false, expiring: false, days: null, problem: false };
  }
  const days = daysUntil(item.expiry);
  const out = item.stock <= 0;
  const low = !out && item.stock <= item.lowThreshold;
  const expired = days !== null && days < 0;
  const expiring = days !== null && days >= 0 && days <= 7;
  return { service: false, out, low, expired, expiring, days, problem: out || low || expired || expiring };
};

const severity = (item) => {
  const s = getStatus(item);
  if (s.out) return 4;
  if (s.expired) return 3;
  if (s.low) return 2;
  if (s.expiring) return 1;
  return 0;
};

const warningText = (item) => {
  const s = getStatus(item);
  if (s.out) return "Out of stock. Restock now.";
  if (s.expired) return `Expired on ${item.expiry}`;
  if (s.low) return `Low: ${formatStock(item.stock, item.unit)} left (min ${item.lowThreshold})`;
  if (s.expiring) return `Expires in ${s.days} day${s.days === 1 ? "" : "s"}`;
  return "Healthy";
};

const stepFor = (meta, item) => (meta.id === "restaurant" && (item.unit === "g" || item.unit === "ml") ? 50 : 1);

const metaValue = (item, meta) => (meta.metaField === "expiry" ? item.expiry : meta.metaField === "isbn" ? item.isbn : item.brand);

const enterKey = (fn) => (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    fn();
  }
};

function makeItem(meta, f) {
  const kind = f.kind === "service" || (!f.kind && meta.kind === "service") ? "service" : "stock";
  const isbn = meta.metaField === "isbn" && f.isbn ? String(f.isbn).replace(/[-\s]/g, "") : null;
  return {
    id: f.id || uid(),
    kind,
    name: String(f.name || "").trim(),
    sku: (f.sku && String(f.sku).trim()) || isbn || `${meta.prefix}-${uid().toUpperCase()}`,
    category: f.category || meta.categories[0] || "General",
    unit: f.unit || meta.units[0],
    stock: kind === "service" ? 0 : Math.max(0, Number(f.stock) || 0),
    price: Number(f.price) || 0,
    expiry: f.expiry && ISO_RE.test(f.expiry) ? f.expiry : null,
    isbn,
    author: f.author || null,
    brand: f.brand ? String(f.brand).trim() : null,
    lowThreshold: Number(f.lowThreshold) || meta.lowDefault || 5,
  };
}

/* ═════════════════════════════════════════════════════════════
   SEED DATA
   ═════════════════════════════════════════════════════════════ */

const seed = (id) => (f) => makeItem(PRESETS[id], f);
const sk = seed("kirana");
const sr = seed("restaurant");
const sb = seed("book");
const se = seed("electrical");
const sa = seed("automobile");
const ss = seed("services");

const INITIAL_INVENTORY = {
  kirana: [
    sk({ id: "k1", sku: "8901058000001", name: "Maggi Masala Noodles", category: "Instant Food", stock: 42, unit: "packet", price: 14, expiry: isoDaysFromNow(140), lowThreshold: 10 }),
    sk({ id: "k2", sku: "8901058000002", name: "Parle-G Biscuits", category: "Snacks", stock: 6, unit: "packet", price: 10, expiry: isoDaysFromNow(9), lowThreshold: 10 }),
    sk({ id: "k3", sku: "8901058000003", name: "Amul Butter", category: "Dairy", stock: 14, unit: "pcs", price: 58, expiry: isoDaysFromNow(3), lowThreshold: 5 }),
    sk({ id: "k4", sku: "8901058000004", name: "Tata Tea Gold", category: "Beverages", stock: 0, unit: "pcs", price: 245, expiry: isoDaysFromNow(300), lowThreshold: 4 }),
    sk({ id: "k5", sku: "8901058000005", name: "Aashirvaad Atta", category: "Staples", stock: 18, unit: "kg", price: 52, expiry: isoDaysFromNow(180), lowThreshold: 8 }),
    sk({ id: "k6", sku: "8901058000006", name: "Dettol Handwash", category: "Personal Care", stock: 3, unit: "pcs", price: 95, expiry: isoDaysFromNow(500), lowThreshold: 5 }),
  ],
  restaurant: [
    sr({ id: "r1", sku: "RM-PNR-200", name: "Paneer", category: "Dairy", stock: 4200, unit: "g", price: 0.36, expiry: isoDaysFromNow(4), lowThreshold: 1000 }),
    sr({ id: "r2", sku: "RM-BTR-001", name: "Butter", category: "Dairy", stock: 900, unit: "g", price: 0.52, expiry: isoDaysFromNow(12), lowThreshold: 300 }),
    sr({ id: "r3", sku: "RM-TMT-001", name: "Tomato", category: "Produce", stock: 1800, unit: "g", price: 0.04, expiry: isoDaysFromNow(2), lowThreshold: 1500 }),
    sr({ id: "r4", sku: "RM-CRM-001", name: "Fresh Cream", category: "Dairy", stock: 300, unit: "ml", price: 0.22, expiry: isoDaysFromNow(1), lowThreshold: 500 }),
    sr({ id: "r5", sku: "RM-GRM-001", name: "Garam Masala", category: "Spices", stock: 150, unit: "g", price: 1.8, expiry: isoDaysFromNow(200), lowThreshold: 100 }),
    sr({ id: "r6", sku: "RM-CASH-01", name: "Cashew", category: "Raw Ingredients", stock: 0, unit: "g", price: 1.1, expiry: isoDaysFromNow(60), lowThreshold: 200 }),
  ],
  book: [
    sb({ id: "b1", isbn: "9780735211292", name: "Atomic Habits", author: "James Clear", category: "Self-Help", stock: 12, unit: "copies", price: 699, lowThreshold: 5 }),
    sb({ id: "b2", isbn: "9780143423492", name: "The Alchemist", author: "Paulo Coelho", category: "Fiction", stock: 3, unit: "copies", price: 299, lowThreshold: 4 }),
    sb({ id: "b3", isbn: "9780131103627", name: "The C Programming Language", author: "Kernighan & Ritchie", category: "Academic", stock: 0, unit: "copies", price: 550, lowThreshold: 3 }),
    sb({ id: "b4", isbn: "9780451524935", name: "1984", author: "George Orwell", category: "Fiction", stock: 9, unit: "copies", price: 350, lowThreshold: 4 }),
    sb({ id: "b5", isbn: "9780062316097", name: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiction", stock: 7, unit: "copies", price: 499, lowThreshold: 4 }),
    sb({ id: "b6", isbn: "9781408855652", name: "Harry Potter and the Half-Blood Prince", author: "J.K. Rowling", category: "Children", stock: 5, unit: "copies", price: 450, lowThreshold: 3 }),
  ],
  electrical: [
    se({ id: "e1", name: "PVC Wire 2.5 sq mm", category: "Wires & Cables", stock: 300, unit: "meter", price: 6.5, brand: "Havells", lowThreshold: 50 }),
    se({ id: "e2", name: "Modular Switch Board 6-way", category: "Switches & Sockets", stock: 2, unit: "pcs", price: 420, brand: "Anchor", lowThreshold: 5 }),
    se({ id: "e3", name: "LED Bulb 9W", category: "Lighting", stock: 0, unit: "pcs", price: 85, brand: "Philips", lowThreshold: 10 }),
    se({ id: "e4", name: "MCB 16A", category: "MCB & Protection", stock: 25, unit: "pcs", price: 180, brand: "Legrand", lowThreshold: 5 }),
  ],
  automobile: [
    sa({ id: "a1", name: "Brake Pad Set", category: "Brakes", stock: 8, unit: "set", price: 1200, brand: "Bosch", lowThreshold: 3 }),
    sa({ id: "a2", name: "Engine Oil 5W-30", category: "Oils & Lubricants", stock: 20, unit: "litre", price: 650, brand: "Castrol", lowThreshold: 5 }),
    sa({ id: "a3", name: "Air Filter", category: "Filters", stock: 2, unit: "pcs", price: 240, brand: "Mahle", lowThreshold: 3 }),
  ],
  services: [
    ss({ id: "s1", name: "AC Gas Refill", category: "Repairs", unit: "job", price: 1800, brand: "Split AC" }),
    ss({ id: "s2", name: "Oil Change Service", category: "Maintenance", unit: "visit", price: 900, brand: "Car" }),
    ss({ id: "s3", name: "Electrical Wiring Labour", category: "Labour", unit: "hour", price: 350, brand: "Home visit" }),
  ],
};

const INITIAL_RECIPES = [
  { id: "d1", name: "Paneer Butter Masala", price: 280, ingredients: [{ itemId: "r1", qty: 200 }, { itemId: "r2", qty: 50 }, { itemId: "r3", qty: 150 }, { itemId: "r4", qty: 30 }, { itemId: "r5", qty: 3 }] },
  { id: "d2", name: "Cashew Paneer Curry", price: 320, ingredients: [{ itemId: "r1", qty: 180 }, { itemId: "r6", qty: 40 }, { itemId: "r3", qty: 120 }, { itemId: "r4", qty: 25 }] },
  { id: "d3", name: "Tomato Shorba", price: 140, ingredients: [{ itemId: "r3", qty: 250 }, { itemId: "r2", qty: 10 }, { itemId: "r5", qty: 2 }] },
];

const EMPTY_INVOICES = { kirana: [], restaurant: [], book: [], electrical: [], automobile: [], services: [], hardware: [], pharmacy: [], clothing: [] };

const SAMPLE_ROWS = {
  kirana: [
    ["Sunfeast Dark Fantasy", "Snacks", 24, "packet", 40, 120],
    ["Mother Dairy Milk 1L", "Dairy", 30, "pcs", 68, 5],
    ["Fortune Sunflower Oil 1L", "Staples", 12, "pcs", 165, 260],
    ["Nescafe Classic 50g", "Beverages", 8, "pcs", 210, 330],
    ["Colgate Strong Teeth", "Personal Care", 16, "pcs", 92, 400],
  ],
  restaurant: [
    ["Mozzarella", "Dairy", 2000, "g", 0.6, 9],
    ["Onion", "Produce", 5000, "g", 0.03, 6],
    ["Capsicum", "Produce", 1200, "g", 0.09, 4],
    ["Black Pepper", "Spices", 250, "g", 2.4, 300],
    ["Basmati Rice", "Raw Ingredients", 8000, "g", 0.12, 240],
  ],
  book: [
    ["Ikigai", "Self-Help", 10, "copies", 399, "9780143110872"],
    ["Thinking Fast and Slow", "Non-Fiction", 6, "copies", 599, "9780374533557"],
    ["Wings of Fire", "Non-Fiction", 14, "copies", 250, "9788173711466"],
    ["Ponniyin Selvan", "Fiction", 5, "copies", 595, "9789350092237"],
    ["Rich Dad Poor Dad", "Self-Help", 8, "copies", 350, "9781612680194"],
  ],
  electrical: [
    ["LED Bulb 9W", "Lighting", 40, "pcs", 85, "Philips"],
    ["Ceiling Fan 1200mm", "Fans & Motors", 6, "pcs", 1850, "Crompton"],
    ["Extension Board 4-way", "Switches & Sockets", 12, "pcs", 420, "Anchor"],
    ["Earth Wire 1.5 sq mm", "Wires & Cables", 200, "meter", 4.2, "Finolex"],
    ["Circuit Breaker 32A", "MCB & Protection", 10, "pcs", 260, "Schneider"],
  ],
  automobile: [
    ["Spark Plug", "Engine Parts", 40, "pcs", 180, "NGK"],
    ["Tyre 185/65 R15", "Tyres & Wheels", 6, "pcs", 3800, "MRF"],
    ["Coolant 1L", "Oils & Lubricants", 18, "litre", 320, "Castrol"],
    ["Wiper Blade Pair", "Accessories", 14, "pair", 450, "Bosch"],
    ["Headlight Bulb H4", "Electricals", 20, "pcs", 260, "Philips"],
  ],
  services: [
    ["AC Gas Refill", "Repairs", 0, "job", 1800, "Split AC"],
    ["Screen Replacement", "Repairs", 0, "job", 2500, "Mobile"],
    ["Full Service Visit", "Maintenance", 0, "visit", 900, "Car"],
    ["Site Visit & Inspection", "Consultation", 0, "visit", 500, "General"],
    ["Installation Labour", "Installation", 0, "hour", 350, "Home"],
  ],
};

const csvHeader = (meta) => {
  const extra = meta.metaField === "expiry" ? "expiry (YYYY-MM-DD)" : meta.metaField === "isbn" ? "isbn" : "brand";
  return `name, category, stock, unit, price, ${extra}`;
};

function sampleCSV(meta) {
  const rows = SAMPLE_ROWS[meta.id];
  if (!rows) return null;
  const body = rows
    .map(([name, cat, stock, unit, price, extra]) => {
      const last = meta.metaField === "expiry" ? isoDaysFromNow(extra) : extra;
      return `${name},${cat},${stock},${unit},${price},${last}`;
    })
    .join("\n");
  const last = meta.metaField === "expiry" ? "expiry" : meta.metaField === "isbn" ? "isbn" : "brand";
  return `name,category,stock,unit,price,${last}\n${body}`;
}

/* ═════════════════════════════════════════════════════════════
   COMMAND PARSER (typed or spoken)
   ═════════════════════════════════════════════════════════════ */

function parseCommand(raw, items) {
  const text = norm(raw);
  if (!text) return { error: "Type a command first." };

  const addAt = text.search(ADD_RE);
  const subAt = text.search(SUB_RE);
  if (addAt === -1 && subAt === -1) {
    return { error: 'Start with "add" / "restock" or "sold" / "used". Example: "Restock 10 packets of Maggi".' };
  }
  const op = subAt === -1 || (addAt !== -1 && addAt < subAt) ? "add" : "sub";

  const words = text.split(" ");
  const qIdx = words.findIndex((w) => /^\d+(\.\d+)?$/.test(w) || NUMBER_WORDS[w] !== undefined);
  if (qIdx === -1) return { error: 'No quantity found. Example: "Restock 10 packets of Maggi".' };

  const qWord = words[qIdx];
  const qty = /^\d/.test(qWord) ? parseFloat(qWord) : NUMBER_WORDS[qWord];
  const unitWord = words[qIdx + 1];
  const userFactor = USER_UNIT_FACTOR[unitWord];

  const nameWords = words.filter((w, i) => i !== qIdx && !STOP_WORDS.has(w) && !(i === qIdx + 1 && userFactor !== undefined));
  const candidates = nameWords.map(stem);

  let best = null;
  let bestScore = 0;
  items.forEach((item) => {
    const tokens = norm(item.name).split(" ").filter((t) => t.length >= 2).map(stem);
    if (!tokens.length) return;
    const hits = tokens.filter((t) =>
      candidates.some((c) => c === t || (c.length >= 4 && t.startsWith(c)) || (t.length >= 4 && c.startsWith(t)))
    ).length;
    if (hits === 0) return;
    const score = hits / tokens.length + hits * 0.01;
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  });

  if (!best) return { error: `No item matched "${nameWords.join(" ") || "that"}". Check the spelling or add it first.` };
  if (best.kind === "service") return { error: `${best.name} is a service, so it has no stock to update.` };

  const itemFactor = ITEM_UNIT_FACTOR[best.unit];
  const converted = userFactor !== undefined && itemFactor !== undefined ? (qty * userFactor) / itemFactor : qty;
  return { op, qty: Math.round(converted * 100) / 100, item: best };
}

/* ═════════════════════════════════════════════════════════════
   CSV PARSER
   ═════════════════════════════════════════════════════════════ */

function parseCSV(text, meta) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const items = [];
  const errors = [];
  lines.forEach((line, idx) => {
    const cols = line.split(",").map((c) => c.trim());
    if (idx === 0 && /^name/i.test(cols[0])) return;
    const [name, category, stock, unit, price, extra] = cols;
    if (!name) return;
    if (meta.kind !== "service" && stock !== undefined && Number.isNaN(Number(stock))) {
      errors.push(`Line ${idx + 1}: stock "${stock}" is not a number`);
      return;
    }
    items.push(
      makeItem(meta, {
        name,
        category,
        stock,
        unit,
        price,
        expiry: meta.metaField === "expiry" ? extra : null,
        isbn: meta.metaField === "isbn" ? extra : null,
        brand: meta.metaField === "brand" ? extra : null,
      })
    );
  });
  return { items, errors };
}

/* ═════════════════════════════════════════════════════════════
   INVOICE PRINTING
   ═════════════════════════════════════════════════════════════ */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function invoiceHTML(inv) {
  const rows = inv.lines
    .map((l) => `<tr><td>${esc(l.name)}</td><td class="r">${l.qty}</td><td class="r">${money(l.price)}</td><td class="r">${money(l.qty * l.price)}</td></tr>`)
    .join("");
  const gst = inv.total - inv.total / 1.05;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${esc(inv.number)}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;margin:0;padding:32px;max-width:720px}
  header{display:flex;justify-content:space-between;border-bottom:2px solid #0f172a;padding-bottom:12px;margin-bottom:16px}
  h1{font-size:20px;margin:0}
  .muted{color:#64748b;font-size:12px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{padding:8px 4px;border-bottom:1px solid #e2e8f0;text-align:left}
  th{font-size:11px;text-transform:uppercase;color:#64748b}
  .r{text-align:right}
  .totals{margin-top:16px;margin-left:auto;width:240px;font-size:13px}
  .totals div{display:flex;justify-content:space-between;padding:3px 0}
  .grand{font-weight:bold;font-size:16px;border-top:2px solid #0f172a;margin-top:6px;padding-top:6px}
  footer{margin-top:32px;text-align:center;font-size:11px;color:#94a3b8}
  @media print{body{padding:12px}}
</style></head><body>
<header>
  <div><h1>Randhawa Bro's</h1><div class="muted">${esc(inv.storeLabel)} · Inventory Manager</div></div>
  <div class="muted" style="text-align:right">Invoice #${esc(inv.number)}<br>${esc(inv.date)}</div>
</header>
<table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<div class="totals">
  <div><span>Subtotal</span><span>${money(inv.total)}</span></div>
  <div><span>GST 5% (incl.)</span><span>${money(gst)}</span></div>
  <div class="grand"><span>Total</span><span>${money(inv.total)}</span></div>
</div>
<footer>Thank you for shopping with Randhawa Bro's</footer>
</body></html>`;
}

function openPrintWindow(inv) {
  let w = null;
  try {
    w = window.open("", "_blank", "width=820,height=900");
  } catch {
    w = null;
  }
  if (!w) return false;
  w.document.open();
  w.document.write(invoiceHTML(inv));
  w.document.close();
  w.focus();
  setTimeout(() => {
    try {
      w.print();
    } catch {
      /* window closed before printing */
    }
  }, 400);
  return true;
}

function downloadInvoice(inv) {
  try {
    const blob = new Blob([invoiceHTML(inv)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${inv.number}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

/* ═════════════════════════════════════════════════════════════
   HOOKS
   ═════════════════════════════════════════════════════════════ */

function usePersistentState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage blocked in some hosts; keep working in memory */
    }
  }, [key, state]);
  return [state, setState];
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, tone = "success") => {
    const id = uid();
    setToasts((prev) => [...prev.slice(-3), { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);
  const dismiss = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, toast, dismiss };
}

function useEscape(cb) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && cb();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cb]);
}

/* ═════════════════════════════════════════════════════════════
   SHARED UI
   ═════════════════════════════════════════════════════════════ */

const LABEL = "text-xs font-medium text-slate-500";
const INPUT = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";
const QTY_BTN = "flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100";
const btnPrimary = (acc) =>
  `flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${acc.bg} ${acc.hover}`;

function Card({ title, subtitle, right, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || right) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

const CHIP_TONES = {
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-800",
  emerald: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-700",
  slate: "bg-slate-100 text-slate-700",
};

function Chip({ tone = "slate", icon: Icon, children }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${CHIP_TONES[tone]}`}>
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}

function StatusChips({ item }) {
  const s = getStatus(item);
  if (s.service) return <Chip tone="sky" icon={Wrench}>Service · no stock</Chip>;
  const chips = [];
  if (s.out) chips.push(<Chip key="o" tone="rose" icon={PackageX}>Out of stock</Chip>);
  if (s.low) chips.push(<Chip key="l" tone="amber" icon={AlertTriangle}>Low stock</Chip>);
  if (s.expired) chips.push(<Chip key="e" tone="rose" icon={AlertTriangle}>Expired</Chip>);
  else if (s.expiring) chips.push(<Chip key="x" tone="amber" icon={AlertTriangle}>{`Expires in ${s.days}d`}</Chip>);
  if (!chips.length) chips.push(<Chip key="h" tone="emerald" icon={CheckCircle2}>Healthy</Chip>);
  return <div className="flex flex-wrap gap-1">{chips}</div>;
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-400">
      <Icon size={28} />
      <p className="text-sm">{text}</p>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-44 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-200 sm:w-56"
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

function Notice({ tone, children }) {
  const tones = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  };
  const Icon = tone === "error" ? AlertTriangle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${tones[tone]}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function Toasts({ toasts, dismiss }) {
  const TONE = {
    success: { Icon: CheckCircle2, color: "text-emerald-500" },
    warn: { Icon: AlertTriangle, color: "text-amber-500" },
    danger: { Icon: PackageX, color: "text-rose-500" },
    info: { Icon: Sparkles, color: "text-sky-500" },
  };
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((t) => {
        const { Icon, color } = TONE[t.tone] || TONE.success;
        return (
          <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-xl">
            <Icon size={18} className={`mt-0.5 shrink-0 ${color}`} />
            <p className="flex-1 leading-snug">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-700" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEscape(onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   HOMEPAGE
   ═════════════════════════════════════════════════════════════ */

const HOME_CSS = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(48px,-36px) scale(1.12); } }
@keyframes shimmer { to { background-position: 200% center; } }
@keyframes floaty { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-14px) rotate(1deg); } }
@keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,.6); } 50% { box-shadow: 0 0 0 8px rgba(52,211,153,0); } }
.fade-up { animation: fadeUp .9s cubic-bezier(.2,.7,.2,1) both; }
.d1 { animation-delay: .08s } .d2 { animation-delay: .2s } .d3 { animation-delay: .32s } .d4 { animation-delay: .5s }
.blob { position: absolute; border-radius: 9999px; filter: blur(90px); opacity: .5; animation: drift 16s ease-in-out infinite; pointer-events: none; }
.grid-overlay { position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
  background-size: 56px 56px; -webkit-mask-image: radial-gradient(ellipse at center, black 25%, transparent 78%); mask-image: radial-gradient(ellipse at center, black 25%, transparent 78%); }
.gradient-text { background: linear-gradient(90deg, #fb923c, #f472b6, #a78bfa, #34d399, #fb923c); background-size: 220% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 7s linear infinite; }
.floaty { animation: floaty 7s ease-in-out infinite; }
.live-dot { animation: pulseDot 2s infinite; }
.glass { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
@media (prefers-reduced-motion: reduce) { .fade-up, .blob, .gradient-text, .floaty, .live-dot { animation: none !important; } }
`;

const HOME_FEATURES = [
  { icon: Mic, title: "Speak a restock", text: "Say “Restock 10 packets of Maggi” and the stock updates. Typed commands work everywhere." },
  { icon: ScanBarcode, title: "Scan or type a SKU", text: "Barcodes and ISBNs move stock in or out with one tap." },
  { icon: ChefHat, title: "Recipes that deduct themselves", text: "One paneer dish pulls 200 g paneer and 50 g butter from stock automatically." },
  { icon: Bell, title: "Warnings before it's too late", text: "Low stock, out-of-stock and expiry alerts surface in one Needs-attention list." },
  { icon: Receipt, title: "Bills in one click", text: "Every sale creates a printable invoice with GST, saved in the invoice history." },
  { icon: Layers, title: "Any business, your categories", text: "Presets for shops and garages, plus a builder for any business you can describe." },
];

const HOME_BUSINESSES = [
  { id: "kirana", label: "Kirana", icon: Store, accent: "emerald" },
  { id: "restaurant", label: "Cafe & Restaurant", icon: UtensilsCrossed, accent: "orange" },
  { id: "book", label: "Book Depot", icon: BookOpen, accent: "violet" },
  { id: "electrical", label: "Electrical", icon: Zap, accent: "sky" },
  { id: "automobile", label: "Auto & Garage", icon: Car, accent: "rose" },
  { id: "services", label: "Service Center", icon: Wrench, accent: "teal" },
  { id: "hardware", label: "Hardware", icon: Hammer, accent: "indigo" },
  { id: "pharmacy", label: "Medical Store", icon: Pill, accent: "amber" },
  { id: "clothing", label: "Garments", icon: Shirt, accent: "fuchsia" },
];

function HomePage({ onLaunch, onOpenBusiness }) {
  return (
    <div className="-mx-4 -mt-6 overflow-hidden bg-slate-950 text-white">
      <style>{HOME_CSS}</style>

      <div className="flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-fuchsia-500 shadow-lg">
            <Store size={18} />
          </div>
          <span className="text-sm font-bold tracking-tight">Randhawa Bro's</span>
        </div>
        <button onClick={onLaunch} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:scale-105">
          Launch dashboard
        </button>
      </div>

      <section className="relative isolate px-6 pb-24 pt-10 sm:px-12 sm:pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="blob" style={{ width: 560, height: 560, left: -160, top: -180, background: "#f97316" }} />
          <div className="blob" style={{ width: 480, height: 480, right: -120, top: 40, background: "#8b5cf6", animationDelay: "-5s" }} />
          <div className="blob" style={{ width: 420, height: 420, left: "38%", bottom: -220, background: "#10b981", animationDelay: "-9s" }} />
          <div className="grid-overlay" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <span className="fade-up glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/85">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
              Live demo · built for shops that run on instinct
            </span>
            <h1 className="fade-up d1 mt-7 text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
              Every shelf, counter <span className="gradient-text">&amp; bill</span> on one screen.
            </h1>
            <p className="fade-up d2 mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Speak a restock, scan a barcode, bill a customer and know what runs out before it does. Kirana stores, cafés, bookshops, electricals, garages and service centres, all in one app.
            </p>
            <div className="fade-up d3 mt-10 flex flex-wrap gap-3">
              <button
                onClick={onLaunch}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-fuchsia-500 to-violet-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-fuchsia-500/25 transition hover:scale-105"
              >
                <LayoutDashboard size={16} />
                Launch dashboard
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </button>
              <a href="#how" className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                See how it works
              </a>
            </div>

            <div className="fade-up d4 mt-14 grid max-w-xl grid-cols-3 gap-6">
              {[
                ["10+", "business types"],
                ["3", "ways to take in stock"],
                ["1 tap", "to a printed bill"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="text-3xl font-black text-white">{n}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/55">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up d3 relative lg:col-span-2">
            <div className="floaty glass rounded-3xl p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Today at the counter</p>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">Live</span>
              </div>
              <div className="space-y-2.5 font-mono text-sm">
                {[
                  ["2 × Maggi Masala Noodles", "₹28"],
                  ["1 × Amul Butter", "₹58"],
                  ["3 × Parle-G Biscuits", "₹30"],
                ].map(([a, b]) => (
                  <div key={a} className="flex justify-between rounded-xl bg-white/5 px-3 py-2.5">
                    <span className="text-white/85">{a}</span>
                    <span className="text-white">{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-white/60">Total incl. GST</span>
                <span className="text-2xl font-black">₹116</span>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 rounded-xl bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
                  <AlertTriangle size={14} /> Parle-G is low: 1 packet left (min 10)
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
                  <PackageX size={14} /> Tata Tea Gold is out of stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">What it does</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Built for the counter, not the spreadsheet.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass group rounded-2xl p-6 transition hover:-translate-y-1 hover:bg-white/10">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-fuchsia-500 shadow-lg transition group-hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Pick your business</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Open it straight into your world.</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {HOME_BUSINESSES.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  onClick={() => onOpenBusiness(b.id)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25"
                >
                  <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-30 blur-xl transition group-hover:opacity-60 ${ACCENT[b.accent].tile}`} />
                  <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow ${ACCENT[b.accent].tile}`}>
                    <Icon size={18} />
                  </div>
                  <p className="relative mt-4 text-sm font-semibold">{b.label}</p>
                  <p className="relative mt-1 flex items-center gap-1 text-xs text-white/50 transition group-hover:text-white/80">
                    Open <ArrowRight size={12} />
                  </p>
                </button>
              );
            })}
            <button
              onClick={() => onOpenBusiness("__create")}
              className="group rounded-2xl border border-dashed border-white/25 p-5 text-left transition hover:-translate-y-1 hover:border-white/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Plus size={18} />
              </div>
              <p className="mt-4 text-sm font-semibold">Your own business</p>
              <p className="mt-1 text-xs text-white/50">Create with your categories</p>
            </button>
          </div>
        </div>
      </section>

      <section id="how" className="px-6 pb-24 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Three steps. No training needed.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Add your stock", "Type items, books or dishes once. Set low-stock alerts and expiry dates."],
              ["02", "Update by voice or scan", "Say “Sold 2 packets of Parle-G”, scan a barcode, or drop in a CSV from your supplier."],
              ["03", "Bill and print", "Tap the items a customer buys. The invoice opens ready to print, and stock drops automatically."],
            ].map(([n, t, d]) => (
              <div key={n} className="glass relative overflow-hidden rounded-3xl p-7">
                <p className="gradient-text text-6xl font-black">{n}</p>
                <h3 className="mt-4 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-12">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-fuchsia-600 to-violet-700 p-10 shadow-2xl sm:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber-300/25 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/75">Ready when you are</p>
              <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-5xl">Start managing your stock in under a minute.</h2>
            </div>
            <button onClick={onLaunch} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-xl transition hover:scale-105">
              Launch dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/45 sm:px-12">
        Randhawa Bro's Inventory Manager · Team Randhawa Bro's · Hackathon MVP
      </footer>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   HEADER, PAGE TABS, HERO
   ═════════════════════════════════════════════════════════════ */

function Header({ meta, stores, onStore, onCreate, onHome }) {
  const acc = ACCENT[meta.accent] || ACCENT.slate;
  const mainList = PRESET_ORDER.filter((id) => PRESETS[id].main).map((id) => stores[id]);
  const others = Object.values(stores).filter((s) => !s.main);
  const isOther = !mainList.some((s) => s.id === meta.id);
  const BrandIcon = iconFor(meta);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onHome} className="flex items-center gap-3" aria-label="Go to homepage">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow ${acc.bg}`}>
              <BrandIcon size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold leading-tight text-slate-900">Randhawa Bro's</p>
              <p className="text-xs leading-tight text-slate-500">Inventory Manager</p>
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onHome} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <HomeIcon size={14} />
            Home
          </button>
          <div className="flex rounded-xl bg-slate-100 p-1">
            {mainList.map((s) => {
              const Icon = iconFor(s);
              const on = !isOther && s.id === meta.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onStore(s.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${on ? `${ACCENT[s.accent].bg} text-white shadow` : "text-slate-600 hover:text-slate-900"}`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </button>
              );
            })}
          </div>

          <select
            value={isOther ? meta.id : ""}
            onChange={(e) => {
              if (e.target.value === "__new") onCreate();
              else if (e.target.value) onStore(e.target.value);
            }}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-200 ${isOther ? `${acc.bg} border-transparent text-white` : "border-slate-200 bg-white text-slate-700"}`}
          >
            <option value="">Other business ▾</option>
            {others.map((s) => (
              <option key={s.id} value={s.id} className="text-slate-900">
                {s.label}
              </option>
            ))}
            <option value="__new" className="text-slate-900">
              ＋ Create new business
            </option>
          </select>
        </div>
      </div>
    </header>
  );
}

function PageTabs({ page, onPage }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
        {PAGES.map((p) => {
          const Icon = p.icon;
          const on = p.key === page;
          return (
            <button
              key={p.key}
              onClick={() => onPage(p.key)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${on ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              <Icon size={16} />
              {p.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function Hero({ meta, items, invoiceCount }) {
  const acc = ACCENT[meta.accent] || ACCENT.slate;
  const alerts = items.filter((i) => getStatus(i).problem).length;
  const stats = [
    { label: "Products", value: items.length },
    { label: "Need attention", value: alerts },
    { label: "Invoices", value: invoiceCount },
  ];
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${acc.hero}`}>
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 right-28 h-56 w-56 rounded-full bg-white/10" />
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/75">Now managing</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{meta.label}</h1>
          <p className="mt-1 max-w-md text-sm text-white/85">{meta.tagline}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/15 px-4 py-2.5">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wide text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   PAGE: SELL & BILL
   ═════════════════════════════════════════════════════════════ */

function SellPage({ meta, items, recipes, cart, setCart, onCheckout }) {
  const [q, setQ] = useState("");
  const isRest = meta.id === "restaurant";
  const acc = ACCENT[meta.accent] || ACCENT.slate;

  const menu = useMemo(() => {
    const base = isRest
      ? recipes.map((d) => {
          const available = d.ingredients.every((ing) => {
            const it = items.find((i) => i.id === ing.itemId);
            return it && it.stock >= ing.qty;
          });
          return { id: d.id, name: d.name, price: d.price, tag: "Dish", sub: `${d.ingredients.length} ingredients`, available };
        })
      : items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          tag: i.category,
          sub: i.kind === "service" ? "Service" : i.sku,
          available: i.kind === "service" || i.stock > 0,
        }));
    const needle = norm(q);
    return needle ? base.filter((m) => norm(m.name).includes(needle)) : base;
  }, [isRest, recipes, items, q]);

  const add = (m) =>
    setCart((prev) => {
      const ex = prev.find((l) => l.id === m.id);
      return ex ? prev.map((l) => (l.id === m.id ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { id: m.id, name: m.name, price: m.price, qty: 1 }];
    });
  const bump = (id, d) => setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));

  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);

  if (!items.length && !isRest) {
    return (
      <Card title="Sell & bill">
        <EmptyState icon={ShoppingCart} text={`No items yet for ${meta.label}. Add some from the Add New page.`} />
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card
        className="lg:col-span-3"
        title={isRest ? "Menu" : "Products"}
        subtitle={isRest ? "Each dish auto-deducts its raw ingredients from stock" : "Tap to add. Completing the sale reduces stock."}
        right={<SearchBox value={q} onChange={setQ} placeholder={isRest ? "Search dishes…" : "Search…"} />}
      >
        <div className="grid max-h-[480px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
          {menu.map((m) => (
            <button
              key={m.id}
              disabled={!m.available}
              onClick={() => add(m)}
              className={`rounded-xl border p-3 text-left transition ${m.available ? "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md" : "cursor-not-allowed border-dashed border-slate-300 bg-slate-50 opacity-60"}`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{m.tag}</span>
              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{m.name}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <span className="truncate text-[11px] text-slate-500">{m.available ? m.sub : "Out of stock"}</span>
                <span className={`shrink-0 text-sm font-bold ${acc.text}`}>{money(m.price)}</span>
              </div>
            </button>
          ))}
          {menu.length === 0 && <p className="col-span-full py-10 text-center text-sm text-slate-400">Nothing matches "{q}".</p>}
        </div>
      </Card>

      <Card className="lg:col-span-2" title="Current order" subtitle={`${count} item${count === 1 ? "" : "s"}`}>
        <div className="flex min-h-[260px] flex-col">
          <div className="flex-1 space-y-2">
            {cart.length === 0 && <EmptyState icon={ShoppingCart} text="Cart is empty. Tap an item to start an order." />}
            {cart.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{l.name}</p>
                  <p className="text-xs text-slate-500">
                    {money(l.price)} each · {money(l.price * l.qty)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => bump(l.id, -1)} className={QTY_BTN} aria-label="Decrease">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                  <button onClick={() => bump(l.id, 1)} className={QTY_BTN} aria-label="Increase">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-xl font-bold text-slate-900">{money(total)}</span>
            </div>
            <button disabled={!cart.length} onClick={onCheckout} className={btnPrimary(acc)}>
              <Receipt size={16} />
              {isRest ? "Fire order & generate bill" : "Complete sale & generate bill"}
            </button>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="w-full text-xs text-slate-500 hover:text-rose-600">
                Clear order
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   PAGE: INVOICES
   ═════════════════════════════════════════════════════════════ */

function InvoicesPage({ meta, list, onOpen }) {
  return (
    <Card title="Invoice history" subtitle={`${list.length} invoice${list.length === 1 ? "" : "s"} for ${meta.label}`}>
      {list.length === 0 ? (
        <EmptyState icon={Receipt} text="No invoices yet. Complete a sale to create your first one." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {list.map((inv) => (
            <li key={inv.id}>
              <button onClick={() => onOpen(inv)} className="flex w-full items-center justify-between gap-4 rounded-lg px-2 py-3 text-left transition hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-slate-900">#{inv.number}</p>
                  <p className="truncate text-xs text-slate-500">
                    {inv.date} · {inv.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}
                  </p>
                </div>
                <span className="shrink-0 font-bold text-slate-900">{money(inv.total)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function InvoiceModal({ invoice, onClose, onPrint, onDownload }) {
  useEscape(onClose);
  if (!invoice) return null;
  const gst = invoice.total - invoice.total / 1.05;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between rounded-t-2xl bg-slate-800 px-5 py-4 text-white">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/75">Invoice</p>
            <p className="font-semibold">#{invoice.number}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-white/80 hover:bg-white/15 hover:text-white" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="m-5 rounded-xl border border-dashed border-slate-300 p-5 font-mono text-xs text-slate-700">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">RANDHAWA BRO'S</p>
            <p className="text-[11px] text-slate-500">{invoice.storeLabel}</p>
            <p className="mt-1 text-[11px] text-slate-500">{invoice.date}</p>
          </div>
          <div className="my-3 border-t border-dashed border-slate-300" />
          {invoice.lines.map((l, idx) => (
            <div key={idx} className="flex justify-between gap-2 py-0.5">
              <span className="truncate">
                {l.qty} × {l.name}
              </span>
              <span className="shrink-0">{money(l.qty * l.price)}</span>
            </div>
          ))}
          <div className="my-3 border-t border-dashed border-slate-300" />
          <div className="flex justify-between text-sm font-bold text-slate-900">
            <span>TOTAL</span>
            <span>{money(invoice.total)}</span>
          </div>
          <p className="mt-1 text-right text-[11px] text-slate-500">incl. GST 5%: {money(gst)}</p>
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <button onClick={() => onPrint(invoice)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
            <Printer size={16} />
            Print receipt
          </button>
          <button
            onClick={() => onDownload(invoice)}
            title="Download as HTML"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   PAGE: CHECK STOCK
   ═════════════════════════════════════════════════════════════ */

const KPI_TONES = { all: "text-slate-900", out: "text-rose-600", low: "text-amber-600", expiring: "text-orange-600", healthy: "text-emerald-600" };

function StockPage({ meta, items, onAdjust, onDelete }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const c = { all: items.length, out: 0, low: 0, expiring: 0, healthy: 0 };
    items.forEach((i) => {
      const s = getStatus(i);
      if (s.out) c.out++;
      else if (s.low) c.low++;
      if (s.expiring || s.expired) c.expiring++;
      if (!s.problem) c.healthy++;
    });
    return c;
  }, [items]);

  const attention = useMemo(() => items.filter((i) => getStatus(i).problem).sort((a, b) => severity(b) - severity(a)).slice(0, 5), [items]);

  const rows = useMemo(() => {
    const needle = norm(q);
    return items
      .filter((i) => {
        const s = getStatus(i);
        if (cat !== "All" && i.category !== cat) return false;
        if (filter === "out" && !s.out) return false;
        if (filter === "low" && !s.low) return false;
        if (filter === "expiring" && !(s.expiring || s.expired)) return false;
        if (filter === "healthy" && s.problem) return false;
        if (!needle) return true;
        return norm(i.name).includes(needle) || i.sku.toLowerCase().includes(needle) || norm(i.category).includes(needle);
      })
      .sort((a, b) => severity(b) - severity(a));
  }, [items, q, cat, filter]);

  const kpis = [
    { key: "all", label: "All items" },
    { key: "out", label: "Out of stock" },
    { key: "low", label: "Low stock" },
    { key: "expiring", label: "Expiring ≤ 7 days" },
    { key: "healthy", label: "Healthy" },
  ];

  if (!items.length) {
    return (
      <Card title="Check stock">
        <EmptyState icon={PackageSearch} text={`Nothing in stock for ${meta.label} yet. Add items from Add New.`} />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <button
            key={k.key}
            onClick={() => setFilter(k.key)}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${filter === k.key ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200"}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{k.label}</p>
            <p className={`mt-1 text-2xl font-bold ${KPI_TONES[k.key]}`}>{counts[k.key]}</p>
          </button>
        ))}
      </div>

      {attention.length > 0 && (
        <Card title="Needs attention" subtitle="Sorted by urgency">
          <ul className="grid gap-2 sm:grid-cols-2">
            {attention.map((i) => {
              const s = getStatus(i);
              return (
                <li key={i.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${s.out || s.expired ? "text-rose-500" : "text-amber-500"}`} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{i.name}</p>
                    <p className="text-xs text-slate-500">{warningText(i)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <Card
        title="Inventory"
        subtitle={`${rows.length} of ${items.length} shown`}
        right={
          <div className="flex flex-wrap items-center gap-2">
            <SearchBox value={q} onChange={setQ} placeholder="Search name or SKU…" />
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none">
              {["All", ...meta.categories].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        }
      >
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-2.5 font-semibold">Item</th>
                <th className="px-3 py-2.5 font-semibold">Category</th>
                <th className="px-3 py-2.5 font-semibold">Stock</th>
                <th className="px-3 py-2.5 font-semibold">{meta.metaLabel}</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-5 py-2.5 text-right font-semibold">Quick actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                    No items match these filters.
                  </td>
                </tr>
              )}
              {rows.map((item) => {
                const s = getStatus(item);
                const pct = Math.min(100, (item.stock / Math.max(item.lowThreshold * 4, 1)) * 100);
                const bar = s.out ? "bg-rose-500" : s.low ? "bg-amber-500" : ACCENT[meta.accent]?.bar || "bg-slate-500";
                const value = metaValue(item, meta);
                return (
                  <tr key={item.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="font-mono text-[11px] text-slate-500">{item.sku}</p>
                    </td>
                    <td className="px-3 py-3">
                      <Chip>{item.category}</Chip>
                    </td>
                    <td className="px-3 py-3">
                      {s.service ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <>
                          <p className="font-semibold text-slate-800">{formatStock(item.stock, item.unit)}</p>
                          <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-slate-200">
                            <div className={`h-full transition-all duration-500 ${bar}`} style={{ width: `${pct}%` }} />
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {meta.metaField === "expiry" ? (
                        <span className={s.expired ? "text-rose-600" : s.expiring ? "text-amber-600" : "text-slate-600"}>{value || "—"}</span>
                      ) : meta.metaField === "isbn" ? (
                        <span className="font-mono text-slate-600">{value || "—"}</span>
                      ) : (
                        <span className="text-slate-600">{value || "—"}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <StatusChips item={item} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {!s.service && (
                          <>
                            <button onClick={() => onAdjust(item.id, -stepFor(meta, item))} className={QTY_BTN} aria-label="Decrease stock">
                              <Minus size={13} />
                            </button>
                            <button onClick={() => onAdjust(item.id, stepFor(meta, item))} className={QTY_BTN} aria-label="Increase stock">
                              <Plus size={13} />
                            </button>
                          </>
                        )}
                        <button onClick={() => onDelete(item.id)} className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50" aria-label="Delete item">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   PAGE: UPDATE STOCK
   ═════════════════════════════════════════════════════════════ */

function VoiceCard({ meta, items, onCommand }) {
  const acc = ACCENT[meta.accent] || ACCENT.slate;
  const [listening, setListening] = useState(false);
  const [live, setLive] = useState("");
  const [typed, setTyped] = useState("");
  const [log, setLog] = useState([]);
  const [micNote, setMicNote] = useState("");
  const recRef = useRef(null);
  const SR = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

  const examples = meta.voice?.length
    ? meta.voice
    : items.filter((i) => i.kind !== "service").slice(0, 2).map((i) => `Add 5 ${i.unit} of ${i.name}`);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.abort();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  const handle = (text) => {
    const t = text.trim();
    if (!t) return;
    const res = onCommand(t);
    setLog((prev) => [{ id: uid(), text: t, ok: res.ok, message: res.message }, ...prev].slice(0, 6));
  };

  const submitTyped = () => {
    handle(typed);
    setTyped("");
  };

  const start = () => {
    setMicNote("");
    if (!SR) {
      setMicNote("This browser has no live voice support. Use Chrome or Edge, or type the command below.");
      return;
    }
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setMicNote("The microphone needs a secure page (https or localhost). Type the command below for now.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => {
      setListening(true);
      setLive("");
    };
    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      setLive((final || interim).trim());
      if (final.trim()) handle(final);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setMicNote("This page is not allowed to use the microphone. Open the app in its own browser tab (Chrome or Edge), allow Microphone for the site, and reload. Typed commands work everywhere.");
      } else if (e.error === "audio-capture") {
        setMicNote("No microphone was found. Connect one, or type the command below.");
      } else if (e.error !== "no-speech" && e.error !== "aborted") {
        setMicNote(`Voice input stopped (${e.error}). You can type the command instead.`);
      }
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      setListening(false);
      setMicNote("The microphone could not start. Try again, or type the command below.");
    }
  };

  const stop = () => recRef.current?.stop();

  return (
    <Card title="Voice & typed commands" subtitle="Say or type a stock update. It is applied to inventory right away.">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          {listening && <span className={`absolute inset-0 animate-ping rounded-full ${acc.bg} opacity-30`} />}
          <button
            onClick={listening ? stop : start}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition hover:scale-105 ${acc.bg} ${acc.hover}`}
            aria-label={listening ? "Stop listening" : "Start listening"}
          >
            <Mic size={30} />
          </button>
        </div>
        <p className="text-xs font-medium text-slate-500">{listening ? "Listening… speak now" : "Tap the mic and speak"}</p>
        <div className="min-h-[2.75rem] w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-800">
          {listening ? (
            live ? <span>{live}</span> : <span className="text-slate-400">Waiting for speech…</span>
          ) : (
            <span className="text-slate-400">{examples[0] ? `Try saying: "${examples[0]}"` : "Add items first, then speak a stock update."}</span>
          )}
        </div>
      </div>

      {micNote && (
        <div className="mt-4">
          <Notice tone="info">{micNote}</Notice>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <div className="relative flex-1">
          <Keyboard size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={enterKey(submitTyped)}
            placeholder='Type, e.g. "Restock 10 packets of Maggi"'
            className={`${INPUT} pl-9`}
          />
        </div>
        <button onClick={submitTyped} className={`rounded-xl px-4 text-sm font-semibold text-white ${acc.bg} ${acc.hover}`}>
          Apply
        </button>
      </div>

      {examples.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => handle(ex)}
              className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] text-slate-500 hover:border-slate-500 hover:text-slate-800"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {log.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <History size={12} /> Recent commands
          </p>
          {log.map((l) => (
            <div key={l.id} className="flex items-start gap-2 text-xs">
              {l.ok ? <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" /> : <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" />}
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">"{l.text}"</p>
                <p className={l.ok ? "text-slate-500" : "text-amber-700"}>{l.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function BarcodeCard({ meta, items, onAdjust, toast }) {
  const acc = ACCENT[meta.accent] || ACCENT.slate;
  const [code, setCode] = useState("");
  const [mode, setMode] = useState(1);
  const stockItems = items.filter((i) => i.kind !== "service");

  const submit = () => {
    const c = code.trim().toLowerCase();
    if (!c) return;
    const it = items.find((i) => i.sku.toLowerCase() === c);
    if (!it) {
      toast(`No item with code "${code.trim()}".`, "warn");
      return;
    }
    if (it.kind === "service") {
      toast(`${it.name} is a service and has no stock.`, "warn");
      return;
    }
    onAdjust(it.id, mode);
    setCode("");
  };

  return (
    <Card title="Barcode / SKU" subtitle="Scan or type a code to add or remove one unit">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {[
            { v: 1, label: "Stock in (+1)" },
            { v: -1, label: "Stock out (−1)" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setMode(o.v)}
              className={`rounded-lg py-1.5 text-xs font-semibold transition ${mode === o.v ? `${acc.bg} text-white shadow` : "text-slate-500 hover:text-slate-800"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <ScanBarcode size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={enterKey(submit)}
            placeholder={meta.metaField === "isbn" ? "Scan ISBN" : "Scan or type SKU"}
            className={`${INPUT} py-2.5 pl-10 font-mono`}
          />
        </div>
        {stockItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {stockItems.slice(0, 4).map((i) => (
              <button
                key={i.id}
                onClick={() => setCode(i.sku)}
                className="rounded-md border border-dashed border-slate-300 px-2 py-0.5 font-mono text-[11px] text-slate-500 hover:border-slate-500 hover:text-slate-800"
              >
                {i.sku}
              </button>
            ))}
          </div>
        )}
        <button onClick={submit} className={btnPrimary(acc)}>
          Apply scan
        </button>
      </div>
    </Card>
  );
}

function BulkCard({ meta, onBulk, toast }) {
  const acc = ACCENT[meta.accent] || ACCENT.slate;
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const sample = sampleCSV(meta);

  const ingest = (text) => {
    const { items, errors } = parseCSV(text, meta);
    if (!items.length) {
      toast(errors[0] || "No rows found. Check the CSV format shown below.", "warn");
      return;
    }
    onBulk(items);
    const skipped = errors.length ? ` · ${errors.length} row(s) skipped` : "";
    toast(`Imported ${items.length} item${items.length === 1 ? "" : "s"}${skipped}.`, errors.length ? "warn" : "success");
  };

  const readFile = async (file) => {
    if (!file) return;
    if (!/\.(csv|txt)$/i.test(file.name)) {
      toast("Please use a .csv file.", "warn");
      return;
    }
    ingest(await file.text());
  };

  return (
    <Card title="Bulk import" subtitle="Drop a CSV from a supplier or billing app">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          readFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${drag ? `${acc.soft} border-slate-400` : "border-slate-300 hover:border-slate-400"}`}
      >
        <UploadCloud size={30} className={acc.text} />
        <p className="text-sm font-medium text-slate-800">Drop a CSV here or click to browse</p>
        <p className="font-mono text-[11px] text-slate-500">{csvHeader(meta)}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={(e) => {
            readFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {sample && (
        <button
          onClick={() => ingest(sample)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <FileSpreadsheet size={16} />
          Load sample batch (5 items)
        </button>
      )}
    </Card>
  );
}

function ManualCard({ meta, items, onAdjust }) {
  const acc = ACCENT[meta.accent] || ACCENT.slate;
  const stockItems = items.filter((i) => i.kind !== "service");
  const [id, setId] = useState(stockItems[0]?.id ?? "");
  const [amount, setAmount] = useState(1);
  const [dir, setDir] = useState(1);
  const selected = stockItems.find((i) => i.id === id) ?? stockItems[0];

  if (!selected) {
    return (
      <Card title="Manual adjustment">
        <EmptyState icon={PackageSearch} text="No stock items yet. Services don't hold stock." />
      </Card>
    );
  }

  const delta = dir * Number(amount || 0);
  const preview = Math.max(0, selected.stock + delta);

  return (
    <Card title="Manual adjustment" subtitle="Pick an item and set the exact change">
      <div className="space-y-4">
        <Field label="Item">
          <select value={selected.id} onChange={(e) => setId(e.target.value)} className={INPUT}>
            {stockItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} · {formatStock(i.stock, i.unit)}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={`Amount (${selected.unit})`}>
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={INPUT} />
          </Field>
          <Field label="Direction">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              {[
                { v: 1, label: "Add" },
                { v: -1, label: "Remove" },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => setDir(o.v)}
                  className={`rounded-lg py-2 text-xs font-semibold transition ${dir === o.v ? `${acc.bg} text-white shadow` : "text-slate-500 hover:text-slate-800"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-500">
            {formatStock(selected.stock, selected.unit)} → <span className="font-semibold text-slate-900">{formatStock(preview, selected.unit)}</span>
          </span>
          <button
            disabled={!Number(amount)}
            onClick={() => {
              onAdjust(selected.id, delta);
              setAmount(1);
            }}
            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 ${acc.bg} ${acc.hover}`}
          >
            Apply
          </button>
        </div>
      </div>
    </Card>
  );
}

function UpdateStockPage({ meta, items, onVoice, onScan, onBulk, onAdjust, toast }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <VoiceCard meta={meta} items={items} onCommand={onVoice} />
      <div className="space-y-6">
        <BarcodeCard meta={meta} items={items} onAdjust={onScan} toast={toast} />
        <ManualCard meta={meta} items={items} onAdjust={onAdjust} />
      </div>
      <div className="lg:col-span-2">
        <BulkCard meta={meta} onBulk={onBulk} toast={toast} />
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   PAGE: ADD NEW
   ═════════════════════════════════════════════════════════════ */

function ProductForm({ meta, items, onSubmit, onAddCategory }) {
  const blank = {
    name: "",
    kind: meta.kind,
    category: meta.categories[0] || "",
    unit: meta.units[0],
    stock: "",
    price: "",
    lowThreshold: "",
    expiry: "",
    brand: "",
    sku: "",
    isbn: "",
  };
  const [f, setF] = useState(blank);
  const [newCat, setNewCat] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isService = f.kind === "service";
  const allowService = meta.id !== "restaurant" && meta.id !== "book";
  const accBg = ACCENT[meta.accent]?.bg || "bg-slate-700";

  const set = (k) => (e) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const saveCategory = () => {
    const name = newCat.trim();
    if (!name) {
      setError("Type a category name first.");
      return;
    }
    onAddCategory(name);
    setF((p) => ({ ...p, category: name }));
    setNewCat("");
    setAddingCat(false);
    setError("");
  };

  const submit = () => {
    setError("");
    setSuccess("");
    const name = f.name.trim();
    if (!name) return setError("Enter the item name.");
    if (!isService) {
      if (f.stock !== "" && (Number(f.stock) < 0 || Number.isNaN(Number(f.stock)))) return setError("Opening stock must be 0 or more.");
      if (!f.unit) return setError("Choose a unit.");
    }
    if (f.price !== "" && (Number(f.price) < 0 || Number.isNaN(Number(f.price)))) return setError("Price must be 0 or more.");
    const sku = f.sku.trim();
    if (sku && items.some((i) => i.sku.toLowerCase() === sku.toLowerCase())) return setError("That SKU / barcode is already used.");
    const isbn = f.isbn.replace(/[-\s]/g, "");
    if (meta.metaField === "isbn" && isbn) {
      if (!/^\d{10}(\d{3})?$/.test(isbn)) return setError("ISBN must be 10 or 13 digits.");
      if (items.some((i) => i.sku === isbn || i.isbn === isbn)) return setError("A book with this ISBN already exists.");
    }
    if (f.expiry && !ISO_RE.test(f.expiry)) return setError("Expiry date is not valid.");

    const ok = onSubmit({ ...f, name, sku, isbn: isbn || null });
    if (!ok) return setError("Could not add the item. Please try again.");
    setSuccess(`"${name}" added to ${meta.short}.`);
    setF({ ...blank, kind: f.kind, category: f.category, unit: f.unit });
  };

  return (
    <div className="space-y-5">
      {allowService && (
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:w-96">
          {[
            { v: "stock", label: "Stock item (has quantity)" },
            { v: "service", label: "Service (billed, no stock)" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setF((p) => ({ ...p, kind: o.v }))}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${f.kind === o.v ? `${accBg} text-white shadow` : "text-slate-500 hover:text-slate-800"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Item name *">
            <input
              value={f.name}
              onChange={set("name")}
              onKeyDown={enterKey(submit)}
              placeholder={isService ? "e.g. AC Gas Refill" : "e.g. Bru Instant Coffee 100g"}
              className={INPUT}
            />
          </Field>
        </div>

        <Field label="Category">
          {addingCat ? (
            <div className="flex gap-2">
              <input autoFocus value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={enterKey(saveCategory)} placeholder="New category name" className={INPUT} />
              <button onClick={saveCategory} className={`shrink-0 rounded-xl px-3 text-xs font-semibold text-white ${accBg}`}>
                Save
              </button>
              <button onClick={() => setAddingCat(false)} className="shrink-0 rounded-xl border border-slate-200 px-3 text-xs text-slate-600">
                Cancel
              </button>
            </div>
          ) : (
            <select
              value={f.category}
              onChange={(e) => {
                if (e.target.value === "__new") setAddingCat(true);
                else setF((p) => ({ ...p, category: e.target.value }));
              }}
              className={INPUT}
            >
              {meta.categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
              <option value="__new">＋ Add new category…</option>
            </select>
          )}
        </Field>

        {!isService && (
          <Field label="Unit">
            <select value={f.unit} onChange={set("unit")} className={INPUT}>
              {meta.units.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </Field>
        )}

        {!isService && (
          <Field label="Opening stock">
            <input type="number" min="0" value={f.stock} onChange={set("stock")} placeholder="0" className={INPUT} />
          </Field>
        )}

        <Field label={isService ? "Rate (₹)" : "Price (₹)"}>
          <input type="number" min="0" step="any" value={f.price} onChange={set("price")} placeholder="0" className={INPUT} />
        </Field>

        {!isService && (
          <Field label="Low-stock alert at">
            <input type="number" min="0" value={f.lowThreshold} onChange={set("lowThreshold")} placeholder={`${meta.lowDefault}`} className={INPUT} />
          </Field>
        )}

        {meta.metaField === "expiry" && !isService && (
          <Field label="Expiry date">
            <input type="date" value={f.expiry} onChange={set("expiry")} className={INPUT} />
          </Field>
        )}

        {meta.metaField === "isbn" && (
          <Field label="ISBN (optional)">
            <input value={f.isbn} onChange={set("isbn")} placeholder="13-digit ISBN" className={`${INPUT} font-mono`} />
          </Field>
        )}

        {meta.metaField !== "isbn" && (
          <Field label={`${meta.metaLabel} (optional)`}>
            <input value={f.brand} onChange={set("brand")} placeholder={meta.metaLabel} className={INPUT} />
          </Field>
        )}

        <Field label="SKU / barcode (optional)">
          <input value={f.sku} onChange={set("sku")} onKeyDown={enterKey(submit)} placeholder="Auto-generated if empty" className={`${INPUT} font-mono`} />
        </Field>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">{success}</Notice>}

      <button onClick={submit} className={btnPrimary(ACCENT[meta.accent] || ACCENT.slate)}>
        <PlusCircle size={16} />
        {isService ? "Add service" : "Add to inventory"}
      </button>
    </div>
  );
}

function BookForm({ items, onSubmit }) {
  const blank = { title: "", author: "", isbn: "", category: PRESETS.book.categories[0], price: "", copies: "", lowThreshold: "" };
  const [f, setF] = useState(blank);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = (k) => (e) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const submit = () => {
    setError("");
    setSuccess("");
    const isbn = f.isbn.replace(/[-\s]/g, "");
    if (!f.title.trim()) return setError("Enter the book title.");
    if (!/^\d{10}(\d{3})?$/.test(isbn)) return setError("ISBN must be 10 or 13 digits.");
    if (items.some((i) => i.sku === isbn || i.isbn === isbn)) return setError("A book with this ISBN already exists.");
    const ok = onSubmit({
      name: f.title,
      author: f.author,
      isbn,
      sku: isbn,
      category: f.category,
      unit: "copies",
      price: f.price,
      stock: f.copies,
      lowThreshold: f.lowThreshold,
      kind: "stock",
    });
    if (!ok) return setError("Could not add the book. Please try again.");
    setSuccess(`"${f.title.trim()}" added to the catalogue.`);
    setF(blank);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Book title *">
            <input value={f.title} onChange={set("title")} onKeyDown={enterKey(submit)} placeholder="e.g. Deep Work" className={INPUT} />
          </Field>
        </div>
        <Field label="Author">
          <input value={f.author} onChange={set("author")} placeholder="e.g. Cal Newport" className={INPUT} />
        </Field>
        <Field label="ISBN *">
          <input value={f.isbn} onChange={set("isbn")} onKeyDown={enterKey(submit)} placeholder="13-digit ISBN" className={`${INPUT} font-mono`} />
        </Field>
        <Field label="Category">
          <select value={f.category} onChange={set("category")} className={INPUT}>
            {PRESETS.book.categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="MRP (₹)">
          <input type="number" min="0" value={f.price} onChange={set("price")} placeholder="0" className={INPUT} />
        </Field>
        <Field label="Copies in stock">
          <input type="number" min="0" value={f.copies} onChange={set("copies")} placeholder="0" className={INPUT} />
        </Field>
        <Field label="Reorder alert at">
          <input type="number" min="0" value={f.lowThreshold} onChange={set("lowThreshold")} placeholder={`${PRESETS.book.lowDefault}`} className={INPUT} />
        </Field>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">{success}</Notice>}
      <button onClick={submit} className={btnPrimary(ACCENT.violet)}>
        <BookOpen size={16} />
        Add book to catalogue
      </button>
    </div>
  );
}

function RecipeForm({ items, onSubmit }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rows, setRows] = useState([{ itemId: "", qty: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateRow = (idx, patch) => setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const submit = () => {
    setError("");
    setSuccess("");
    const ingredients = rows.filter((r) => r.itemId && Number(r.qty) > 0).map((r) => ({ itemId: r.itemId, qty: Number(r.qty) }));
    if (!name.trim()) return setError("Enter the dish name.");
    if (ingredients.length === 0) return setError("Add at least one ingredient with a quantity above 0.");
    const ok = onSubmit({ id: uid(), name: name.trim(), price: Number(price) || 0, ingredients });
    if (!ok) return setError("Could not save the dish. Please try again.");
    setSuccess(`"${name.trim()}" added to the menu.`);
    setName("");
    setPrice("");
    setRows([{ itemId: "", qty: "" }]);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="Dish name *">
            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={enterKey(submit)} placeholder="e.g. Dal Makhani" className={INPUT} />
          </Field>
        </div>
        <Field label="Selling price (₹)">
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className={INPUT} />
        </Field>
      </div>

      <div className="space-y-2">
        <p className={LABEL}>Ingredients (deducted from raw stock on every order)</p>
        {rows.map((row, idx) => {
          const it = items.find((i) => i.id === row.itemId);
          return (
            <div key={idx} className="grid grid-cols-12 items-center gap-2">
              <select value={row.itemId} onChange={(e) => updateRow(idx, { itemId: e.target.value })} className={`${INPUT} col-span-6`}>
                <option value="">Choose ingredient</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <div className="relative col-span-4">
                <input type="number" min="0" value={row.qty} onChange={(e) => updateRow(idx, { qty: e.target.value })} placeholder="Qty" className={`${INPUT} pr-12`} />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{it?.unit || ""}</span>
              </div>
              <button
                onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((_, i) => i !== idx) : rs))}
                className="col-span-2 flex h-9 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50"
                aria-label="Remove ingredient"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
        <button onClick={() => setRows((rs) => [...rs, { itemId: "", qty: "" }])} className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700">
          <Plus size={14} /> Add ingredient
        </button>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">{success}</Notice>}

      <button onClick={submit} className={btnPrimary(ACCENT.orange)}>
        <ChefHat size={16} />
        Save dish
      </button>
    </div>
  );
}

function AddNewPage({ meta, items, recipes, onAddItem, onAddRecipe, onDeleteRecipe, onAddCategory }) {
  const types = meta.id === "book" ? ["book", "product"] : meta.id === "restaurant" ? ["recipe", "product"] : ["product"];
  const [type, setType] = useState(types[0]);
  const acc = ACCENT[meta.accent] || ACCENT.slate;
  const labels = {
    product: meta.id === "restaurant" ? "Raw ingredient / other" : "Item",
    book: "Book",
    recipe: "Dish / recipe",
  };
  const titles = {
    product: meta.id === "restaurant" ? "Add a raw ingredient" : meta.kind === "service" ? "Add a service" : "Add an item",
    book: "Add a book",
    recipe: "Add a dish",
  };
  const subtitles = {
    product: "Anything you sell or use: products, supplies, parts, or services. You can add new categories as you go.",
    book: "Add a title by ISBN. The ISBN doubles as its barcode.",
    recipe: "Link ingredients from raw stock so each order deducts them automatically.",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card
        className="lg:col-span-2"
        title={titles[type]}
        subtitle={subtitles[type]}
        right={
          types.length > 1 && (
            <div className="flex rounded-xl bg-slate-100 p-1">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${type === t ? `${acc.bg} text-white shadow` : "text-slate-500 hover:text-slate-800"}`}
                >
                  {labels[t]}
                </button>
              ))}
            </div>
          )
        }
      >
        {type === "product" && <ProductForm key={meta.id} meta={meta} items={items} onSubmit={onAddItem} onAddCategory={onAddCategory} />}
        {type === "book" && <BookForm items={items} onSubmit={onAddItem} />}
        {type === "recipe" && <RecipeForm items={items} onSubmit={onAddRecipe} />}
      </Card>

      <Card title="Good to know" subtitle="How this stays accurate">
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-2">
            <Info size={15} className="mt-0.5 shrink-0 text-slate-400" />
            Opening stock is what you have on the shelf today. Change it later from Update Stock.
          </li>
          <li className="flex gap-2">
            <Info size={15} className="mt-0.5 shrink-0 text-slate-400" />
            Set a low-stock alert so you hear about it before running out.
          </li>
          <li className="flex gap-2">
            <Info size={15} className="mt-0.5 shrink-0 text-slate-400" />
            Services are billed like items but never reduce stock. Use them for labour, repairs and visits.
          </li>
          {meta.id === "restaurant" && (
            <li className="flex gap-2">
              <Info size={15} className="mt-0.5 shrink-0 text-slate-400" />
              Add raw ingredients first, then link them to a dish. Quantities use the ingredient's unit.
            </li>
          )}
        </ul>
      </Card>

      {meta.id === "restaurant" && (
        <Card className="lg:col-span-3" title="Your dishes" subtitle={`${recipes.length} on the menu`}>
          {recipes.length === 0 ? (
            <EmptyState icon={ChefHat} text="No dishes yet. Create one above." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((d) => (
                <div key={d.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900">{d.name}</p>
                    <button onClick={() => onDeleteRecipe(d.id)} className="text-rose-500 hover:text-rose-600" aria-label="Delete dish">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {money(d.price)} · {d.ingredients.length} ingredients
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-600">
                    {d.ingredients.map((ing, idx) => {
                      const it = items.find((i) => i.id === ing.itemId);
                      return (
                        <li key={idx} className="flex justify-between gap-2">
                          <span className="truncate">{it?.name || "Removed item"}</span>
                          <span className="shrink-0 font-mono">
                            {ing.qty}
                            {it?.unit || ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   CREATE BUSINESS
   ═════════════════════════════════════════════════════════════ */

function CreateBusinessModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [cats, setCats] = useState("");
  const [units, setUnits] = useState("pcs, box, kg, litre, set");
  const [expiry, setExpiry] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    const categories = cats.split(",").map((s) => s.trim()).filter(Boolean);
    const unitList = units.split(",").map((s) => s.trim()).filter(Boolean);
    if (!name.trim()) return setError("Enter a business name.");
    if (categories.length === 0) return setError("Add at least one category, separated by commas.");
    onCreate({ label: name.trim(), categories, units: unitList.length ? unitList : ["pcs"], expiry });
  };

  return (
    <Modal title="Create a new business" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Business name *">
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={enterKey(submit)} placeholder="e.g. Sharma Plumbing Supplies" className={INPUT} />
        </Field>
        <Field label="Categories * (comma separated)">
          <input value={cats} onChange={(e) => setCats(e.target.value)} onKeyDown={enterKey(submit)} placeholder="Pipes, Taps, Fittings, Tools" className={INPUT} />
        </Field>
        <Field label="Units (comma separated)">
          <input value={units} onChange={(e) => setUnits(e.target.value)} className={INPUT} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={expiry} onChange={(e) => setExpiry(e.target.checked)} className="h-4 w-4" />
          Items in this business have expiry dates
        </label>
        {error && <Notice tone="error">{error}</Notice>}
        <button onClick={submit} className={btnPrimary(ACCENT.slate)}>
          <Briefcase size={16} />
          Create business
        </button>
      </div>
    </Modal>
  );
}

/* ═════════════════════════════════════════════════════════════
   ROOT
   ═════════════════════════════════════════════════════════════ */

export default function App() {
  const [view, setView] = usePersistentState("rbim.v4.view", "home");
  const [storeId, setStoreId] = usePersistentState("rbim.v4.store", "kirana");
  const [page, setPage] = usePersistentState("rbim.v4.page", "sell");
  const [customs, setCustoms] = usePersistentState("rbim.v4.customs", []);
  const [extraCats, setExtraCats] = usePersistentState("rbim.v4.cats", {});
  const [inventory, setInventory] = usePersistentState("rbim.v4.inventory", INITIAL_INVENTORY);
  const [recipes, setRecipes] = usePersistentState("rbim.v4.recipes", INITIAL_RECIPES);
  const [invoices, setInvoices] = usePersistentState("rbim.v4.invoices", EMPTY_INVOICES);
  const [cart, setCart] = useState([]);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [creating, setCreating] = useState(false);
  const { toasts, toast, dismiss } = useToasts();

  const stores = useMemo(() => {
    const all = {};
    Object.values(PRESETS).forEach((p) => {
      all[p.id] = p;
    });
    customs.forEach((c) => {
      all[c.id] = c;
    });
    Object.keys(all).forEach((id) => {
      const base = all[id];
      const extras = (extraCats[id] || []).filter((c) => !base.categories.includes(c));
      all[id] = { ...base, categories: [...base.categories, ...extras] };
    });
    return all;
  }, [customs, extraCats]);

  const meta = stores[storeId] || PRESETS.kirana;
  const activeId = meta.id;
  const items = inventory[activeId] || [];
  const storeInvoices = invoices[activeId] || [];

  const setItems = useCallback((fn) => setInventory((prev) => ({ ...prev, [activeId]: fn(prev[activeId] || []) })), [activeId, setInventory]);

  const openBusiness = (id) => {
    if (id === "__create") {
      setView("app");
      setCreating(true);
      return;
    }
    setStoreId(id);
    setPage("sell");
    setView("app");
  };

  /* ── stock ── */

  const adjustStock = (id, delta) => {
    const it = items.find((i) => i.id === id);
    if (!it || it.kind === "service") return;
    const next = Math.max(0, it.stock + delta);
    setItems((list) => list.map((i) => (i.id === id ? { ...i, stock: next } : i)));
    if (next === 0 && it.stock > 0) toast(`${it.name} is now out of stock.`, "danger");
    else if (delta < 0 && next > 0 && next <= it.lowThreshold) toast(`${it.name} is low: ${formatStock(next, it.unit)} left.`, "warn");
    else if (delta > 0) toast(`${it.name} is now ${formatStock(next, it.unit)}.`, "success");
  };

  const deleteItem = (id) => {
    const it = items.find((i) => i.id === id);
    setItems((list) => list.filter((i) => i.id !== id));
    if (it) toast(`${it.name} removed.`, "info");
  };

  const applyCommand = (text) => {
    const res = parseCommand(text, items);
    if (res.error) {
      toast(res.error, "warn");
      return { ok: false, message: res.error };
    }
    const next = Math.max(0, res.item.stock + (res.op === "add" ? res.qty : -res.qty));
    setItems((list) => list.map((i) => (i.id === res.item.id ? { ...i, stock: next } : i)));
    const message = `${res.op === "add" ? "Added" : "Removed"} ${formatStock(res.qty, res.item.unit)} ${res.op === "add" ? "to" : "from"} ${res.item.name}. Now ${formatStock(next, res.item.unit)}.`;
    if (next === 0 && res.item.stock > 0) toast(`${res.item.name} is now out of stock.`, "danger");
    else toast(message, "success");
    return { ok: true, message };
  };

  const bulkAdd = (list) => {
    setItems((cur) => [...list, ...cur]);
    toast(`${list.length} item${list.length === 1 ? "" : "s"} imported to ${meta.short}.`, "success");
  };

  const addItem = (fields) => {
    if (!fields.name || !String(fields.name).trim()) {
      toast("Enter an item name.", "warn");
      return false;
    }
    const it = makeItem(meta, { ...fields, kind: fields.kind || meta.kind });
    setItems((list) => [it, ...list]);
    toast(`${it.name} added to ${meta.short}.`, "success");
    return true;
  };

  const addCategory = (name) => {
    const clean = name.trim();
    if (!clean) return;
    if (meta.categories.some((c) => c.toLowerCase() === clean.toLowerCase())) return;
    setExtraCats((prev) => ({ ...prev, [activeId]: [...(prev[activeId] || []), clean] }));
    toast(`Category "${clean}" added.`, "success");
  };

  const addRecipe = (recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
    toast(`${recipe.name} added to the menu.`, "success");
    return true;
  };

  const deleteRecipe = (id) => {
    const d = recipes.find((x) => x.id === id);
    setRecipes((prev) => prev.filter((x) => x.id !== id));
    if (d) toast(`${d.name} removed from the menu.`, "info");
  };

  const createBusiness = ({ label, categories, units, expiry }) => {
    const id = `custom-${uid()}`;
    const biz = {
      id,
      label,
      short: label.length > 12 ? `${label.slice(0, 11)}…` : label,
      iconKey: "briefcase",
      accent: "slate",
      main: false,
      prefix: "CU",
      kind: "stock",
      tagline: `${label}. Custom business with your own categories.`,
      units,
      categories,
      metaField: expiry ? "expiry" : "brand",
      metaLabel: expiry ? "Expiry" : "Brand",
      lowDefault: 5,
      voice: [],
    };
    setCustoms((prev) => [...prev, biz]);
    setInventory((prev) => ({ ...prev, [id]: [] }));
    setStoreId(id);
    setPage("add");
    setCreating(false);
    toast(`${label} created. Add your first item below.`, "success");
  };

  /* ── sale & invoice ── */

  const checkout = () => {
    if (!cart.length) return;

    const need = {};
    cart.forEach((l) => {
      if (meta.id === "restaurant") {
        const dish = recipes.find((d) => d.id === l.id);
        dish?.ingredients.forEach((ing) => {
          need[ing.itemId] = (need[ing.itemId] || 0) + ing.qty * l.qty;
        });
      } else {
        const it = items.find((i) => i.id === l.id);
        if (it && it.kind !== "service") need[l.id] = (need[l.id] || 0) + l.qty;
      }
    });

    const shortages = [];
    Object.entries(need).forEach(([id, q]) => {
      const it = items.find((i) => i.id === id);
      if (!it) shortages.push("an ingredient is missing from inventory");
      else if (it.stock < q) shortages.push(`${it.name}: need ${formatStock(q, it.unit)}, have ${formatStock(it.stock, it.unit)}`);
    });
    if (shortages.length) {
      toast(`Order not completed. ${shortages.join(" · ")}`, "danger");
      return;
    }

    if (Object.keys(need).length) {
      setItems((list) => list.map((i) => (need[i.id] ? { ...i, stock: i.stock - need[i.id] } : i)));
    }

    items.forEach((i) => {
      const q = need[i.id];
      if (!q) return;
      const after = i.stock - q;
      if (after <= 0) toast(`${i.name} is now out of stock.`, "danger");
      else if (after <= i.lowThreshold) toast(`${i.name} is running low (${formatStock(after, i.unit)}).`, "warn");
    });

    if (meta.id === "restaurant") toast("Raw ingredients auto-deducted for this order.", "info");

    const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
    const invoice = {
      id: uid(),
      store: activeId,
      storeLabel: meta.label,
      number: `RBI-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      lines: cart.map((l) => ({ id: l.id, name: l.name, qty: l.qty, price: l.price })),
      total,
    };
    setInvoices((prev) => ({ ...prev, [activeId]: [invoice, ...(prev[activeId] || [])] }));
    setCart([]);
    setViewInvoice(invoice);
    toast(`Invoice #${invoice.number} generated.`, "success");
  };

  const printInvoice = (inv) => {
    if (!openPrintWindow(inv)) {
      if (downloadInvoice(inv)) toast("Pop-ups are blocked here, so the invoice downloaded as HTML. Open it and print.", "warn");
      else toast("Printing is blocked in this preview. Open the app in its own browser tab to print.", "warn");
    }
  };

  const downloadInv = (inv) => {
    if (downloadInvoice(inv)) toast("Invoice downloaded as HTML.", "success");
    else toast("Download is blocked in this preview. Open the app in its own browser tab.", "warn");
  };

  if (view === "home") {
    return (
      <div className="min-h-screen bg-slate-950">
        <HomePage onLaunch={() => setView("app")} onOpenBusiness={openBusiness} />
        {creating && <CreateBusinessModal onClose={() => setCreating(false)} onCreate={createBusiness} />}
        <Toasts toasts={toasts} dismiss={dismiss} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header meta={meta} stores={stores} onStore={setStoreId} onCreate={() => setCreating(true)} onHome={() => setView("home")} />
      <PageTabs page={page} onPage={setPage} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <Hero meta={meta} items={items} invoiceCount={storeInvoices.length} />

        {page === "sell" && <SellPage key={`sell-${activeId}`} meta={meta} items={items} recipes={recipes} cart={cart} setCart={setCart} onCheckout={checkout} />}
        {page === "invoices" && <InvoicesPage key={`inv-${activeId}`} meta={meta} list={storeInvoices} onOpen={setViewInvoice} />}
        {page === "stock" && <StockPage key={`stock-${activeId}`} meta={meta} items={items} onAdjust={adjustStock} onDelete={deleteItem} />}
        {page === "update" && (
          <UpdateStockPage key={`update-${activeId}`} meta={meta} items={items} onVoice={applyCommand} onScan={adjustStock} onBulk={bulkAdd} onAdjust={adjustStock} toast={toast} />
        )}
        {page === "add" && (
          <AddNewPage
            key={`add-${activeId}`}
            meta={meta}
            items={items}
            recipes={recipes}
            onAddItem={addItem}
            onAddRecipe={addRecipe}
            onDeleteRecipe={deleteRecipe}
            onAddCategory={addCategory}
          />
        )}
      </main>

      {creating && <CreateBusinessModal onClose={() => setCreating(false)} onCreate={createBusiness} />}
      <InvoiceModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} onPrint={printInvoice} onDownload={downloadInv} />
      <Toasts toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
