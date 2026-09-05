import { LAPTOPS, fmt, toFa, type Laptop } from "../data/laptops";
import { useEscape, useLockBody } from "../lib/motion";
import { ICart, IClose, ICompare, IEye, IStar } from "./icons";

export function CompareTray({ ids, onRemove, onClear, onOpen, onOpenProduct }: {
  ids: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpen: () => void;
  onOpenProduct: (id: string) => void;
}) {
  if (ids.length === 0) return null;
  const items = ids.map((id) => LAPTOPS.find((l) => l.id === id)!).filter(Boolean);
  return (
    <div className="panel-in fixed bottom-4 left-1/2 z-40 w-[min(620px,94vw)] -translate-x-1/2 rounded-2xl border border-line bg-card p-3 shadow-2xl shadow-sea/15">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sea text-white"><ICompare size={17} /></span>
        <span className="text-xs font-extrabold text-ink">مقایسه <span className="text-mist">({toFa(ids.length)} از ۳)</span></span>
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {items.map((l) => (
            <div key={l.id} className="group relative shrink-0">
              <button onClick={() => onOpenProduct(l.id)} className="block overflow-hidden rounded-lg border border-line transition-colors hover:border-sea" aria-label={l.name}>
                <img src={l.image} alt={l.shortName} className="h-11 w-16 object-cover" loading="lazy" />
              </button>
              <button
                onClick={() => onRemove(l.id)}
                aria-label={`حذف ${l.shortName} از مقایسه`}
                className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-deep text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-coral"
              >
                <IClose size={10} />
              </button>
            </div>
          ))}
          {items.length < 3 && (
            <span className="hidden whitespace-nowrap rounded-full border border-dashed border-line px-3 py-1.5 text-[10px] font-bold text-mist sm:block">
              دستگاه بعدی را از ویترین انتخاب کنید
            </span>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <button
            onClick={onOpen}
            disabled={ids.length < 2}
            className="rounded-full bg-sea px-4 py-2 text-[11px] font-extrabold text-white transition-all enabled:hover:bg-seadark enabled:active:scale-95 disabled:opacity-40"
          >
            مقایسه کن
          </button>
          <button onClick={onClear} className="text-[10px] font-bold text-mist underline-offset-2 hover:text-coral hover:underline">
            خالی‌کردن
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompareModal({ ids, onClose, onRemove, onAdd, onOpenProduct }: {
  ids: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
  onOpenProduct: (id: string) => void;
}) {
  useLockBody(true);
  useEscape(true, onClose);
  const items = ids.map((id) => LAPTOPS.find((l) => l.id === id)!).filter(Boolean);
  const keys = ["پردازنده", "گرافیک", "رم / حافظه", "نمایشگر", "وزن"];

  const best = (get: (l: Laptop) => number, mode: "min" | "max") => {
    const vals = items.map(get);
    const target = mode === "min" ? Math.min(...vals) : Math.max(...vals);
    return items.map((l) => get(l) === target).filter(Boolean).length === 1
      ? items.map((l) => get(l) === target)
      : items.map(() => false);
  };
  const bestPrice = best((l) => l.price, "min");
  const bestRating = best((l) => l.rating, "max");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="مقایسه لپ‌تاپ‌ها">
      <div className="overlay-in fixed inset-0 bg-deep/75 backdrop-blur-sm" onClick={onClose} />
      <div className="panel-in relative mx-auto my-6 w-[min(1080px,95vw)] overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-line bg-deep px-5 py-3.5 text-white">
          <p className="flex items-center gap-2 font-display text-xl"><ICompare size={18} className="text-sea" /> دوئل مشخصات — {toFa(items.length)} دستگاه</p>
          <button onClick={onClose} aria-label="بستن مقایسه" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white">
            <IClose size={16} />
          </button>
        </div>

        <div className="thin-scroll overflow-x-auto p-5 sm:p-6">
          <table className="w-full min-w-[680px] border-separate" style={{ borderSpacing: 0 }}>
            <thead>
              <tr>
                <th className="w-36 rounded-s-2xl border border-line bg-foam/70 p-3 text-start text-[11px] font-extrabold text-mist">شاخص</th>
                {items.map((l, i) => (
                  <th key={l.id} className={`border border-s-0 border-line bg-foam/70 p-3 text-start align-top ${i === items.length - 1 ? "rounded-e-2xl" : ""}`}>
                    <div className="relative">
                      <button onClick={() => onRemove(l.id)} aria-label={`حذف ${l.shortName}`} className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-line text-mist transition-colors hover:bg-coral hover:text-white">
                        <IClose size={11} />
                      </button>
                      <button onClick={() => onOpenProduct(l.id)} className="group block w-full text-start">
                        <img src={l.image} alt={l.name} className="aspect-[4/3] w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                        <span className="mt-2 block text-[10px] font-bold text-mist">{l.brand}</span>
                        <span className="block font-display text-base leading-snug group-hover:text-sea">{l.shortName}</span>
                      </button>
                      <span className="mt-1 flex items-center gap-1 text-sea">
                        {[1, 2, 3, 4, 5].map((s) => <IStar key={s} size={11} filled={s <= Math.round(l.rating)} className={s <= Math.round(l.rating) ? "" : "opacity-25"} />)}
                        <span className={`ms-1 text-[10px] font-bold ${bestRating[i] ? "text-moss" : "text-mist"}`}>{toFa(l.rating)}</span>
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((k, ri) => (
                <tr key={k}>
                  <th scope="row" className={`border border-t-0 border-line bg-foam/40 p-3 text-start text-[11px] font-extrabold text-mist ${ri === keys.length - 1 ? "rounded-es-2xl" : ""}`}>{k}</th>
                  {items.map((l, i) => {
                    const val = l.brief.find(([key]) => key === k)?.[1] ?? "—";
                    return (
                      <td key={l.id} className={`border border-s-0 border-t-0 border-line p-3 align-top text-[12px] leading-6 text-ink ${ri === keys.length - 1 && i === items.length - 1 ? "rounded-ee-2xl" : ""}`} dir="auto">
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <th scope="row" className="border border-t-0 border-line bg-foam/40 p-3 text-start text-[11px] font-extrabold text-mist">قیمت</th>
                {items.map((l, i) => (
                  <td key={l.id} className="border border-s-0 border-t-0 border-line p-3">
                    <span className={`text-sm font-extrabold ${bestPrice[i] ? "text-moss" : "text-ink"}`}>{fmt(l.price)}</span>
                    {bestPrice[i] && <span className="ms-2 rounded-full bg-moss/15 px-2 py-0.5 text-[9px] font-bold text-moss">بهترین قیمت</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="rounded-es-2xl border border-t-0 border-line bg-foam/40 p-3 text-start text-[11px] font-extrabold text-mist">خرید</th>
                {items.map((l, i) => (
                  <td key={l.id} className={`border border-s-0 border-t-0 border-line p-3 ${i === items.length - 1 ? "rounded-ee-2xl" : ""}`}>
                    <button onClick={() => onAdd(l.id)} className="flex items-center gap-1.5 rounded-full bg-sea px-4 py-2 text-[11px] font-extrabold text-white transition-all hover:bg-seadark active:scale-95">
                      <ICart size={13} /> افزودن به سبد
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-line bg-foam/50 px-4 py-3">
            <p className="text-[11px] font-bold text-mist">
              دنبال جدول کامل‌تری هستید؟ مشخصات فنی هر دستگاه ۸ بخش و بیش از ۴۰ ردیف دارد.
            </p>
            <button onClick={() => onOpenProduct(items[0].id)} className="flex shrink-0 items-center gap-1.5 rounded-full border border-sea px-4 py-2 text-[11px] font-extrabold text-seadark transition-colors hover:bg-sea hover:text-white">
              <IEye size={13} /> جدول کامل {items[0].shortName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
