import { useState } from "react";
import { BRANDS, CATEGORIES, FAQS, toFa } from "../data/laptops";
import { Reveal } from "../lib/motion";
import { IChevron, IShield, ITruck, IReturn, ILock, LogoMark } from "./icons";

const SEO_PILLARS: [string, string[]][] = [
  ["خرید بر اساس کاربرد", ["لپ‌تاپ گیمینگ", "لپ‌تاپ مهندسی و رندر", "لپ‌تاپ دانشجویی", "لپ‌تاپ اداری و بیزنس", "اولترابوک سبک", "لپ‌تاپ طراحی و گرافیک"]],
  ["بر اساس پردازنده و گرافیک", ["لپ‌تاپ با RTX 5090", "لپ‌تاپ با RTX 4090", "لپ‌تاپ Apple M4", "لپ‌تاپ Snapdragon X Elite", "لپ‌تاپ Ryzen AI", "لپ‌تاپ Intel Core Ultra"]],
  ["سوالات پرتکرار", ["قیمت لپ‌تاپ به ریال", "لپ‌تاپ با کالیبراسیون نمایشگر", "لپ‌تاپ با گارانتی ۲ ساله", "لپ‌تاپ قابل تعمیر و ماژولار", "خرید اقساطی لپ‌تاپ", "لپ‌تاپ با ارسال ۴۸ ساعته"]],
];

interface FooterProps {
  count: number;
  onCategory: (cat: string) => void;
  onBrand: (brand: string) => void;
  onAdmin: () => void;
}

