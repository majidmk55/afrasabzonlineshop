import { useEffect, useMemo, useState } from "react";
import { WARRANTY_PRICE, fmt, toFa, type Laptop } from "../data/laptops";
import { Reveal, prefersReducedMotion, useEscape, useLockBody } from "../lib/motion";
import { IBox, ICheck, IClose, ICompare, IMinus, IPlus, IStar, ITruck, SPEC_ICONS } from "./icons";

type Tab = "specs" | "box" | "shipping";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* امتیاز وزن از مشخصات واقعی دستگاه مشتق می‌شود: سبک‌تر = بهتر */
function weightScore(l: Laptop): number {
  const raw = l.brief.find((b) => b[0] === "وزن")?.[1] ?? "";
  const norm = raw.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const m = norm.match(/(\d+(?:\.\d+)?)/);
  const kg = m ? parseFloat(m[1]) : 2;
  return Math.round(Math.min(97, Math.max(42, 104 - kg * 22)));
}

/* Cache for score calculations to avoid recomputation */
const scoreCache = new Map<string, { parts: { label: string; icon: string; v: number }[]; overall: number }>();

function scoreLaptop(l: Laptop) {
  const cached = scoreCache.get(l.id);
  if (cached) return cached;

  const h = hash(l.id);
  const parts: { label: string; icon: string; v: number }[] = [
    { label: "پردازنده", icon: "cpu", v: 68 + ((h >> 1) % 30) },
    { label: "گرافیک", icon: "gpu", v: 58 + ((h >> 4) % 40) },
    { label: "حافظه", icon: "ram", v: 70 + ((h >> 6) % 28) },
    { label: "نمایشگر", icon: "display", v: 72 + ((h >> 9) % 26) },
    { label: "باتری", icon: "battery", v: 48 + ((h >> 12) % 48) },
    { label: "وزن", icon: "scale", v: weightScore(l) },
  ];
  const overall = Math.round(parts.reduce((a, p) => a + p.v, 0) / parts.length);
  const result = { parts, overall };
  scoreCache.set(l.id, result);
  return result;
}

