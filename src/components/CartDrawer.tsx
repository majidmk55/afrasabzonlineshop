import { useState } from "react";
import { FREE_SHIPPING_THRESHOLD, WARRANTY_PRICE, cartTotals, fmt, type CartLine } from "../data/laptops";
import { useEscape, useLockBody } from "../lib/motion";
import { IArrowR, IClose, ILock, IMinus, IPlus, ITrash, ITruck } from "./icons";

interface CartDrawerProps {
  lines: CartLine[];
  promo: string | null;
  onApplyPromo: (code: string) => string | null; // returns error message or null on success
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onToggleWarranty: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ lines, promo, onApplyPromo, onClose, onSetQty, onRemove, onToggleWarranty, onCheckout }: CartDrawerProps) {
  const [code, setCode] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useLockBody(true);
  useEscape(true, onClose);

  const t = cartTotals(lines, promo);
  const toFree = Math.max(0, FREE_SHIPPING_THRESHOLD - (t.subtotal - t.discount));

  const tryPromo = () => {
    const err = onApplyPromo(code.trim().toUpperCase());
    if (err) setPromoMsg({ ok: false, text: err });
    else {
      setPromoMsg({ ok: true, text: `CODE ${code.trim().toUpperCase()} APPLIED` });
      setCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="overlay-in absolute inset-0 bg-coal/70" onClick={onClose} />
      <aside className="panel-in absolute right-0 top-0 flex h-full w-[min(430px,94vw)] flex-col border-l border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold tracking-tight">
            CART <span className="font-mono text-sm font-normal text-smoke">({t.count})</span>
          </h2>
          <button onClick={onClose} aria-label="Close cart" className="flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-ember hover:text-ember">
            <IClose size={17} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="font-display text-xl font-bold">CART'S EMPTY.</p>
            <p className="text-sm text-smoke">Ten benchmarked machines are waiting on the floor.</p>
            <button onClick={onClose} className="mt-2 bg-ink px-5 py-2.5 font-mono text-xs tracking-wider text-paper transition-colors hover:bg-ember">
              BROWSE THE FLOOR
            </button>
          </div>
        ) : (
          <>
            <div className="thin-scroll flex-1 overflow-y-auto px-5 py-4">
              {toFree > 0 ? (
                <div className="mb-4 border border-dashed border-line bg-card p-3">
                  <p className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-smoke">
                    <ITruck size={14} className="text-ember" /> {fmt(toFree)} AWAY FROM FREE 48-H SHIPPING
                  </p>
                  <div className="mt-2 h-1.5 bg-line/70">
                    <div className="h-full bg-ember transition-[width] duration-500" style={{ width: `${Math.min(100, ((t.subtotal - t.discount) / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                  </div>
                </div>
              ) : (
                <p className="mb-4 flex items-center gap-2 border border-moss/40 bg-moss/10 p-3 font-mono text-[11px] tracking-wider text-moss">
                  <ITruck size={14} /> FREE 48-H SHIPPING UNLOCKED
                </p>
              )}

              <ul className="space-y-3">
                {lines.map(({ laptop, qty, warranty }) => (
                  <li key={laptop.id} className="rise-in border border-line bg-card p-3">
                    <div className="flex gap-3">
                      <img src={laptop.image} alt="" className="h-16 w-22 shrink-0 object-cover" style={{ width: 88 }} loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-semibold">{laptop.name}</p>
                        <p className="font-mono text-[10px] tracking-wider text-smoke">{laptop.sku}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-line bg-paper">
                            <button onClick={() => onSetQty(laptop.id, qty - 1)} aria-label="Decrease" className="px-2 py-1 hover:text-ember"><IMinus size={12} /></button>
                            <span className="w-7 text-center font-mono text-xs">{qty}</span>
                            <button onClick={() => onSetQty(laptop.id, Math.min(laptop.stock, qty + 1))} aria-label="Increase" className="px-2 py-1 hover:text-ember"><IPlus size={12} /></button>
                          </div>
                          <p className="font-mono text-sm font-semibold">{fmt((laptop.price + (warranty ? WARRANTY_PRICE : 0)) * qty)}</p>
                        </div>
                      </div>
                      <button onClick={() => onRemove(laptop.id)} aria-label={`Remove ${laptop.name}`} className="self-start p-1 text-smoke transition-colors hover:text-ember">
                        <ITrash size={15} />
                      </button>
                    </div>
                    <label className="mt-2.5 flex cursor-pointer items-center gap-2 border-t border-dashed border-line pt-2.5 text-xs text-smoke">
                      <input type="checkbox" checked={warranty} onChange={() => onToggleWarranty(laptop.id)} className="h-3 w-3 accent-[#f4490f]" />
                      Accidental-damage cover (+{fmt(WARRANTY_PRICE)}/unit)
                    </label>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                {promo ? (
                  <p className="flex items-center justify-between border border-moss/40 bg-moss/10 px-3 py-2.5 font-mono text-[11px] tracking-wider text-moss">
                    CODE {promo} APPLIED
                    <button onClick={() => { onApplyPromo(""); setPromoMsg(null); }} className="underline underline-offset-2 hover:opacity-70">REMOVE</button>
                  </p>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && tryPromo()}
                        placeholder="PROMO CODE (TRY VOLT10)"
                        aria-label="Promo code"
                        className="min-w-0 flex-1 border border-line bg-card px-3 py-2.5 font-mono text-xs tracking-wider outline-none transition-colors focus:border-ink"
                      />
                      <button onClick={tryPromo} className="border border-ink px-4 font-mono text-xs tracking-wider transition-colors hover:bg-ink hover:text-paper">
                        APPLY
                      </button>
                    </div>
                    {promoMsg && (
                      <p className={`mt-1.5 font-mono text-[10px] tracking-wider ${promoMsg.ok ? "text-moss" : "text-ember"}`}>{promoMsg.text}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-line bg-card px-5 py-4">
              <dl className="space-y-1.5 font-mono text-xs text-smoke">
                <div className="flex justify-between"><dt>Subtotal</dt><dd className="text-ink">{fmt(t.subtotal)}</dd></div>
                {t.discount > 0 && <div className="flex justify-between text-moss"><dt>Discount</dt><dd>−{fmt(t.discount)}</dd></div>}
                <div className="flex justify-between"><dt>Shipping</dt><dd className={t.shipping === 0 ? "text-moss" : "text-ink"}>{t.shipping === 0 ? "FREE" : fmt(t.shipping)}</dd></div>
                <div className="flex justify-between"><dt>Est. tax (8%)</dt><dd className="text-ink">{fmt(t.tax)}</dd></div>
              </dl>
              <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-smoke">TOTAL</span>
                <span className="font-mono text-2xl font-semibold">{fmt(t.total)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="mt-4 flex w-full items-center justify-center gap-2 bg-ember py-3.5 font-mono text-sm font-semibold tracking-wider text-paper transition-all hover:bg-emberdim active:translate-y-0.5"
              >
                <ILock size={15} /> SECURE CHECKOUT <IArrowR size={15} />
              </button>
              <p className="mt-2 text-center font-mono text-[10px] tracking-wider text-smoke">256-BIT TLS · PCI-DSS LEVEL 1 · NO CARD DATA TOUCHES US</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
