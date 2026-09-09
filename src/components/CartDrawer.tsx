import { useState } from "react";
import { FREE_SHIPPING_THRESHOLD, WARRANTY_PRICE, cartTotals, fmt, toFa, type CartLine } from "../data/laptops";
import { useEscape, useLockBody } from "../lib/motion";
import { IArrowR, IClose, ILock, IMinus, IPlus, ITrash, ITruck } from "./icons";

interface CartDrawerProps {
  lines: CartLine[];
  promo: string | null;
  enableTax: boolean;
  onApplyPromo: (code: string) => string | null;
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onToggleWarranty: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ lines, promo, enableTax, onApplyPromo, onClose, onSetQty, onRemove, onToggleWarranty, onCheckout }: CartDrawerProps) {
  const [code, setCode] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useLockBody(true);
  useEscape(true, onClose);

  const t = cartTotals(lines, promo, enableTax);
  const toFree = Math.max(0, FREE_SHIPPING_THRESHOLD - (t.subtotal - t.discount));

  const tryPromo = () => {
    const err = onApplyPromo(code.trim().toUpperCase());
    if (err) setPromoMsg({ ok: false, text: err });
    else {
      setPromoMsg({ ok: true, text: `کد ${code.trim().toUpperCase()} اعمال شد ✓` });
      setCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="سبد خرید">
      <div className="overlay-in absolute inset-0 bg-deep/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="panel-in absolute left-0 top-0 flex h-full w-[min(430px,94vw)] flex-col border-e border-line bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-line bg-foam/70 px-5 py-4">
          <h2 className="font-display text-2xl text-ink">
            سبد خرید <span className="text-base text-mist">({toFa(t.count)} کالا)</span>
          </h2>
          <button onClick={onClose} aria-label="بستن سبد خرید" className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-sea hover:text-sea">
            <IClose size={17} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-skywash text-sea"><ITruck size={28} /></span>
            <p className="font-display text-2xl text-ink">سبد شما خالی است.</p>
            <p className="text-sm leading-6 text-mist">ده دستگاه بنچمارک‌شده در ویترین منتظر شماست.</p>
            <button onClick={onClose} className="mt-2 rounded-full bg-sea px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-seadark">
              مشاهده ویترین
            </button>
          </div>
        ) : (
          <>
            <div className="thin-scroll flex-1 overflow-y-auto px-5 py-4">
              {toFree > 0 ? (
                <div className="mb-4 rounded-xl border border-dashed border-sea/40 bg-skywash/50 p-3">
                  <p className="flex items-center gap-2 text-[11px] font-bold text-seadark">
                    <ITruck size={14} className="text-sea" /> تا ارسال رایگان ۴۸ ساعته: {fmt(toFree)}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/70">
                    <div className="h-full rounded-full bg-sea transition-[width] duration-500" style={{ width: `${Math.min(100, ((t.subtotal - t.discount) / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                  </div>
                </div>
              ) : (
                <p className="mb-4 flex items-center gap-2 rounded-xl border border-moss/40 bg-moss/10 p-3 text-[11px] font-bold text-moss">
                  <ITruck size={14} /> ارسال رایگان ۴۸ ساعته فعال شد ✓
                </p>
              )}

              <ul className="space-y-3">
                {lines.map(({ laptop, qty, warranty }) => (
                  <li key={laptop.id} className="rise-in rounded-2xl border border-line bg-foam/50 p-3">
                    <div className="flex gap-3">
                      <img src={laptop.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm leading-6">{laptop.name}</p>
                        <p className="font-mono text-[10px] text-mist" dir="ltr">{laptop.sku}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-line bg-card">
                            <button onClick={() => onSetQty(laptop.id, qty - 1)} aria-label="کاهش تعداد" className="px-2.5 py-1.5 hover:text-sea"><IMinus size={12} /></button>
                            <span className="w-7 text-center text-xs font-bold">{toFa(qty)}</span>
                            <button onClick={() => onSetQty(laptop.id, Math.min(laptop.stock, qty + 1))} aria-label="افزایش تعداد" className="px-2.5 py-1.5 hover:text-sea"><IPlus size={12} /></button>
                          </div>
                          <p className="text-sm font-extrabold">{fmt((laptop.price + (warranty ? WARRANTY_PRICE : 0)) * qty)}</p>
                        </div>
                      </div>
                      <button onClick={() => onRemove(laptop.id)} aria-label={`حذف ${laptop.name}`} className="self-start rounded-full p-1.5 text-mist transition-colors hover:bg-coral/10 hover:text-coral">
                        <ITrash size={15} />
                      </button>
                    </div>
                    <label className="mt-2.5 flex cursor-pointer items-center gap-2 border-t border-dashed border-line pt-2.5 text-xs text-mist">
                      <input type="checkbox" checked={warranty} onChange={() => onToggleWarranty(laptop.id)} className="h-3 w-3 accent-[#0477b3]" />
                      پوشش حوادث ({fmt(WARRANTY_PRICE)} برای هر دستگاه)
                    </label>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                {promo ? (
                  <p className="flex items-center justify-between rounded-xl border border-moss/40 bg-moss/10 px-3 py-2.5 text-[11px] font-bold text-moss">
                    کد تخفیف {promo} اعمال شده است
                    <button onClick={() => { onApplyPromo(""); setPromoMsg(null); }} className="underline underline-offset-2 hover:opacity-70">حذف</button>
                  </p>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && tryPromo()}
                        placeholder="کد تخفیف (مثلاً CORE10)"
                        aria-label="کد تخفیف"
                        dir="ltr"
                        className="min-w-0 flex-1 rounded-full border border-line bg-card px-4 py-2.5 text-start font-mono text-xs outline-none transition-colors focus:border-sea"
                      />
                      <button onClick={tryPromo} className="rounded-full border border-sea px-5 text-xs font-bold text-seadark transition-colors hover:bg-sea hover:text-white">
                        اعمال
                      </button>
                    </div>
                    {promoMsg && (
                      <p className={`mt-1.5 text-[10px] font-bold ${promoMsg.ok ? "text-moss" : "text-coral"}`}>{promoMsg.text}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-line bg-foam/70 px-5 py-4">
              <dl className="space-y-1.5 text-xs text-mist">
                <div className="flex justify-between"><dt>جمع کالاها</dt><dd className="font-bold text-ink">{fmt(t.subtotal)}</dd></div>
                {t.discount > 0 && <div className="flex justify-between text-moss"><dt>تخفیف</dt><dd className="font-bold">{fmt(t.discount)}−</dd></div>}
                <div className="flex justify-between"><dt>هزینه ارسال</dt><dd className={`font-bold ${t.shipping === 0 ? "text-moss" : "text-ink"}`}>{t.shipping === 0 ? "رایگان" : fmt(t.shipping)}</dd></div>
                <div className="flex justify-between"><dt>مالیات بر ارزش افزوده (۱۰٪)</dt><dd className="font-bold text-ink">{fmt(t.tax)}</dd></div>
              </dl>
              <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
                <span className="text-[11px] font-extrabold tracking-wide text-mist">مبلغ قابل پرداخت</span>
                <span className="text-xl font-extrabold text-seadark">{fmt(t.total)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-sea py-3.5 text-sm font-extrabold text-white transition-all hover:bg-seadark hover:shadow-lg active:scale-[0.98]"
              >
                <ILock size={15} /> ادامه و پرداخت امن <IArrowR size={15} className="rotate-180" />
              </button>
              <p className="mt-2 text-center text-[10px] font-medium tracking-wide text-mist">رمزنگاری ۲۵۶ بیتی · درگاه رسمی شتاب · اطلاعات کارت نزد ما ذخیره نمی‌شود</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
