import { useMemo, useRef, useState } from "react";
import { CATEGORIES, LAPTOPS, fmt } from "../data/laptops";
import { ICart, IChevron, IClose, ICompare, IMenu, ISearch, LogoMark, IBolt } from "./icons";

const TICKER = [
  "FREE 48-HOUR SHIPPING OVER $1,500",
  "CODE VOLT10 — 10% OFF YOUR FIRST ORDER",
  "EVERY UNIT SHIPS WITH A 42-POINT BENCHMARK REPORT",
  "RTX 4090 CLASS MACHINES IN STOCK — 3 UNITS",
  "TRADE-IN CREDIT UP TO $600 ON OLD NOTEBOOKS",
  "DISPLAYS CALIBRATED TO ΔE < 2 BEFORE DISPATCH",
];

interface HeaderProps {
  cartCount: number;
  compareCount: number;
  onCartOpen: () => void;
  onSearch: (q: string) => void;
  onOpenProduct: (id: string) => void;
  onCategory: (cat: string) => void;
  onCompareOpen: () => void;
  onHome: () => void;
}

export default function Header({ cartCount, compareCount, onCartOpen, onSearch, onOpenProduct, onCategory, onCompareOpen, onHome }: HeaderProps) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (q.length < 2) return [];
    return LAPTOPS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.highlights.some((h) => h.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [text]);

  const submit = () => {
    onSearch(text);
    setFocused(false);
    inputRef.current?.blur();
  };

  return (
    <>
      {/* promo ticker */}
      <div className="marquee-paused bg-coal text-paper overflow-hidden border-b border-panel" aria-hidden="true">
        <div className="marquee-track" style={{ "--marquee-speed": "38s" } as React.CSSProperties}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {TICKER.map((t) => (
                <span key={t + dup} className="flex items-center gap-3 px-5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-mist">
                  <IBolt size={11} className="text-ember" /> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <button onClick={onHome} className="group flex items-center gap-2.5" aria-label="Corehaus home">
            <LogoMark size={30} className="text-ink transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-display text-xl font-bold tracking-tight">
              COREHAUS<span className="text-ember">.</span>
            </span>
          </button>

          <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => onCategory(c)}
                className="rounded px-3 py-1.5 font-mono text-xs tracking-wider text-smoke transition-colors hover:bg-ink hover:text-paper"
              >
                {c.toUpperCase()}
              </button>
            ))}
          </nav>

          {/* search */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm">
            <div className="flex items-center gap-2 border border-line bg-card px-3 py-2 transition-colors focus-within:border-ink">
              <ISearch size={16} className="shrink-0 text-smoke" />
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 120)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Search 10 machines, specs, brands…"
                aria-label="Search laptops"
                className="w-full bg-transparent text-sm outline-none placeholder:text-smoke/70"
              />
              {text && (
                <button onClick={() => setText("")} aria-label="Clear search">
                  <IClose size={14} className="text-smoke" />
                </button>
              )}
            </div>
            {focused && suggestions.length > 0 && (
              <div className="panel-in absolute left-0 right-0 top-full mt-1.5 border border-line bg-card shadow-xl">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onOpenProduct(s.id);
                      setText("");
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-paper"
                  >
                    <img src={s.image} alt="" className="h-9 w-12 object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{s.name}</span>
                      <span className="font-mono text-[10px] text-smoke">{s.category} · {fmt(s.price)}</span>
                    </span>
                    <ISearch size={13} className="text-smoke" />
                  </button>
                ))}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="w-full border-t border-line px-3 py-2 text-left font-mono text-[11px] tracking-wider text-ember hover:bg-paper"
                >
                  SEE ALL RESULTS FOR “{text.toUpperCase()}” →
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onCompareOpen}
            className="relative hidden items-center gap-2 border border-line bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-ink md:flex"
            aria-label={`Open compare tray, ${compareCount} selected`}
          >
            <ICompare size={16} />
            <span className="hidden xl:inline">Compare</span>
            {compareCount > 0 && (
              <span key={compareCount} className="rise-in absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-ink font-mono text-[10px] text-paper">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 bg-ink px-3.5 py-2 text-xs font-semibold text-paper transition-transform hover:-translate-y-0.5 active:translate-y-0"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <ICart size={17} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span key={cartCount} className="rise-in absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-ember font-mono text-[10px] font-semibold text-paper">
                {cartCount}
              </span>
            )}
          </button>

          <button className="border border-line p-2 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <IClose size={18} /> : <IMenu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="rise-in border-t border-line bg-card px-4 py-2 lg:hidden" aria-label="Categories mobile">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onCategory(c);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center justify-between border-b border-line/60 py-2.5 font-mono text-xs tracking-wider last:border-0"
              >
                {c.toUpperCase()} <IChevron size={14} className="text-smoke" />
              </button>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
