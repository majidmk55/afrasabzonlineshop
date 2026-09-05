import { REVIEW_QUOTES } from "../data/laptops";
import { Reveal } from "../lib/motion";
import { IBolt, IStar } from "./icons";

const STEPS = [
  {
    n: "01",
    title: "STRESS-BENCH EVERY UNIT",
    body: "Cinebench R24 and 3DMark Time Spy run on every single machine — not a batch sample. If a unit scores outside 3% of its silicon class, it goes back to the distributor. No exceptions.",
    metric: "R24 MULTI · 3DMARK · CPU-Z",
  },
  {
    n: "02",
    title: "CALIBRATE THE DISPLAY",
    body: "Per-zone color calibration to ΔE < 2 against an X-Rite i1 Pro, white point locked to D65. The signed report — serial number, panel lot, before/after curves — ships inside the box.",
    metric: "ΔE < 2 · D65 · 100% sRGB MIN",
  },
  {
    n: "03",
    title: "THERMAL-SOAK 30 MINUTES",
    body: "Half-hour sustained load at a 40 dBA noise cap. We log fan curves and throttle points so you know exactly what the machine does on lap 30, not lap one.",
    metric: "30-MIN SOAK · 40 dBA CAP",
  },
  {
    n: "04",
    title: "SUPPORT THAT ANSWERS",
    body: "Real technicians on chat, seven days. Compatibility questions before you buy, RMA orchestration after. Median first response last quarter: 9 minutes.",
    metric: "7-DAY CHAT · 9-MIN MEDIAN",
  },
];

export default function Guide() {
  return (
    <>
      {/* The Corehaus Standard — sticky two-column */}
      <section className="dark-panel relative overflow-hidden" aria-label="The Corehaus Standard">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-ember/8 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.22em] text-ember">// WHY BUY HERE</p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight text-paper sm:text-5xl">
                THE COREHAUS
                <br />
                STANDARD<span className="text-ember">.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
                Big-box stores ship laptops straight from the pallet. We open every box, bench
                every board, and sign our name to the numbers. It takes an extra 48 hours.
                It's worth every one of them.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-px border border-panel bg-panel">
                {[["4,218", "UNITS BENCHED IN 2025"], ["0.7%", "REJECTED AT INTAKE"], ["9 MIN", "MEDIAN SUPPORT REPLY"]].map(([v, l]) => (
                  <div key={l} className="bg-coal p-4">
                    <p className="font-display text-2xl font-bold text-ember">{v}</p>
                    <p className="mt-1 font-mono text-[9px] leading-snug tracking-wider text-mist">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <li className="group border border-panel bg-slab/50 p-6 transition-all duration-300 hover:border-ember hover:bg-slab">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-3xl font-semibold text-ember/40 transition-colors group-hover:text-ember">{s.n}</span>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-wide text-paper">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
                      <p className="mt-3 inline-block border border-panel bg-coal px-2.5 py-1 font-mono text-[10px] tracking-wider text-mist">
                        <IBolt size={10} className="mr-1 inline text-ember" />{s.metric}
                      </p>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Field notes — reviews marquee */}
      <section className="border-t border-line bg-card py-14" aria-label="Customer reviews">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-3xl font-bold tracking-tight">FIELD NOTES FROM THE FLOOR.</h2>
              <p className="font-mono text-[11px] tracking-wider text-smoke">4.7 AVG ACROSS 1,412 VERIFIED ORDERS</p>
            </div>
          </Reveal>
        </div>
        <div className="marquee-paused mt-8 overflow-hidden" aria-hidden="false">
          <div className="marquee-track gap-5 px-4" style={{ "--marquee-speed": "46s" } as React.CSSProperties}>
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 gap-5" aria-hidden={dup === 1}>
                {REVIEW_QUOTES.map((r, i) => (
                  <blockquote key={i} className="w-80 shrink-0 border border-line bg-paper p-5 transition-colors hover:border-ember">
                    <span className="flex gap-0.5 text-ember">
                      {[1, 2, 3, 4, 5].map((s) => <IStar key={s} size={12} filled={s <= r.rating} className={s <= r.rating ? "" : "opacity-25"} />)}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed">“{r.quote}”</p>
                    <footer className="mt-4 font-mono text-[10px] tracking-wider text-smoke">
                      {r.name.toUpperCase()} — {r.role.toUpperCase()}
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
