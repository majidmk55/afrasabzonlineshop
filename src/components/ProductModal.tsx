import { useMemo, useState } from "react";
import { LAPTOPS, WARRANTY_PRICE, fmt, toFa, type Laptop } from "../data/laptops";
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
    <div className="space-y-7">
      {laptop.specs.map((group) => {
        const Icon = SPEC_ICONS[group.icon];
        return (
          <section key={group.title} aria-label={group.title}>
            <h4 className="flex items-center gap-2 border-b-2 border-sea pb-2 font-display text-base text-ink">
              {Icon && <Icon size={16} className="text-sea" />}
              {group.title}
            </h4>
            <dl>
              {group.rows.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 border-b border-line/70 py-2.5 sm:flex-row sm:gap-4">
                  <dt className="w-48 shrink-0 text-[11px] font-bold text-mist">{k}</dt>
                  <dd className="text-[13px] leading-6 text-ink" dir="auto">{v}</dd>
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
      { label: "عملکرد پردازشی", v: 72 + (h % 26) },
      { label: "کیفیت نمایشگر", v: 78 + ((h >> 3) % 20) },
      { label: "عمر باتری", v: 55 + ((h >> 5) % 42) },
      { label: "بدنه و خنک‌کنندگی", v: 70 + ((h >> 7) % 28) },
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
      <div className="overlay-in fixed inset-0 bg-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="panel-in relative mx-auto my-6 w-[min(1060px,94vw)] overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-card/95 px-5 py-3 backdrop-blur-sm">
          <p className="text-[11px] font-bold text-mist">
            {laptop.brand} · شناسه کالا: <span dir="ltr" className="font-mono text-ink">{laptop.sku}</span>
          </p>
          <button onClick={onClose} aria-label="بستن جزئیات محصول" className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-sea hover:text-sea">
            <IClose size={17} />
          </button>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_1fr]">
          {/* image + benchmarks */}
          <div>
            <div className="group overflow-hidden rounded-2xl border border-line bg-skywash/50">
              <img src={laptop.image} alt={laptop.name} className="img-zoom aspect-[4/3] w-full object-cover" />
            </div>

            <div className="mt-5 rounded-2xl border border-line bg-foam/70 p-4">
              <p className="flex items-center justify-between text-[11px] font-extrabold tracking-wide text-mist">
                امتیاز آزمایشگاه کورهِوس
                <span className="text-base font-extrabold text-sea">{toFa(Math.round(laptop.rating * 20))} از ۱۰۰</span>
              </p>
              <div className="mt-3 space-y-2.5">
                {benchmarks.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-[10px] font-bold text-mist">
                      <span>{b.label}</span><span className="text-ink">{toFa(b.v)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line/70">
                      <div className="h-full rounded-full bg-sea transition-[width] duration-700" style={{ width: `${b.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-6 text-mist">
                حاصل تست ۴۲ مرحله‌ای: Cinebench R24، بنچمارک گرافیک، تست حرارتی ۳۰ دقیقه‌ای با سقف نویز ۴۰ دسی‌بل و کالیبراسیون نمایشگر تا ΔE کمتر از ۲.
              </p>
            </div>
          </div>

          {/* buy panel */}
          <div>
            <p className="text-[11px] font-extrabold tracking-wide text-sea">{laptop.category} · مدل {toFa(laptop.year)}</p>
            <h2 className="mt-2 font-display text-3xl leading-[1.25] text-ink">{laptop.name}</h2>
            <p className="mt-2 text-sm leading-7 text-mist">{laptop.tagline}</p>

            <div className="mt-3 flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-sea">
                {[1, 2, 3, 4, 5].map((i) => <IStar key={i} size={14} filled={i <= Math.round(laptop.rating)} className={i <= Math.round(laptop.rating) ? "" : "opacity-25"} />)}
              </span>
              <span className="text-xs text-mist">{toFa(laptop.rating)} · {toFa(laptop.reviews)} دیدگاه ثبت‌شده</span>
            </div>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {laptop.highlights.map((h) => (
                <li key={h} dir="ltr" className="rounded-full bg-skywash/70 px-2.5 py-1 text-[11px] font-medium text-seadark">{h}</li>
              ))}
            </ul>

            <div className="mt-5 rounded-2xl border border-line bg-foam/60 p-4">
              <div className="flex items-end justify-between gap-3">
                <p className="text-2xl font-extrabold text-ink">
                  {fmt(laptop.price)}
                  {laptop.oldPrice && <span className="ms-2 text-base font-normal text-mist line-through">{fmt(laptop.oldPrice)}</span>}
                </p>
                <p className={`flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold ${laptop.stock <= 5 ? "text-coral" : "text-moss"}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${laptop.stock <= 5 ? "bg-coral" : "dot-live bg-moss"}`} />
                  {laptop.stock <= 5 ? `فقط ${toFa(laptop.stock)} عدد` : `${toFa(laptop.stock)} عدد موجود`}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <div className="flex items-center rounded-full border border-line bg-card">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="کاهش تعداد" className="px-3 py-2.5 transition-colors hover:text-sea"><IMinus size={14} /></button>
                  <span className="w-8 text-center text-sm font-bold">{toFa(qty)}</span>
                  <button onClick={() => setQty((q) => Math.min(laptop.stock, q + 1))} aria-label="افزایش تعداد" className="px-3 py-2.5 transition-colors hover:text-sea"><IPlus size={14} /></button>
                </div>
                <button
                  onClick={() => onToggleCompare(laptop.id)}
                  aria-pressed={compared}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-bold transition-all active:scale-95 ${
                    compared ? "border-sea bg-sea text-white" : "border-line bg-card text-mist hover:border-sea hover:text-sea"
                  }`}
                >
                  <ICompare size={14} /> {compared ? "در لیست مقایسه" : "افزودن به مقایسه"}
                </button>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-dashed border-sea/40 bg-card p-3 text-sm transition-colors hover:border-sea">
                <input type="checkbox" checked={warranty} onChange={(e) => setWarranty(e.target.checked)} className="mt-1 h-3.5 w-3.5 accent-[#0477b3]" />
                <span>
                  <span className="font-bold">پوشش حوادث (ضربه و مایعات) × {toFa(qty)}</span>
                  <span className="block text-[11px] text-mist">شکست پنل، ریختن مایعات و ضربه — هر دستگاه {fmt(WARRANTY_PRICE)}</span>
                </span>
              </label>

              <button
                onClick={add}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold transition-all active:scale-[0.98] ${
                  added ? "bg-moss text-white" : "bg-sea text-white hover:bg-seadark hover:shadow-lg"
                }`}
              >
                {added ? <><ICheck size={16} /> به سبد اضافه شد</> : <>افزودن {toFa(qty)} دستگاه به سبد — {fmt(laptop.price * qty + (warranty ? WARRANTY_PRICE * qty : 0))}</>}
              </button>
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wide text-mist">
                <ITruck size={13} /> ارسال رایگان ۴۸ ساعته · از آزمایشگاه تهران
              </p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="border-t border-line px-5 sm:px-8">
          <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="اطلاعات محصول">
            {([["specs", "مشخصات فنی کامل"], ["box", "اقلام همراه جعبه"], ["shipping", "ارسال، مرجوعی و گارانتی"]] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-[12px] font-bold transition-colors ${
                  tab === t ? "border-sea text-seadark" : "border-transparent text-mist hover:text-ink"
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
                  <li key={item} className="flex items-center gap-2.5 rounded-xl border border-line bg-foam/60 px-3.5 py-2.5 text-sm">
                    <ICheck size={14} className="shrink-0 text-moss" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {tab === "shipping" && (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["ارسال رایگان ۴۸ ساعته", "سفارش‌های بالای ۱۵۰ میلیون ریال با پیک اختصاصی و امضای تحویل‌گیرنده؛ بقیه سفارش‌ها با تیپاکس یا پست ویژه (۲ تا ۴ روز کاری). همه مرسولات بیمه کامل دارند."],
                  ["۷ روز مرجوعی", "مرجوعی بدون قیدوشرط با برچسب رایگان. مبلغ حداکثر ۳ روز کاری پس از رسیدن دستگاه به آزمایشگاه برگشت می‌خورد."],
                  ["گارانتی دولایه", "گارانتی رسمی سازنده ابتدا اجرا می‌شود؛ پوشش ۲ ساله کورهِوس بدنه، لولا و باتری را پس از آن تضمین می‌کند."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-xl border border-line bg-foam/60 p-4">
                    <p className="font-display text-base text-ink">{t}</p>
                    <p className="mt-1.5 text-xs leading-6 text-mist">{d}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="border-t border-line bg-foam/60 px-5 py-6 sm:px-8">
            <Reveal>
              <p className="text-[11px] font-extrabold tracking-wide text-mist">دستگاه‌های بیشتر در دسته {laptop.category}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <button key={r.id} onClick={() => onOpen(r.id)} className="group flex items-center gap-3 rounded-xl border border-line bg-card p-2.5 text-start transition-all hover:border-sea hover:shadow-md">
                    <img src={r.image} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" loading="lazy" />
                    <span>
                      <span className="block font-display text-sm leading-snug group-hover:text-sea">{r.shortName}</span>
                      <span className="text-[11px] font-bold text-mist">{fmt(r.price)}</span>
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
