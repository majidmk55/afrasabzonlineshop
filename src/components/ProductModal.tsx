import { useMemo, useState } from "react";
import { LAPTOPS, WARRANTY_PRICE, fmt, type Laptop } from "../data/laptops";
import { Reveal, useEscape, useLockBody } from "../lib/motion";
import { ICheck, IClose, ICompare, IMinus, IPlus, IStar, ITruck, SPEC_ICONS } from "./icons";

type Tab = "specs" | "box" | "shipping";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function SpecTable({ laptop }: { laptop: Laptop }) {
  return (
    <div className="space-y-6">
      {laptop.specs.map((group) => {
        const Icon = SPEC_ICONS[group.icon];
        return (
          <section key={group.title} aria-label={group.title}>
            <h4 className="flex items-center gap-2 border-b-2 border-ink pb-2 font-display text-sm font-bold tracking-wide">
              {Icon && <Icon size={16} className="text-ember" />}
              {group.title.toUpperCase()}
            </h4>
            <dl>
              {group.rows.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 border-b border-line py-2 sm:flex-row sm:gap-4">
                  <dt className="w-48 shrink-0 font-mono text-[11px] uppercase tracking-wider text-smoke">{k}</dt>
                  <dd className="font-mono text-[13px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}

interface ProductModalProps {
  laptop: Laptop;
  onClose: () => void;
  onAdd: (id: string, qty: number, warranty: boolean) => void;
  onToggleCompare: (id: string) => void;
  compared: boolean;
  onOpen: (id: string) => void;
}

export default function ProductModal({ laptop, onClose, onAdd, onToggleCompare, compared, onOpen }: ProductModalProps) {
  const [tab, setTab] = useState<Tab>("specs");
  const [qty, setQty] = useState(1);
  const [warranty, setWarranty] = useState(false);
  const [added, setAdded] = useState(false);
  useLockBody(true);
  useEscape(true, onClose);

  const benchmarks = useMemo(() => {
    const h = hash(laptop.id);
    return [
      { label: "Performance", v: 72 + (h % 26) },
      { label: "Display", v: 78 + ((h >> 3) % 20) },
      { label: "Battery", v: 55 + ((h >> 5) % 42) },
      { label: "Build & thermals", v: 70 + ((h >> 7) % 28) },
    ];
  }, [laptop.id]);

  const related = useMemo(
    () => LAPTOPS.filter((l) => l.category === laptop.category && l.id !== laptop.id).slice(0, 3),
    [laptop]
  );

  const add = () => {
    onAdd(laptop.id, qty, warranty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={laptop.name}>
      <div className="overlay-in fixed inset-0 bg-coal/70" onClick={onClose} />
      <div className="panel-in relative mx-auto my-6 w-[min(1060px,94vw)] border border-line bg-paper shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-5 py-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] tracking-[0.18em] text-smoke">
            {laptop.brand.toUpperCase()} · SKU <span className="text-ink">{laptop.sku}</span>
          </p>
          <button onClick={onClose} aria-label="Close product details" className="flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-ember hover:text-ember">
            <IClose size={17} />
          </button>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_1fr]">
          {/* left: image + benchmarks */}
          <div>
            <div className="group overflow-hidden border border-line bg-slab">
              <img src={laptop.image} alt={laptop.name} className="img-zoom aspect-[4/3] w-full object-cover" />
            </div>

            <div className="mt-5 border border-line bg-card p-4">
              <p className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-smoke">
                COREHAUS LAB SCORE
                <span className="text-ink">{Math.round(laptop.rating * 20)}/100</span>
              </p>
              <div className="mt-3 space-y-2.5">
                {benchmarks.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between font-mono text-[10px] tracking-wider text-smoke">
                      <span>{b.label.toUpperCase()}</span><span className="text-ink">{b.v}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-line/70">
                      <div className="h-full bg-ember transition-[width] duration-700" style={{ width: `${b.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] leading-relaxed text-smoke">
                From our 42-point intake bench: Cinebench R24, 3DMark Time Spy, 30-min thermal soak at 40 dBA cap, per-zone display calibration to ΔE &lt; 2.
              </p>
            </div>
          </div>

          {/* right: buy panel */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-ember">{laptop.category.toUpperCase()} · {laptop.year}</p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight">{laptop.name}</h2>
            <p className="mt-2 text-sm text-smoke">{laptop.tagline}</p>

            <div className="mt-3 flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-ember">
                {[1, 2, 3, 4, 5].map((i) => <IStar key={i} size={14} filled={i <= Math.round(laptop.rating)} className={i <= Math.round(laptop.rating) ? "" : "opacity-30"} />)}
              </span>
              <span className="font-mono text-xs text-smoke">{laptop.rating} · {laptop.reviews} verified reviews</span>
            </div>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {laptop.highlights.map((h) => (
                <li key={h} className="border border-line bg-card px-2.5 py-1 font-mono text-[11px] text-smoke">{h}</li>
              ))}
            </ul>

            <div className="mt-5 border border-line bg-card p-4">
              <div className="flex items-end justify-between">
                <p className="font-mono text-3xl font-semibold">
                  {fmt(laptop.price)}
                  {laptop.oldPrice && <span className="ml-2 text-base text-smoke line-through">{fmt(laptop.oldPrice)}</span>}
                </p>
                <p className={`flex items-center gap-1.5 font-mono text-[11px] tracking-wider ${laptop.stock <= 5 ? "text-ember" : "text-moss"}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${laptop.stock <= 5 ? "bg-ember" : "dot-live bg-moss"}`} />
                  {laptop.stock <= 5 ? `ONLY ${laptop.stock} LEFT` : `${laptop.stock} IN STOCK`}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-line bg-paper">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="px-3 py-2.5 transition-colors hover:text-ember"><IMinus size={14} /></button>
                  <span className="w-8 text-center font-mono text-sm">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(laptop.stock, q + 1))} aria-label="Increase quantity" className="px-3 py-2.5 transition-colors hover:text-ember"><IPlus size={14} /></button>
                </div>
                <button
                  onClick={() => onToggleCompare(laptop.id)}
                  aria-pressed={compared}
                  className={`flex items-center gap-2 border px-3.5 py-2.5 font-mono text-[11px] tracking-wider transition-colors ${
                    compared ? "border-ember bg-ember text-paper" : "border-line hover:border-ink"
                  }`}
                >
                  <ICompare size={14} /> {compared ? "IN COMPARE" : "COMPARE"}
                </button>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 border border-dashed border-line p-3 text-sm transition-colors hover:border-ink">
                <input type="checkbox" checked={warranty} onChange={(e) => setWarranty(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-[#f4490f]" />
                <span>
                  <span className="font-semibold">Accidental-damage cover × {qty}</span>
                  <span className="block font-mono text-[11px] text-smoke">Drops, spills, cracked panels — +{fmt(WARRANTY_PRICE)} per unit</span>
                </span>
              </label>

              <button
                onClick={add}
                className={`mt-4 flex w-full items-center justify-center gap-2 py-3.5 font-mono text-sm font-semibold tracking-wider transition-all active:translate-y-0.5 ${
                  added ? "bg-moss text-paper" : "bg-ember text-paper hover:bg-emberdim"
                }`}
              >
                {added ? <><ICheck size={16} /> ADDED TO CART</> : `ADD ${qty} TO CART — ${fmt(laptop.price * qty + (warranty ? WARRANTY_PRICE * qty : 0))}`}
              </button>
              <p className="mt-2.5 flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider text-smoke">
                <ITruck size={13} /> FREE 48-H SHIPPING · SHIPS FROM OHIO LAB
              </p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="border-t border-line px-5 sm:px-8">
          <div className="flex gap-1 -mb-px" role="tablist" aria-label="Product information">
            {([["specs", `TECHNICAL SPECIFICATIONS`], ["box", "IN THE BOX"], ["shipping", "SHIPPING & RETURNS"]] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`border-b-2 px-3 py-3.5 font-mono text-[11px] tracking-wider transition-colors sm:px-4 ${
                  tab === t ? "border-ember text-ink" : "border-transparent text-smoke hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-7">
            {tab === "specs" && <SpecTable laptop={laptop} />}
            {tab === "box" && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {laptop.inBox.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 border border-line bg-card px-3.5 py-2.5 text-sm">
                    <ICheck size={14} className="shrink-0 text-moss" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {tab === "shipping" && (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["FREE 48-H DELIVERY", "Orders over $1,500 ship next-day from our Ohio lab with signature required. Standard 2–4 day otherwise ($29 flat)."],
                  ["30-DAY RETURNS", "No-questions returns with prepaid label. Refund lands within 3 business days of the unit reaching us."],
                  ["WARRANTY STACKING", "Manufacturer warranty runs first; Corehaus 2-year cover picks up chassis, hinge and battery after that."],
                ].map(([t, d]) => (
                  <div key={t} className="border border-line bg-card p-4">
                    <p className="font-display text-sm font-bold tracking-wide">{t}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-smoke">{d}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="border-t border-line bg-card px-5 py-6 sm:px-8">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] text-smoke">MORE {laptop.category.toUpperCase()} MACHINES</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <button key={r.id} onClick={() => onOpen(r.id)} className="group flex items-center gap-3 border border-line bg-paper p-2.5 text-left transition-colors hover:border-ember">
                    <img src={r.image} alt="" className="h-14 w-18 shrink-0 object-cover" style={{ width: 72 }} loading="lazy" />
                    <span>
                      <span className="block font-display text-xs font-semibold leading-snug group-hover:text-ember">{r.shortName}</span>
                      <span className="font-mono text-[11px] text-smoke">{fmt(r.price)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
