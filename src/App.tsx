import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import Guide from "./components/Guide";
import Footer from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CompareTray } from "./components/Compare";
import { PROMOS, type CartLine, type Laptop } from "./data/laptops";
import { loadOrders, loadProducts, loadSettings, saveOrders, saveProducts, saveSettings, visibleProducts, type OrderRecord, type Settings } from "./lib/store";
import { scrollToId } from "./lib/motion";
import { ICheck } from "./components/icons";

// Lazy load سنگین‌ترین کامپوننت‌ها
const Admin = lazy(() => import("./components/Admin"));
const ProductModal = lazy(() => import("./components/ProductModal"));
const CartDrawer = lazy(() => import("./components/CartDrawer"));
const Checkout = lazy(() => import("./components/Checkout"));
const ComparePage = lazy(() => import("./components/ComparePage"));
const LiveChat = lazy(() => import("./components/LiveChat"));
const AuthModal = lazy(() => import("./components/AuthModal"));

interface CartEntry { qty: number; warranty: boolean }

export default function App() {
  const [products, setProducts] = useState<Laptop[]>(loadProducts);
  const [orders, setOrders] = useState<OrderRecord[]>(loadOrders);
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const [cart, setCart] = useState<Record<string, CartEntry>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [productId, setProductId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [comparePageOpen, setComparePageOpen] = useState(false);
  const [compareIdsForPage, setCompareIdsForPage] = useState<string[]>([]);
  const [promo, setPromo] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ q: string; cats: string[]; brands: string[]; minPrice: number; maxPrice: number; inStockOnly: boolean; sort: string }>({
    q: "",
    cats: [],
    brands: [],
    minPrice: 0,
    maxPrice: 400_000_000,
    inStockOnly: false,
    sort: "featured",
  });
  const [adminOpen, setAdminOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);

  /* کالاهای قابل‌نمایش برای مشتریان — ناموجودها خودکار خاموش می‌شوند */
  const visible = useMemo(() => visibleProducts(products, settings), [products, settings]);

  /* Build a lookup map for O(1) product access — avoids repeated .find() calls */
  const productMap = useMemo(() => {
    const map = new Map<string, Laptop>();
    for (const p of products) map.set(p.id, p);
    return map;
  }, [products]);

  const lines: CartLine[] = useMemo(() => {
    const result: CartLine[] = [];
    for (const [id, e] of Object.entries(cart)) {
      const laptop = productMap.get(id);
      if (laptop && laptop.stock > 0) {
        result.push({
          laptop,
          qty: Math.min(e.qty, Math.max(1, laptop.stock)),
          warranty: e.warranty,
        });
      }
    }
    return result;
  }, [cart, productMap]);

  const cartCount = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines]);

  const notify = useCallback((msg: string) => {
    const id = Date.now();
    setToast({ id, msg });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2600);
  }, []);

  const updateProducts = useCallback((next: Laptop[]) => {
    setProducts(next);
    saveProducts(next);
  }, []);

  const updateSettings = useCallback((s: Settings) => {
    setSettings(s);
    saveSettings(s);
  }, []);

  const recordOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => {
      const next = [order, ...prev];
      saveOrders(next);
      return next;
    });
    /* کاهش موجودی پس از خرید موفق */
    setProducts((prev) => {
      const next = prev.map((p) => {
        const it = order.items.find((i) => i.id === p.id);
        return it ? { ...p, stock: Math.max(0, p.stock - it.qty) } : p;
      });
      saveProducts(next);
      return next;
    });
  }, []);

  const addToCart = useCallback((id: string, qty = 1, warranty = false) => {
    const l = productMap.get(id);
    if (!l) return;
    setCart((c) => ({
      ...c,
      [id]: {
        qty: Math.min(l.stock, (c[id]?.qty ?? 0) + qty),
        warranty: warranty || c[id]?.warranty || false,
      },
    }));
    notify(`${l.shortName} به سبد اضافه شد`);
  }, [productMap, notify]);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => {
      if (qty <= 0) {
        const { [id]: _drop, ...rest } = c;
        return rest;
      }
      const l = productMap.get(id);
      return { ...c, [id]: { ...c[id], qty: Math.min(l?.stock ?? 99, qty) } };
    });
  }, [productMap]);

  const removeLine = useCallback((id: string) => {
    setCart((c) => {
      const { [id]: _drop, ...rest } = c;
      return rest;
    });
  }, []);

  const toggleWarranty = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: { ...c[id], warranty: !c[id].warranty } }));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id);
      if (ids.length >= 4) {
        notify("حداکثر ۴ کالا قابل مقایسه است");
        return ids;
      }
      return [...ids, id];
    });
  }, [notify]);

  const applyPromo = useCallback((code: string): string | null => {
    if (!code) {
      setPromo(null);
      return null;
    }
    if (PROMOS[code]) {
      setPromo(code);
      return null;
    }
    return "کد نامعتبر است — CORE10 را امتحان کنید";
  }, []);

  const openProduct = useCallback((id: string) => {
    setProductId(id);
  }, []);

  const setFiltersAndScroll = useCallback((patch: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    scrollToId("catalog");
  }, []);

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
    <ErrorBoundary>
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
        onCompareOpen={() => {
          if (compareIds.length >= 2) {
            setCompareIdsForPage(compareIds);
            setComparePageOpen(true);
          }
        }}
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onAdmin={() => setAdminOpen(true)}
        onAuthOpen={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <main>
        <Home
          products={visible}
          onBrand={(b) => setFiltersAndScroll({ brands: [b] })}
          onCategory={(c) => setFiltersAndScroll({ cats: [c] })}
          onPrice={(min, max) => setFiltersAndScroll({ minPrice: min, maxPrice: max })}
          onExplore={() => scrollToId("catalog")}
          onSpecs={openProduct}
          onToggleCompare={toggleCompare}
          compareIds={compareIds}
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
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sea border-t-transparent" /></div>}>
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
        </Suspense>
      )}

      {cartOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sea border-t-transparent" /></div>}>
          <CartDrawer
            lines={lines}
            promo={promo}
            enableTax={settings.enableTax}
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
        </Suspense>
      )}

      {checkoutOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sea border-t-transparent" /></div>}>
          <Checkout
            lines={lines}
            promo={promo}
            enableTax={settings.enableTax}
            onApplyPromo={applyPromo}
            onClose={() => setCheckoutOpen(false)}
            onComplete={(order) => {
              recordOrder(order);
              setCart({});
              setPromo(null);
            }}
          />
        </Suspense>
      )}

      {authModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sea border-t-transparent" /></div>}>
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            initialMode={authMode}
          />
        </Suspense>
      )}

      <CompareTray
        products={products}
        ids={compareIds}
        onRemove={(id) => setCompareIds((ids) => ids.filter((x) => x !== id))}
        onClear={() => setCompareIds([])}
        onOpen={() => {
          setCompareIdsForPage(compareIds);
          setComparePageOpen(true);
        }}
        onOpenProduct={openProduct}
      />


      {comparePageOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sea border-t-transparent" /></div>}>
          <ComparePage
            products={visible}
            ids={compareIdsForPage}
            onClose={() => setComparePageOpen(false)}
            onAddToCart={(id) => {
              addToCart(id);
              setComparePageOpen(false);
            }}
          />
        </Suspense>
      )}

      <LiveChat />

      {toast && (
        <div key={toast.id} className="rise-in fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 shadow-xl" role="status">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss text-white"><ICheck size={13} /></span>
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}
