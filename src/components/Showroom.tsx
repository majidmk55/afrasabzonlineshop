import { useEffect, useMemo, useState } from "react";
import { LAPTOPS, fmt, toFa, type Laptop } from "../data/laptops";
import { Reveal, prefersReducedMotion, useCountdown, useScramble } from "../lib/motion";
import { IArrowR, IBolt, ICheck, ILock, IReturn, IShield, ITruck } from "./icons";

const FEATURED_IDS = ["razer-blade-16", "macbook-pro-14", "asus-zephyrus-g14"];

function nextThursday(): number {
  const d = new Date();
  const day = d.getDay();
  const add = (4 - day + 7) % 7 || 7; // پنجشنبه
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
  const countdown = useCountdown(useMemo(() => nextThursday(), []));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % featured.length), 7000);
    return () => clearInterval(id);
  }, [featured.length]);

  const add = () => {
    onAdd(active.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-skywash via-foam to-card" aria-label="لپ‌تاپ‌های ویژه کورهِوس">
      {/* ambient rings */}
      <div className="pointer-events-none absolute -start-32 top-10 h-96 w-96 rounded-full border-[28px] border-sea/8" aria-hidden="true" />
      <div className="pointer-events-none absolute -end-24 -bottom-24 h-80 w-80 rounded-full border-[22px] border-sea/6" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden" aria-hidden="true">
        <div className="scanline h-28 w-full bg-gradient-to-b from-transparent via-sea/8 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-20">
        {/* intro + selector */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-sea/25 bg-card px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-seadark">
            <IBolt size={12} className="text-sea" /> بورس تخصصی لپ‌تاپ — تهران، خیابان ولیعصر
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.12] text-ink sm:text-6xl xl:text-7xl">
            لپ‌تاپ را
            <br />
            با <span className="relative inline-block text-sea">کارنامه
              <svg viewBox="0 0 120 10" className="absolute -bottom-1 right-0 w-full" aria-hidden="true"><path d="M3 7 Q 60 -2 117 6" stroke="#0477b3" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.35" /></svg>
            </span>{" "}
            بخرید.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-mist sm:text-base sm:leading-8">
            ده دستگاه منتخب، صفر سازش. هر لپ‌تاپ پیش از ارسال، ۴۲ مرحله تست آزمایشگاهی،
            کالیبراسیون نمایشگر و تست حرارتی را می‌گذراند — و گزارش امضاشده‌اش داخل همان جعبه
            به دست شما می‌رسد. قیمت‌ها به ریال و شامل مالیات.
          </p>

          {/* featured selector */}
          <div className="mt-9 border-t border-sea/15" role="tablist" aria-label="دستگاه‌های ویژه">
            {featured.map((l, i) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                onMouseEnter={() => !prefersReducedMotion() && setIdx(i)}
                className={`group flex w-full items-center gap-4 border-b border-sea/15 px-2 py-3.5 text-start transition-all duration-300 ${
                  i === idx ? "bg-card/80 shadow-sm" : "hover:bg-card/50"
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${i === idx ? "bg-sea text-white" : "bg-skywash text-mist"}`}>
                  {toFa(i + 1)}
                </span>
                <span className={`flex-1 font-display text-lg leading-snug transition-colors ${i === idx ? "text-ink" : "text-mist"}`}>
                  {l.name}
                </span>
                <span className={`text-sm font-bold ${i === idx ? "text-sea" : "text-mist"}`}>{fmt(l.price)}</span>
                <IArrowR size={15} className={`rotate-180 transition-all duration-300 ${i === idx ? "text-sea" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`} />
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {[
              [ITruck, "ارسال ۴۸ ساعته"],
              [IShield, "گارانتی ۲ ساله"],
              [IReturn, "۷ روز مرجوعی"],
              [ILock, "پرداخت امن بانکی"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof ITruck;
              return (
                <span key={label as string} className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-[11px] font-medium text-mist shadow-sm">
                  <I size={14} className="text-sea" /> {label as string}
                </span>
              );
            })}
          </div>
        </div>

        {/* the stage */}
        <Reveal>
          <div className="float-y relative overflow-hidden rounded-2xl border border-line bg-card shadow-xl shadow-sea/10">
            <div className="flex items-center justify-between border-b border-line bg-foam/70 px-4 py-2.5">
              <span className="text-[11px] font-bold text-seadark">
                پیشنهاد هفته — تا پایان: {toFa(countdown.d)} روز و {toFa(countdown.h)}:{toFa(countdown.m)}:
                <span className="font-mono text-sea">{toFa(String(countdown.s).padStart(2, "0"))}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-moss">
                <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-moss" /> موجود در انبار: {toFa(active.stock)} دستگاه
              </span>
            </div>

            <div key={active.id} className="rise-in relative overflow-hidden">
              <img
                src={active.image}
                alt={`${active.name} — لپ‌تاپ ${active.category} در کورهِوس`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/10 to-transparent" aria-hidden="true" />
              {active.oldPrice && (
                <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-seadark shadow">
                  {fmt(active.oldPrice - active.price)} تخفیف
                </span>
              )}
              <div className="absolute inset-x-5 bottom-4 text-white">
                <p className="text-[11px] font-medium tracking-wide text-skywash/90">{active.brand} · {active.category} · {toFa(active.year)}</p>
                <p className="mt-1 font-display text-3xl leading-tight" aria-label={active.shortName}>
                  <span aria-hidden="true" dir="ltr">{name}</span>
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <ul className="flex flex-wrap gap-1.5" aria-label="مشخصات کلیدی">
                {active.highlights.map((h) => (
                  <li key={h} dir="ltr" className="rounded-full border border-line bg-skywash/60 px-2.5 py-1 text-[10px] font-medium text-seadark transition-colors hover:border-sea">
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-2xl font-extrabold text-ink">
                    {fmt(active.price)}
                    {active.oldPrice && <span className="ms-2 text-sm font-normal text-mist line-through">{fmt(active.oldPrice)}</span>}
                  </p>
                  <p className="font-mono text-[10px] text-mist" dir="ltr">SKU {active.sku}</p>
                </div>
                <div className="ms-auto flex gap-2">
                  <button
                    onClick={() => onSpecs(active.id)}
                    className="rounded-full border border-sea/40 px-4 py-2.5 text-xs font-bold text-seadark transition-all hover:border-sea hover:bg-skywash active:scale-95"
                  >
                    مشخصات کامل
                  </button>
                  <button
                    onClick={add}
                    className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95 ${
                      added ? "bg-moss text-white" : "bg-sea text-white hover:bg-seadark hover:shadow-lg"
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
            className="group mt-5 flex w-full items-center justify-center gap-2.5 rounded-full border border-dashed border-sea/40 bg-card/60 px-4 py-3 text-xs font-bold text-seadark transition-colors hover:border-sea hover:bg-card"
          >
            مشاهده هر {toFa(LAPTOPS.length)} دستگاه
            <IArrowR size={15} className="rotate-180 transition-transform group-hover:-translate-x-1" />
          </button>

          <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
            {[
              ["۴۲", "مرحله تست آزمایشگاهی"],
              ["ΔE<۲", "کالیبراسیون نمایشگر"],
              ["۴۸h", "ارسال به سراسر ایران"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-card/80 px-2 py-3 shadow-sm">
                <p className="font-display text-xl text-sea" dir="ltr">{v}</p>
                <p className="mt-0.5 text-[10px] font-medium leading-snug text-mist">{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* wave divider */}
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-12 w-full text-card" aria-hidden="true">
        <path d="M0 40 C 240 70, 480 10, 720 32 C 960 54, 1200 16, 1440 42 L 1440 70 L 0 70 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
