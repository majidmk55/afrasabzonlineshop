import { useMemo, useState } from "react";
import { BRANDS, CATEGORIES, LAPTOPS, fmt, type Laptop } from "../data/laptops";
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
export const DEFAULT_FILTERS: Filters = { q: "", cats: [], brands: [], maxPrice: 4000, inStockOnly: false, sort: "featured" };

function matches(l: Laptop, f: Filters): boolean {
  if (f.q) {
    const q = f.q.toLowerCase();
    const hay = `${l.name} ${l.brand} ${l.series} ${l.category} ${l.highlights.join(" ")} ${Object.values(l.brief).join(" ")}`.toLowerCase();
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
    <span className="flex items-center gap-0.5 text-ember" aria-label={`Rated ${rating} out of 5`}>
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
      <article className="card-lift group flex h-full flex-col border border-line bg-card" itemScope itemType="https://schema.org/Product">
        <button onClick={() => onOpen(laptop.id)} className="relative block w-full overflow-hidden border-b border-line bg-slab text-left" aria-label={`View ${laptop.name}`}>
          <img src={laptop.image} alt={laptop.name} loading="lazy" className="img-zoom aspect-[4/3] w-full object-cover" itemProp="image" />
          <span className="absolute left-3 top-3 bg-coal/85 px-2 py-0.5 font-mono text-[10px] tracking-widest text-paper">{laptop.category.toUpperCase()}</span>
          {laptop.oldPrice && (
            <span className="absolute right-3 top-3 bg-ember px-2 py-0.5 font-mono text-[10px] font-semibold text-paper">−{fmt(laptop.oldPrice - laptop.price)}</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(laptop.id); }}
            aria-pressed={compared}
            aria-label={`Compare ${laptop.name}`}
            className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center border transition-all ${
              compared ? "border-ember bg-ember text-paper" : "border-paper/40 bg-coal/70 text-paper hover:border-ember hover:text-ember"
            }`}
          >
            <ICompare size={15} />
          </button>
        </button>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.18em] text-smoke">{laptop.brand.toUpperCase()} · {laptop.year}</span>
            <span className="flex items-center gap-1.5">
              <Stars rating={laptop.rating} />
              <span className="font-mono text-[10px] text-smoke">({laptop.reviews})</span>
            </span>
          </div>
          <button onClick={() => onOpen(laptop.id)} className="mt-1.5 text-left" itemProp="name">
            <h3 className="font-display text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-ember">
              {laptop.name}
            </h3>
          </button>
          <p className="mt-1 text-xs text-smoke">{laptop.tagline}</p>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {laptop.highlights.slice(0, 3).map((h) => (
              <li key={h} className="border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-smoke">{h}</li>
            ))}
          </ul>

          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between">
              <p className="font-mono text-xl font-semibold" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span itemProp="price" content={String(laptop.price)}>{fmt(laptop.price)}</span>
                <meta itemProp="priceCurrency" content="USD" />
                {laptop.oldPrice && <span className="ml-2 text-xs text-smoke line-through">{fmt(laptop.oldPrice)}</span>}
              </p>
              <p className={`flex items-center gap-1.5 font-mono text-[10px] tracking-wider ${laptop.stock <= 5 ? "text-ember" : "text-moss"}`}>
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${laptop.stock <= 5 ? "bg-ember" : "dot-live bg-moss"}`} />
                {laptop.stock <= 5 ? `ONLY ${laptop.stock} LEFT` : "IN STOCK"}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={add}
                className={`flex flex-1 items-center justify-center gap-2 py-2.5 font-mono text-xs font-semibold tracking-wider transition-all active:translate-y-0.5 ${
                  added ? "bg-moss text-paper" : "bg-ink text-paper hover:bg-ember"
                }`}
              >
                {added ? <><ICheck size={14} /> ADDED</> : <><IPlus size={14} /> ADD TO CART</>}
              </button>
              <button
                onClick={() => onOpen(laptop.id)}
                aria-label={`Full specifications for ${laptop.name}`}
                className="flex items-center gap-1.5 border border-line px-3 py-2.5 font-mono text-[11px] tracking-wider transition-colors hover:border-ink"
              >
                <IEye size={14} /> SPECS
              </button>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

interface CatalogProps {
  filters: Filters;
  patch: (p: Partial<Filters>) => void;
  reset: () => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onAdd: (id: string) => void;
  onOpen: (id: string) => void;
}

export default function Catalog({ filters, patch, reset, compareIds, onToggleCompare, onAdd, onOpen }: CatalogProps) {
  const [mobileFilters, setMobileFilters] = useState(false);

  const results = useMemo(() => {
    const list = LAPTOPS.filter((l) => matches(l, filters));
    switch (filters.sort) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      case "name": return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [filters]);

  const activeCount = filters.cats.length + filters.brands.length + (filters.maxPrice < 4000 ? 1 : 0) + (filters.inStockOnly ? 1 : 0) + (filters.q ? 1 : 0);

  const sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-smoke">CATEGORY</h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const on = filters.cats.includes(c);
            return (
              <button
                key={c}
                onClick={() => patch({ cats: on ? filters.cats.filter((x) => x !== c) : [...filters.cats, c] })}
                aria-pressed={on}
                className={`border px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all ${
                  on ? "border-ink bg-ink text-paper" : "border-line bg-card text-smoke hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-smoke">BRAND</h3>
        <div className="mt-2.5 space-y-1">
          {BRANDS.map((b) => {
            const on = filters.brands.includes(b);
            return (
              <label key={b} className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm transition-colors hover:text-ember">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => patch({ brands: on ? filters.brands.filter((x) => x !== b) : [...filters.brands, b] })}
                  className="h-3.5 w-3.5 accent-[#f4490f]"
                />
                {b}
                <span className="ml-auto font-mono text-[10px] text-smoke">{LAPTOPS.filter((l) => l.brand === b).length}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-smoke">MAX PRICE</h3>
        <input
          type="range"
          min={1200}
          max={4000}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => patch({ maxPrice: Number(e.target.value) })}
          className="mt-3 w-full"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-smoke">
          <span>$1,200</span>
          <span className="font-semibold text-ink">{fmt(filters.maxPrice)}{filters.maxPrice === 4000 ? "+" : ""}</span>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 border-t border-line pt-4 text-sm">
        <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => patch({ inStockOnly: e.target.checked })} className="h-3.5 w-3.5 accent-[#f4490f]" />
        In stock only
        <span className="dot-live ml-1 inline-block h-1.5 w-1.5 rounded-full bg-moss" />
      </label>

      {activeCount > 0 && (
        <button onClick={reset} className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-ember underline-offset-4 hover:underline">
          <IClose size={12} /> CLEAR {activeCount} FILTER{activeCount > 1 ? "S" : ""}
        </button>
      )}
    </div>
  );

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6" aria-label="Laptop catalog">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-ember">// THE FLOOR</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              EVERY MACHINE, FULL SPEC SHEET.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilters((v) => !v)}
              className="flex items-center gap-2 border border-line bg-card px-3 py-2 font-mono text-xs tracking-wider lg:hidden"
            >
              <IFilter size={15} /> FILTERS {activeCount > 0 && `(${activeCount})`} <IChevron size={13} className={`transition-transform ${mobileFilters ? "rotate-180" : ""}`} />
            </button>
            <label className="flex items-center gap-2 border border-line bg-card px-3 py-2">
              <span className="font-mono text-[10px] tracking-wider text-smoke">SORT</span>
              <select
                value={filters.sort}
                onChange={(e) => patch({ sort: e.target.value as SortKey })}
                className="bg-transparent font-mono text-xs outline-none"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating">Top rated</option>
                <option value="name">A → Z</option>
              </select>
            </label>
          </div>
        </div>
      </Reveal>

      {filters.q && (
        <p className="mt-4 flex items-center gap-2 font-mono text-xs text-smoke">
          RESULTS FOR <span className="bg-ink px-2 py-0.5 text-paper">“{filters.q.toUpperCase()}”</span>
          <button onClick={() => patch({ q: "" })} aria-label="Clear search" className="text-ember"><IClose size={13} /></button>
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`lg:sticky lg:top-24 lg:self-start ${mobileFilters ? "block border border-line bg-card p-4" : "hidden"}`} aria-label="Filters">
          {sidebar}
        </aside>

        <div>
          <p className="mb-4 font-mono text-[11px] tracking-wider text-smoke" role="status">
            {results.length} / {LAPTOPS.length} MACHINES
          </p>
          {results.length === 0 ? (
            <div className="border border-dashed border-line bg-card px-6 py-16 text-center">
              <p className="font-display text-xl font-bold">NO MACHINES MATCH.</p>
              <p className="mt-2 text-sm text-smoke">Loosen a filter or two — the floor restocks weekly.</p>
              <button onClick={reset} className="mt-5 bg-ink px-5 py-2.5 font-mono text-xs tracking-wider text-paper hover:bg-ember">
                RESET FILTERS
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
