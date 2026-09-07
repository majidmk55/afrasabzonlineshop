import { useMemo, useRef, useState } from "react";
import { fmt, type Laptop } from "../data/laptops";
import { ICart, IChevron, IClose, ICompare, IGear, IMenu, ISearch, LogoMark } from "./icons";

const CATEGORIES = ["گیمینگ", "خلاقیت و رندر", "بیزنس و اداری", "اولترابوک"];

interface HeaderProps {
  products: Laptop[];
  cartCount: number;
  compareCount: number;
  onCartOpen: () => void;
  onSearch: (q: string) => void;
  onOpenProduct: (id: string) => void;
  onCategory: (cat: string) => void;
  onCompareOpen: () => void;
  onHome: () => void;
  onAdmin: () => void;
}

export default function Header({ products, cartCount, compareCount, onCartOpen, onSearch, onOpenProduct, onCategory, onCompareOpen, onHome, onAdmin }: HeaderProps) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.brand.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.highlights.some((h) => h.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [text, products]);

  const submit = () => {
    onSearch(text);
    setFocused(false);
    inputRef.current?.blur();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[90%] items-center gap-3 px-2 py-3 sm:px-4">
        <button onClick={onHome} className="group flex items-center gap-2.5" aria-label="کورهِوس — صفحه اصلی">
          <LogoMark size={30} className="text-ink transition-transform duration-300 group-hover:-rotate-12" />
          <span className="font-display text-xl font-bold tracking-tight">
            کورهِوس<span className="text-sea">.</span>
          </span>
        </button>

        <nav className="ms-6 hidden items-center gap-1 lg:flex" aria-label="دسته‌بندی‌ها">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => onCategory(c)}
              className="rounded-full px-3.5 py-1.5 text-xs font-bold text-mist transition-colors hover:bg-ink hover:text-white"
            >
              {c}
            </button>
          ))}
        </nav>

        {/* جست‌وجو */}
        <div className="relative ms-auto w-full max-w-xs sm:max-w-sm">
          <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 transition-colors focus-within:border-sea">
            <ISearch size={16} className="shrink-0 text-mist" />
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="جست‌وجوی دستگاه، برند، مشخصات…"
              aria-label="جست‌وجوی لپ‌تاپ"
              className="w-full bg-transparent text-sm outline-none placeholder:text-mist/70"
            />
            {text && (
              <button onClick={() => setText("")} aria-label="پاک کردن جست‌وجو">
                <IClose size={14} className="text-mist" />
              </button>
            )}
          </div>
          {focused && suggestions.length > 0 && (
            <div className="panel-in absolute left-0 right-0 top-full mt-1.5 overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onOpenProduct(s.id);
                    setText("");
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-skywash"
                >
                  <img src={s.image} alt="" className="h-9 w-12 rounded object-cover" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{s.name}</span>
                    <span className="text-[10px] text-mist">{s.category} · {fmt(s.price)}</span>
                  </span>
                  <ISearch size={13} className="text-mist" />
                </button>
              ))}
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="w-full border-t border-line px-3 py-2 text-right text-[11px] font-bold text-sea hover:bg-skywash"
              >
                مشاهده همه نتایج «{text}» ←
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onCompareOpen}
          className="relative hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold transition-colors hover:border-ink md:flex"
          aria-label={`مقایسه — ${compareCount} کالا انتخاب شده`}
        >
          <ICompare size={16} />
          <span className="hidden xl:inline">مقایسه</span>
          {compareCount > 0 && (
            <span key={compareCount} className="rise-in absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
              {compareCount.toLocaleString("fa-IR")}
            </span>
          )}
        </button>

        <button
          onClick={onCartOpen}
          className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
          aria-label={`سبد خرید — ${cartCount} کالا`}
        >
          <ICart size={17} />
          <span className="hidden sm:inline">سبد خرید</span>
          {cartCount > 0 && (
            <span key={cartCount} className="rise-in absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sea text-[10px] font-bold text-white">
              {cartCount.toLocaleString("fa-IR")}
            </span>
          )}
        </button>

        <button
          onClick={onAdmin}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mist transition-all hover:rotate-45 hover:border-sea hover:text-sea"
          aria-label="پنل مدیریت"
          title="پنل مدیریت"
        >
          <IGear size={17} />
        </button>

        <button className="rounded-full border border-line p-2 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="منو">
          {menuOpen ? <IClose size={18} /> : <IMenu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="rise-in border-t border-line bg-white px-4 py-2 lg:hidden" aria-label="دسته‌بندی‌ها (موبایل)">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                onCategory(c);
                setMenuOpen(false);
              }}
              className="flex w-full items-center justify-between border-b border-line/60 py-2.5 text-sm font-bold last:border-0"
            >
              {c} <IChevron size={14} className="text-mist" />
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
