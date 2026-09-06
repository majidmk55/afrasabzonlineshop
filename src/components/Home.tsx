import { useMemo } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { Reveal, useCountdown } from "../lib/motion";
import { IArrowR, IBolt, IDisplay, IShield, ITruck, LogoMark } from "./icons";

/* ---------- برندها ---------- */

const BRAND_META: { fa: string; en: string; cls: string }[] = [
  { fa: "اپل", en: "apple", cls: "text-sm font-semibold" },
  { fa: "ایسوس", en: "ASUS", cls: "text-xs font-extrabold tracking-widest" },
  { fa: "لنوو", en: "Lenovo", cls: "text-[11px] font-bold italic" },
  { fa: "دل", en: "DELL", cls: "text-xs font-extrabold tracking-[0.2em]" },
  { fa: "ریزر", en: "RAZER", cls: "text-[11px] font-extrabold italic tracking-wider" },
  { fa: "ام‌اس‌آی", en: "MSI", cls: "text-sm font-extrabold tracking-widest" },
  { fa: "فریم‌ورک", en: "framework", cls: "text-[10px] font-bold lowercase tracking-tight" },
  { fa: "ال‌جی", en: "LG", cls: "text-sm font-extrabold tracking-[0.25em]" },
  { fa: "اچ‌پی", en: "HP", cls: "text-sm font-extrabold italic" },
  { fa: "گیگابایت", en: "GIGABYTE", cls: "text-[9px] font-extrabold tracking-wider" },
];

function AppleGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 12.9c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.5 2 1 0 1.4-.6 2.6-.6s1.6.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3.1ZM14.7 6.6c.5-.7.9-1.6.8-2.6-.8 0-1.8.6-2.3 1.2-.5.6-1 1.6-.8 2.5.9.1 1.8-.4 2.3-1.1Z" />
    </svg>
  );
}

/* ---------- بازه‌های قیمت ---------- */

interface Band { id: string; title: string; desc: string; min: number; max: number; range: string; dark?: boolean }
const BANDS: Band[] = [
  { id: "budget", title: "اقتصادی", desc: "دانشجویی و کارهای روزمره", min: 0, max: 120_000_000, range: "تا ۱۲۰ میلیون" },
  { id: "mid", title: "میان‌رده", desc: "اداری، برنامه‌نویسی و ترید", min: 120_000_000, max: 160_000_000, range: "۱۲۰ تا ۱۶۰ میلیون" },
  { id: "pro", title: "حرفه‌ای", desc: "مهندسی، تدوین و رندر", min: 160_000_000, max: 220_000_000, range: "۱۶۰ تا ۲۲۰ میلیون" },
  { id: "flag", title: "پرچم‌دار", desc: "گیمینگ سنگین و ورک‌استیشن", min: 220_000_000, max: 400_000_000, range: "بالای ۲۲۰ میلیون", dark: true },
];

/* ---------- دسته‌های کاربرد ---------- */

const CAT_SPAN: Record<string, string> = {
  "گیمینگ": "lg:col-span-5",
  "خلاقیت و رندر": "lg:col-span-3",
  "بیزنس و اداری": "lg:col-span-2",
  "اولترابوک": "lg:col-span-2",
};
const CAT_REP: Record<string, string> = {
  "گیمینگ": "razer-blade-16",
  "خلاقیت و رندر": "macbook-pro-14",
  "بیزنس و اداری": "thinkpad-x1-carbon",
  "اولترابوک": "lg-gram-17",
};

function nextSunday(): number {
  const d = new Date();
  const add = d.getDay() === 0 ? 7 : 7 - d.getDay();
  d.setDate(d.getDate() + add);
  d.setHours(23, 59, 59, 0);
  return d.getTime();
}

interface HomeProps {
  products: Laptop[];
  onBrand: (brand: string) => void;
  onCategory: (cat: string) => void;
  onPrice: (min: number, max: number) => void;
  onExplore: () => void;
  onSpecs: (id: string) => void;
}

