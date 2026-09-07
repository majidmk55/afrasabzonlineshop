import { LAPTOPS, type Laptop } from "../data/laptops";

/* ---------- types ---------- */

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  date: string; // ISO
  customer: string;
  city: string;
  pay: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Settings {
  autoOff: boolean; // خاموشی خودکار کالاهای ناموجود از سایت
}

/* ---------- storage keys ---------- */

const PKEY = "ch_products_v1";
const OKEY = "ch_orders_v1";
const SKEY = "ch_settings_v1";

/* ---------- products ---------- */

export function loadProducts(): Laptop[] {
  try {
    const raw = localStorage.getItem(PKEY);
    if (raw) {
      const saved = JSON.parse(raw) as { base?: Record<string, Partial<Laptop>>; custom?: Laptop[] };
      const base = saved.base ?? {};
      const merged = LAPTOPS.map((p) => (base[p.id] ? { ...p, ...base[p.id] } : p));
      return [...merged, ...(saved.custom ?? [])];
    }
  } catch {
    /* داده خراب — بازگشت به پیش‌فرض */
  }
  return LAPTOPS.map((p) => ({ ...p }));
}

/** Shallow equality check for primitive and array values */
function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return false;
}

export function saveProducts(products: Laptop[]) {
  const base: Record<string, Partial<Laptop>> = {};
  const custom: Laptop[] = [];
  for (const p of products) {
    const orig = LAPTOPS.find((b) => b.id === p.id);
    if (!orig) {
      custom.push(p);
      continue;
    }
    const diff: Partial<Laptop> = {};
    let hasDiff = false;
    (Object.keys(p) as (keyof Laptop)[]).forEach((k) => {
      if (!shallowEqual(p[k], orig[k])) {
        // @ts-expect-error partial assignment
        diff[k] = p[k];
        hasDiff = true;
      }
    });
    if (hasDiff) base[p.id] = diff;
  }
  try {
    localStorage.setItem(PKEY, JSON.stringify({ base, custom }));
  } catch {
    /* حافظه پر — نادیده بگیر */
  }
}

/* ---------- settings ---------- */

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SKEY);
    if (raw) return { autoOff: true, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { autoOff: true };
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(SKEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/* ---------- orders + demo seed ---------- */

const CITIES = ["تهران", "اصفهان", "شیراز", "مشهد", "تبریز", "کرج", "قم", "اهواز", "رشت", "کرمان", "یزد", "همدان"];
const NAMES = ["امیر محمدی", "نگار شریفی", "کاوه احمدی", "سارا کریمی", "بابک رضایی", "لیلا موسوی", "آرش نعمتی", "مینا صادقی", "پویا اکبری", "شیدا رحیمی", "رامتین قاسمی", "هانیه طاهری"];
const PAYS = ["کارت شتاب", "کارت شتاب", "کارت شتاب", "کیف پول", "پرداخت در محل"];
const WEIGHTS: [string, number][] = [
  ["razer-blade-16", 16],
  ["asus-zephyrus-g14", 18],
  ["apple-macbook-pro-14", 15],
  ["msi-prestige-16", 12],
  ["lenovo-thinkpad-x1", 11],
  ["lg-gram-17", 10],
  ["hp-spectre-x360", 9],
  ["dell-xps-13", 9],
  ["gigabyte-aorus-17x", 8],
  ["framework-16", 6],
];

function seededRnd(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function seedOrders(): OrderRecord[] {
  const rnd = seededRnd(1404);
  const now = Date.now();
  const pool = WEIGHTS.flatMap(([id, w]) => Array(w).fill(id) as string[]);
  const out: OrderRecord[] = [];
  const count = 132;
  for (let i = 0; i < count; i++) {
    const dayBack = Math.floor(rnd() * rnd() * 90); // تراکم بیشتر در روزهای اخیر
    const date = new Date(now - dayBack * 86400000 - Math.floor(rnd() * 86400000));
    const itemCount = rnd() < 0.78 ? 1 : 2;
    const items: OrderItem[] = [];
    const used = new Set<string>();
    for (let j = 0; j < itemCount; j++) {
      const id = pool[Math.floor(rnd() * pool.length)];
      if (used.has(id)) continue;
      used.add(id);
      const p = LAPTOPS.find((l) => l.id === id);
      if (!p) continue;
      items.push({ id: p.id, name: p.name, category: p.category, qty: rnd() < 0.85 ? 1 : 2, price: p.price });
    }
    if (!items.length) continue;
    const subtotal = items.reduce((a, it) => a + it.price * it.qty, 0);
    const discount = rnd() < 0.12 ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal - discount >= 150_000_000 ? 0 : 1_500_000;
    const tax = Math.round((subtotal - discount) * 0.1);
    out.push({
      id: `CH-${toFaDigits(1404)}-${toFaDigits(1000 + i)}`,
      date: date.toISOString(),
      customer: NAMES[Math.floor(rnd() * NAMES.length)],
      city: CITIES[Math.floor(rnd() * CITIES.length)],
      pay: PAYS[Math.floor(rnd() * PAYS.length)],
      items,
      subtotal,
      discount,
      shipping,
      tax,
      total: subtotal - discount + shipping + tax,
    });
  }
  out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return out;
}

const FA = "۰۱۲۳۴۵۶۷۸۹";
const toFaDigits = (n: number | string) => String(n).replace(/\d/g, (d) => FA[+d]);

export function loadOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(OKEY);
    if (raw) return JSON.parse(raw) as OrderRecord[];
  } catch {
    /* ignore */
  }
  const seeded = seedOrders();
  saveOrders(seeded);
  return seeded;
}

export function saveOrders(orders: OrderRecord[]) {
  try {
    localStorage.setItem(OKEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

export function resetAll() {
  localStorage.removeItem(PKEY);
  localStorage.removeItem(OKEY);
  localStorage.removeItem(SKEY);
  location.reload();
}

/* ---------- helpers for admin ---------- */

export function visibleProducts(products: Laptop[], settings: Settings): Laptop[] {
  return products.filter((p) => p.active !== false && (!settings.autoOff || p.stock > 0));
}

export function compactIRR(n: number): string {
  if (n >= 1_000_000_000) return `${toFaDigits((n / 1_000_000_000).toFixed(1))} میلیارد ریال`;
  return `${toFaDigits(Math.round(n / 1_000_000))} میلیون ریال`;
}

export function placeholderImage(label: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'><rect width='1200' height='900' fill='#e7f2f8'/><rect x='310' y='240' width='580' height='380' rx='22' fill='#0b7cc0' opacity='0.12'/><rect x='340' y='272' width='520' height='316' rx='12' fill='#ffffff' stroke='#0b7cc0' stroke-width='6'/><rect x='430' y='640' width='340' height='16' rx='8' fill='#0b7cc0' opacity='0.35'/><text x='600' y='450' font-family='Tahoma,sans-serif' font-size='42' fill='#0b7cc0' text-anchor='middle'>${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
