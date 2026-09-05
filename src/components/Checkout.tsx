import { useMemo, useRef, useState, type ReactNode } from "react";
import { WARRANTY_PRICE, cartTotals, cardBrand, fmt, luhn, toFa, type CartLine } from "../data/laptops";
import { useEscape, useLockBody } from "../lib/motion";
import { IArrowR, ICheck, IClose, ILock, ITruck } from "./icons";

const STEPS = ["اطلاعات ارسال", "روش پرداخت", "بازبینی سفارش", "تأیید"];

type Method = "card" | "wallet" | "cod";

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

/* small bank / wallet marks (inline SVG) */
function PayMark({ kind }: { kind: Method }) {
  if (kind === "card")
    return (
      <svg viewBox="0 0 40 26" className="h-6 w-9" aria-hidden="true">
        <rect width="40" height="26" rx="4" fill="#0477b3" />
        <rect y="6" width="40" height="5" fill="#07293f" />
        <rect x="4" y="16" width="12" height="5" rx="1.5" fill="#e6f3fa" />
      </svg>
    );
  if (kind === "wallet")
    return (
      <svg viewBox="0 0 40 26" className="h-6 w-9" aria-hidden="true">
        <rect width="40" height="26" rx="6" fill="#0e9f6e" />
        <circle cx="20" cy="13" r="7" fill="#ffffff" opacity="0.9" />
        <text x="20" y="17" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0e9f6e">ری</text>
      </svg>
    );
  return (
    <svg viewBox="0 0 40 26" className="h-6 w-9" aria-hidden="true">
      <rect width="40" height="26" rx="4" fill="#07293f" />
      <path d="M10 19V10l6-4 6 4v9" stroke="#e6f3fa" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="17" y="14" width="4" height="5" fill="#e6f3fa" />
    </svg>
  );
}

interface CheckoutProps {
  lines: CartLine[];
  promo: string | null;
  onApplyPromo: (code: string) => string | null;
  onClose: () => void;
  onComplete: () => void;
}

