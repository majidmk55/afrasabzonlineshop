import { useMemo, useRef, useState } from "react";
import { CATEGORIES, LAPTOPS, fmt, toFa } from "../data/laptops";
import { ICart, IChevron, IClose, ICompare, IMenu, ISearch, LogoMark, IBolt } from "./icons";

const TICKER = [
  "ارسال رایگان ۴۸ ساعته برای سفارش‌های بالای ۱۵۰ میلیون ریال",
  "کد CORE10 — ۱۰٪ تخفیف اولین خرید",
  "هر دستگاه با گزارش بنچمارک ۴۲ مرحله‌ای ارسال می‌شود",
  "گارانتی ۲ ساله کورهِوس روی همه مدل‌ها",
  "کالیبراسیون نمایشگر تا ΔE < 2 پیش از ارسال",
  "خرید اقساطی ۳ تا ۱۲ ماهه با اعتبارسنجی آنلاین",
  "۷ روز مهلت مرجوعی بدون قیدوشرط",
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
        l.brand.includes(text.trim()) ||
        l.category.includes(text.trim()) ||
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
      <div className="marquee-paused overflow-hidden bg-deep text-white" aria-hidden="true">
        <div className="marquee-track" style={{ "--marquee-speed": "40s" } as React.CSSProperties}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {TICKER.map((t) => (
                <span key={t + dup} className="flex items-center gap-2 px-5 py-1.5 text-[11px] font-medium tracking-wide text-skywash">
                  <IBolt size={11} className="text-sea" /> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <button onClick={onHome} className="group flex items-center gap-2.5" aria-label="صفحه اصلی کورهِوس">
            <LogoMark size={32} className="text-sea transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="flex flex-col items-start leading-none">
              <span className="font-display text-2xl text-ink">کورهِوس</span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-mist">COREHAUS · IR</span>
            </span>
          </button>

          <nav className="ms-4 hidden items-center gap-1 lg:flex" aria-label="دسته‌بندی‌ها">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => onCategory(c)}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-mist transition-colors hover:bg-skywash hover:text-seadark"
              >
                {c}
              </button>
            ))}
          </nav>

          {/* search */}
          <div className="relative ms-auto w-full max-w-xs sm:max-w-sm">
            <div className="flex items-center gap-2 rounded-full border border-line bg-foam px-4 py-2 transition-colors focus-within:border-sea">
              <ISearch size={16} className="shrink-0 text-mist" />
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 120)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="جست‌وجوی لپ‌تاپ، برند یا مشخصات…"
                aria-label="جست‌وجوی لپ‌تاپ"
                className="w-full bg-transparent text-sm outline-none placeholder:text-mist/70"
              />
              {text && (
                <button onClick={() => setText("")} aria-label="پاک‌کردن جست‌وجو">
                  <IClose size={14} className="text-mist" />
                </button>
              )}
            </div>
            {focused && suggestions.length > 0 && (
              <div className="panel-in absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-line bg-card shadow-xl">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onOpenProduct(s.id);
                      setText("");
                    }}
                    className="flex w-full items-center gap-3 border-b border-line/60 px-3 py-2 text-start transition-colors last:border-0 hover:bg-skywash/60"
                  >
                    <img src={s.image} alt="" className="h-9 w-12 shrink-0 rounded-md object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{s.name}</span>
                      <span className="text-[10px] text-mist">{s.category} · {fmt(s.price)}</span>
                    </span>
                    <IChevron size={13} className="rotate-180 text-mist" />
                  </button>
                ))}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="w-full bg-foam px-3 py-2 text-start text-[11px] font-semibold text-sea transition-colors hover:bg-skywash"
                >
                  مشاهده همه نتایج «{text}» ←
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onCompareOpen}
            className="relative hidden items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-semibold transition-colors hover:border-sea hover:text-sea md:flex"
            aria-label={`بازکردن مقایسه — ${toFa(compareCount)} دستگاه انتخاب‌شده`}
          >
            <ICompare size={16} />
            <span className="hidden xl:inline">مقایسه</span>
            {compareCount > 0 && (
              <span key={compareCount} className="rise-in absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-deep text-[10px] font-bold text-white">
                {toFa(compareCount)}
              </span>
            )}
          </button>

          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 rounded-full bg-sea px-4 py-2 text-xs font-bold text-white transition-all hover:bg-seadark hover:shadow-lg active:scale-95"
            aria-label={`بازکردن سبد خرید — ${toFa(cartCount)} کالا`}
          >
            <ICart size={17} />
            <span className="hidden sm:inline">سبد خرید</span>
            {cartCount > 0 && (
              <span key={cartCount} className="rise-in absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-deep px-1 text-[10px] font-bold text-white ring-2 ring-card">
                {toFa(cartCount)}
              </span>
            )}
          </button>

          <button className="rounded-full border border-line p-2 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="منو">
            {menuOpen ? <IClose size={18} /> : <IMenu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="rise-in border-t border-line bg-card px-4 py-2 lg:hidden" aria-label="دسته‌بندی‌ها (موبایل)">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onCategory(c);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center justify-between border-b border-line/60 py-3 text-sm font-medium last:border-0"
              >
                {c} <IChevron size={14} className="-rotate-90 text-mist" />
              </button>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
