import { fmt, type Laptop } from "../data/laptops";
import { Reveal, useEscape, useLockBody } from "../lib/motion";
import { ICart, IClose, ICompare } from "./icons";

const ROWS: [string, string][] = [
  ["قیمت", "price"],
  ["پردازنده", "پردازنده"],
  ["گرافیک", "گرافیک"],
  ["رم / حافظه", "رم / حافظه"],
  ["نمایشگر", "نمایشگر"],
  ["وزن", "وزن"],
];

export function CompareTray({ products, ids, onRemove, onClear, onOpen, onOpenProduct }: {
  products: Laptop[];
  ids: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpen: () => void;
  onOpenProduct: (id: string) => void;
}) {
  if (ids.length === 0) return null;
  const laptops = ids
    .map((id) => products.find((l) => l.id === id))
    .filter((l): l is Laptop => !!l);
  return (
    <div className="panel-in fixed bottom-5 left-1/2 z-40 flex max-w-[94vw] -translate-x-1/2 items-center gap-3 rounded-2xl border border-line bg-white/95 py-3 pl-4 pr-5 shadow-2xl backdrop-blur-sm">
      <span className="flex items-center gap-2 text-sm font-bold"><ICompare size={17} className="text-sea" /> مقایسه</span>
      <div className="flex items-center gap-2">
        {laptops.map((l) => (
          <button key={l.id} onClick={() => onOpenProduct(l.id)} className="group relative" title={l.name}>
            <img src={l.image} alt={l.name} className="h-11 w-14 rounded-lg border border-line object-cover transition-transform hover:-translate-y-1" loading="lazy" />
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onRemove(l.id); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onRemove(l.id); } }}
              className="absolute -left-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-red-500"
              aria-label={`حذف ${l.name} از مقایسه`}
              style={{ width: 18, height: 18 }}
            >
              <IClose size={10} />
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={onOpen}
        disabled={ids.length < 2}
        className="rounded-full bg-sea px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-seadeep disabled:opacity-40"
      >
        مقایسه کن ({ids.length.toLocaleString("fa-IR")})
      </button>
      <button onClick={onClear} className="text-[11px] font-bold text-mist underline underline-offset-4 hover:text-red-500">پاک کردن</button>
    </div>
  );
}

export function CompareModal({ products, ids, onClose, onRemove, onAdd, onOpenProduct, onOpenComparePage }: {
  products: Laptop[];
  ids: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onOpenComparePage?: () => void;
}) {
  useLockBody(true);
  useEscape(true, onClose);
  const laptops = ids.map((id) => products.find((l) => l.id === id)).filter((l): l is Laptop => !!l);
  const minPrice = Math.min(...laptops.map((l) => l.price));

  const valueOf = (l: Laptop, key: string): string => {
    if (key === "price") return fmt(l.price);
    return l.brief.find((b) => b[0] === key)?.[1] ?? "—";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="جدول مقایسه لپ‌تاپ‌ها">
      <div className="overlay-in fixed inset-0 bg-ink/70" onClick={onClose} />
      <div className="panel-in relative mx-auto my-6 w-[min(980px,95vw)] rounded-3xl border border-line bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">دوئل مشخصات</h2>
          <div className="flex items-center gap-2">
            {onOpenComparePage && (
              <button
                onClick={onOpenComparePage}
                className="rounded-full bg-sea px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-seadeep"
              >
                مقایسه پیشرفته
              </button>
            )}
            <button onClick={onClose} aria-label="بستن مقایسه" className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-red-400 hover:text-red-500">
              <IClose size={17} />
            </button>
          </div>
        </div>

        <div className="thin-scroll mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="w-36 rounded-tr-2xl border border-line bg-foam p-3 text-right text-[11px] font-extrabold text-mist">مشخصه</th>
                {laptops.map((l) => (
                  <th key={l.id} className="border border-line bg-white p-3 text-right align-top">
                    <div className="relative">
                      <button onClick={() => onRemove(l.id)} aria-label={`حذف ${l.name}`} className="absolute left-0 top-0 text-mist transition-colors hover:text-red-500"><IClose size={14} /></button>
                      <button onClick={() => onOpenProduct(l.id)} className="block w-full text-right">
                        <img src={l.image} alt={l.name} className="aspect-[4/3] w-full rounded-xl border border-line object-cover" loading="lazy" />
                        <span className="mt-2 block text-[10px] font-bold text-mist">{l.brand} · {l.category}</span>
                        <span className="mt-0.5 block font-display text-sm font-bold leading-snug hover:text-sea">{l.name}</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, key], ri) => {
                const best = key === "price" ? minPrice : null;
                return (
                  <tr key={key}>
                    <td className={`border border-line bg-foam p-3 text-[11px] font-extrabold text-mist ${ri === ROWS.length - 1 ? "rounded-br-2xl" : ""}`}>{label}</td>
                    {laptops.map((l) => {
                      const isBest = best !== null && l.price === best;
                      return (
                        <td key={l.id} className={`border border-line p-3 font-mono text-[12px] ${key === "price" ? (isBest ? "bg-moss/10 font-bold text-moss" : "") : ""}`}>
                          <span dir="auto">{valueOf(l, key)}</span>
                          {isBest && <span className="mr-2 rounded-full bg-moss px-2 py-0.5 text-[9px] font-bold text-white">بهترین قیمت</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td className="rounded-br-2xl border border-line bg-foam p-3 text-[11px] font-extrabold text-mist">خرید</td>
                {laptops.map((l) => (
                  <td key={l.id} className="border border-line p-3">
                    <button onClick={() => onAdd(l.id)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-xs font-bold text-white transition-colors hover:bg-sea">
                      <ICart size={14} /> افزودن به سبد
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <Reveal>
          <p className="mt-4 text-center text-[11px] text-mist">
            برای جدول کامل مشخصات هر دستگاه، روی نام آن کلیک کنید — تا {laptops.length.toLocaleString("fa-IR")} دستگاه قابل مقایسه است.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