export default function Checkout({ lines, promo, onApplyPromo, onClose, onComplete }: CheckoutProps) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method>("card");
  const [card, setCard] = useState({ num: "", name: "", exp: "", cvv: "" });
  const [address, setAddress] = useState({ name: "", phone: "", city: "", addr: "", post: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<{ id: string; ref: string } | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useLockBody(true);
  useEscape(true, () => !processing && onClose());

  const t = cartTotals(lines, promo);
  const brand = cardBrand(card.num);

  const validateShip = () => {
    const e: Record<string, string> = {};
    if (address.name.trim().length < 3) e.name = "نام و نام خانوادگی را کامل وارد کنید";
    if (!/^09\d{9}$/.test(address.phone.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))))) e.phone = "شماره موبایل باید مانند ۰۹۱۲۳۴۵۶۷۸۹ باشد";
    if (address.city.trim().length < 2) e.city = "شهر را وارد کنید";
    if (address.addr.trim().length < 10) e.addr = "نشانی دقیق (حداقل ۱۰ حرف) لازم است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePay = () => {
    if (method !== "card") return true;
    const e: Record<string, string> = {};
    const digits = card.num.replace(/\D/g, "");
    if (digits.length !== 16) e.num = "شماره کارت باید ۱۶ رقم باشد";
    else if (!luhn(digits)) e.num = "شماره کارت معتبر نیست؛ دوباره بررسی کنید";
    if (card.name.trim().length < 3) e.cname = "نام دارنده کارت را وارد کنید";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.exp)) e.exp = "تاریخ انقضا را به شکل MM/YY میلادی وارد کنید";
    if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = "CVV2 سه یا چهار رقمی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = () => {
    if (!validatePay()) return;
    setProcessing(true);
    timer.current = setTimeout(() => {
      setOrder({
        id: `CH-${Math.floor(1000 + Math.random() * 9000)}`,
        ref: `RR-${Math.floor(100000 + Math.random() * 899999)}`,
      });
      setProcessing(false);
      setStep(3);
      onComplete();
    }, 1900);
  };

  const fmtCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
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
      <div className="overlay-in fixed inset-0 bg-deep/75 backdrop-blur-sm" onClick={() => !processing && onClose()} />
      <div className="panel-in relative mx-auto my-6 w-[min(980px,94vw)] overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
        {/* head */}
        <div className="flex items-center justify-between border-b border-line bg-deep px-5 py-3.5 text-white">
          <p className="flex items-center gap-2 text-xs font-extrabold tracking-wide">
            <ILock size={15} className="text-sea" /> درگاه پرداخت امن کورهِوس
            <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-skywash sm:inline">رمزنگاری ۲۵۶ بیتی TLS</span>
          </p>
          <button onClick={() => !processing && onClose()} aria-label="بستن درگاه پرداخت" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white">
            <IClose size={16} />
          </button>
        </div>

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
                <p className="mt-5 font-display text-2xl text-ink">در حال اتصال به درگاه بانکی…</p>
                <p className="mt-2 text-sm text-mist">لطفاً این پنجره را نبندید؛ معمولاً چند ثانیه طول می‌کشد.</p>
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
                <div className="grid gap-3 sm:grid-cols-3">
                  {([
                    ["card", "کارت بانکی", "شتاب — همه کارت‌های عضو"],
                    ["wallet", "کیف پول کورهِوس", "موجودی: ۰ ریال — شارژ در لحظه"],
                    ["cod", "پرداخت در محل", "کارت‌خوان همراه مأمور ارسال"],
                  ] as [Method, string, string][]).map(([m, title, sub]) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      aria-pressed={method === m}
                      className={`rounded-2xl border-2 p-3.5 text-start transition-all active:scale-[0.98] ${
                        method === m ? "border-sea bg-skywash/60 shadow-md" : "border-line bg-card hover:border-sea/40"
                      }`}
                    >
                      <PayMark kind={m} />
                      <span className="mt-2 block text-sm font-extrabold">{title}</span>
                      <span className="block text-[10px] leading-5 text-mist">{sub}</span>
                    </button>
                  ))}
                </div>

                {method === "card" && (
                  <div className="rise-in rounded-2xl border border-line bg-foam/60 p-4 sm:p-5">
                    <Field label="شماره کارت" err={errors.num}>
                      <div className="relative">
                        <input
                          className={`${inputCls(errors.num)} pe-12 font-mono tracking-widest`}
                          dir="ltr"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          value={card.num}
                          onChange={(e) => setCard({ ...card, num: fmtCard(e.target.value) })}
                          placeholder="6274 •••• •••• ••••"
                        />
                        <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sea">
                          {brand ? { visa: "VISA", mastercard: "MasterCard", amex: "AMEX", shetab: "شتاب" }[brand] : ""}
                        </span>
                      </div>
                    </Field>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <Field label="نام دارنده کارت" err={errors.cname}>
                        <input className={inputCls(errors.cname)} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="مطابق روی کارت" />
                      </Field>
                      <Field label="انقضا (میلادی)" err={errors.exp}>
                        <input className={`${inputCls(errors.exp)} font-mono`} dir="ltr" inputMode="numeric" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM/YY" />
                      </Field>
                      <Field label="CVV2" err={errors.cvv}>
                        <input className={`${inputCls(errors.cvv)} font-mono`} dir="ltr" inputMode="numeric" type="password" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="•••" />
                      </Field>
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-mist">
                      <ILock size={12} className="text-moss" /> این یک درگاه نمایشی است؛ اطلاعات واقعی کارت وارد نکنید.
                    </p>
                  </div>
                )}
                {method === "wallet" && (
                  <p className="rise-in rounded-2xl border border-dashed border-sea/40 bg-skywash/50 p-4 text-sm leading-7 text-mist">
                    مبلغ <b className="text-ink">{fmt(t.total)}</b> هم‌زمان با ثبت سفارش از طریق درگاه بانکی کیف پول شما را شارژ و بلافاصله کسر می‌شود. باقی‌مانده اعتبار برای خریدهای بعدی محفوظ می‌ماند.
                  </p>
                )}
                {method === "cod" && (
                  <p className="rise-in rounded-2xl border border-dashed border-sea/40 bg-skywash/50 p-4 text-sm leading-7 text-mist">
                    هنگام تحویل، مأمور ارسال دستگاه کارت‌خوان به همراه دارد. لطفاً هنگام تحویل، پلمپ جعبه و گزارش آزمایشگاه را پیش از پرداخت بررسی کنید.
                  </p>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold text-mist transition-colors hover:border-sea hover:text-sea">
                    <IArrowR size={14} /> مرحله قبل
                  </button>
                  <button onClick={() => validatePay() && setStep(2)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sea py-3 text-sm font-extrabold text-white transition-all hover:bg-seadark active:scale-[0.98] sm:flex-none sm:px-10">
                    مرحله بعد: بازبینی <IArrowR size={15} className="rotate-180" />
                  </button>
                </div>
              </div>
            ) : step === 2 ? (
              <div key="s2" className="rise-in space-y-4">
                <h2 className="font-display text-2xl text-ink">بازبینی نهایی سفارش</h2>
                <div className="grid gap-3 rounded-2xl border border-line bg-foam/60 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-extrabold text-mist">تحویل‌گیرنده</p>
                    <p className="mt-1 font-bold">{address.name}</p>
                    <p className="text-xs text-mist" dir="ltr">{address.phone}</p>
                    <p className="mt-1 text-xs leading-6 text-mist">{address.city}، {address.addr}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold text-mist">روش پرداخت</p>
                    <p className="mt-1 font-bold">{method === "card" ? "کارت بانکی (شتاب)" : method === "wallet" ? "کیف پول کورهِوس" : "پرداخت در محل"}</p>
                    {method === "card" && <p className="mt-1 text-xs text-mist" dir="ltr">•••• {card.num.replace(/\D/g, "").slice(-4)}</p>}
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-moss"><ITruck size={13} /> {t.shipping === 0 ? "ارسال رایگان ۴۸ ساعته" : "ارسال ۲ تا ۴ روز کاری"}</p>
                  </div>
                </div>

                {!promo && (
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="کد تخفیف (مثلاً CORE10)"
                      dir="ltr"
                      className="min-w-0 flex-1 rounded-full border border-line bg-card px-4 py-2.5 font-mono text-xs outline-none focus:border-sea"
                      aria-label="کد تخفیف"
                    />
                    <button
                      onClick={() => {
                        const err = onApplyPromo(promoInput.trim().toUpperCase());
                        setPromoMsg(err ? { ok: false, text: err } : { ok: true, text: "کد اعمال شد ✓" });
                      }}
                      className="rounded-full border border-sea px-5 text-xs font-bold text-seadark transition-colors hover:bg-sea hover:text-white"
                    >
                      اعمال
                    </button>
                  </div>
                )}
                {promoMsg && <p className={`text-[11px] font-bold ${promoMsg.ok ? "text-moss" : "text-coral"}`}>{promoMsg.text}</p>}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold text-mist transition-colors hover:border-sea hover:text-sea">
                    <IArrowR size={14} /> مرحله قبل
                  </button>
                  <button onClick={pay} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-moss py-3.5 text-sm font-extrabold text-white transition-all hover:brightness-110 active:scale-[0.98] sm:flex-none sm:px-10">
                    <ILock size={15} /> پرداخت {fmt(t.total)}
                  </button>
                </div>
              </div>
            ) : (
              <div key="s3" className="rise-in flex flex-col items-center py-10 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-moss/15 text-moss">
                  <ICheck size={40} />
                </span>
                <h2 className="mt-5 font-display text-3xl text-ink">سفارش شما ثبت شد!</h2>
                <p className="mt-2 max-w-md text-sm leading-7 text-mist">
                  دستگاه شما وارد صف تست نهایی و بسته‌بندی آزمایشگاه شد. پیامک تأیید و رهگیری
                  به‌زودی ارسال می‌شود.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["کد سفارش", order?.id ?? "—"],
                    ["کد رهگیری پستی", order?.ref ?? "—"],
                    ["تحویل تخمینی", "۲ تا ۴ روز کاری"],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-2xl border border-line bg-foam/70 px-5 py-3.5">
                      <p className="text-[10px] font-bold text-mist">{l}</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-seadark" dir="ltr">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-full bg-skywash/70 px-4 py-2 text-[11px] font-bold text-seadark">
                  رسید پرداخت به ایمیل شما ارسال شد — گزارش بنچمارک دستگاه داخل جعبه است.
                </p>
                <button onClick={onClose} className="mt-7 rounded-full bg-sea px-10 py-3 text-sm font-extrabold text-white transition-all hover:bg-seadark active:scale-95">
                  بازگشت به فروشگاه
                </button>
              </div>
            )}
          </div>

          {/* summary column */}
          {!processing && step < 3 && <aside className="space-y-3">{summary}
            <div className="rounded-2xl border border-line bg-card p-4 text-[11px] leading-6 text-mist">
              <p className="flex items-center gap-1.5 font-bold text-ink"><ITruck size={14} className="text-sea" /> تضمین‌های کورهِوس</p>
              <ul className="mt-2 space-y-1.5">
                <li className="flex gap-1.5"><ICheck size={13} className="mt-0.5 shrink-0 text-moss" /> ۷ روز مرجوعی بدون قیدوشرط</li>
                <li className="flex gap-1.5"><ICheck size={13} className="mt-0.5 shrink-0 text-moss" /> گارانتی ۲ ساله + گزارش آزمایشگاه</li>
                <li className="flex gap-1.5"><ICheck size={13} className="mt-0.5 shrink-0 text-moss" /> بیمه کامل مرسوله تا درب منزل</li>
              </ul>
            </div>
          </aside>}
        </div>
      </div>
    </div>
  );
}
