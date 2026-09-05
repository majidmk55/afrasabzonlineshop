import { useMemo, useState } from "react";
import { fmt, type Laptop } from "../data/laptops";
import { Reveal } from "../lib/motion";
import { ICheck, IChevron, IClose, ICompare, IEye, IFilter, IPlus, IStar } from "./icons";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "name";
export interface Filters {
  q: string;
  cats: string[];
  brands: string[];
  maxPrice: number;
  inStockOnly: boolean;
  sort: SortKey;
}
export const DEFAULT_FILTERS: Filters = { q: "", cats: [], brands: [], maxPrice: 400_000_000, inStockOnly: false, sort: "featured" };

const BASE_CATEGORIES = ["گیمینگ", "خلاقیت و رندر", "بیزنس و اداری", "اولترابوک"];
const BASE_BRANDS = ["ایسوس", "اپل", "لنوو", "دل", "ریزر", "ام‌اس‌آی", "فریم‌ورک", "ال‌جی", "اچ‌پی", "گیگابایت"];

function matches(l: Laptop, f: Filters): boolean {
  if (f.q) {
    const q = f.q.toLowerCase();
    const hay = `${l.name} ${l.brand} ${l.series} ${l.category} ${l.highlights.join(" ")} ${l.brief.map((b) => b.join(" ")).join(" ")}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.cats.length && !f.cats.includes(l.category)) return false;
  if (f.brands.length && !f.brands.includes(l.brand)) return false;
  if (l.price > f.maxPrice) return false;
  if (f.inStockOnly && l.stock <= 0) return false;
  return true;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-sea" aria-label={`امتیاز ${rating.toLocaleString("fa-IR")} از ۵`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IStar key={i} size={12} filled={i <= Math.round(rating)} className={i <= Math.round(rating) ? "" : "opacity-30"} />
      ))}
    </span>
  );
}

function ProductCard({ laptop, compared, onToggleCompare, onAdd, onOpen, delay }: {
  laptop: Laptop;
  compared: boolean;
  onToggleCompare: (id: string) => void;
  onAdd: (id: string) => void;
  onOpen: (id: string) => void;
  delay: number;
}) {
  const [added, setAdded] = useState(false);
  const add = () => {
    onAdd(laptop.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };
  return (
    <Reveal delay={delay}>
      <article className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white" itemScope itemType="https://schema.org/Product">
        <button onClick={() => onOpen(laptop.id)} className="relative block w-full overflow-hidden border-b border-line bg-skywash text-left" aria-label={`مشاهده ${laptop.name}`}>
          <img src={laptop.image} alt={laptop.name} loading="lazy" decoding="async" className="img-zoom aspect-[4/3] w-full object-cover" itemProp="image" />
          <span className="absolute right-3 top-3 rounded-full bg-coal/85 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">{laptop.category}</span>
          {laptop.oldPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-sea px-2.5 py-1 text-[10px] font-bold text-white">
              {Math.round((laptop.oldPrice - laptop.price) / 1_000_000).toLocaleString("fa-IR")} م.ریال تخفیف
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(laptop.id); }}
            aria-pressed={compared}
            aria-label={`مقایسه ${laptop.name}`}
            className={`absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              compared ? "border-sea bg-sea text-white" : "border-white/50 bg-coal/70 text-white hover:border-sea hover:text-sea"
            }`}
          >
            <ICompare size={15} />
          </button>
        </button>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold tracking-wider text-mist">{laptop.brand} · {laptop.year.toLocaleString("fa-IR")}</span>
            <span className="flex items-center gap-1.5">
              <Stars rating={laptop.rating} />
              <span className="text-[10px] text-mist">({laptop.reviews.toLocaleString("fa-IR")})</span>
            </span>
          </div>
          <button onClick={() => onOpen(laptop.id)} className="mt-1.5 text-right" itemProp="name">
            <h3 className="font-display text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-sea">
              {laptop.name}
            </h3>
          </button>
          <p className="mt-1 text-xs leading-6 text-mist">{laptop.tagline}</p>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {laptop.highlights.slice(0, 3).map((h) => (
              <li key={h} className="rounded-full border border-line bg-foam px-2.5 py-0.5 font-mono text-[10px] text-mist" dir="ltr">{h}</li>
            ))}
          </ul>

          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between">
              <p className="text-lg font-extrabold" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span itemProp="price" content={String(laptop.price)}>{fmt(laptop.price)}</span>
                <meta itemProp="priceCurrency" content="IRR" />
                {laptop.oldPrice && <span className="mr-2 text-xs text-mist line-through">{fmt(laptop.oldPrice)}</span>}
              </p>
              <p className={`flex items-center gap-1.5 text-[10px] font-bold ${laptop.stock <= 5 ? "text-amber-600" : "text-moss"}`}>
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${laptop.stock <= 5 ? "bg-amber-500" : "dot-live bg-moss"}`} />
                {laptop.stock <= 5 ? `فقط ${laptop.stock.toLocaleString("fa-IR")} عدد` : "موجود"}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={add}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all active:translate-y-0.5 ${
                  added ? "bg-moss text-white" : "bg-ink text-white hover:bg-sea"
                }`}
              >
                {added ? <><ICheck size={14} /> اضافه شد</> : <><IPlus size={14} /> افزودن به سبد</>}
              </button>
              <button
                onClick={() => onOpen(laptop.id)}
                aria-label={`مشخصات کامل ${laptop.name}`}
                className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-[11px] font-bold transition-colors hover:border-sea hover:text-sea"
              >
                <IEye size={14} /> مشخصات
              </button>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

interface CatalogProps {
  products: Laptop[];
  filters: Filters;
  patch: (p: Partial<Filters>) => void;
  reset: () => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onAdd: (id: string) => void;
  onOpen: (id: string) => void;
}

export default function Catalog({ products, filters, patch, reset, compareIds, onToggleCompare, onAdd, onOpen }: CatalogProps) {
  const [mobileFilters, setMobileFilters] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [...BASE_CATEGORIES.filter((c) => set.has(c)), ...[...set].filter((c) => !BASE_CATEGORIES.includes(c))];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return [...BASE_BRANDS.filter((b) => set.has(b)), ...[...set].filter((b) => !BASE_BRANDS.includes(b))];
  }, [products]);

  const results = useMemo(() => {
    const list = products.filter((l) => matches(l, filters));
    switch (filters.sort) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      case "name": return [...list].sort((a, b) => a.name.localeCompare(b.name, "fa"));
      default: return list;
    }
  }, [products, filters]);

  const activeCount = filters.cats.length + filters.brands.length + (filters.maxPrice < 400_000_000 ? 1 : 0) + (filters.inStockOnly ? 1 : 0) + (filters.q ? 1 : 0);

  const sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="text-[11px] font-extrabold tracking-wider text-mist">دسته‌بندی</h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {categories.map((c) => {
            const on = filters.cats.includes(c);
            return (
              <button
                key={c}
                onClick={() => patch({ cats: on ? filters.cats.filter((x) => x !== c) : [...filters.cats, c] })}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${
                  on ? "border-sea bg-sea text-white" : "border-line bg-white text-mist hover:border-sea hover:text-sea"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-extrabold tracking-wider text-mist">برند</h3>
        <div className="mt-2.5 space-y-1">
          {brands.map((b) => {
            const on = filters.brands.includes(b);
            return (
              <label key={b} className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm transition-colors hover:text-sea">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => patch({ brands: on ? filters.brands.filter((x) => x !== b) : [...filters.brands, b] })}
                  className="h-3.5 w-3.5 accent-[#0477b3]"
                />
                {b}
                <span className="mr-auto text-[10px] text-mist">{products.filter((l) => l.brand === b).length.toLocaleString("fa-IR")}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-extrabold tracking-wider text-mist">سقف قیمت</h3>
        <input
          type="range"
          min={60_000_000}
          max={400_000_000}
          step={5_000_000}
          value={filters.maxPrice}
          onChange={(e) => patch({ maxPrice: Number(e.target.value) })}
          className="mt-3 w-full"
          aria-label="حداکثر قیمت"
        />
        <div className="mt-1 flex justify-between text-[10px] text-mist">
          <span>۶۰ میلیون</span>
          <span className="font-bold text-ink">{Math.round(filters.maxPrice / 1_000_000).toLocaleString("fa-IR")} میلیون ریال{filters.maxPrice === 400_000_000 ? "+" : ""}</span>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 border-t border-line pt-4 text-sm">
        <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => patch({ inStockOnly: e.target.checked })} className="h-3.5 w-3.5 accent-[#0477b3]" />
        فقط کالاهای موجود
        <span className="dot-live mr-1 inline-block h-1.5 w-1.5 rounded-full bg-moss" />
      </label>

      {activeCount > 0 && (
        <button onClick={reset} className="flex items-center gap-1.5 text-[11px] font-bold text-sea underline-offset-4 hover:underline">
          <IClose size={12} /> پاک کردن {activeCount.toLocaleString("fa-IR")} فیلتر
        </button>
      )}
    </div>
  );

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6" aria-label="فهرست لپ‌تاپ‌ها">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-wider text-sea">— ویترین فروشگاه</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              هر دستگاه، برگه مشخصات کامل.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilters((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold lg:hidden"
            >
              <IFilter size={15} /> فیلترها {activeCount > 0 && `(${activeCount.toLocaleString("fa-IR")})`} <IChevron size={13} className={`transition-transform ${mobileFilters ? "rotate-180" : ""}`} />
            </button>
            <label className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2">
              <span className="text-[10px] font-bold tracking-wider text-mist">مرتب‌سازی</span>
              <select
                value={filters.sort}
                onChange={(e) => patch({ sort: e.target.value as SortKey })}
                className="bg-transparent text-xs font-bold outline-none"
                aria-label="مرتب‌سازی محصولات"
              >
                <option value="featured">پیشنهادی</option>
                <option value="price-asc">ارزان‌ترین</option>
                <option value="price-desc">گران‌ترین</option>
                <option value="rating">بالاترین امتیاز</option>
                <option value="name">الفبایی</option>
              </select>
            </label>
          </div>
        </div>
      </Reveal>

      {filters.q && (
        <p className="mt-4 flex items-center gap-2 text-xs text-mist">
          نتایج جست‌وجوی <span className="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">«{filters.q}»</span>
          <button onClick={() => patch({ q: "" })} aria-label="حذف جست‌وجو" className="text-sea"><IClose size={13} /></button>
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`lg:sticky lg:top-24 lg:self-start ${mobileFilters ? "block rounded-2xl border border-line bg-white p-4" : "hidden"}`} aria-label="فیلترها">
          {sidebar}
        </aside>

        <div>
          <p className="mb-4 text-[11px] font-bold tracking-wider text-mist" role="status">
            {results.length.toLocaleString("fa-IR")} از {products.length.toLocaleString("fa-IR")} دستگاه
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
              <p className="font-display text-xl font-bold">دستگاهی مطابق فیلترها پیدا نشد.</p>
              <p className="mt-2 text-sm text-mist">یک‌دو فیلتر را کم کنید — ویترین هر هفته شارژ می‌شود.</p>
              <button onClick={reset} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white hover:bg-sea">
                حذف همه فیلترها
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l, i) => (
                <ProductCard
                  key={l.id}
                  laptop={l}
                  delay={(i % 3) * 70}
                  compared={compareIds.includes(l.id)}
                  onToggleCompare={onToggleCompare}
                  onAdd={onAdd}
                  onOpen={onOpen}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