export default function Footer({ count, onCategory, onBrand, onAdmin }: FooterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative">
      {/* wave into footer */}
      <div className="dark-panel">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-12 w-full rotate-180 text-card" aria-hidden="true">
          <path d="M0 40 C 240 70, 480 10, 720 32 C 960 54, 1200 16, 1440 42 L 1440 70 L 0 70 Z" fill="currentColor" />
        </svg>

        <div className="mx-auto max-w-[80%] px-2 pb-10 pt-6 sm:px-4">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_1fr_1.1fr]">
            {/* brand + newsletter */}
            <div>
              <div className="flex items-center gap-2.5">
                <LogoMark size={34} className="text-sea" />
                <span className="flex flex-col leading-none">
                  <span className="font-display text-3xl text-white">افرالیک</span>
                  <span className="font-mono text-[9px] tracking-[0.3em] text-skywash/60">AFRALIK · SPECIALTY LAPTOPS</span>
                </span>
              </div>
              <p className="mt-4 max-w-xs text-xs leading-7 text-skywash/70">
                بورس تخصصی لپ‌تاپ در تهران؛ هر دستگاه با کارنامه آزمایشگاه، کالیبراسیون نمایشگر
                و گارانتی ۲ ساله. از ۱۳۹۸ تا امروز، ۴٬۲۱۸ دستگاه بنچمارک‌شده تحویل داده‌ایم.
              </p>
              <p className="mt-5 text-[11px] font-extrabold tracking-wide text-white">عضویت در خبرنامه ویترین هفتگی</p>
              {subscribed ? (
                <p className="rise-in mt-2 rounded-full bg-moss/20 px-4 py-2.5 text-xs font-bold text-moss">ایمیل شما ثبت شد — هفته آینده اولین خبرنامه می‌رسد ✓</p>
              ) : (
                <form
                  className="mt-2 flex max-w-sm gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.includes("@")) setSubscribed(true);
                  }}
                >
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="you@example.com"
                    dir="ltr"
                    aria-label="ایمیل برای خبرنامه"
                    className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white outline-none transition-colors placeholder:text-skywash/40 focus:border-sea"
                  />
                  <button className="rounded-full bg-sea px-5 py-2.5 text-xs font-extrabold text-white transition-all hover:bg-seadark active:scale-95">عضویت</button>
                </form>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                {[["اینستاگرام", "@corehaus.ir"], ["تلگرام", "@corehaus_ir"], ["یوتیوب", "Corehaus"]].map(([n, h]) => (
                  <a key={n} href="#catalog" aria-label={n} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[10px] font-bold text-skywash/80 transition-colors hover:border-sea hover:text-white">
                    {n} <span dir="ltr" className="font-mono font-normal text-skywash/50">{h}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* دسته‌بندی و برند */}
            <nav aria-label="دسته‌بندی‌ها">
              <p className="text-[11px] font-extrabold tracking-wide text-white">دسته‌بندی‌ها</p>
              <ul className="mt-3 space-y-2">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <button onClick={() => onCategory(c)} className="text-xs text-skywash/70 transition-colors hover:text-sea">لپ‌تاپ {c}</button>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[11px] font-extrabold tracking-wide text-white">برندها</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {BRANDS.map((b) => (
                  <li key={b}>
                    <button onClick={() => onBrand(b)} className="text-xs text-skywash/70 transition-colors hover:text-sea">لپ‌تاپ {b}</button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* services */}
            <nav aria-label="خدمات">
              <p className="text-[11px] font-extrabold tracking-wide text-white">خدمات افرالیک</p>
              <ul className="mt-3 space-y-2.5 text-xs text-skywash/70">
                <li className="flex items-center gap-2"><ITruck size={14} className="text-sea" /> ارسال ۴۸ ساعته به سراسر ایران</li>
                <li className="flex items-center gap-2"><IReturn size={14} className="text-sea" /> ۷ روز مرجوعی بدون قیدوشرط</li>
                <li className="flex items-center gap-2"><IShield size={14} className="text-sea" /> گارانتی ۲ ساله + پوشش حوادث</li>
                <li className="flex items-center gap-2"><ILock size={14} className="text-sea" /> درگاه امن شتاب و خرید اقساطی</li>
              </ul>
              <p className="mt-6 text-[11px] font-extrabold tracking-wide text-white">تماس با آزمایشگاه</p>
              <ul className="mt-3 space-y-2 text-xs text-skywash/70">
                <li>تهران، خیابان ولیعصر، مرکز خرید پایتخت، پلاک ۱۲۸</li>
                <li dir="ltr" className="font-mono text-start">تلفن: 021-9100-4820</li>
                <li dir="ltr" className="font-mono text-start">موبایل پشتیبانی: 0912-123-4567</li>
                <li dir="ltr" className="font-mono text-start">واتساپ: 0912-123-4567</li>
                <li>۷ روز هفته، ساعت ۹ تا ۲۱</li>
                <li dir="ltr" className="font-mono text-start">hello@corehaus.ir</li>
              </ul>
            </nav>

            {/* FAQ */}
            <div>
              <p className="text-[11px] font-extrabold tracking-wide text-white">سوالات پرتکرار</p>
              <div className="mt-3 space-y-2">
                {FAQS.map((f, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start text-xs font-bold text-white transition-colors hover:text-sea"
                    >
                      {f.q}
                      <IChevron size={14} className={`shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-sea" : ""}`} />
                    </button>
                    {openFaq === i && <p className="rise-in border-t border-white/10 px-3.5 py-3 text-[11px] leading-6 text-skywash/70">{f.a}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-7">
            {[
              ["نماد اعتماد الکترونیکی", "eNamad"],
              ["نشان ملی ثبت", "ساماندهی"],
              ["درگاه پرداخت امن", "PCI-DSS"],
            ].map(([t, s]) => (
              <span key={t} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition-colors hover:border-sea/60">
                <IShield size={20} className="text-sea" />
                <span className="text-[11px] font-bold text-white">{t}<span className="block font-mono text-[9px] font-normal tracking-wider text-skywash/50" dir="ltr">{s}</span></span>
              </span>
            ))}
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold text-white">
              پرداخت با <span className="text-sea">شتاب</span> · <span dir="ltr" className="font-mono font-normal text-skywash/60">VISA · MC</span>
            </span>
          </div>

          {/* SEO paragraph + keyword index */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] leading-7 text-skywash/60">
              فروشگاه اینترنتی افرالیک، بورس تخصصی خرید لپ‌تاپ در ایران؛ از لپ‌تاپ گیمینگ با گرافیک
              RTX 5090 و RTX 4090 برای گیمرها و استریمرها، تا مک‌بوک پرو و ورک‌استیشن‌های سبک برای
              تدوین، رندر سه‌بعدی و طراحی. لپ‌تاپ‌های مهندسی با پردازنده‌های Intel Core Ultra و
              Ryzen AI برای نرم‌افزارهای سالیدورکس، کتیا و متلب؛ اولترابوک‌های زیر ۱.۵ کیلوگرم
              برای دانشجویان و مدیران؛ و لپ‌تاپ‌های ماژولار و قابل‌تعمیر برای طرفداران سخت‌افزار
              پایدار. همه دستگاه‌ها پیش از ارسال بنچمارک و کالیبره می‌شوند، قیمت‌ها به ریال و به‌روز
              است و خرید اقساطی، پرداخت در محل و ارسال ۴۸ ساعته به تهران، اصفهان، شیراز، مشهد و
              همه شهرهای ایران فراهم است.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SEO_PILLARS.flatMap(([, items]) => items).map((k) => (
                <a key={k} href="#catalog" className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-skywash/60 transition-colors hover:border-sea hover:text-white">
                  {k}
                </a>
              ))}
            </div>
          </div>

          {/* مارکت‌پلیس‌ها */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-4 text-[12px] font-extrabold text-white">افرالیک را در مارکت‌پلیس‌های معتبر دنبال کنید:</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://emalls.ir/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 transition-all hover:border-sea hover:bg-sea/20"
              >
                <span className="text-[13px] font-bold text-white">مشاهده در</span>
                <span className="text-[15px] font-extrabold text-sea">ایمالز</span>
              </a>
              <a
                href="https://torob.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 transition-all hover:border-sea hover:bg-sea/20"
              >
                <span className="text-[13px] font-bold text-white">مشاهده در</span>
                <span className="text-[15px] font-extrabold text-sea">ترب</span>
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
            <p className="text-[11px] text-skywash/60">
              © {toFa(1404)} افرالیک — کلیه حقوق محفوظ است. قیمت‌ها به ریال و شامل مالیات بر ارزش افزوده. · {count.toLocaleString("fa-IR")} دستگاه فعال روی ویترین
            </p>
            <div className="flex items-center gap-4">
              <button onClick={onAdmin} className="text-[11px] font-bold text-skywash/60 underline-offset-4 transition-colors hover:text-sea hover:underline">
                پنل مدیریت فروشگاه
              </button>
              <p className="font-mono text-[9px] tracking-[0.25em] text-skywash/40" dir="ltr">COREHAUS · BENCH-TESTED · CALIBRATED · SEALED</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
