import { useMemo, useRef, useState, type ReactNode } from "react";
import { WARRANTY_PRICE, cartTotals, fmt, luhn, toFa, type CartLine } from "../data/laptops";
import { useEscape, useLockBody } from "../lib/motion";
import type { OrderRecord } from "../lib/store";
import { IArrowR, ICheck, IClose, ILock, IShield, ITruck } from "./icons";

const STEPS = ["اطلاعات ارسال", "روش پرداخت", "بازبینی سفارش", "تأیید"];

type Method = "zarinpal" | "cod";

function Field({ label, err, children }: { label: string; err?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-mist">{label}</span>
      {children}
      {err && <span className="mt-1 block text-[11px] font-bold text-coral">{err}</span>}
    </label>
  );
}

const inputCls = (err?: string) =>
  `w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-mist/50 ${err ? "border-coral" : "border-line focus:border-sea"}`;

/* نشان زرین‌پال (شبیه‌سازی بصری لوگو) */
function ZarinMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
      <rect width="44" height="44" rx="11" fill="#141824" />
      <path d="M13 13.5h18v4.2l-10.6 9.6H31v4.2H13v-4.2l10.6-9.6H13v-4.2Z" fill="#ffd34e" />
      <circle cx="33" cy="31.5" r="2.6" fill="#ffd34e" />
    </svg>
  );
}

interface CheckoutProps {
  lines: CartLine[];
  promo: string | null;
  onApplyPromo: (code: string) => string | null;
  onClose: () => void;
  onComplete: (order: OrderRecord) => void;
}

