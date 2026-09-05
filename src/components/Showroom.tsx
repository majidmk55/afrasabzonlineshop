import { useEffect, useMemo, useState } from "react";
import { fmt, type Laptop } from "../data/laptops";
import { Reveal, prefersReducedMotion, useCountdown, useScramble } from "../lib/motion";
import { IArrowR, IBolt, ILock, IReturn, IShield, ITruck } from "./icons";

const FEATURED_IDS = ["razer-blade-16", "apple-macbook-pro-14", "asus-zephyrus-g14"];

function nextThursday(): number {
  const d = new Date();
  const add = (4 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + add);
  d.setHours(23, 59, 59, 0);
  return d.getTime();
}

interface ShowroomProps {
  products: Laptop[];
  onAdd: (id: string) => void;
  onSpecs: (id: string) => void;
  onExplore: () => void;
}

export default function Showroom({ products, onAdd, onSpecs, onExplore }: ShowroomProps) {
  const featured = useMemo(() => {
    const picks = FEATURED_IDS.map((id) => products.find((l) => l.id === id)).filter((l): l is Laptop => !!l);
    for (const p of products) {
      if (picks.length >= 3) break;
      if (!picks.includes(p)) picks.push(p);
    }
    return picks.slice(0, 3);
  }, [products]);

  const [idx, setIdx] = useState(0);
  const active: Laptop | undefined = featured[Math.min(idx, featured.length - 1)];
  const name = useScramble(active ? active.shortName.toUpperCase() : "");
  const countdown = useCountdown(useMemo(() => nextThursday(), []));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || featured.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % featured.length), 7000);
    return () => clearInterval(id);
  }, [featured.length]);

  const pad = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

  if (!active) {
    return (
      <section className="dark-panel flex min-h-[50vh] items-center justify-center">
        <p className="font-display text-2xl font-bold text-paper">در حال حاضر کالای فعالی روی ویترین نیست — از پنل مدیریت کالا اضافه کنید.</p>
      </section>
    );
  }

  const add = () => {
    onAdd(active.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <section className="dark-panel relative overflow-hidden" aria-label="لپ‌تاپ‌های ویژه">
      <div className="pointer-events-none absolute -left-40 top-0 h-[560px] w-[560px] rounded-full bg-sea/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sea/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden" aria-hidden="true">
        <div className="scanline h-24 w-full bg-gradient-to-b from-transparent via-sea/15 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        {/* راست — مانیفست */}
        <div>
          <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] text-sea">
            <IBolt size={13} /> فروشگاه تخصصی لپ‌تاپ — هر دستگاه با کارنامه آزمایشگاه
          </p>
          <h1 className="font-nazanin mt-6 text-6xl font-bold leading-[1.12] text-paper sm:text-7xl xl:text-[5.5rem]">
            لپ‌تاپ را با
            <br />
            <span className="text-sea">کارنامه</span> بخرید.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-mist sm:text-base">
            ده دستگاه منتخب، صفر فیلر. هر نوت‌بوک پیش از ارسال، تست حرارتی، بنچمارک واقعی و
            کالیبراسیون نمایشگر را در آزمایشگاه ما می‌گذراند — و برگه مشخصات کاملش داخل جعبه است.
          </p>

          <div className="mt-9 border-t border-panel" role="tablist" aria-label="دستگاه‌های ویژه">
            {featured.map((l, i) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                onMouseEnter={() => !prefersReducedMotion() && setIdx(i)}
                className={`group flex w-full items-center gap-4 border-b border-panel py-3.5 text-right transition-all duration-300 ${
                  i === idx ? "bg-panel/60 pr-4" : "hover:pr-3"
                }`}
              >
                <span className={`font-mono text-[11px] ${i === idx ? "text-sea" : "text-mist/50"}`}>{["۰۱", "۰۲", "۰۳"][i]}</span>
                <span className={`flex-1 text-sm font-bold sm:text-base ${i === idx ? "text-paper" : "text-mist"}`}>{l.name}</span>
                <span className="font-mono text-[11px] text-mist">{Math.round(l.price / 1_000_000).toLocaleString("fa-IR")} م.ریال</span>
                <IArrowR size={15} className={`rotate-180 transition-transform duration-300 ${i === idx ? "text-sea" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`} />
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[12px] font-bold text-mist">
            <span className="flex items-center gap-2"><ITruck size={15} className="text-sea" /> ارسال ۴۸ ساعته</span>
            <span className="flex items-center gap-2"><IShield size={15} className="text-sea" /> ۲ سال پوشش</span>
            <span className="flex items-center gap-2"><IReturn size={15} className="text-sea" /> ۷ روز مرجوعی</span>
            <span className="flex items-center gap-2"><ILock size={15} className="text-sea" /> پرداخت امن بانکی</span>
          </div>
        </div>

        {/* چپ — سکوی دستگاه */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-panel bg-slab/70">
            <div className="flex items-center justify-between border-b border-panel px-4 py-2.5">
              <span className="font-mono text-[11px] tracking-wider text-mist">
                پیشنهاد هفته — پایان تا {pad(countdown.d)}:{pad(countdown.h)}:{pad(countdown.m)}:
                <span className="text-sea">{pad(countdown.s)}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#5fd096]">
                <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-[#5fd096]" /> موجود · {active.stock.toLocaleString("fa-IR")} عدد
              </span>
            </div>

            <div key={active.id} className="rise-in relative overflow-hidden">
              <img src={active.image} alt={`${active.name} — لپ‌تاپ ${active.category} در کورهِوس`} className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" aria-hidden="true" />
              {active.oldPrice && (
                <span className="absolute right-4 top-4 rounded-full bg-sea px-3 py-1 text-[11px] font-bold text-white">
                  {Math.round(active.oldPrice / 1_000_000).toLocaleString("fa-IR")} میلیون ریال تخفیف
                </span>
              )}
              <div className="absolute inset-x-4 bottom-4">
                <p className="text-[11px] font-bold tracking-wider text-sea">{active.brand} · {active.category} · {active.year.toLocaleString("fa-IR")}</p>
                <p className="mt-1 font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl" aria-label={active.shortName}>
                  <span aria-hidden="true">{name}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-panel p-4 sm:p-5">
              <ul className="flex flex-wrap gap-2" aria-label="مشخصات کلیدی">
                {active.highlights.map((h) => (
                  <li key={h} className="rounded-full border border-panel bg-coal px-3 py-1 font-mono text-[11px] text-mist transition-colors hover:border-sea hover:text-paper" dir="ltr">
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-2xl font-extrabold text-paper">
                    {fmt(active.price)}
                    {active.oldPrice && <span className="mr-2 text-sm text-mist/60 line-through">{fmt(active.oldPrice)}</span>}
                  </p>
                  <p className="font-mono text-[10px] tracking-wider text-mist/70" dir="ltr">SKU {active.sku}</p>
                </div>
                <div className="mr-auto flex gap-2.5">
                  <button
                    onClick={() => onSpecs(active.id)}
                    className="rounded-full border border-mist/30 px-4 py-2.5 text-xs font-bold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-coal"
                  >
                    مشخصات کامل
                  </button>
                  <button
                    onClick={add}
                    className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                      added ? "bg-[#5fd096] text-coal" : "bg-sea text-white hover:-translate-y-0.5 hover:bg-seadeep"
                    }`}
                  >
                    {added ? "✓ اضافه شد" : "افزودن به سبد"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onExplore}
            className="group mt-5 flex w-full items-center justify-center gap-3 rounded-full border border-dashed border-panel px-4 py-3 text-xs font-bold tracking-wider text-mist transition-colors hover:border-sea hover:text-sea"
          >
            مشاهده همه {products.length.toLocaleString("fa-IR")} دستگاه
            <IArrowR size={15} className="rotate-180 transition-transform group-hover:-translate-x-1.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