/* خلاصه «مشخصات اصلی» — شش ردیف کلیدی مانند برگه فنی استاندارد */
function MainSpecs({ laptop }: { laptop: Laptop }) {
  const brief = (key: string) => laptop.brief.find((b) => b[0] === key)?.[1] ?? "—";
  const row = (groupTitle: string, rowKey: string) => {
    const g = laptop.specs.find((s) => s.title === groupTitle);
    return g?.rows.find((r) => r[0] === rowKey)?.[1] ?? "—";
  };
  const items: [string, string][] = [
    ["پردازنده", brief("پردازنده")],
    ["صفحه نمایش", brief("نمایشگر")],
    ["هارد", row("ذخیره‌سازی", "ظرفیت کلی")],
    ["رم", row("حافظه رم", "حافظه داخلی رم") || brief("رم / حافظه")],
    ["سیستم‌عامل", row("نرم‌افزار", "سیستم‌عامل نصب‌شده")],
    ["کارت گرافیک", brief("گرافیک")],
  ];
  return (
    <section aria-label="مشخصات اصلی" className="overflow-hidden rounded-2xl border-2 border-purple-300/80 bg-purple-100/70 shadow-sm">
      <h4 className="flex items-center gap-2 border-b border-purple-200 bg-white/50 px-4 py-3.5 font-body text-[16.5px] font-extrabold text-purple-800">
        مشخصات اصلی در یک نگاه
      </h4>
      <dl className="divide-y divide-purple-200/70 px-4">
        {items.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
            <dt className="w-48 shrink-0 text-[13px] font-extrabold text-ink">{k}</dt>
            <dd className="font-spec text-[14.5px] font-semibold text-ink" dir="auto">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ترتیب استاندارد بخش‌های مشخصات فنی */
const SPEC_ORDER = [
  "طراحی",
  "پردازنده",
  "حافظه رم",
  "ذخیره‌سازی",
  "گرافیک",
  "صفحه نمایش",
  "صدا",
  "دوربین",
  "پورت‌ها و اتصالات",
  "شبکه",
  "کیبورد",
  "باتری و شارژ",
  "نرم‌افزار",
  "وزن و ابعاد",
  "امنیت",
];

/* ---------- نقاط قوت و ضعف ---------- */
function ProsCons({ laptop }: { laptop: Laptop }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <section aria-label="نقاط قوت" className="overflow-hidden rounded-2xl border border-moss/40 bg-moss/10">
        <h4 className="flex items-center gap-2.5 border-b border-moss/25 bg-white/60 px-4 py-3 font-body text-[15px] font-extrabold text-moss">
          <ICheck size={20} className="shrink-0" />
          نقاط قوت
        </h4>
        <ul className="divide-y divide-moss/15 px-4">
          {laptop.pros.map((p) => (
            <li key={p} className="flex items-start gap-2.5 py-2.5 text-[13px] leading-6 text-ink">
              <ICheck size={15} className="mt-1 shrink-0 text-moss" />
              {p}
            </li>
          ))}
        </ul>
      </section>
      <section aria-label="نقاط ضعف" className="overflow-hidden rounded-2xl border border-red-300/60 bg-red-50">
        <h4 className="flex items-center gap-2.5 border-b border-red-200 bg-white/60 px-4 py-3 font-body text-[15px] font-extrabold text-red-700">
          <IClose size={20} className="shrink-0" />
          نقاط ضعف
        </h4>
        <ul className="divide-y divide-red-200/60 px-4">
          {laptop.cons.map((c) => (
            <li key={c} className="flex items-start gap-2.5 py-2.5 text-[13px] leading-6 text-ink">
              <IClose size={15} className="mt-1 shrink-0 text-red-500" />
              {c}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ---------- نمای انفجاری سخت‌افزار (شماتیک آزمایشگاه) ---------- */
const PARTS = [
  { n: "۱", label: "درب و نمایشگر OLED" },
  { n: "۲", label: "لولا و کابل تصویر" },
  { n: "۳", label: "دک کیبورد و تاچ‌پد" },
  { n: "۴", label: "لوله‌های حرارتی مسی" },
  { n: "۵", label: "دو فن خنک‌کننده" },
  { n: "۶", label: "برد اصلی، پردازنده و گرافیک" },
  { n: "۷", label: "ماژول رم و SSD" },
  { n: "۸", label: "باتری لیتیوم‌پلیمر" },
  { n: "۹", label: "بلندگوها و برد پورت‌ها" },
  { n: "۱۰", label: "پوشش پایینی آلومینیومی" },
];

function HardwareExploded({ laptop }: { laptop: Laptop }) {
  const [hi, setHi] = useState<number | null>(null);
  return (
    <section aria-label="نمای انفجاری سخت‌افزار" className="overflow-hidden rounded-2xl border border-line bg-deep">
      <h4 className="flex items-center gap-2.5 border-b border-panel px-4 py-3 font-body text-[15px] font-extrabold text-white">
        <IBox size={21} className="shrink-0 text-sea" />
        نمای انفجاری سخت‌افزار — داخل {laptop.shortName}
      </h4>
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.3fr_1fr]">
        {/* شمای لایه‌ها */}
        <div className="relative overflow-hidden rounded-xl bg-slab/60" dir="ltr">
          <svg viewBox="0 0 520 430" className="h-auto w-full" role="img" aria-label="شمای انفجاری قطعات داخلی لپ‌تاپ">
            <defs>
              <linearGradient id="slabGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#16496e" />
                <stop offset="100%" stopColor="#0c3350" />
              </linearGradient>
            </defs>
            {PARTS.map((p, i) => {
              const y = 24 + i * 40;
              const w = i === 0 || i === 9 ? 400 : i === 7 ? 340 : 300;
              const x = 70;
              const active = hi === i;
              return (
                <g
                  key={p.n}
                  onMouseEnter={() => setHi(i)}
                  onMouseLeave={() => setHi(null)}
                  style={{ cursor: "pointer", transition: "opacity .25s ease" }}
                  opacity={hi === null || active ? 1 : 0.35}
                >
                  <polygon
                    points={`${x},${y + 12} ${x + 46},${y} ${x + 46 + w},${y} ${x + w},${y + 12} ${x + w},${y + 24} ${x},${y + 24}`}
                    fill={active ? "#0477b3" : "url(#slabGrad)"}
                    stroke={active ? "#7cc7ec" : "#2c5c80"}
                    strokeWidth="1.2"
                    style={{ transition: "fill .25s ease" }}
                  />
                  {i === 5 && (
                    <>
                      <rect x={x + 90} y={y + 3} width="34" height="7" fill="#0c0f15" opacity="0.85" />
                      <rect x={x + 132} y={y + 3} width="26" height="7" fill="#0c0f15" opacity="0.6" />
                    </>
                  )}
                  {i === 4 && (
                    <>
                      <circle cx={x + 120} cy={y + 12} r="8" fill="none" stroke="#7cc7ec" strokeWidth="1.4" />
                      <circle cx={x + 168} cy={y + 12} r="8" fill="none" stroke="#7cc7ec" strokeWidth="1.4" />
                    </>
                  )}
                  {i === 3 && (
                    <path d={`M ${x + 60} ${y + 12} q 70 -8 150 0 t 90 0`} fill="none" stroke="#e08d5a" strokeWidth="2.4" strokeLinecap="round" />
                  )}
                  {i === 7 && (
                    <rect x={x + 40} y={y + 4} width={w - 90} height="14" rx="3" fill="#0a2a43" stroke="#2c5c80" strokeWidth="1" />
                  )}
                  <line x1={x + w + 12} y1={y + 12} x2={x + w + 34} y2={y + 12} stroke="#7cc7ec" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx={x + w + 44} cy={y + 12} r="9" fill={active ? "#0477b3" : "#07293f"} stroke="#7cc7ec" strokeWidth="1.2" />
                  <text x={x + w + 44} y={y + 16} textAnchor="middle" fontSize="10" fill="#bfe3f5" fontFamily="IBM Plex Mono, monospace">
                    {p.n.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* راهنمای قطعات */}
        <ol className="self-center space-y-1.5">
          {PARTS.map((p, i) => (
            <li key={p.n}>
              <button
                onMouseEnter={() => setHi(i)}
                onMouseLeave={() => setHi(null)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-right text-[13px] transition-all ${
                  hi === i ? "bg-sea/25 text-white" : "text-skywash/85 hover:bg-slab"
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${hi === i ? "border-sea bg-sea text-white" : "border-panel text-skywash"}`}>
                  {p.n}
                </span>
                {p.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className="border-t border-panel bg-coal/40 px-4 py-2.5 text-[10px] leading-relaxed text-skywash/70">
        شمای شماتیک آزمایشگاه کورهِوس — چیدمان قطعات ممکن است در هر مدل کمی متفاوت باشد. همه دستگاه‌ها پیش از ارسال باز، تست و دوباره پلمپ می‌شوند و گزارش ۴۲ مرحله‌ای همراه جعبه است.
      </p>
    </section>
  );
}

function SpecTable({ laptop }: { laptop: Laptop }) {
  const sorted = [...laptop.specs].sort((a, b) => {
    const ia = SPEC_ORDER.indexOf(a.title);
    const ib = SPEC_ORDER.indexOf(b.title);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return (
    <div className="space-y-5">
      <MainSpecs laptop={laptop} />
      {sorted.map((group) => {
        const Icon = SPEC_ICONS[group.icon];
        return (
          <section
            key={group.title}
            aria-label={group.title}
            className="overflow-hidden rounded-2xl border border-line bg-sea/5 transition-colors hover:border-sea/40"
          >
            <h4 className="flex items-center gap-2.5 border-b border-line/70 bg-white/60 px-4 py-3 font-body text-[15px] font-extrabold">
              {Icon && <Icon size={21} className="shrink-0 text-sea" />}
              {group.title}
            </h4>
            <dl className="divide-y divide-line/60 px-4">
              {group.rows.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
                  <dt className="w-48 shrink-0 text-[12px] font-bold text-mist">{k}</dt>
                  <dd className="font-spec text-[13px] text-ink" dir="auto">{v}</dd>
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
  products: Laptop[];
  onClose: () => void;
  onAdd: (id: string, qty: number, warranty: boolean) => void;
  onToggleCompare: (id: string) => void;
  compared: boolean;
  onOpen: (id: string) => void;
}

export default function ProductModal({ laptop, products, onClose, onAdd, onToggleCompare, compared, onOpen }: ProductModalProps) {
  const [tab, setTab] = useState<Tab>("specs");
  const [qty, setQty] = useState(1);
  const [warranty, setWarranty] = useState(false);
  const [added, setAdded] = useState(false);
  useLockBody(true);
  useEscape(true, onClose);

  const score = useMemo(() => scoreLaptop(laptop), [laptop]);

  const [ringPct, setRingPct] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setRingPct(score.overall);
      return;
    }
    const t = setTimeout(() => setRingPct(score.overall), 80);
    return () => clearTimeout(t);
  }, [score.overall]);

  const related = useMemo(
    () => products.filter((l) => l.category === laptop.category && l.id !== laptop.id).slice(0, 3),
    [products, laptop]
  );

  const add = () => {
    onAdd(laptop.id, qty, warranty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={laptop.name}>
      <div className="overlay-in fixed inset-0 bg-ink/70" onClick={onClose} />
      <div className="panel-in relative mx-auto my-6 w-[min(1060px,94vw)] rounded-3xl border border-line bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-line bg-white/95 px-5 py-3 backdrop-blur-sm">
          <p className="text-[11px] font-bold tracking-wider text-mist">
            {laptop.brand} · <span dir="ltr" className="font-mono">SKU {laptop.sku}</span>
          </p>
          <button onClick={onClose} aria-label="بستن جزئیات کالا" className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-red-400 hover:text-red-500">
            <IClose size={17} />
          </button>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_1fr]">
          {/* تصویر + بنچمارک */}
          <div>
            <div className="group overflow-hidden rounded-2xl border border-line bg-skywash">
              <img src={laptop.image} alt={laptop.name} className="img-zoom aspect-[4/3] w-full object-cover" />
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-sea/5">
              <div className="flex items-center justify-between border-b border-line/70 bg-white/60 px-4 py-3">
                <p className="font-body text-[15px] font-extrabold">امتیاز بنچمارک</p>
                <span className="text-[10px] font-bold text-mist">تست آزمایشگاه کورهِوس · از ۱۰۰</span>
              </div>
              <div className="grid gap-6 p-5 sm:grid-cols-[150px_1fr]">
                {/* امتیاز کلی — حلقه میانگین */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="relative h-32 w-32">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" strokeWidth="11" className="stroke-line" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="11"
                        strokeLinecap="round"
                        className="stroke-sea transition-[stroke-dashoffset] duration-1000 ease-out"
                        strokeDasharray={327}
                        strokeDashoffset={327 * (1 - ringPct / 100)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-4xl font-bold text-ink">{toFa(score.overall)}</span>
                      <span className="text-[10px] font-bold text-mist">از ۱۰۰</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm font-extrabold">امتیاز کلی</p>
                  <p className="text-[10px] text-mist">میانگین همه معیارها</p>
                </div>

                {/* شش معیار */}
                <div className="space-y-3 self-center">
                  {score.parts.map((p) => {
                    const Icon = SPEC_ICONS[p.icon];
                    return (
                      <div key={p.label}>
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="flex items-center gap-1.5 text-ink">
                            {Icon && <Icon size={17} className="text-sea" />} {p.label}
                          </span>
                          <span className="text-ink">{toFa(p.v)}</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-seadeep to-sea transition-[width] duration-700"
                            style={{ width: `${p.v}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="border-t border-line/60 bg-white/50 px-4 py-2.5 text-[10px] leading-relaxed text-mist">
                از تست ۴۲ مرحله‌ای ما: Cinebench R24، تست حرارتی ۳۰ دقیقه‌ای با سقف نویز ۴۰ دسی‌بل و کالیبراسیون نمایشگر تا ΔE کمتر از ۲.
              </p>
            </div>
          </div>

          {/* پنل خرید */}
          <div>
            <p className="text-[11px] font-extrabold tracking-wider text-sea">{laptop.category} · {laptop.year.toLocaleString("fa-IR")}</p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight">{laptop.name}</h2>
            <p className="mt-2 text-sm leading-7 text-mist">{laptop.tagline}</p>

            <div className="mt-3 flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-sea">
                {[1, 2, 3, 4, 5].map((i) => <IStar key={i} size={14} filled={i <= Math.round(laptop.rating)} className={i <= Math.round(laptop.rating) ? "" : "opacity-30"} />)}
              </span>
              <span className="text-xs text-mist">{laptop.rating.toLocaleString("fa-IR")} · {laptop.reviews.toLocaleString("fa-IR")} دیدگاه تأییدشده</span>
            </div>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {laptop.highlights.map((h) => (
                <li key={h} className="rounded-full border border-line bg-foam px-2.5 py-1 font-mono text-[11px] text-mist" dir="ltr">{h}</li>
              ))}
            </ul>

            <div className="mt-5 rounded-2xl border border-line bg-white p-4">
              <div className="flex items-end justify-between">
                <p className="text-2xl font-extrabold">
                  {fmt(laptop.price)}
                  {laptop.oldPrice && <span className="mr-2 text-base text-mist line-through">{fmt(laptop.oldPrice)}</span>}
                </p>
                <p className={`flex items-center gap-1.5 text-[11px] font-bold ${laptop.stock <= 5 ? "text-amber-600" : "text-moss"}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${laptop.stock <= 5 ? "bg-amber-500" : "dot-live bg-moss"}`} />
                  {laptop.stock <= 5 ? `فقط ${laptop.stock.toLocaleString("fa-IR")} عدد` : `${laptop.stock.toLocaleString("fa-IR")} عدد موجود`}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-xl border border-line bg-foam">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="کاهش تعداد" className="px-3 py-2.5 transition-colors hover:text-sea"><IMinus size={14} /></button>
                  <span className="w-8 text-center font-mono text-sm">{toFa(qty)}</span>
                  <button onClick={() => setQty((q) => Math.min(Math.max(1, laptop.stock), q + 1))} aria-label="افزایش تعداد" className="px-3 py-2.5 transition-colors hover:text-sea"><IPlus size={14} /></button>
                </div>
                <button
                  onClick={() => onToggleCompare(laptop.id)}
                  aria-pressed={compared}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[11px] font-bold transition-colors ${
                    compared ? "border-sea bg-sea text-white" : "border-line hover:border-ink"
                  }`}
                >
                  <ICompare size={14} /> {compared ? "در لیست مقایسه" : "مقایسه"}
                </button>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-dashed border-line p-3 text-sm transition-colors hover:border-sea">
                <input type="checkbox" checked={warranty} onChange={(e) => setWarranty(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-[#0477b3]" />
                <span>
                  <span className="font-bold">پوشش حوادث (ضربه و مایعات) × {toFa(qty)}</span>
                  <span className="block text-[11px] text-mist">هر واحد + {fmt(WARRANTY_PRICE)}</span>
                </span>
              </label>

              <button
                onClick={add}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all active:translate-y-0.5 ${
                  added ? "bg-moss text-white" : "bg-sea text-white hover:bg-seadeep"
                }`}
              >
                {added ? <><ICheck size={16} /> به سبد اضافه شد</> : `افزودن ${toFa(qty)} عدد به سبد — ${fmt(laptop.price * qty + (warranty ? WARRANTY_PRICE * qty : 0))}`}
              </button>
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider text-mist">
                <ITruck size={13} /> ارسال رایگان ۴۸ ساعته · از انبار تهران
              </p>
            </div>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="border-t border-line px-5 sm:px-8">
          <div className="-mb-px flex gap-1" role="tablist" aria-label="اطلاعات محصول">
            {([["specs", "مشخصات فنی کامل"], ["box", "اقلام همراه"], ["shipping", "ارسال و مرجوعی"]] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`border-b-2 px-3 py-3.5 text-[11px] font-extrabold tracking-wider transition-colors sm:px-4 ${
                  tab === t ? "border-sea text-ink" : "border-transparent text-mist hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-7">
            {tab === "specs" && (
              <div className="space-y-5">
                <SpecTable laptop={laptop} />
                <ProsCons laptop={laptop} />
                <HardwareExploded laptop={laptop} />
              </div>
            )}
            {tab === "box" && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {laptop.inBox.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 rounded-xl border border-line bg-foam px-3.5 py-2.5 text-sm">
                    <ICheck size={14} className="shrink-0 text-moss" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {tab === "shipping" && (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["ارسال رایگان ۴۸ ساعته", "سفارش‌های بالای ۱۵۰ میلیون ریال با پیک اختصاصی و امضای گیرنده؛ بقیه با تیپاکس یا پست ویژه (۲ تا ۴ روز کاری)."],
                  ["۷ روز مرجوعی", "مرجوعی بدون قیدوشرط با برچسب رایگان. مبلغ حداکثر ۳ روز کاری پس از رسیدن دستگاه برمی‌گردد."],
                  ["پوشش دوگانه گارانتی", "ابتدا گارانتی رسمی سازنده؛ سپس پوشش ۲ ساله کورهِوس برای بدنه، لولا و باتری."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border border-line bg-foam p-4">
                    <p className="font-display text-sm font-bold tracking-wide">{t}</p>
                    <p className="mt-1.5 text-xs leading-6 text-mist">{d}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* کالاهای مرتبط */}
        {related.length > 0 && (
          <div className="rounded-b-3xl border-t border-line bg-foam px-5 py-6 sm:px-8">
            <Reveal>
              <p className="text-[11px] font-extrabold tracking-wider text-mist">دستگاه‌های بیشتر در دسته «{laptop.category}»</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <button key={r.id} onClick={() => onOpen(r.id)} className="group flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 text-right transition-colors hover:border-sea">
                    <img src={r.image} alt="" className="h-14 shrink-0 rounded-lg object-cover" style={{ width: 72 }} loading="lazy" />
                    <span>
                      <span className="block font-display text-xs font-bold leading-snug group-hover:text-sea">{r.shortName}</span>
                      <span className="text-[11px] text-mist">{fmt(r.price)}</span>
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