export default function Home({ products, onBrand, onCategory, onPrice, onExplore, onSpecs }: HomeProps) {
  const flash = useMemo(() => products.find((p) => p.oldPrice) ?? products[0] ?? null, [products]);
  const billboard = useMemo(
    () => products.find((p) => p.id === "razer-blade-16")?.image ?? products[0]?.image ?? "",
    [products]
  );
  const countdown = useCountdown(useMemo(() => nextSunday(), []));
  const pad = (n: number) => toFa(String(n).padStart(2, "0"));

  const brands = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.brand, (map.get(p.brand) ?? 0) + 1));
    return BRAND_META.map((b) => ({ ...b, count: map.get(b.fa) ?? 0 })).filter((b) => b.count > 0);
  }, [products]);

  const cats = useMemo(() => {
    const order = ["گیمینگ", "خلاقیت و رندر", "بیزنس و اداری", "اولترابوک"];
    const list = order
      .filter((c) => products.some((p) => p.category === c))
      .map((c) => {
        const inCat = products.filter((p) => p.category === c);
        const rep = inCat.find((p) => p.id === CAT_REP[c]) ?? inCat[0];
        return { name: c, count: inCat.length, min: Math.min(...inCat.map((p) => p.price)), img: rep.image };
      });
    const extra = [...new Set(products.map((p) => p.category))]
      .filter((c) => !order.includes(c))
      .map((c) => {
        const inCat = products.filter((p) => p.category === c);
        return { name: c, count: inCat.length, min: Math.min(...inCat.map((p) => p.price)), img: inCat[0].image };
      });
    return [...list, ...extra];
  }, [products]);

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl font-bold">ویترین در حال آماده‌سازی است</p>
        <p className="mt-2 text-sm text-mist">همه کالاها از پنل مدیریت خاموش شده‌اند. لطفاً بعداً سر بزنید.</p>
      </section>
    );
  }

  return (
    <>
      {/* ── بیلبورد اصلی ── */}
      <section className="relative w-full overflow-hidden bg-deep" aria-label="بیلبورد اصلی">
        <img src={billboard} alt="لپ‌تاپ تخصصی کورهِوس روی میز آزمایشگاه" className="absolute inset-0 h-full w-full object-cover opacity-90" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-l from-deep via-deep/70 to-deep/10" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 overflow-hidden" aria-hidden="true">
          <div className="scanline h-20 w-full bg-gradient-to-b from-transparent via-sea/20 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[280px] max-w-7xl flex-col justify-center px-4 py-10 sm:min-h-[340px] sm:px-6 lg:min-h-[400px]">
          <p className="flex w-fit items-center gap-2 rounded-full border border-sea/50 bg-deep/60 px-4 py-1.5 text-[11px] font-bold tracking-wider text-skywash backdrop-blur-sm">
            <LogoMark size={16} className="text-sea" /> بورس تخصصی لپ‌تاپ — از ۱۳۹۸
          </p>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.25] text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-nazanin)" }}>
            لپ‌تاپ را با <span className="text-sea" style={{ textShadow: "0 0 28px rgba(4,119,179,0.55)" }}>کارنامه</span> بخرید.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-8 text-skywash/85 sm:text-base">
            هر دستگاه پیش از ارسال، ۴۲ مرحله تست آزمایشگاهی، کالیبراسیون نمایشگر و بنچمارک واقعی را
            می‌گذراند — گزارش امضاشده داخل جعبه، قیمت به ریال و به‌روز.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onExplore}
              className="group flex items-center gap-2.5 rounded-full bg-sea px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sea/30 transition-all hover:bg-white hover:text-sea active:translate-y-0.5"
            >
              دیدن ویترین
              <IArrowR size={16} className="-scale-x-100 transition-transform group-hover:-translate-x-1" />
            </button>

            {flash && (
              <button
                onClick={() => onSpecs(flash.id)}
                className="group flex items-center gap-3 rounded-full border border-white/25 bg-white/10 py-2 pe-5 ps-2.5 backdrop-blur-sm transition-colors hover:border-sea hover:bg-sea/20"
              >
                <span className="flex items-center gap-1.5 rounded-full bg-sea px-3 py-1.5 font-mono text-[11px] font-bold text-white" dir="ltr">
                  <IBolt size={11} /> {pad(countdown.d)}:{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
                </span>
                <span className="text-right leading-tight">
                  <span className="block text-[10px] font-bold text-sea">پیشنهاد هفته — {flash.oldPrice ? `${toFa(Math.round((flash.oldPrice - flash.price) / 1_000_000))} م.ریال تخفیف` : "موجودی محدود"}</span>
                  <span className="block text-xs font-bold text-white">{flash.shortName}</span>
                </span>
              </button>
            )}
          </div>

          <ul className="mt-8 hidden flex-wrap gap-x-7 gap-y-2 text-[11px] font-bold tracking-wider text-skywash/80 sm:flex">
            <li className="flex items-center gap-2"><ITruck size={15} className="text-sea" /> ارسال رایگان ۴۸ ساعته</li>
            <li className="flex items-center gap-2"><IDisplay size={15} className="text-sea" /> کالیبراسیون تا ΔE کمتر از ۲</li>
            <li className="flex items-center gap-2"><IShield size={15} className="text-sea" /> گارانتی ۲ ساله کورهِوس</li>
          </ul>
        </div>

        <div className="relative h-1.5 w-full bg-gradient-to-l from-sea via-skywash to-sea/30" aria-hidden="true" />
      </section>

      {/* ── خرید بر اساس برند ── */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6" aria-label="خرید بر اساس برند">
        <Reveal>
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 font-display text-2xl font-bold tracking-tight sm:text-3xl">خرید بر اساس برند</h2>
            <span className="h-px flex-1 bg-gradient-to-l from-line to-transparent" aria-hidden="true" />
            <span className="hidden text-[11px] font-bold text-mist sm:block">{toFa(products.length)} دستگاه فعال</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-6 grid grid-cols-5 gap-3 sm:gap-4">
            {brands.map((b) => (
              <li key={b.fa}>
                <button
                  onClick={() => onBrand(b.fa)}
                  className="group flex w-full flex-col items-center gap-2"
                  aria-label={`لپ‌تاپ‌های ${b.fa}`}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-sea group-hover:shadow-lg group-hover:shadow-sea/15 sm:h-20 sm:w-20">
                    {b.en === "apple" ? (
                      <AppleGlyph className="h-7 w-7 text-ink transition-colors group-hover:text-sea" />
                    ) : (
                      <span dir="ltr" className={`text-ink transition-colors group-hover:text-sea ${b.cls}`}>{b.en}</span>
                    )}
                  </span>
                  <span className="text-center leading-tight">
                    <span className="block text-xs font-bold transition-colors group-hover:text-sea">{b.fa}</span>
                    <span className="block text-[10px] text-mist">{toFa(b.count)} دستگاه</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── خرید بر اساس کاربرد ── */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6" aria-label="خرید بر اساس کاربرد">
        <Reveal>
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 font-display text-2xl font-bold tracking-tight sm:text-3xl">بر اساس کاربرد شما</h2>
            <span className="h-px flex-1 bg-gradient-to-l from-line to-transparent" aria-hidden="true" />
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {cats.map((c, i) => (
            <Reveal key={c.name} delay={i * 70} className={`sm:col-span-1 ${CAT_SPAN[c.name] ?? "lg:col-span-3"}`}>
              <button
                onClick={() => onCategory(c.name)}
                className="group relative block h-44 w-full overflow-hidden rounded-2xl border border-line text-right sm:h-52"
                aria-label={`لپ‌تاپ‌های ${c.name}`}
              >
                <img src={c.img} alt="" className="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                <span className="absolute inset-0 bg-gradient-to-t from-deep via-deep/35 to-transparent transition-opacity" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <span>
                    <span className="block font-display text-xl font-bold text-white drop-shadow-sm sm:text-2xl">{c.name}</span>
                    <span className="mt-0.5 block text-[11px] font-bold text-skywash/85">
                      {toFa(c.count)} دستگاه · از {toFa(Math.round(c.min / 1_000_000))} میلیون ریال
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 translate-x-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <IArrowR size={16} className="-scale-x-100" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── خرید بر اساس بودجه ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-label="خرید بر اساس بودجه">
        <Reveal>
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 font-display text-2xl font-bold tracking-tight sm:text-3xl">بر اساس بودجه شما</h2>
            <span className="h-px flex-1 bg-gradient-to-l from-line to-transparent" aria-hidden="true" />
            <span className="hidden text-[11px] font-bold text-mist sm:block">قیمت‌ها به ریال و به‌روز</span>
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {BANDS.map((band, i) => {
            const inBand = products.filter((p) => p.price >= band.min && p.price < band.max);
            const share = products.length ? Math.round((inBand.length / products.length) * 100) : 0;
            const from = inBand.length ? Math.min(...inBand.map((p) => p.price)) : null;
            return (
              <Reveal key={band.id} delay={i * 70}>
                <button
                  onClick={() => onPrice(band.min, band.max)}
                  className={`card-lift group flex h-full w-full flex-col rounded-2xl border p-4 text-right sm:p-5 ${
                    band.dark ? "border-deep bg-deep text-white" : "border-line bg-white"
                  }`}
                  aria-label={`لپ‌تاپ‌های ${band.title} — ${band.range} ریال`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`font-display text-lg font-bold ${band.dark ? "text-white" : "text-ink"}`}>{band.title}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${band.dark ? "bg-sea text-white" : "bg-skywash text-sea"}`}>
                      {toFa(inBand.length)} دستگاه
                    </span>
                  </span>
                  <span className={`mt-1 font-mono text-[11px] ${band.dark ? "text-skywash/80" : "text-sea"}`} dir="rtl">
                    {band.range} ریال
                  </span>
                  <span className={`mt-1.5 text-[11px] leading-5 ${band.dark ? "text-skywash/65" : "text-mist"}`}>{band.desc}</span>

                  <span className="mt-auto block pt-4">
                    <span className={`block h-1.5 overflow-hidden rounded-full ${band.dark ? "bg-white/15" : "bg-skywash"}`}>
                      <span className="block h-full rounded-full bg-sea transition-[width] duration-700" style={{ width: `${Math.max(6, share)}%` }} />
                    </span>
                    <span className={`mt-2 flex items-center justify-between text-[10px] font-bold ${band.dark ? "text-skywash/70" : "text-mist"}`}>
                      <span>{toFa(share)}٪ از ویترین</span>
                      <span className={`transition-colors ${band.dark ? "group-hover:text-sea" : "group-hover:text-sea"}`}>
                        {from ? `از ${toFa(Math.round(from / 1_000_000))} میلیون` : "به‌زودی"}
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <p className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-line bg-foam px-4 py-3 text-[11px] font-bold text-mist">
            <IBolt size={13} className="text-sea" />
            قیمت‌ها شامل ۱۰٪ مالیات بر ارزش افزوده است · سفارش بالای ۱۵۰ میلیون ریال، ارسال رایگان ۴۸ ساعته
            <button onClick={onExplore} className="mr-auto flex items-center gap-1 text-sea underline-offset-4 hover:underline">
              مشاهده همه دستگاه‌ها <IArrowR size={13} className="-scale-x-100" />
            </button>
          </p>
        </Reveal>
      </section>
    </>
  );
}
