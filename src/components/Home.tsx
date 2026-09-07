import { useMemo, useRef, type ComponentType } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { prefersReducedMotion, Reveal, useCountdown } from "../lib/motion";
import ProductCard from "./ProductCard";
import DigiShop from "./DigiShop";
import { IArrowR, IBolt, IBriefGear, ICap, ICode, IDisplay, IGamepad, IPenNib, IShield, ITruck, LogoMark } from "./icons";

/* تصویر بیلبورد — Lenovo IdeaPad Pro 5i Hero Family */
const BILLBOARD_IMG = "https://www.ballicom.co.uk/bp-assets/uploads/2023/12/16_Ideapad_Pro_5i_Hero_Family.png";

/* ---------- بازه‌های قیمت ---------- */

interface Band { id: string; title: string; desc: string; min: number; max: number; range: string; dark?: boolean }
const BANDS: Band[] = [
  { id: "budget", title: "اقتصادی", desc: "دانشجویی و کارهای روزمره", min: 0, max: 120_000_000, range: "تا ۱۲۰ میلیون" },
  { id: "mid", title: "میان‌رده", desc: "اداری، برنامه‌نویسی و ترید", min: 120_000_000, max: 160_000_000, range: "۱۲۰ تا ۱۶۰ میلیون" },
  { id: "pro", title: "حرفه‌ای", desc: "مهندسی، تدوین و رندر", min: 160_000_000, max: 220_000_000, range: "۱۶۰ تا ۲۲۰ میلیون" },
  { id: "flag", title: "پرچم‌دار", desc: "گیمینگ سنگین و ورک‌استیشن", min: 220_000_000, max: 400_000_000, range: "بالای ۲۲۰ میلیون", dark: true },
];

/* ---------- پنج گروه بر اساس کاربرد ---------- */

interface UseGroup {
  id: string;
  name: string;
  desc: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  cats?: string[];
  price?: [number, number];
}
const USE_GROUPS: UseGroup[] = [
  { id: "gaming", name: "گیمینگ", desc: "فریم‌ریت بالا و خنک‌کنندگی قوی", Icon: IGamepad, cats: ["گیمینگ"] },
  { id: "creative", name: "طراحی و تولید محتوا", desc: "نمایشگر کالیبره، رندر سریع", Icon: IPenNib, cats: ["خلاقیت و رندر"] },
  { id: "student", name: "دانشجویی", desc: "سبک، بادوام و خوش‌قیمت", Icon: ICap, price: [0, 120_000_000] },
  { id: "office", name: "اداری و مهندسی", desc: "پایدار برای نرم‌افزارهای سنگین", Icon: IBriefGear, cats: ["بیزنس و اداری"] },
  { id: "dev", name: "برنامه‌نویسی", desc: "کیبورد عالی و باتری بلند", Icon: ICode, cats: ["اولترابوک"] },
];

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
  const countdown = useCountdown(useMemo(() => nextSunday(), []));
  const pad = (n: number) => toFa(String(n).padStart(2, "0"));



  const groupCount = (g: UseGroup) =>
    products.filter((p) =>
      g.cats ? g.cats.includes(p.category) : g.price ? p.price >= g.price[0] && p.price < g.price[1] : false
    ).length;

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-[90%] px-2 py-24 text-center sm:px-4">
        <p className="font-display text-2xl font-bold">ویترین در حال آماده‌سازی است</p>
        <p className="mt-2 text-sm text-mist">همه کالاها از پنل مدیریت خاموش شده‌اند. لطفاً بعداً سر بزنید.</p>
      </section>
    );
  }

  return (
    <>
      {/* ── بیلبورد اصلی ── */}
      <section className="relative w-full overflow-hidden bg-deeplit" aria-label="بیلبورد اصلی">
        {/* هاله نور اقیانوسی پشت تصویر */}
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-sea/20 blur-3xl" aria-hidden="true" />
        {/* تصویر بیلبورد — خانواده لپ‌تاپ‌های لنوو IdeaPad Pro */}
        <img
          src={BILLBOARD_IMG}
          alt="خانواده لپ‌تاپ‌های لنوو IdeaPad Pro"
          className="pointer-events-none absolute bottom-0 left-0 hidden h-[96%] w-auto max-w-[75%] select-none object-contain object-bottom drop-shadow-[0_30px_55px_rgba(2,20,35,0.55)] md:block lg:h-full"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-deeplit via-deeplit/60 to-deeplit/5" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 overflow-hidden" aria-hidden="true">
          <div className="scanline h-20 w-full bg-gradient-to-b from-transparent via-sea/20 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[280px] max-w-[90%] flex-col justify-center px-2 py-10 sm:min-h-[340px] sm:px-4 lg:min-h-[400px]">
          <p className="flex w-fit items-center gap-2 rounded-full border border-sea/50 bg-deeplit/70 px-4 py-1.5 text-[11px] font-bold tracking-wider text-skywash backdrop-blur-sm">
            <LogoMark size={16} className="text-sea" /> بورس تخصصی لپ‌تاپ — از ۱۳۹۸
          </p>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.25] text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-nazanin)" }}>
            لپ‌تاپ را با <span className="text-sea" style={{ textShadow: "0 0 28px rgba(4,119,179,0.55)" }}>کارنامه</span> بخرید.
          </h1>

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

      {/* ── فروشگاه به سبک دیجی‌کالا/ترب ── */}
      <DigiShop products={products} onSpecs={onSpecs} onBrand={onBrand} />

      {/* ── خرید بر اساس کاربرد: پنج گروه با لوگوی مینیمال ── */}
      <section className="mx-auto max-w-[90%] px-2 pt-14 sm:px-4" aria-label="خرید بر اساس کاربرد">
        <Reveal>
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 font-display text-2xl font-bold tracking-tight sm:text-3xl">بر اساس کاربرد شما</h2>
            <span className="h-px flex-1 bg-gradient-to-l from-line to-transparent" aria-hidden="true" />
            <span className="hidden text-[11px] font-bold text-mist sm:block">پنج گروه تخصصی</span>
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {USE_GROUPS.map((g, i) => {
            const count = groupCount(g);
            return (
              <Reveal key={g.id} delay={i * 70}>
                <button
                  onClick={() => (g.cats ? onCategory(g.cats[0]) : onPrice(g.price![0], g.price![1]))}
                  className="card-lift group flex h-full w-full flex-col items-center rounded-2xl border border-line bg-white p-5 text-center"
                  aria-label={`لپ‌تاپ‌های ${g.name} — ${toFa(count)} دستگاه`}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-skywash text-ink transition-all duration-300 group-hover:bg-sea group-hover:text-white group-hover:shadow-lg group-hover:shadow-sea/25">
                    <g.Icon size={30} className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                  </span>
                  <span className="mt-3 font-display text-lg font-bold leading-tight transition-colors group-hover:text-sea">{g.name}</span>
                  <span className="mt-1 text-[11px] leading-5 text-mist">{g.desc}</span>
                  <span className="mt-3 flex items-center gap-1.5 text-[11px] font-extrabold text-sea">
                    {toFa(count)} دستگاه
                    <IArrowR size={12} className="-scale-x-100 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── خرید بر اساس بودجه ── */}
      <section className="mx-auto max-w-[90%] px-2 py-14 sm:px-4" aria-label="خرید بر اساس بودجه">
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
