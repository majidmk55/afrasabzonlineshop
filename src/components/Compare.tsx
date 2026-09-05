import { useMemo } from "react";
import { LAPTOPS, fmt, type Laptop } from "../data/laptops";
import { useEscape, useLockBody } from "../lib/motion";
import { IClose, ICompare, IStar } from "./icons";

const ROWS: [string, (l: Laptop) => string | number][] = [
  ["Price", (l) => fmt(l.price)],
  ["Lab rating", (l) => `${l.rating} / 5 (${l.reviews})`],
  ["CPU", (l) => l.brief.CPU],
  ["GPU", (l) => l.brief.GPU],
  ["Memory", (l) => l.brief.RAM],
  ["Storage", (l) => l.brief.Storage],
  ["Display", (l) => l.brief.Display],
  ["Battery", (l) => l.brief.Battery],
  ["Weight", (l) => l.brief.Weight],
  ["Ports", (l) => l.brief.Ports],
];

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
    <div className="panel-in fixed bottom-4 left-1/2 z-40 w-[min(680px,94vw)] -translate-x-1/2 border border-panel bg-coal shadow-2xl">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="hidden font-mono text-[10px] tracking-[0.2em] text-mist sm:block">COMPARE<br />TRAY</span>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto thin-scroll">
          {items.map((l) => (
            <span key={l.id} className="group relative shrink-0">
              <button onClick={() => onOpenProduct(l.id)} aria-label={`Open ${l.name}`} className="block h-12 w-16 overflow-hidden border border-panel transition-colors hover:border-ember">
                <img src={l.image} alt={l.shortName} className="h-full w-full object-cover" />
              </button>
              <button onClick={() => onRemove(l.id)} aria-label={`Remove ${l.shortName} from compare`} className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ember text-paper opacity-0 transition-opacity group-hover:opacity-100" style={{ width: 18, height: 18 }}>
                <IClose size={10} />
              </button>
            </span>
          ))}
          {items.length < 3 && (
            <span className="shrink-0 border border-dashed border-panel px-2.5 py-3 font-mono text-[10px] tracking-wider text-mist/60">+ {3 - items.length} SLOT{items.length < 2 ? "S" : ""} FREE</span>
          )}
        </div>
        <button onClick={onClear} className="shrink-0 font-mono text-[10px] tracking-wider text-mist underline-offset-4 hover:text-ember hover:underline">CLEAR</button>
        <button
          onClick={onOpen}
          disabled={items.length < 2}
          className="shrink-0 bg-ember px-4 py-2.5 font-mono text-[11px] font-semibold tracking-wider text-paper transition-all enabled:hover:bg-emberdim disabled:opacity-40"
        >
          COMPARE {items.length} →
        </button>
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
  const items = useMemo(() => ids.map((id) => LAPTOPS.find((l) => l.id === id)!).filter(Boolean), [ids]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Compare laptops">
      <div className="overlay-in fixed inset-0 bg-coal/70" onClick={onClose} />
      <div className="panel-in relative mx-auto my-6 w-[min(1100px,94vw)] border border-line bg-paper shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-5 py-3.5 backdrop-blur-sm">
          <h2 className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
            <ICompare size={19} className="text-ember" /> SIDE-BY-SIDE SPEC DUEL
          </h2>
          <button onClick={onClose} aria-label="Close compare" className="flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-ember hover:text-ember">
            <IClose size={17} />
          </button>
        </div>

        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-[1] w-40 border-b border-r border-line bg-card p-3 text-left font-mono text-[10px] tracking-[0.2em] text-smoke">SPEC</th>
                {items.map((l) => (
                  <th key={l.id} className="border-b border-r border-line bg-card p-3 text-left last:border-r-0">
                    <div className="relative">
                      <button onClick={() => onOpenProduct(l.id)} className="block w-full overflow-hidden border border-line bg-slab">
                        <img src={l.image} alt={l.name} className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105" />
                      </button>
                      <button onClick={() => onRemove(l.id)} aria-label={`Remove ${l.shortName}`} className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center bg-coal/80 text-paper transition-colors hover:bg-ember">
                        <IClose size={12} />
                      </button>
                      <p className="mt-2 font-display text-sm font-bold leading-snug">{l.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-smoke">
                        <IStar size={11} className="text-ember" /> {l.rating} · {l.reviews} reviews
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, get], ri) => {
                const values = items.map((l) => String(get(l)));
                const best = label === "Price" ? Math.min(...items.map((l) => l.price)) : null;
                return (
                  <tr key={label} className={ri % 2 ? "bg-card" : "bg-paper"}>
                    <th scope="row" className={`sticky left-0 z-[1] border-b border-r border-line p-3 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-smoke ${ri % 2 ? "bg-card" : "bg-paper"}`}>{label}</th>
                    {items.map((l, i) => (
                      <td key={l.id} className={`border-b border-r border-line p-3 font-mono text-xs leading-relaxed last:border-r-0 ${best !== null && l.price === best ? "bg-moss/10 font-semibold text-moss" : ""}`}>
                        {values[i]}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <th scope="row" className="sticky left-0 z-[1] border-r border-line bg-card p-3 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-smoke">Action</th>
                {items.map((l) => (
                  <td key={l.id} className="border-r border-line bg-card p-3 last:border-r-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-semibold">{fmt(l.price)}</span>
                      <button onClick={() => onAdd(l.id)} className="ml-auto bg-ink px-3.5 py-2 font-mono text-[10px] font-semibold tracking-wider text-paper transition-colors hover:bg-ember">
                        ADD TO CART
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
