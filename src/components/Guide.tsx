import { REVIEW_QUOTES } from "../data/laptops";
import { Reveal } from "../lib/motion";
import { IBolt, IStar } from "./icons";

const STEPS = [
  {
    n: "۰۱",
    title: "بنچمارک تک‌تک دستگاه‌ها",
    body: "Cinebench R24 و بنچمارک گرافیک روی همه دستگاه‌ها اجرا می‌شود — نه نمونه‌ای از یک پالت. اگر دستگاهی بیش از ۳٪ از کلاس سیلیکون خودش فاصله داشته باشد، به توزیع‌کننده برمی‌گردد. بدون استثنا.",
    metric: "R24 MULTI · GPU BENCH · CPU-Z",
  },
  {
    n: "۰۲",
    title: "کالیبراسیون نمایشگر",
    body: "کالیبراسیون رنگ ناحیه‌به‌ناحیه تا ΔE کمتر از ۲ با دستگاه X-Rite و نقطه سفید D65. گزارش امضاشده — شماره سریال، سری پنل و منحنی قبل و بعد — داخل همان جعبه ارسال می‌شود.",
    metric: "ΔE < 2 · D65 · sRGB 100%",
  },
  {
    n: "۰۳",
    title: "تست حرارتی ۳۰ دقیقه‌ای",
    body: "نیم‌ساعت بار پایدار با سقف نویز ۴۰ دسی‌بل. منحنی فن و نقاط افت فرکانس را ثبت می‌کنیم تا بدانید دستگاه در دقیقه ۳۰ چه رفتاری دارد، نه دقیقه اول.",
    metric: "30-MIN SOAK · 40 dBA",
  },
  {
    n: "۰۴",
    title: "پشتیبانی که جواب می‌دهد",
    body: "تکنسین واقعی در چت، هفت روز هفته. قبل از خرید پاسخ سازگاری، بعد از خرید پیگیری گارانتی. میانه زمان پاسخ‌گویی فصل گذشته: ۹ دقیقه.",
    metric: "چت ۷ روز · پاسخ میانه ۹ دقیقه",
  },
];

export default function Guide() {
  return (
    <>
      {/* استاندارد افرالیک — sticky two-column */}
      <section className="dark-panel relative overflow-hidden" aria-label="استاندارد افرالیک">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-sea/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[80%] gap-12 px-2 py-16 sm:px-4 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="text-[11px] font-extrabold tracking-wide text-sea">چرا از ما بخرید؟</p>
              <h2 className="mt-3 font-display text-5xl leading-[1.15] text-white sm:text-6xl">
                استانداردِ
                <br />
                افرالیک<span className="text-sea">.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-8 text-skywash/80">
                فروشگاه‌های بزرگ لپ‌تاپ را مستقیم از پالت می‌فرستند. ما هر جعبه را باز می‌کنیم،
                هر بُرد را زیر دستگاه می‌بریم و پای عدد‌هایش امضا می‌کنیم. ۴۸ ساعت بیشتر طول
                می‌کشد — و به تک‌تک دقایقش می‌ارزد.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-2.5">
                {[["۴٬۲۱۸", "دستگاه تست‌شده در ۱۴۰۳"], ["۰.۷٪", "ردشده در پذیرش"], ["۹ دقیقه", "میانه پاسخ پشتیبانی"]].map(([v, l]) => (
                  <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-sea/50">
                    <p className="font-display text-2xl text-sea" dir="ltr">{v}</p>
                    <p className="mt-1 text-[9px] font-medium leading-5 tracking-wide text-skywash/70">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <li className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-sea/60 hover:bg-white/10">
                  <div className="flex items-start gap-5">
                    <span className="font-display text-4xl leading-none text-sea/50 transition-colors group-hover:text-sea">{s.n}</span>
                    <div>
                      <h3 className="font-display text-2xl text-white">{s.title}</h3>
                      <p className="mt-2 text-sm leading-8 text-skywash/80">{s.body}</p>
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-deep px-3 py-1 font-mono text-[10px] tracking-wide text-skywash/80" dir="ltr">
                        <IBolt size={10} className="text-sea" />{s.metric}
                      </p>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* یادداشت‌های میدانی — reviews marquee */}
      <section className="border-t border-line bg-foam/60 py-14" aria-label="دیدگاه خریداران">
        <div className="mx-auto max-w-[80%] px-2 sm:px-4">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold tracking-wide text-sea">یادداشت‌های میدانی</p>
                <h2 className="mt-1 font-display text-4xl text-ink">حرفِ کسانی که کارنامه گرفتند.</h2>
              </div>
              <p className="rounded-full bg-card px-4 py-2 text-[11px] font-bold text-mist shadow-sm">میانگین ۴.۷ از ۱٬۴۱۲ سفارش تأییدشده</p>
            </div>
          </Reveal>
        </div>
        <div className="marquee-paused mt-8 overflow-hidden">
          <div className="marquee-track gap-5 px-4" style={{ "--marquee-speed": "48s" } as React.CSSProperties}>
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 gap-5" aria-hidden={dup === 1}>
                {REVIEW_QUOTES.map((r, i) => (
                  <blockquote key={i} className="w-80 shrink-0 rounded-2xl border border-line bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-sea hover:shadow-lg">
                    <span className="flex gap-0.5 text-sea">
                      {[1, 2, 3, 4, 5].map((s) => <IStar key={s} size={12} filled={s <= r.rating} className={s <= r.rating ? "" : "opacity-25"} />)}
                    </span>
                    <p className="mt-3 text-sm leading-7">«{r.quote}»</p>
                    <footer className="mt-4 text-[10px] font-bold tracking-wide text-mist">
                      {r.name} — {r.role}
                    </footer>
                  </blockquote>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
