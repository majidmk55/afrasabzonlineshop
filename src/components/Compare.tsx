import { type Laptop } from "../data/laptops";
import { IClose, ICompare } from "./icons";



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
      <div className="flex items-center gap-1.5">
        {laptops.map((l) => (
          <button key={l.id} onClick={() => onOpenProduct(l.id)} className="group relative" title={l.name}>
            <img src={l.image} alt={l.name} className="h-10 w-12 rounded-lg border border-line object-cover transition-transform hover:-translate-y-1" loading="lazy" />
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onRemove(l.id); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onRemove(l.id); } }}
              className="absolute -left-1 -top-1 flex items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-red-500"
              aria-label={`حذف ${l.name} از مقایسه`}
              style={{ width: 16, height: 16 }}
            >
              <IClose size={9} />
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


