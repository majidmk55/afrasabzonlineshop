import { useState } from "react";
import { BRANDS, CATEGORIES } from "../data/laptops";
import { AmexMark, BankMark, ICheck, McMark, PaypalMark, SocialIg, SocialX, SocialYt, VisaMark, LogoMark } from "./icons";

const FAQS = [
  ["How fast is shipping?", "Orders before 3 PM ET ship same day from our Ohio lab. Free 48-hour delivery over $1,500; standard is 2–4 business days ($29 flat)."],
  ["What's the return policy?", "30 days, no questions, prepaid label. Refund lands within 3 business days of the unit reaching our bench."],
  ["How does the warranty work?", "Manufacturer warranty runs first. After that, Corehaus 2-year cover handles chassis, hinge and battery faults. Accidental-damage cover can be added in cart."],
  ["Which payment methods do you take?", "Visa, Mastercard, Amex, PayPal and instant bank transfer through our PCI-DSS Level 1 portal. Financing over $999 at checkout."],
  ["Do you take trade-ins?", "Yes — quote your old notebook in chat and get up to $600 credit, applied instantly to your order."],
];

interface FooterProps {
  onCategory: (c: string) => void;
  onBrand: (b: string) => void;
}

export default function Footer({ onCategory, onBrand }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);
  const [subErr, setSubErr] = useState(false);

  const subscribe = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setSubErr(true);
      return;
    }
    setSubErr(false);
    setSubbed(true);
  };

  return (
    <footer className="dark-panel border-t border-panel" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {/* newsletter strip */}
        <div className="flex flex-col gap-5 border border-panel bg-slab/50 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">RESTOCK SIGNALS, WEEKLY.</h2>
            <p className="mt-1 text-sm text-mist">One email every Friday: new benches, price drops, flash units. Unsubscribe anytime.</p>
          </div>
          {subbed ? (
            <p className="flex items-center gap-2 border border-moss/50 bg-moss/10 px-4 py-3 font-mono text-xs tracking-wider text-moss">
              <ICheck size={15} /> YOU'RE ON THE LIST — FIRST SIGNAL FRIDAY 07:00 ET
            </p>
          ) : (
            <div className="w-full max-w-md">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && subscribe()}
                  placeholder="you@studio.dev"
                  aria-label="Email for newsletter"
                  className="min-w-0 flex-1 border border-panel bg-coal px-4 py-3 font-mono text-xs tracking-wider text-paper outline-none placeholder:text-mist/50 focus:border-ember"
                />
                <button onClick={subscribe} className="bg-ember px-5 font-mono text-xs font-semibold tracking-wider text-paper transition-colors hover:bg-emberdim">
                  SUBSCRIBE
                </button>
              </div>
              {subErr && <p className="mt-1.5 font-mono text-[10px] tracking-wider text-ember">▲ THAT EMAIL DOESN'T PARSE — TRY AGAIN</p>}
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
          <div>
            <p className="flex items-center gap-2.5">
              <LogoMark size={28} className="text-paper" />
              <span className="font-display text-lg font-bold tracking-tight text-paper">COREHAUS<span className="text-ember">.</span></span>
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-mist">
              A specialty laptop outfitter in Columbus, Ohio. Ten machines on the floor,
              a 42-point bench in the back, and zero patience for uncalibrated panels.
            </p>
            <div className="mt-5 flex gap-2">
              <a href="https://twitter.com/corehaus" target="_blank" rel="noreferrer" aria-label="Corehaus on X" className="flex h-9 w-9 items-center justify-center border border-panel text-mist transition-colors hover:border-ember hover:text-ember"><SocialX /></a>
              <a href="https://instagram.com/corehaus" target="_blank" rel="noreferrer" aria-label="Corehaus on Instagram" className="flex h-9 w-9 items-center justify-center border border-panel text-mist transition-colors hover:border-ember hover:text-ember"><SocialIg /></a>
              <a href="https://youtube.com/@corehaus" target="_blank" rel="noreferrer" aria-label="Corehaus on YouTube" className="flex h-9 w-9 items-center justify-center border border-panel text-mist transition-colors hover:border-ember hover:text-ember"><SocialYt /></a>
            </div>
          </div>

          <nav aria-label="Shop by category">
            <h3 className="font-mono text-[11px] tracking-[0.22em] text-mist">SHOP</h3>
            <ul className="mt-3.5 space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button onClick={() => onCategory(c)} className="text-sm text-paper/80 transition-colors hover:text-ember">
                    {c} laptops
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => onCategory("Gaming")} className="text-sm text-paper/80 transition-colors hover:text-ember">RTX graphics machines</button>
              </li>
              <li>
                <button onClick={() => onCategory("Ultrabook")} className="text-sm text-paper/80 transition-colors hover:text-ember">Sub-1.4 kg ultrabooks</button>
              </li>
            </ul>
          </nav>

          <nav aria-label="Shop by brand">
            <h3 className="font-mono text-[11px] tracking-[0.22em] text-mist">BRANDS</h3>
            <ul className="mt-3.5 grid grid-cols-2 gap-x-3 gap-y-2">
              {BRANDS.map((b) => (
                <li key={b}>
                  <button onClick={() => onBrand(b)} className="text-sm text-paper/80 transition-colors hover:text-ember">{b}</button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-[11px] tracking-[0.22em] text-mist">SUPPORT / FAQ</h3>
            <div className="mt-3 divide-y divide-panel border-y border-panel">
              {FAQS.map(([q, a]) => (
                <details key={q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2.5 text-sm text-paper/85 transition-colors hover:text-ember [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="font-mono text-ember transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-3 text-xs leading-relaxed text-mist">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-panel pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <VisaMark /><McMark /><AmexMark /><PaypalMark /><BankMark />
          </div>
          <p className="font-mono text-[10px] leading-relaxed tracking-wider text-mist/70">
            © 2026 COREHAUS SUPPLY CO. · COLUMBUS, OH · <span className="text-ember">PCI-DSS L1</span> CHECKOUT · PRICES IN USD
          </p>
        </div>
      </div>
    </footer>
  );
}
