import { useMemo, useState } from "react";
import Header from "./components/Header";
import Showroom from "./components/Showroom";
import Catalog, { DEFAULT_FILTERS, type Filters } from "./components/Catalog";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import { CompareTray, CompareModal } from "./components/Compare";
import Guide from "./components/Guide";
import Footer from "./components/Footer";
import { LAPTOPS, PROMOS, type CartLine } from "./data/laptops";
import { scrollToId } from "./lib/motion";
import { ICheck } from "./components/icons";

interface CartEntry { qty: number; warranty: boolean }

export default function App() {
  const [cart, setCart] = useState<Record<string, CartEntry>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [promo, setPromo] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, e]) => {
          const laptop = LAPTOPS.find((l) => l.id === id);
          return laptop ? { laptop, qty: e.qty, warranty: e.warranty } : null;
        })
        .filter((x): x is CartLine => x !== null),
    [cart]
  );
  const cartCount = lines.reduce((a, l) => a + l.qty, 0);

  const notify = (msg: string) => {
    const id = Date.now();
    setToast({ id, msg });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2600);
  };

  const addToCart = (id: string, qty = 1, warranty = false) => {
    const l = LAPTOPS.find((x) => x.id === id);
    if (!l) return;
    setCart((c) => ({
      ...c,
      [id]: {
        qty: Math.min(l.stock, (c[id]?.qty ?? 0) + qty),
        warranty: warranty || c[id]?.warranty || false,
      },
    }));
    notify(`«${l.shortName}» به سبد خرید اضافه شد`);
  };

  const setQty = (id: string, qty: number) => {
    setCart((c) => {
      if (qty <= 0) {
        const { [id]: _drop, ...rest } = c;
        return rest;
      }
      const l = LAPTOPS.find((x) => x.id === id);
      return { ...c, [id]: { ...c[id], qty: Math.min(l?.stock ?? 99, qty) } };
    });
  };

  const removeLine = (id: string) =>
    setCart((c) => {
      const { [id]: _drop, ...rest } = c;
      return rest;
    });

  const toggleWarranty = (id: string) =>
    setCart((c) => ({ ...c, [id]: { ...c[id], warranty: !c[id].warranty } }));

  const toggleCompare = (id: string) => {
    setCompareIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id);
      if (ids.length >= 3) {
        notify("سینی مقایسه پر است — حداکثر ۳ دستگاه");
        return ids;
      }
      return [...ids, id];
    });
  };

  const applyPromo = (code: string): string | null => {
    if (!code) {
      setPromo(null);
      return null;
    }
    if (PROMOS[code]) {
      setPromo(code);
      return null;
    }
    return "کد نامعتبر است؛ CORE10 یا RAYEGAN را امتحان کنید";
  };

  const openProduct = (id: string) => {
    setCompareOpen(false);
    setProductId(id);
  };

  const setFiltersAndScroll = (patch: Partial<Filters>) => {
    setFilters({ ...DEFAULT_FILTERS, ...patch });
    scrollToId("catalog");
  };

  return (
    <div className="min-h-screen">
      <a href="#catalog" className="sr-only focus:not-sr-only focus:absolute focus:right-2 focus:top-2 focus:z-[100] focus:rounded-full focus:bg-sea focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white">
        پرش به فهرست محصولات
      </a>

      <Header
        cartCount={cartCount}
        compareCount={compareIds.length}
        onCartOpen={() => setCartOpen(true)}
        onSearch={(q) => {
          setFilters((f) => ({ ...f, q }));
          scrollToId("catalog");
        }}
        onOpenProduct={openProduct}
        onCategory={(c) => setFiltersAndScroll({ cats: [c] })}
        onCompareOpen={() => compareIds.length >= 2 && setCompareOpen(true)}
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      <main>
        <Showroom
          onAdd={addToCart}
          onSpecs={openProduct}
          onExplore={() => scrollToId("catalog")}
        />
        <Catalog
          filters={filters}
          patch={(p) => setFilters((f) => ({ ...f, ...p }))}
          reset={() => setFilters(DEFAULT_FILTERS)}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
          onAdd={addToCart}
          onOpen={openProduct}
        />
        <Guide />
      </main>

      <Footer
        onCategory={(c) => setFiltersAndScroll({ cats: [c] })}
        onBrand={(b) => setFiltersAndScroll({ brands: [b] })}
      />

      {/* overlays */}
      {productId && (
        <ProductModal
          key={productId}
          laptop={LAPTOPS.find((l) => l.id === productId)!}
          onClose={() => setProductId(null)}
          onAdd={(id, qty, warranty) => addToCart(id, qty, warranty)}
          onToggleCompare={toggleCompare}
          compared={compareIds.includes(productId)}
          onOpen={openProduct}
        />
      )}

      {cartOpen && (
        <CartDrawer
          lines={lines}
          promo={promo}
          onApplyPromo={applyPromo}
          onClose={() => setCartOpen(false)}
          onSetQty={setQty}
          onRemove={removeLine}
          onToggleWarranty={toggleWarranty}
          onCheckout={() => {
            if (lines.length === 0) return;
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />
      )}

      {checkoutOpen && (
        <Checkout
          lines={lines}
          promo={promo}
          onApplyPromo={applyPromo}
          onClose={() => setCheckoutOpen(false)}
          onComplete={() => {
            setCart({});
            setPromo(null);
          }}
        />
      )}

      {!compareOpen && (
        <CompareTray
          ids={compareIds}
          onRemove={(id) => setCompareIds((ids) => ids.filter((x) => x !== id))}
          onClear={() => setCompareIds([])}
          onOpen={() => setCompareOpen(true)}
          onOpenProduct={openProduct}
        />
      )}
      {compareOpen && (
        <CompareModal
          ids={compareIds}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => {
            setCompareIds((ids) => ids.filter((x) => x !== id));
            if (compareIds.length <= 2) setCompareOpen(false);
          }}
          onAdd={(id) => {
            addToCart(id);
            setCompareOpen(false);
          }}
          onOpenProduct={openProduct}
        />
      )}

      {toast && (
        <div key={toast.id} className="rise-in fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 rounded-full border border-line bg-deep py-2.5 pe-5 ps-3 shadow-2xl" role="status">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss text-white"><ICheck size={13} /></span>
          <span className="text-[11px] font-bold text-white">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
