import { useEffect, useMemo, useState } from "react";
import { LAPTOPS, fmt, type Laptop } from "../data/laptops";
import { Reveal, prefersReducedMotion, useCountdown, useScramble } from "../lib/motion";
import { IArrowR, IBolt, ILock, IReturn, IShield, ITruck } from "./icons";

const FEATURED_IDS = ["razer-blade-16", "macbook-pro-14", "zephyrus-g14"];

function nextSunday(): number {
  const d = new Date();
  const day = d.getDay(); // 0 = Sun
  const add = day === 0 ? 7 : 7 - day;
  d.setDate(d.getDate() + add);
  d.setHours(23, 59, 59, 0);
  return d.getTime();
}

interface ShowroomProps {
  onAdd: (id: string) => void;
  onSpecs: (id: string) => void;
  onExplore: () => void;
}

export default function Showroom({ onAdd, onSpecs, onExplore }: ShowroomProps) {
  const featured = useMemo(() => FEATURED_IDS.map((id) => LAPTOPS.find((l) => l.id === id)!).filter(Boolean), []);
  const [idx, setIdx] = useState(0);
  const active: Laptop = featured[idx];
  const name = useScramble(active.shortName.toUpperCase(), 26);
  const countdown = useCountdown(useMemo(() => nextSunday(), []));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % featured.length), 7000);
    return () => clearInterval(id);
  }, [featured.length]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const add = () => {
    onAdd(active.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <section className="dark-panel relative overflow-hidden" aria-label="Featured specialty laptops">
      {/* ember glow + scanline */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-ember/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden" aria-hidden="true">
        <div className="scanline h-24 w-full bg-gradient-to-b from-transparent via-ember/10 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        {/* left — manifesto + selector */}
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-ember">
            <IBolt size={12} /> COREHAUS SUPPLY — SPECIALTY LAPTOP OUTFITTERS
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-paper sm:text-6xl xl:text-7xl">
            LAPTOPS
            <br />
            FOR PEOPLE
            <br />
            WHO <span className="text-ember">COMPILE.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-mist sm:text-base">
            Ten machines. Zero filler. Every notebook on this floor is stress-tested, thermally
            soaked and display-calibrated in our lab before it ships — and the full spec sheet
            travels in the box.
          </p>

          {/* featured selector */}
          <div className="mt-9 border-t border-panel" role="tablist" aria-label="Featured machines">
            {featured.map((l, i) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                onMouseEnter={() => !prefersReducedMotion() && setIdx(i)}
                className={`group flex w-full items-center gap-4 border-b border-panel px-1 py-3.5 text-left transition-all duration-300 ${
                  i === idx ? "bg-panel/60 pl-4" : "hover:pl-3"
                }`}
              >
                <span className={`font-mono text-[11px] ${i === idx ? "text-ember" : "text-mist/50"}`}>0{i + 1}</span>
                <span className={`flex-1 font-display text-sm font-semibold tracking-wide sm:text-base ${i === idx ? "text-paper" : "text-mist"}`}>
                  {l.name}
                </span>
                <span className="font-mono text-sm text-mist">{fmt(l.price)}</span>
                <IArrowR size={15} className={`transition-transform duration-300 ${i === idx ? "translate-x-0 text-ember" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`} />
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 font-mono text-[11px] tracking-wider text-mist">
            <span className="flex items-center gap-2"><ITruck size={15} className="text-ember" /> 48-H SHIP</span>
            <span className="flex items-center gap-2"><IShield size={15} className="text-ember" /> 2-YR COVER</span>
            <span className="flex items-center gap-2"><IReturn size={15} className="text-ember" /> 30-DAY RETURNS</span>
            <span className="flex items-center gap-2"><ILock size={15} className="text-ember" /> PCI-DSS CHECKOUT</span>
          </div>
        </div>

        {/* right — the stage */}
        <Reveal>
          <div className="relative border border-panel bg-slab/60">
            <div className="flex items-center justify-between border-b border-panel px-4 py-2.5">
              <span className="font-mono text-[11px] tracking-[0.18em] text-mist">
                WEEKLY FLASH UNIT — ENDS {pad(countdown.d)}:{pad(countdown.h)}:{pad(countdown.m)}:
                <span className="text-ember">{pad(countdown.s)}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-moss">
                <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-moss" /> IN STOCK · {active.stock}
              </span>
            </div>

            <div key={active.id} className="rise-in relative overflow-hidden">
              <img
                src={active.image}
                alt={`${active.name} — ${active.category} laptop at Corehaus`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" aria-hidden="true" />
              {active.oldPrice && (
                <span className="absolute left-4 top-4 bg-ember px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-paper">
                  SAVE {fmt(active.oldPrice - active.price)}
                </span>
              )}
              <div className="absolute inset-x-4 bottom-4">
                <p className="font-mono text-[11px] tracking-[0.2em] text-ember">{active.brand.toUpperCase()} · {active.category.toUpperCase()} · {active.year}</p>
                <p className="mt-1 font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl" aria-label={active.shortName}>
                  <span aria-hidden="true">{name}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-panel p-4 sm:p-5">
              <ul className="flex flex-wrap gap-2" aria-label="Key specifications">
                {active.highlights.map((h) => (
                  <li key={h} className="border border-panel bg-coal px-2.5 py-1 font-mono text-[11px] text-mist transition-colors hover:border-ember hover:text-paper">
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div>
                  <p className="font-mono text-2xl font-semibold text-paper">
                    {fmt(active.price)}
                    {active.oldPrice && <span className="ml-2 text-sm text-mist/60 line-through">{fmt(active.oldPrice)}</span>}
                  </p>
                  <p className="font-mono text-[10px] tracking-wider text-mist/70">SKU {active.sku}</p>
                </div>
                <div className="ml-auto flex gap-2.5">
                  <button
                    onClick={() => onSpecs(active.id)}
                    className="border border-mist/30 px-4 py-2.5 font-mono text-xs tracking-wider text-paper transition-colors hover:border-paper hover:bg-paper hover:text-coal"
                  >
                    FULL SPECS
                  </button>
                  <button
                    onClick={add}
                    className={`px-5 py-2.5 font-mono text-xs font-semibold tracking-wider transition-all ${
                      added ? "bg-moss text-paper" : "bg-ember text-paper hover:bg-emberdim hover:-translate-y-0.5"
                    }`}
                  >
                    {added ? "✓ ADDED" : "ADD TO CART"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onExplore}
            className="group mt-5 flex w-full items-center justify-center gap-3 border border-dashed border-panel px-4 py-3 font-mono text-xs tracking-[0.18em] text-mist transition-colors hover:border-ember hover:text-ember"
          >
            BROWSE ALL {LAPTOPS.length} MACHINES
            <IArrowR size={15} className="transition-transform group-hover:translate-x-1.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
