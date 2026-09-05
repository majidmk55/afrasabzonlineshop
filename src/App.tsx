import { lazy, Suspense, useMemo, useState } from "react";
import Header from "./components/Header";
import Showroom from "./components/Showroom";
import Catalog, { DEFAULT_FILTERS, type Filters } from "./components/Catalog";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import { CompareTray, CompareModal } from "./components/Compare";
import Guide from "./components/Guide";
import Footer from "./components/Footer";
import { PROMOS, type CartLine, type Laptop } from "./data/laptops";
import { loadOrders, loadProducts, loadSettings, saveOrders, saveProducts, saveSettings, visibleProducts, type OrderRecord, type Settings } from "./lib/store";
import { scrollToId } from "./lib/motion";
import { ICheck } from "./components/icons";

const Admin = lazy(() => import("./components/Admin"));

interface CartEntry { qty: number; warranty: boolean }

export default function App() {
  const [products, setProducts] = useState<Laptop[]>(loadProducts);
  const [orders, setOrders] = useState<OrderRecord[]>(loadOrders);
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const [cart, setCart] = useState<Record<string, CartEntry>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [promo, setPromo] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [adminOpen, setAdminOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);

  /* کالاهای قابل‌نمایش برای مشتریان — ناموجودها خودکار خاموش می‌شوند */
  const visible = useMemo(() => visibleProducts(products, settings), [products, settings]);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, e]) => {
          const laptop = products.find((l) => l.id === id);
          return laptop ? { laptop, qty: Math.min(e.qty, Math.max(1, laptop.stock)), warranty: e.warranty } : null;
        })
        .filter((x): x is CartLine => x !== null && x.laptop.stock > 0),
    [cart, products]
  );
  const cartCount = lines.reduce((a, l) => a + l.qty, 0);

  const notify = (msg: string) => {
    const id = Date.now();
    setToast({ id, msg });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2600);
  };

  const updateProducts = (next: Laptop[]) => {
    setProducts(next);
    saveProducts(next);
  };

  const updateSettings = (s: Settings) => {
    setSettings(s);
    saveSettings(s);
  };

  const recordOrder = (order: OrderRecord) => {
    const next = [order, ...orders];
    setOrders(next);
    saveOrders(next);
    /* کاهش موجودی پس از خرید موفق */
    updateProducts(
      products.map((p) => {
        const it = order.items.find((i) => i.id === p.id);
        return it ? { ...p, stock: Math.max(0, p.stock - it.qty) } : p;
      })
    );
  };

  const addToCart = (id: string, qty = 1, warranty = false) => {
    const l = products.find((x) => x.id === id);
    if (!l) return;
    setCart((c) => ({
      ...c,
      [id]: {
        qty: Math.min(l.stock, (c[id]?.qty ?? 0) + qty),
        warranty: warranty || c[id]?.warranty || false,
      },
    }));
    notify(`${l.shortName} به سبد اضافه شد`);
  };

  const setQty = (id: string, qty: number) => {
    setCart((c) => {
      if (qty <= 0) {
        const { [id]: _drop, ...rest } = c;
        return rest;
      }
      const l = products.find((x) => x.id === id);
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
        notify("حداکثر ۳ کالا قابل مقایسه است");
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
    return "کد نامعتبر است — CORE10 را امتحان کنید";
  };

  const openProduct = (id: string) => {
    setCompareOpen(false);
    setProductId(id);
  };

  const setFiltersAndScroll = (patch: Partial<Filters>) => {
    setFilters({ ...DEFAULT_FILTERS, ...patch });
    scrollToId("catalog");
  };

  if (adminOpen) {
    return (
      <Suspense
        fallback={
          <div className="dark-panel flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="spin-slow h-10 w-10 rounded-full border-2 border-panel border-t-sea" />
              <p className="font-mono text-xs tracking-widest text-mist">در حال بارگذاری پنل مدیریت…</p>
            </div>
          </div>
        }
      >
        <Admin
          products={products}
          orders={orders}
          settings={settings}
          onProducts={updateProducts}
          onSettings={updateSettings}
          onExit={() => setAdminOpen(false)}
        />
      </Suspense>
    );
  }

  const activeProduct = productId ? visible.find((l) => l.id === productId) ?? products.find((l) => l.id === productId) ?? null : null;

  return (
    <div className="min-h-screen">
      <a href="#catalog" className="sr-only focus:not-sr-only focus:absolute focus:right-2 focus:top-2 focus:z-[100] focus:bg-sea focus:px-3 focus:py-2 focus:text-xs focus:text-white">
        پرش به فهرست کالاها
      </a>

      <Header
        products={visible}
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
        onAdmin={() => setAdminOpen(true)}
      />

      <main>
        <Showroom products={visible} onAdd={addToCart} onSpecs={openProduct} onExplore={() => scrollToId("catalog")} />
        <Catalog
          products={visible}
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
        count={visible.length}
        onCategory={(c) => setFiltersAndScroll({ cats: [c] })}
        onBrand={(b) => setFiltersAndScroll({ brands: [b] })}
        onAdmin={() => setAdminOpen(true)}
      />

      {/* overlays */}
      {activeProduct && (
        <ProductModal
          key={activeProduct.id}
          laptop={activeProduct}
          products={visible}
          onClose={() => setProductId(null)}
          onAdd={(id, qty, warranty) => addToCart(id, qty, warranty)}
          onToggleCompare={toggleCompare}
          compared={compareIds.includes(activeProduct.id)}
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
          onComplete={(order) => {
            recordOrder(order);
            setCart({});
            setPromo(null);
          }}
        />
      )}

      {!compareOpen && (
        <CompareTray
          products={products}
          ids={compareIds}
          onRemove={(id) => setCompareIds((ids) => ids.filter((x) => x !== id))}
          onClear={() => setCompareIds([])}
          onOpen={() => setCompareOpen(true)}
          onOpenProduct={openProduct}
        />
      )}
      {compareOpen && (
        <CompareModal
          products={visible}
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
        <div key={toast.id} className="rise-in fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 shadow-xl" role="status">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss text-white"><ICheck size={13} /></span>
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