export default function Checkout({ lines, promo, onApplyPromo, onClose, onComplete }: CheckoutProps) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method>("zarinpal");
  const [address, setAddress] = useState({ name: "", phone: "", city: "", addr: "", post: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<{ id: string; ref: string } | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  /* درگاه زرین‌پال */
  const [gate, setGate] = useState(false);
  const [gateProcessing, setGateProcessing] = useState(false);
  const [zp, setZp] = useState({ num: "", exp: "", cvv: "", pin: "" });
  const [zpErr, setZpErr] = useState<Record<string, string>>({});

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useLockBody(true);
  useEscape(true, () => !processing && !gateProcessing && onClose());

  const t = cartTotals(lines, promo);

  const validateShip = () => {
    const e: Record<string, string> = {};
    if (address.name.trim().length < 3) e.name = "نام و نام خانوادگی را کامل وارد کنید";
    if (!/^09\d{9}$/.test(address.phone.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))))) e.phone = "شماره موبایل باید مانند ۰۹۱۲۳۴۵۶۷۸۹ باشد";
    if (address.city.trim().length < 2) e.city = "شهر را وارد کنید";
    if (address.addr.trim().length < 10) e.addr = "نشانی دقیق (حداقل ۱۰ حرف) لازم است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

  /* اعتبارسنجی فرم درگاه زرین‌پال */
  const validateGate = () => {
    const e: Record<string, string> = {};
    const digits = zp.num.replace(/\D/g, "");
    if (digits.length !== 16) e.num = "شماره کارت باید ۱۶ رقم باشد";
    else if (!luhn(digits)) e.num = "شماره کارت معتبر نیست؛ دوباره بررسی کنید";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(zp.exp)) e.exp = "تاریخ انقضا را به شکل MM/YY وارد کنید";
    if (!/^\d{3,4}$/.test(zp.cvv)) e.cvv = "CVV2 سه یا چهار رقمی است";
    if (!/^\d{5,12}$/.test(zp.pin)) e.pin = "رمز پویا را از سامانه بانک خود دریافت کنید (۵ تا ۱۲ رقم)";
    setZpErr(e);
    return Object.keys(e).length === 0;
  };

  const finalizeOrder = (payLabel: string, refPrefix: string) => {
    const faDigits = (n: number) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
    const id = `CH-${faDigits(1404)}-${faDigits(Math.floor(1000 + Math.random() * 9000))}`;
    setOrder({ id, ref: `${refPrefix}-${faDigits(Math.floor(100000 + Math.random() * 899999))}` });
    const record: OrderRecord = {
      id,
      date: new Date().toISOString(),
      customer: address.name.trim(),
      city: address.city.trim(),
      pay: payLabel,
      items: lines.map((l) => ({ id: l.laptop.id, name: l.laptop.name, category: l.laptop.category, qty: l.qty, price: l.laptop.price + (l.warranty ? WARRANTY_PRICE : 0) })),
      subtotal: t.subtotal,
      discount: t.discount,
      shipping: t.shipping,
      tax: t.tax,
      total: t.total,
    };
    onComplete(record);
    setStep(3);
  };

  /* پرداخت در محل */
  const payCod = () => {
    setProcessing(true);
    timer.current = setTimeout(() => {
      setProcessing(false);
      finalizeOrder("پرداخت در محل", "RR");
    }, 1600);
  };

  /* پرداخت از درگاه زرین‌پال */
  const payZarinpal = () => {
    if (!validateGate()) return;
    setGateProcessing(true);
    timer.current = setTimeout(() => {
      setGateProcessing(false);
      setGate(false);
      finalizeOrder("زرین‌پال — کارت شتاب", "ZP");
    }, 2400);
  };

  const summary = useMemo(
    () => (
      <div className="rounded-2xl border border-line bg-foam/70 p-4">
        <p className="text-[11px] font-extrabold tracking-wide text-mist">خلاصه سفارش</p>
        <ul className="mt-3 space-y-2.5">
          {lines.map(({ laptop, qty, warranty }) => (
            <li key={laptop.id} className="flex items-center gap-2.5">
              <img src={laptop.image} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" loading="lazy" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold">{laptop.name}</span>
                <span className="text-[10px] text-mist">{toFa(qty)} دستگاه{warranty ? " + پوشش حوادث" : ""}</span>
              </span>
              <span className="text-xs font-bold">{fmt(laptop.price * qty + (warranty ? WARRANTY_PRICE * qty : 0))}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-mist">
          <div className="flex justify-between"><dt>جمع کالاها</dt><dd className="font-bold text-ink">{fmt(t.subtotal)}</dd></div>
          {t.discount > 0 && <div className="flex justify-between text-moss"><dt>تخفیف</dt><dd className="font-bold">{fmt(t.discount)}−</dd></div>}
          <div className="flex justify-between"><dt>ارسال</dt><dd className={`font-bold ${t.shipping === 0 ? "text-moss" : "text-ink"}`}>{t.shipping === 0 ? "رایگان ۴۸ ساعته" : fmt(t.shipping)}</dd></div>
          <div className="flex justify-between"><dt>مالیات (۱۰٪)</dt><dd className="font-bold text-ink">{fmt(t.tax)}</dd></div>
        </dl>
        <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
          <span className="text-[11px] font-extrabold text-mist">مبلغ قابل پرداخت</span>
          <span className="text-lg font-extrabold text-seadark">{fmt(t.total)}</span>
        </div>
      </div>
    ),
    [lines, t]
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="پرداخت امن">
      <div className="overlay-in fixed inset-0 bg-deep/75 backdrop-blur-sm" onClick={() => !processing && !gateProcessing && onClose()} />
      <div className="panel-in relative mx-auto my-6 w-[min(980px,94vw)] overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
        {/* head */}
        <div className="flex items-center justify-between border-b border-line bg-deep px-5 py-3.5 text-white">
          <p className="flex items-center gap-2 text-xs font-extrabold tracking-wide">
            <ILock size={15} className="text-sea" /> تسویه حساب امن کورهِوس
            <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-skywash sm:inline">درگاه پرداخت: زرین‌پال</span>
          </p>
          <button onClick={() => !processing && !gateProcessing && onClose()} aria-label="بستن" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white">
            <IClose size={16} />
          </button>
        </div>

        {/* ── صفحه درگاه زرین‌پال (شبیه‌سازی Sandbox) ── */}
        {gate ? (
          <div className="p-5 sm:p-8" dir="rtl">
            <div className="mx-auto max-w-lg">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-line bg-[#f7f8fa] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ZarinMark className="h-10 w-10" />
                    <div>
                      <p className="text-base font-extrabold text-[#141824]">زرین‌پال</p>
                      <p className="text-[10px] font-bold tracking-wide text-mist" dir="ltr">ZARINPAL · SECURE GATEWAY</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-moss/10 px-3 py-1 text-[10px] font-extrabold text-moss">
                    <IShield size={12} /> اتصال امن TLS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-px bg-line/60">
                  <div className="bg-white p-4">
                    <p className="text-[10px] font-bold text-mist">پذیرنده</p>
                    <p className="mt-0.5 text-sm font-extrabold text-ink">فروشگاه کورهِوس</p>
                  </div>
                  <div className="bg-white p-4 text-left" dir="ltr">
                    <p className="text-right text-[10px] font-bold text-mist">مبلغ قابل پرداخت</p>
                    <p className="mt-0.5 text-right text-sm font-extrabold text-[#141824]">{fmt(t.total)}</p>
                  </div>
                </div>

                {gateProcessing ? (
                  <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
                    <span className="spin-slow flex h-14 w-14 items-center justify-center rounded-full border-4 border-line border-t-[#ffd34e]" aria-hidden="true" />
                    <p className="text-sm font-extrabold text-ink">در حال پردازش تراکنش در شبکه شتاب…</p>
                    <p className="text-[11px] text-mist">این پنجره را نبندید؛ تأییدیه بانک معمولاً چند ثانیه طول می‌کشد.</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-5">
                    <Field label="شماره کارت" err={zpErr.num}>
                      <input
                        className={`${inputCls(zpErr.num)} font-mono tracking-[0.2em]`}
                        dir="ltr"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={zp.num}
                        onChange={(e) => setZp({ ...zp, num: fmtCard(e.target.value) })}
                        placeholder="6274 •••• •••• ••••"
                        autoFocus
                      />
                    </Field>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="CVV2" err={zpErr.cvv}>
                        <input className={`${inputCls(zpErr.cvv)} font-mono`} dir="ltr" inputMode="numeric" type="password" value={zp.cvv} onChange={(e) => setZp({ ...zp, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="•••" />
                      </Field>
                      <Field label="انقضا (ماه/سال)" err={zpErr.exp}>
                        <input className={`${inputCls(zpErr.exp)} font-mono`} dir="ltr" inputMode="numeric" value={zp.exp} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); setZp({ ...zp, exp: d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d }); }} placeholder="MM/YY" />
                      </Field>
                      <Field label="رمز پویا" err={zpErr.pin}>
                        <input className={`${inputCls(zpErr.pin)} font-mono`} dir="ltr" inputMode="numeric" type="password" value={zp.pin} onChange={(e) => setZp({ ...zp, pin: e.target.value.replace(/\D/g, "").slice(0, 12) })} placeholder="••••••" />
                      </Field>
                    </div>

                    <button
                      onClick={payZarinpal}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffd34e] py-3.5 text-sm font-extrabold text-[#141824] shadow-md transition-all hover:brightness-95 active:translate-y-0.5"
                    >
                      <ILock size={16} /> پرداخت {fmt(t.total)}
                    </button>
                    <button
                      onClick={() => setGate(false)}
                      className="w-full rounded-xl border border-line py-2.5 text-xs font-bold text-mist transition-colors hover:border-coral hover:text-coral"
                    >
                      انصراف و بازگشت به فروشگاه
                    </button>

                    <p className="rounded-xl bg-skywash/70 px-3.5 py-2.5 text-center text-[10px] font-bold leading-5 text-seadark">
                      حالت آزمایشی (Sandbox) — برای اتصال واقعی، شناسه پذیرنده زرین‌پال را در بک‌اند جایگذاری کنید؛ هیچ تراکنش واقعی انجام نمی‌شود.
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-4 text-center text-[10px] font-bold text-mist" dir="ltr">
                PCI-DSS LEVEL 1 · SHAPARAK-COMPLIANT · zarinpal.com
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* stepper */}
            <ol className="flex items-center gap-0 border-b border-line bg-foam/70 px-5 py-4" aria-label="مراحل خرید">
              {STEPS.map((s, i) => (
                <li key={s} className="flex flex-1 items-center">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                    i < step ? "bg-moss text-white" : i === step ? "bg-sea text-white ring-4 ring-sea/20" : "bg-line text-mist"
                  }`}>
                    {i < step ? <ICheck size={14} /> : toFa(i + 1)}
                  </span>
                  <span className={`ms-2 hidden text-[11px] font-bold sm:block ${i === step ? "text-ink" : "text-mist"}`}>{s}</span>
                  {i < STEPS.length - 1 && <span className={`mx-3 h-0.5 flex-1 rounded-full transition-colors ${i < step ? "bg-moss" : "bg-line"}`} />}
                </li>
              ))}
            </ol>

            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_340px]">
              <div>
                {processing ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-line border-t-sea spin-slow" aria-hidden="true" />
                    <p className="mt-5 font-display text-2xl text-ink">در حال ثبت سفارش…</p>
                    <p className="mt-2 text-sm text-mist">لطفاً این پنجره را نبندید.</p>
                  </div>
                ) : step === 0 ? (
                  <div key="s0" className="rise-in space-y-4">
                    <h2 className="font-display text-2xl text-ink">اطلاعات تحویل‌گیرنده</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="نام و نام خانوادگی" err={errors.name}>
                        <input className={inputCls(errors.name)} value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="مثلاً سارا محمدی" />
                      </Field>
                      <Field label="شماره موبایل" err={errors.phone}>
                        <input className={inputCls(errors.phone)} dir="ltr" inputMode="numeric" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="09123456789" />
                      </Field>
                      <Field label="شهر" err={errors.city}>
                        <input className={inputCls(errors.city)} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="تهران" />
                      </Field>
                      <Field label="کد پستی (اختیاری)">
                        <input className={inputCls()} dir="ltr" inputMode="numeric" value={address.post} onChange={(e) => setAddress({ ...address, post: e.target.value })} placeholder="1234567890" />
                      </Field>
                    </div>
                    <Field label="نشانی کامل" err={errors.addr}>
                      <textarea rows={3} className={inputCls(errors.addr)} value={address.addr} onChange={(e) => setAddress({ ...address, addr: e.target.value })} placeholder="خیابان، کوچه، پلاک، واحد…" />
                    </Field>
                    <button onClick={() => validateShip() && setStep(1)} className="flex w-full items-center justify-center gap-2 rounded-full bg-sea py-3.5 text-sm font-extrabold text-white transition-all hover:bg-seadark active:scale-[0.98] sm:w-auto sm:px-10">
                      مرحله بعد: روش پرداخت <IArrowR size={15} className="rotate-180" />
                    </button>
                  </div>
                ) : step === 1 ? (
                  <div key="s1" className="rise-in space-y-4">
                    <h2 className="font-display text-2xl text-ink">روش پرداخت را انتخاب کنید</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setMethod("zarinpal")}
                        aria-pressed={method === "zarinpal"}
                        className={`rounded-2xl border-2 p-4 text-start transition-all active:scale-[0.98] ${
                          method === "zarinpal" ? "border-sea bg-skywash/60 shadow-md" : "border-line bg-card hover:border-sea/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <ZarinMark className="h-11 w-11" />
                          {method === "zarinpal" && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sea text-white"><ICheck size={13} /></span>}
                        </div>
                        <span className="mt-2.5 block text-sm font-extrabold">درگاه پرداخت زرین‌پال</span>
                        <span className="block text-[10px] leading-5 text-mist">انتقال امن به شبکه شتاب — همه کارت‌های بانکی · با رمز پویا</span>
                        <span className="mt-2 inline-block rounded-full bg-[#fff4cf] px-2.5 py-1 text-[9px] font-extrabold text-[#8a6d00]">پیشنهاد کورهِوس — تسویه آنی</span>
                      </button>

                      <button
                        onClick={() => setMethod("cod")}
                        aria-pressed={method === "cod"}
                        className={`rounded-2xl border-2 p-4 text-start transition-all active:scale-[0.98] ${
                          method === "cod" ? "border-sea bg-skywash/60 shadow-md" : "border-line bg-card hover:border-sea/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <svg viewBox="0 0 44 44" className="h-11 w-11" aria-hidden="true">
                            <rect width="44" height="44" rx="11" fill="#07293f" />
                            <path d="M12 20V13l10-6 10 6v7" stroke="#e6f3fa" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="18" y="20" width="8" height="10" rx="1" fill="#e6f3fa" />
                            <path d="M12 33h20" stroke="#ffd34e" strokeWidth="2.4" strokeLinecap="round" />
                          </svg>
                          {method === "cod" && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sea text-white"><ICheck size={13} /></span>}
                        </div>
                        <span className="mt-2.5 block text-sm font-extrabold">پرداخت در محل</span>
                        <span className="block text-[10px] leading-5 text-mist">کارت‌خوان همراه مأمور ارسال — فقط تهران و کرج</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={() => setStep(0)} className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold text-mist transition-colors hover:border-sea hover:text-sea">
                        <IArrowR size={14} /> مرحله قبل
                      </button>
                      <button onClick={() => setStep(2)} className="flex items-center gap-2 rounded-full bg-sea px-10 py-3.5 text-sm font-extrabold text-white transition-all hover:bg-seadark active:scale-[0.98]">
                        مرحله بعد: بازبینی سفارش <IArrowR size={15} className="rotate-180" />
                      </button>
                    </div>
                  </div>
                ) : step === 2 ? (
                  <div key="s2" className="rise-in space-y-4">
                    <h2 className="font-display text-2xl text-ink">بازبینی و پرداخت</h2>
                    <div className="rounded-2xl border border-line bg-white p-4 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-extrabold">{address.name}</p>
                          <p className="mt-1 text-xs leading-6 text-mist">
                            {address.city} — {address.addr}
                            <span dir="ltr" className="mx-1 font-mono">{address.phone}</span>
                            {address.post && <span dir="ltr" className="mx-1 font-mono">· کد پستی {address.post}</span>}
                          </p>
                        </div>
                        <button onClick={() => setStep(0)} className="shrink-0 text-[11px] font-bold text-sea underline-offset-4 hover:underline">ویرایش</button>
                      </div>
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-foam px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {method === "zarinpal" ? <ZarinMark className="h-8 w-8" /> : <ITruck size={22} className="text-sea" />}
                          <div>
                            <p className="text-xs font-extrabold">{method === "zarinpal" ? "پرداخت اینترنتی — درگاه زرین‌پال" : "پرداخت در محل (کارت‌خوان)"}</p>
                            <p className="text-[10px] text-mist">{method === "zarinpal" ? "پس از تأیید، به صفحه بانک منتقل می‌شوید" : "مبلغ هنگام تحویل دریافت می‌شود"}</p>
                          </div>
                        </div>
                        <button onClick={() => setStep(1)} className="shrink-0 text-[11px] font-bold text-sea underline-offset-4 hover:underline">تغییر</button>
                      </div>

                      {promo ? (
                        <p className="mt-3 flex items-center justify-between rounded-xl border border-moss/40 bg-moss/10 px-4 py-2.5 text-[11px] font-extrabold text-moss">
                          کد تخفیف {promo} اعمال شد
                          <button onClick={() => { onApplyPromo(""); setPromoMsg(null); }} className="underline underline-offset-2">حذف</button>
                        </p>
                      ) : (
                        <div className="mt-3">
                          <div className="flex gap-2">
                            <input
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (() => { const err = onApplyPromo(promoInput.trim().toUpperCase()); setPromoMsg(err ? { ok: false, text: err } : { ok: true, text: "کد اعمال شد" }); })()}
                              placeholder="کد تخفیف (مثلاً CORE10)"
                              className="min-w-0 flex-1 rounded-xl border border-line bg-card px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-sea"
                            />
                            <button
                              onClick={() => { const err = onApplyPromo(promoInput.trim().toUpperCase()); setPromoMsg(err ? { ok: false, text: err } : { ok: true, text: "کد اعمال شد" }); }}
                              className="rounded-xl border border-ink px-4 text-xs font-bold transition-colors hover:bg-ink hover:text-white"
                            >
                              اعمال
                            </button>
                          </div>
                          {promoMsg && <p className={`mt-1.5 text-[10px] font-bold ${promoMsg.ok ? "text-moss" : "text-coral"}`}>{promoMsg.text}</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={() => setStep(1)} className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold text-mist transition-colors hover:border-sea hover:text-sea">
                        <IArrowR size={14} /> مرحله قبل
                      </button>
                      {method === "zarinpal" ? (
                        <button
                          onClick={() => { setZpErr({}); setGate(true); }}
                          className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-[#141824] px-8 py-4 text-sm font-extrabold text-[#ffd34e] shadow-lg transition-all hover:bg-black active:scale-[0.98] sm:flex-none"
                        >
                          <ZarinMark className="h-6 w-6" />
                          پرداخت {fmt(t.total)} از درگاه زرین‌پال
                        </button>
                      ) : (
                        <button
                          onClick={payCod}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sea px-8 py-4 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-seadark active:scale-[0.98] sm:flex-none"
                        >
                          <ICheck size={16} /> ثبت نهایی سفارش — {fmt(t.total)}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key="s3" className="rise-in flex flex-col items-center py-10 text-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-moss text-white shadow-lg shadow-moss/30"><ICheck size={38} /></span>
                    <h2 className="mt-5 font-display text-3xl text-ink">سفارش شما ثبت شد</h2>
                    <p className="mt-2 max-w-md text-sm leading-7 text-mist">
                      کارشناسان آزمایشگاه، دستگاه{lines.reduce((a, l) => a + l.qty, 0) > 1 ? "ها" : ""} را بنچمارک و کالیبره می‌کنند و گزارش امضاشده همراه جعبه ارسال می‌شود.
                    </p>
                    <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3">
                      <div className="rounded-xl border border-line bg-white p-3.5">
                        <p className="text-[10px] font-bold text-mist">شماره سفارش</p>
                        <p className="mt-1 text-base font-extrabold text-seadark">{order?.id}</p>
                      </div>
                      <div className="rounded-xl border border-line bg-white p-3.5">
                        <p className="text-[10px] font-bold text-mist">{method === "zarinpal" ? "مرجع تراکنش زرین‌پال" : "مرجع پرداخت"}</p>
                        <p className="mt-1 text-base font-extrabold text-seadark">{order?.ref}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[11px] font-bold text-mist">فاکتور به شماره موبایل <span dir="ltr" className="font-mono">{address.phone}</span> پیامک شد · تحویل ۴۸ تا ۷۲ ساعت کاری</p>
                    <button onClick={onClose} className="mt-6 rounded-full bg-ink px-10 py-3.5 text-sm font-extrabold text-white transition-all hover:bg-sea active:scale-[0.98]">
                      بازگشت به فروشگاه
                    </button>
                  </div>
                )}
              </div>

              <aside className="lg:sticky lg:top-4 lg:self-start">{summary}</aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
