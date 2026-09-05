import { useMemo, useState } from "react";
import { cardBrand, cartTotals, fmt2, luhn, type CartLine } from "../data/laptops";
import { prefersReducedMotion, useEscape, useLockBody } from "../lib/motion";
import { AmexMark, BankMark, ICheck, IClose, ILock, McMark, PaypalMark, VisaMark } from "./icons";

const STEPS = ["DELIVERY", "PAYMENT", "REVIEW"];

interface CheckoutProps {
  lines: CartLine[];
  promo: string | null;
  onApplyPromo: (code: string) => string | null;
  onClose: () => void;
  onComplete: () => void; // clears the cart after success screen is dismissed
}

interface FormState {
  email: string; first: string; last: string; address: string; city: string; zip: string; country: string;
  method: "card" | "paypal" | "bank";
  cardName: string; cardNum: string; expiry: string; cvc: string;
}

const initialForm: FormState = {
  email: "", first: "", last: "", address: "", city: "", zip: "", country: "United States",
  method: "card", cardName: "", cardNum: "", expiry: "", cvc: "",
};

export default function Checkout({ lines, promo, onApplyPromo, onClose, onComplete }: CheckoutProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");
  const [orderId, setOrderId] = useState("");
  const [code, setCode] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useLockBody(true);
  useEscape(true, () => { if (phase !== "processing") onClose(); });

  const t = useMemo(() => cartTotals(lines, promo), [lines, promo]);
  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const validateDelivery = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (form.first.trim().length < 2) e.first = "Required";
    if (form.last.trim().length < 2) e.last = "Required";
    if (form.address.trim().length < 5) e.address = "Street address required";
    if (form.city.trim().length < 2) e.city = "Required";
    if (form.zip.trim().length < 3) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (form.method !== "card") return true;
    const e: Record<string, string> = {};
    if (form.cardName.trim().length < 3) e.cardName = "Name on card required";
    if (!luhn(form.cardNum)) e.cardNum = "Card number failed checksum";
    const m = form.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!m) e.expiry = "MM/YY";
    else {
      const mo = Number(m[1]);
      const yr = 2000 + Number(m[2]);
      const now = new Date();
      if (mo < 1 || mo > 12) e.expiry = "Invalid month";
      else if (yr < now.getFullYear() || (yr === now.getFullYear() && mo < now.getMonth() + 1)) e.expiry = "Card expired";
    }
    if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = "3–4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateDelivery()) return;
    if (step === 1 && !validatePayment()) return;
    setStep((s) => Math.min(2, s + 1));
  };

  const pay = () => {
    setPhase("processing");
    setTimeout(() => {
      setOrderId(`CH-2026-${String(Math.floor(1000 + Math.random() * 9000))}`);
      setPhase("done");
    }, prefersReducedMotion() ? 300 : 2000);
  };

  const brand = cardBrand(form.cardNum);
  const inputCls = (k: string) =>
    `w-full border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink ${errors[k] ? "border-ember" : "border-line"}`;
  const Err = ({ k }: { k: string }) =>
    errors[k] ? <p className="mt-1 font-mono text-[10px] tracking-wider text-ember">▲ {errors[k].toUpperCase()}</p> : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Secure checkout">
      <div className="overlay-in fixed inset-0 bg-coal/80" onClick={() => phase !== "processing" && onClose()} />
      <div className="panel-in relative mx-auto my-6 w-[min(920px,94vw)] border border-line bg-paper shadow-2xl">
        {/* portal header */}
        <div className="dark-panel flex flex-wrap items-center justify-between gap-3 border-b border-panel px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-ember text-paper"><ILock size={17} /></span>
            <div>
              <p className="font-display text-sm font-bold tracking-wide text-paper">COREHAUS PAYMENT PORTAL</p>
              <p className="font-mono text-[10px] tracking-wider text-mist">TLS 1.3 · PCI-DSS L1 · 3-D SECURE READY</p>
            </div>
          </div>
          {phase === "form" && (
            <ol className="flex items-center gap-1.5" aria-label="Checkout progress">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-1.5">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] tracking-wider transition-colors ${
                      i === step ? "border-ember bg-ember text-paper" : i < step ? "border-moss/60 text-moss" : "border-panel text-mist/60"
                    }`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    {i < step ? <ICheck size={11} /> : <span>{i + 1}</span>} {s}
                  </button>
                  {i < STEPS.length - 1 && <span className="h-px w-4 bg-panel" />}
                </li>
              ))}
            </ol>
          )}
          {phase !== "processing" && (
            <button onClick={onClose} aria-label="Close checkout" className="flex h-9 w-9 items-center justify-center border border-panel text-mist transition-colors hover:border-ember hover:text-ember">
              <IClose size={16} />
            </button>
          )}
        </div>

        {/* processing */}
        {phase === "processing" && (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
            <span className="spin-slow flex h-14 w-14 items-center justify-center border-2 border-ember border-t-transparent rounded-full" aria-hidden="true" />
            <p className="font-display text-xl font-bold tracking-wide">TALKING TO YOUR BANK…</p>
            <p className="max-w-sm font-mono text-[11px] leading-relaxed tracking-wider text-smoke">
              ENCRYPTING SESSION → 3-D SECURE CHALLENGE → RESERVING STOCK. DO NOT CLOSE THIS WINDOW.
            </p>
          </div>
        )}

        {/* success */}
        {phase === "done" && (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="rise-in flex h-16 w-16 items-center justify-center rounded-full bg-moss text-paper"><ICheck size={30} /></span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight">ORDER CONFIRMED.</h2>
            <p className="mt-2 font-mono text-sm text-smoke">
              <span className="bg-ink px-2 py-0.5 text-paper">{orderId}</span> · receipt sent to {form.email || "your inbox"}
            </p>
            <div className="mt-6 w-full max-w-md border border-line bg-card p-4 text-left">
              <p className="flex justify-between font-mono text-xs text-smoke"><span>{t.count} ITEM{t.count > 1 ? "S" : ""} · {form.method === "card" ? (brand ?? "card").toUpperCase() : form.method.toUpperCase()}</span><span>{fmt2(t.total)}</span></p>
              <p className="mt-1 flex justify-between font-mono text-xs text-smoke"><span>SHIP TO</span><span className="text-right">{form.first} {form.last}, {form.city}</span></p>
              <p className="mt-1 flex justify-between font-mono text-xs text-smoke"><span>ETA</span><span className="text-moss">48-HOUR EXPRESS</span></p>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-smoke">
              Your machine enters the 42-point bench queue now. You'll get the calibration report by email before it ships.
            </p>
            <button
              onClick={() => { onComplete(); onClose(); }}
              className="mt-6 bg-ink px-7 py-3 font-mono text-xs font-semibold tracking-wider text-paper transition-colors hover:bg-ember"
            >
              BACK TO THE FLOOR
            </button>
          </div>
        )}

        {/* form steps */}
        {phase === "form" && (
          <div className="grid lg:grid-cols-[1fr_320px]">
            <div className="p-5 sm:p-7">
              {step === 0 && (
                <div className="rise-in space-y-4">
                  <h3 className="font-display text-xl font-bold tracking-tight">WHERE'S IT HEADED?</h3>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">EMAIL</label>
                    <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@studio.dev" className={inputCls("email")} autoComplete="email" />
                    <Err k="email" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">FIRST NAME</label>
                      <input value={form.first} onChange={(e) => set("first", e.target.value)} className={inputCls("first")} autoComplete="given-name" />
                      <Err k="first" />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">LAST NAME</label>
                      <input value={form.last} onChange={(e) => set("last", e.target.value)} className={inputCls("last")} autoComplete="family-name" />
                      <Err k="last" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">STREET ADDRESS</label>
                    <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="4096 Kernel Avenue, Apt 12" className={inputCls("address")} autoComplete="street-address" />
                    <Err k="address" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">CITY</label>
                      <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls("city")} autoComplete="address-level2" />
                      <Err k="city" />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">ZIP</label>
                      <input value={form.zip} onChange={(e) => set("zip", e.target.value)} className={inputCls("zip")} autoComplete="postal-code" />
                      <Err k="zip" />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">COUNTRY</label>
                      <select value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls("country")}>
                        <option>United States</option><option>Canada</option><option>United Kingdom</option><option>Germany</option><option>Australia</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={next} className="w-full bg-ink py-3.5 font-mono text-xs font-semibold tracking-wider text-paper transition-colors hover:bg-ember">
                    CONTINUE TO PAYMENT →
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="rise-in space-y-4">
                  <h3 className="font-display text-xl font-bold tracking-tight">HOW ARE YOU PAYING?</h3>
                  <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Payment method">
                    {([["card", "CARD"], ["paypal", "PAYPAL"], ["bank", "TRANSFER"]] as const).map(([m, label]) => (
                      <button
                        key={m}
                        role="tab"
                        aria-selected={form.method === m}
                        onClick={() => set("method", m)}
                        className={`border px-3 py-3 font-mono text-[11px] tracking-wider transition-all ${
                          form.method === m ? "border-ember bg-ember text-paper" : "border-line bg-card hover:border-ink"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {form.method === "card" && (
                    <div className="space-y-4 border border-line bg-card p-4">
                      <div>
                        <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">CARD NUMBER</label>
                        <div className="relative">
                          <input
                            value={form.cardNum}
                            onChange={(e) => set("cardNum", formatCard(e.target.value))}
                            placeholder="4242 4242 4242 4242"
                            inputMode="numeric"
                            className={`${inputCls("cardNum")} pr-14 font-mono`}
                            autoComplete="cc-number"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2">
                            {brand === "visa" && <VisaMark />}
                            {brand === "mastercard" && <McMark />}
                            {brand === "amex" && <AmexMark />}
                          </span>
                        </div>
                        <Err k="cardNum" />
                        <p className="mt-1 font-mono text-[10px] text-smoke">DEMO: 4242 4242 4242 4242 PASSES Luhn</p>
                      </div>
                      <div>
                        <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">NAME ON CARD</label>
                        <input value={form.cardName} onChange={(e) => set("cardName", e.target.value)} className={inputCls("cardName")} autoComplete="cc-name" />
                        <Err k="cardName" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">EXPIRY</label>
                          <input value={form.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} placeholder="MM/YY" inputMode="numeric" className={`${inputCls("expiry")} font-mono`} autoComplete="cc-exp" />
                          <Err k="expiry" />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] tracking-[0.18em] text-smoke">CVC</label>
                          <input value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" inputMode="numeric" className={`${inputCls("cvc")} font-mono`} autoComplete="cc-csc" />
                          <Err k="cvc" />
                        </div>
                      </div>
                    </div>
                  )}

                  {form.method === "paypal" && (
                    <div className="border border-line bg-card p-4">
                      <p className="flex items-center gap-3"><PaypalMark /> <span className="text-sm">You'll authorize the payment in a PayPal window after review. (Demo: continues straight to review.)</span></p>
                    </div>
                  )}
                  {form.method === "bank" && (
                    <div className="border border-line bg-card p-4">
                      <p className="flex items-center gap-3"><BankMark /> <span className="text-sm">Instant SEPA / ACH transfer via your bank's OAuth. (Demo: continues straight to review.)</span></p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="border border-line px-5 py-3.5 font-mono text-xs tracking-wider transition-colors hover:border-ink">← BACK</button>
                    <button onClick={next} className="flex-1 bg-ink py-3.5 font-mono text-xs font-semibold tracking-wider text-paper transition-colors hover:bg-ember">
                      REVIEW ORDER →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="rise-in space-y-4">
                  <h3 className="font-display text-xl font-bold tracking-tight">FINAL CHECK BEFORE WE PULL THE TRIGGER.</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border border-line bg-card p-4">
                      <p className="font-mono text-[10px] tracking-[0.18em] text-smoke">DELIVER TO</p>
                      <p className="mt-1.5 text-sm font-semibold">{form.first} {form.last}</p>
                      <p className="text-xs text-smoke">{form.address}, {form.city} {form.zip}, {form.country}</p>
                      <p className="text-xs text-smoke">{form.email}</p>
                    </div>
                    <div className="border border-line bg-card p-4">
                      <p className="font-mono text-[10px] tracking-[0.18em] text-smoke">PAYMENT</p>
                      <p className="mt-1.5 text-sm font-semibold">
                        {form.method === "card" ? `${(brand ?? "card").toUpperCase()} •••• ${form.cardNum.replace(/\D/g, "").slice(-4)}` : form.method === "paypal" ? "PayPal" : "Bank transfer"}
                      </p>
                      <p className="text-xs text-smoke">{form.method === "card" ? `Expires ${form.expiry}` : "Authorized at confirmation"}</p>
                    </div>
                  </div>

                  <ul className="divide-y divide-line border border-line bg-card">
                    {lines.map(({ laptop, qty, warranty }) => (
                      <li key={laptop.id} className="flex items-center gap-3 p-3">
                        <img src={laptop.image} alt="" className="h-11 w-14 object-cover" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold">{laptop.name}</p>
                          <p className="font-mono text-[10px] text-smoke">QTY {qty}{warranty && " · +ACCIDENTAL COVER"}</p>
                        </div>
                        <p className="font-mono text-xs font-semibold">{fmt2((laptop.price + (warranty ? 129 : 0)) * qty)}</p>
                      </li>
                    ))}
                  </ul>

                  <div>
                    {promo ? (
                      <p className="border border-moss/40 bg-moss/10 px-3 py-2 font-mono text-[11px] tracking-wider text-moss">CODE {promo} APPLIED — {t.discount > 0 ? `SAVING ${fmt2(t.discount)}` : "FREE SHIPPING"}</p>
                    ) : (
                      <div className="flex gap-2">
                        <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && code.trim() && (onApplyPromo(code.trim().toUpperCase()) ? setPromoMsg({ ok: false, text: "INVALID CODE" }) : (setPromoMsg({ ok: true, text: "APPLIED" }), setCode("")))} placeholder="PROMO CODE" aria-label="Promo code" className="min-w-0 flex-1 border border-line bg-card px-3 py-2.5 font-mono text-xs tracking-wider outline-none focus:border-ink" />
                        <button onClick={() => { const err = onApplyPromo(code.trim().toUpperCase()); if (err) setPromoMsg({ ok: false, text: err }); else { setPromoMsg({ ok: true, text: "APPLIED" }); setCode(""); } }} className="border border-ink px-4 font-mono text-xs tracking-wider hover:bg-ink hover:text-paper">APPLY</button>
                      </div>
                    )}
                    {promoMsg && !promo && <p className={`mt-1 font-mono text-[10px] tracking-wider ${promoMsg.ok ? "text-moss" : "text-ember"}`}>{promoMsg.text}</p>}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="border border-line px-5 py-3.5 font-mono text-xs tracking-wider transition-colors hover:border-ink">← BACK</button>
                    <button onClick={pay} className="flex flex-1 items-center justify-center gap-2 bg-ember py-3.5 font-mono text-sm font-semibold tracking-wider text-paper transition-all hover:bg-emberdim active:translate-y-0.5">
                      <ILock size={15} /> PAY {fmt2(t.total)}
                    </button>
                  </div>
                  <p className="text-center font-mono text-[10px] tracking-wider text-smoke">THIS IS A DEMO PORTAL — NO REAL CHARGE IS MADE.</p>
                </div>
              )}
            </div>

            {/* order summary rail */}
            <aside className="dark-panel border-t border-panel p-5 lg:border-l lg:border-t-0" aria-label="Order summary">
              <p className="font-mono text-[11px] tracking-[0.2em] text-mist">ORDER SUMMARY</p>
              <ul className="mt-4 space-y-2.5">
                {lines.map(({ laptop, qty }) => (
                  <li key={laptop.id} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-panel font-mono text-[10px] text-paper">{qty}</span>
                    <span className="min-w-0 flex-1 truncate text-xs text-mist">{laptop.shortName}</span>
                    <span className="font-mono text-xs text-paper">{fmt2(laptop.price * qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-1.5 border-t border-panel pt-4 font-mono text-xs text-mist">
                <div className="flex justify-between"><dt>Subtotal</dt><dd className="text-paper">{fmt2(t.subtotal)}</dd></div>
                {t.discount > 0 && <div className="flex justify-between text-moss"><dt>Discount</dt><dd>−{fmt2(t.discount)}</dd></div>}
                <div className="flex justify-between"><dt>Shipping</dt><dd className={t.shipping === 0 ? "text-moss" : "text-paper"}>{t.shipping === 0 ? "FREE" : fmt2(t.shipping)}</dd></div>
                <div className="flex justify-between"><dt>Tax 8%</dt><dd className="text-paper">{fmt2(t.tax)}</dd></div>
              </dl>
              <div className="mt-4 flex items-end justify-between border-t border-panel pt-4">
                <span className="font-mono text-[10px] tracking-[0.2em] text-mist">TOTAL</span>
                <span className="font-mono text-2xl font-semibold text-paper">{fmt2(t.total)}</span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <VisaMark /><McMark /><AmexMark /><PaypalMark /><BankMark />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
