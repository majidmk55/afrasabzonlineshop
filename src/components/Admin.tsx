import { useMemo, useState } from "react";
import { fmt, fmtShort, toFa, type Laptop } from "../data/laptops";
import { compactIRR, placeholderImage, resetAll, type OrderRecord, type Settings } from "../lib/store";
import { useLockBody } from "../lib/motion";
import { IBox, IChart, ICheck, IClose, IGear, ILock, IPencil, IPlus, ITrash, ITruck, IUpload, LogoMark } from "./icons";

/* ------------------------------------------------------------------ */

const PIN = "1234";
type Tab = "dashboard" | "products" | "orders" | "settings";

interface AdminProps {
  products: Laptop[];
  orders: OrderRecord[];
  settings: Settings;
  onProducts: (next: Laptop[]) => void;
  onSettings: (s: Settings) => void;
  onExit: () => void;
}

export default function Admin({ products, orders, settings, onProducts, onSettings, onExit }: AdminProps) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ch_admin_ok") === "1");
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");

  if (!authed) {
    return (
      <div className="dark-panel flex min-h-screen items-center justify-center p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin === PIN) {
              sessionStorage.setItem("ch_admin_ok", "1");
              setAuthed(true);
            } else setPinErr(true);
          }}
          className="panel-in w-full max-w-sm border border-panel bg-slab p-8"
        >
          <div className="flex items-center gap-3">
            <LogoMark size={34} className="text-paper" />
            <div>
              <p className="font-display text-xl font-bold text-paper">پنل مدیریت کورهِوس</p>
              <p className="font-mono text-[11px] tracking-wider text-mist">COREHAUS ADMIN CONSOLE</p>
            </div>
          </div>
          <label className="mt-7 block font-mono text-[11px] tracking-wider text-mist" htmlFor="pin">رمز عبور مدیر</label>
          <input
            id="pin"
            type="password"
            dir="ltr"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinErr(false); }}
            className={`mt-2 w-full border bg-coal px-4 py-3 text-center font-mono text-lg tracking-[0.5em] text-paper outline-none transition-colors ${pinErr ? "border-red-500" : "border-panel focus:border-sea"}`}
            placeholder="••••"
            autoFocus
          />
          {pinErr && <p className="mt-2 text-xs text-red-400">رمز اشتباه است؛ دوباره تلاش کنید.</p>}
          <button type="submit" className="mt-5 w-full bg-sea py-3 font-bold text-white transition-colors hover:bg-seadeep">
            ورود به پنل
          </button>
          <p className="mt-4 text-center font-mono text-[10px] text-mist">نسخه نمایشی — رمز: <span dir="ltr" className="text-sea">1234</span></p>
          <button type="button" onClick={onExit} className="mt-2 w-full border border-panel py-2.5 text-sm text-mist transition-colors hover:border-sea hover:text-paper">
            بازگشت به فروشگاه
          </button>
        </form>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: (p: { size?: number; className?: string }) => JSX.Element }[] = [
    { id: "dashboard", label: "داشبورد فروش", icon: IChart },
    { id: "products", label: "مدیریت کالاها", icon: IBox },
    { id: "orders", label: "سفارش‌ها", icon: ITruck },
    { id: "settings", label: "تنظیمات", icon: IGear },
  ];

  return (
    <div className="min-h-screen bg-foam">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <LogoMark size={28} className="text-sea" />
          <div className="leading-tight">
            <p className="font-display text-base font-bold">پنل مدیریت کورهِوس</p>
            <p className="font-mono text-[10px] tracking-wider text-mist">تغییرات بلافاصله در سایت اعمال می‌شوند</p>
          </div>
          <nav className="mr-4 hidden items-center gap-1 md:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${tab === t.id ? "bg-ink text-white" : "text-mist hover:bg-skywash hover:text-ink"}`}
              >
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => { sessionStorage.removeItem("ch_admin_ok"); onExit(); }}
            className="mr-auto rounded-full border border-line px-4 py-2 text-xs font-bold text-mist transition-colors hover:border-ink hover:text-ink"
          >
            بازگشت به سایت
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 md:hidden">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${tab === t.id ? "bg-ink text-white" : "text-mist"}`}>
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === "dashboard" && <Dashboard products={products} orders={orders} />}
        {tab === "products" && <Products products={products} onProducts={onProducts} />}
        {tab === "orders" && <Orders orders={orders} />}
        {tab === "settings" && <SettingsTab settings={settings} onSettings={onSettings} />}
      </main>
    </div>
  );
}

/* ------------------------------ dashboard ------------------------------ */

function Dashboard({ products, orders }: { products: Laptop[]; orders: OrderRecord[] }) {
  const [range, setRange] = useState<30 | 90 | 0>(30);

  const scoped = useMemo(() => {
    if (range === 0) return orders;
    const cut = Date.now() - range * 86400000;
    return orders.filter((o) => +new Date(o.date) >= cut);
  }, [orders, range]);

  const kpi = useMemo(() => {
    const revenue = scoped.reduce((a, o) => a + o.total, 0);
    const units = scoped.reduce((a, o) => a + o.items.reduce((b, i) => b + i.qty, 0), 0);
    return { revenue, count: scoped.length, units, avg: scoped.length ? revenue / scoped.length : 0 };
  }, [scoped]);

  const prev = useMemo(() => {
    if (range === 0) return null;
    const now = Date.now();
    const prevOrders = orders.filter((o) => {
      const t = +new Date(o.date);
      return t < now - range * 86400000 && t >= now - 2 * range * 86400000;
    });
    return prevOrders.reduce((a, o) => a + o.total, 0);
  }, [orders, range]);

  const growth = prev !== null && prev > 0 ? Math.round(((kpi.revenue - prev) / prev) * 100) : null;

  const buckets = useMemo(() => {
    const days = range === 0 ? 90 : range;
    const step = days > 45 ? 7 : 1; // هفتگی برای بازه‌های بلند
    const n = Math.ceil(days / step);
    const arr = Array.from({ length: n }, () => 0);
    const now = Date.now();
    for (const o of scoped) {
      const back = Math.floor((now - +new Date(o.date)) / 86400000);
      const idx = n - 1 - Math.floor(back / step);
      if (idx >= 0 && idx < n) arr[idx] += o.total;
    }
    return { arr, step, n };
  }, [scoped, range]);

  const top = useMemo(() => {
    const map = new Map<string, { name: string; category: string; units: number; revenue: number }>();
    for (const o of scoped)
      for (const it of o.items) {
        const cur = map.get(it.id) ?? { name: it.name, category: it.category, units: 0, revenue: 0 };
        cur.units += it.qty;
        cur.revenue += it.price * it.qty;
        map.set(it.id, cur);
      }
    return [...map.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  }, [scoped]);

  const catShare = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of scoped) for (const it of o.items) map.set(it.category, (map.get(it.category) ?? 0) + it.price * it.qty);
    const total = [...map.values()].reduce((a, b) => a + b, 0) || 1;
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([c, v]) => [c, Math.round((v / total) * 100)] as [string, number]);
  }, [scoped]);

  const lowStock = products.filter((p) => p.stock <= 3).sort((a, b) => a.stock - b.stock);
  const maxBar = Math.max(...buckets.arr, 1);
  const W = 640;
  const H = 170;
  const slot = W / buckets.n;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">هوش تجاری فروش</h1>
          <p className="mt-1 text-sm text-mist">نمای زنده عملکرد فروشگاه — داده‌های نمایشی + سفارش‌های واقعی شما</p>
        </div>
        <div className="flex rounded-full border border-line bg-white p-1">
          {([["۳۰ روز", 30], ["۹۰ روز", 90], ["همه", 0]] as [string, 30 | 90 | 0][]).map(([label, v]) => (
            <button key={v} onClick={() => setRange(v)} className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${range === v ? "bg-sea text-white" : "text-mist hover:text-ink"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "مجموع فروش", value: compactIRR(kpi.revenue), note: growth === null ? "کل دوره" : `${growth >= 0 ? "▲" : "▼"} ${toFa(Math.abs(growth))}٪ نسبت به دوره قبل`, up: (growth ?? 0) >= 0 },
          { label: "تعداد سفارش", value: toFa(kpi.count), note: "سفارش ثبت‌شده" },
          { label: "دستگاه فروخته‌شده", value: toFa(kpi.units), note: "واحد کالا" },
          { label: "میانگین ارزش سبد", value: compactIRR(kpi.avg), note: "به ازای هر سفارش" },
        ].map((k) => (
          <div key={k.label} className="card-lift border border-line bg-white p-5">
            <p className="text-xs font-bold text-mist">{k.label}</p>
            <p className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">{k.value}</p>
            <p className={`mt-1 text-[11px] ${k.up === false ? "text-red-500" : k.up === true ? "text-moss" : "text-mist"}`}>{k.note}</p>
          </div>
        ))}
      </div>

      {/* chart */}
      <div className="border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">روند فروش {buckets.step > 1 ? "(هفتگی)" : "(روزانه)"}</h2>
          <span className="font-mono text-[11px] text-mist">اوج: {compactIRR(maxBar)}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H + 26}`} className="mt-4 w-full" role="img" aria-label="نمودار فروش">
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1="0" x2={W} y1={H - H * g} y2={H - H * g} stroke="#dbe3ec" strokeDasharray="4 5" />
          ))}
          {buckets.arr.map((v, i) => {
            const h = Math.max(3, (v / maxBar) * (H - 12));
            const x = W - (i + 1) * slot + slot * 0.18; // راست‌به‌چپ: قدیمی‌ترین سمت راست
            return (
              <g key={i}>
                <rect x={x} y={H - h} width={slot * 0.64} height={h} rx="3" className="fill-sea opacity-80 transition-opacity hover:opacity-100">
                  <title>{compactIRR(v)}</title>
                </rect>
                {(i % Math.ceil(buckets.n / 8) === 0 || i === buckets.n - 1) && (
                  <text x={x + slot * 0.32} y={H + 16} textAnchor="middle" fontSize="10" fill="#5f7d90">
                    {toFa((buckets.n - 1 - i) * buckets.step === 0 ? "امروز" : `${(buckets.n - 1 - i) * buckets.step} روز قبل`)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* top sellers */}
        <div className="border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">پرفروش‌ترین کالاها</h2>
          <ol className="mt-4 space-y-3">
            {top.map(([id, t], i) => {
              const maxRev = top[0][1].revenue || 1;
              return (
                <li key={id} className="group">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-skywash font-mono text-xs font-bold text-sea">{toFa(i + 1)}</span>
                      <span className="truncate font-bold">{t.name}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-mist">{toFa(t.units)} واحد · {compactIRR(t.revenue)}</span>
                  </div>
                  <div className="mt-1.5 mr-8 h-2 overflow-hidden rounded-full bg-skywash">
                    <div className="h-full rounded-full bg-sea transition-[width] duration-700" style={{ width: `${(t.revenue / maxRev) * 100}%` }} />
                  </div>
                </li>
              );
            })}
            {top.length === 0 && <p className="text-sm text-mist">در این بازه فروشی ثبت نشده است.</p>}
          </ol>
        </div>

        {/* category share + low stock */}
        <div className="space-y-6">
          <div className="border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">سهم دسته‌ها از فروش</h2>
            <div className="mt-4 space-y-3">
              {catShare.map(([c, pct]) => (
                <div key={c}>
                  <div className="flex justify-between text-sm"><span className="font-bold">{c}</span><span className="font-mono text-xs text-mist">{toFa(pct)}٪</span></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-skywash">
                    <div className="h-full rounded-full bg-ink transition-[width] duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-line bg-white p-5">
            <h2 className="flex items-center justify-between font-display text-lg font-bold">
              هشدار موجودی کم
              <span className="rounded-full bg-skywash px-2.5 py-0.5 font-mono text-xs text-sea">{toFa(lowStock.length)} کالا</span>
            </h2>
            {lowStock.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {lowStock.map((p) => (
                  <li key={p.id} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${p.stock === 0 ? "border-red-300 bg-red-50 text-red-600" : "border-amber-300 bg-amber-50 text-amber-700"}`}>
                    {p.shortName} — {p.stock === 0 ? "ناموجود" : `${toFa(p.stock)} عدد`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-mist">همه کالاها موجودی کافی دارند.</p>
            )}
          </div>
        </div>
      </div>

      {/* recent orders */}
      <div className="border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold">آخرین سفارش‌ها</h2>
        <div className="mt-3 divide-y divide-line">
          {orders.slice(0, 6).map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <span className="font-mono text-xs text-sea">{o.id}</span>
              <span className="font-bold">{o.customer}</span>
              <span className="text-mist">{o.city}</span>
              <span className="mr-auto font-mono text-xs">{new Date(o.date).toLocaleDateString("fa-IR", { day: "numeric", month: "long" })}</span>
              <span className="font-mono text-sm font-bold">{fmtShort(o.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ products ------------------------------ */

function Products({ products, onProducts }: { products: Laptop[]; onProducts: (n: Laptop[]) => void }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Laptop | null>(null);
  const [adding, setAdding] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [editCell, setEditCell] = useState<{ id: string; field: "price" | "stock"; value: string } | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => `${p.name} ${p.brand} ${p.sku} ${p.category}`.toLowerCase().includes(s));
  }, [products, q]);

  const patch = (id: string, p: Partial<Laptop>) => onProducts(products.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const saveCell = () => {
    if (!editCell) return;
    const v = Math.max(0, Math.round(Number(editCell.value) || 0));
    patch(editCell.id, { [editCell.field]: v } as Partial<Laptop>);
    setEditCell(null);
  };

  const remove = (id: string) => {
    if (confirmDel !== id) {
      setConfirmDel(id);
      setTimeout(() => setConfirmDel((c) => (c === id ? null : c)), 2500);
      return;
    }
    onProducts(products.filter((x) => x.id !== id));
    setConfirmDel(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">مدیریت کالاها</h1>
          <p className="mt-1 text-sm text-mist">ویرایش قیمت و موجودی با یک کلیک — خاموش/روشن کردن نمایش در سایت</p>
        </div>
        <div className="mr-auto flex flex-wrap gap-2">
          <button onClick={() => setBulk(true)} className="flex items-center gap-2 rounded-full border border-sea px-4 py-2.5 text-sm font-bold text-sea transition-colors hover:bg-skywash">
            <IUpload size={16} /> ورود دسته‌جمعی
          </button>
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-full bg-sea px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-seadeep">
            <IPlus size={16} /> کالای جدید
          </button>
        </div>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جست‌وجو در کالاها (نام، برند، SKU)…"
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
      />

      <div className="thin-scroll overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-line bg-foam text-right text-[11px] font-bold text-mist">
              <th className="p-3">کالا</th>
              <th className="p-3">دسته</th>
              <th className="p-3">قیمت (ریال)</th>
              <th className="p-3">موجودی</th>
              <th className="p-3">نمایش در سایت</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((p) => {
              const off = p.active === false || p.stock === 0;
              return (
                <tr key={p.id} className={`transition-colors hover:bg-skywash/50 ${p.active === false ? "opacity-55" : ""}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{p.name}</p>
                        <p className="font-mono text-[10px] text-mist">{p.sku} · {p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><span className="rounded-full bg-skywash px-2.5 py-1 text-[11px] font-bold text-sea">{p.category}</span></td>
                  <td className="p-3">
                    {editCell?.id === p.id && editCell.field === "price" ? (
                      <input autoFocus dir="ltr" type="number" value={editCell.value} onChange={(e) => setEditCell({ ...editCell, value: e.target.value })} onBlur={saveCell} onKeyDown={(e) => e.key === "Enter" && saveCell()} className="w-36 rounded-lg border border-sea px-2 py-1.5 font-mono text-xs outline-none" />
                    ) : (
                      <button onClick={() => setEditCell({ id: p.id, field: "price", value: String(p.price) })} className="rounded-lg border border-dashed border-line px-2 py-1.5 font-mono text-xs transition-colors hover:border-sea hover:text-sea" title="کلیک برای ویرایش قیمت">
                        {fmtShort(p.price)} ✎
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    {editCell?.id === p.id && editCell.field === "stock" ? (
                      <input autoFocus dir="ltr" type="number" value={editCell.value} onChange={(e) => setEditCell({ ...editCell, value: e.target.value })} onBlur={saveCell} onKeyDown={(e) => e.key === "Enter" && saveCell()} className="w-20 rounded-lg border border-sea px-2 py-1.5 font-mono text-xs outline-none" />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => patch(p.id, { stock: Math.max(0, p.stock - 1) })} className="h-7 w-7 rounded-lg border border-line font-bold text-mist hover:border-sea hover:text-sea">−</button>
                        <button onClick={() => setEditCell({ id: p.id, field: "stock", value: String(p.stock) })} className={`min-w-9 rounded-lg border border-dashed border-line px-2 py-1 font-mono text-xs hover:border-sea ${p.stock === 0 ? "text-red-500" : p.stock <= 3 ? "text-amber-600" : ""}`} title="کلیک برای ویرایش موجودی">
                          {toFa(p.stock)}
                        </button>
                        <button onClick={() => patch(p.id, { stock: p.stock + 1 })} className="h-7 w-7 rounded-lg border border-line font-bold text-mist hover:border-sea hover:text-sea">+</button>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      role="switch"
                      aria-checked={p.active !== false}
                      onClick={() => patch(p.id, { active: p.active === false })}
                      className={`relative h-6 w-12 rounded-full transition-colors ${p.active === false ? "bg-mist/40" : "bg-moss"}`}
                      title={p.active === false ? "روشن کردن (نمایش در سایت)" : "خاموش کردن (حذف از سایت)"}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${p.active === false ? "right-0.5" : "right-6"}`} />
                    </button>
                    {p.stock === 0 && p.active !== false && <p className="mt-1 text-[10px] text-red-500">ناموجود — خودکار خاموش شد</p>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setEditing(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-mist transition-colors hover:border-sea hover:text-sea" title="ویرایش کامل"><IPencil size={14} /></button>
                      <button onClick={() => remove(p.id)} className={`flex h-8 items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-bold transition-colors ${confirmDel === p.id ? "border-red-500 bg-red-500 text-white" : "border-line text-mist hover:border-red-400 hover:text-red-500"}`} title="حذف کالا">
                        <ITrash size={13} /> {confirmDel === p.id && "مطمئنم؟"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-8 text-center text-sm text-mist">کالایی با این مشخصات پیدا نشد.</p>}
      </div>

      {(adding || editing) && (
        <ProductForm
          initial={editing ?? undefined}
          products={products}
          onSave={(p) => {
            if (editing) onProducts(products.map((x) => (x.id === p.id ? p : x)));
            else onProducts([...products, p]);
            setAdding(false);
            setEditing(null);
          }}
          onClose={() => { setAdding(false); setEditing(null); }}
        />
      )}
      {bulk && <BulkImport products={products} onAdd={(items) => { onProducts([...products, ...items]); setBulk(false); }} onClose={() => setBulk(false)} />}
    </div>
  );
}

/* --------------------------- product form --------------------------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-mist">{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-sea";

function ProductForm({ initial, products, onSave, onClose }: { initial?: Laptop; products: Laptop[]; onSave: (p: Laptop) => void; onClose: () => void }) {
  const [f, setF] = useState({
    name: initial?.name ?? "",
    shortName: initial?.shortName ?? "",
    brand: initial?.brand ?? "",
    series: initial?.series ?? "",
    category: initial?.category ?? "گیمینگ",
    year: initial?.year ?? 1404,
    price: initial ? String(initial.price) : "",
    oldPrice: initial?.oldPrice ? String(initial.oldPrice) : "",
    stock: initial ? String(initial.stock) : "5",
    rating: initial ? String(initial.rating) : "4.5",
    image: initial?.image ?? "",
    tagline: initial?.tagline ?? "",
    highlights: initial?.highlights.join("، ") ?? "",
    cpu: initial?.brief.find((b) => b[0] === "پردازنده")?.[1] ?? "",
    gpu: initial?.brief.find((b) => b[0] === "گرافیک")?.[1] ?? "",
    mem: initial?.brief.find((b) => b[0] === "رم / حافظه")?.[1] ?? "",
    display: initial?.brief.find((b) => b[0] === "نمایشگر")?.[1] ?? "",
    weight: initial?.brief.find((b) => b[0] === "وزن")?.[1] ?? "",
  });
  const [err, setErr] = useState("");
  useLockBody(true);

  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const dash = (s: string) => (s.trim() ? s.trim() : "—");

  const submit = () => {
    const name = f.name.trim();
    const brand = f.brand.trim();
    const price = Number(f.price);
    if (!name || !brand || !price || price <= 0) {
      setErr("نام، برند و قیمت معتبر الزامی است.");
      return;
    }
    const shortName = f.shortName.trim() || name.split(" ").slice(-2).join(" ");
    const id = initial?.id ?? `p-${Date.now()}`;
    const p: Laptop = {
      id,
      sku: initial?.sku ?? `CH-NEW-${String(Date.now()).slice(-4)}`,
      name,
      shortName,
      brand,
      series: f.series.trim() || brand,
      category: f.category.trim() || "اولترابوک",
      year: Number(f.year) || 1404,
      price,
      oldPrice: Number(f.oldPrice) > price ? Number(f.oldPrice) : undefined,
      stock: Math.max(0, Math.round(Number(f.stock) || 0)),
      rating: Math.min(5, Math.max(1, Number(f.rating) || 4.5)),
      reviews: initial?.reviews ?? 0,
      image: f.image.trim() || placeholderImage(shortName),
      tagline: f.tagline.trim() || "جدیدترین ورودی فروشگاه کورهِوس با کارنامه آزمایشگاه.",
      highlights: f.highlights.split(/[،,]/).map((s) => s.trim()).filter(Boolean).slice(0, 4),
      brief: [
        ["پردازنده", dash(f.cpu)],
        ["گرافیک", dash(f.gpu)],
        ["رم / حافظه", dash(f.mem)],
        ["نمایشگر", dash(f.display)],
        ["وزن", dash(f.weight)],
      ],
      specs: initial?.specs ?? [
        { title: "طراحی", icon: "tag", rows: [["نوع محصول", "لپ‌تاپ"], ["برند سازنده", dash(f.brand)], ["فرم فاکتور", "Clamshell (کلاسیک)"], ["جنس بدنه", "—"]] },
        { title: "صفحه نمایش", icon: "display", rows: [["پنل و رزولوشن", dash(f.display)], ["صفحه لمسی", "—"], ["حداکثر نرخ نوسازی", "—"], ["پوشش رنگ", "—"]] },
        { title: "پردازنده", icon: "cpu", rows: [["مدل پردازنده", dash(f.cpu)], ["شرکت سازنده", dash(f.brand)], ["تعداد هسته و رشته", "—"], ["تاریخ شروع تولید", "—"], ["فرکانس پایه و حداکثر", "—"], ["توان مصرفی", "—"], ["گرافیک مجتمع", "—"], ["معماری", "—"], ["سطح تکنولوژی ساخت", "—"], ["مقدار حافظه کش", "—"], ["نوع حافظه قابل پشتیبانی", "—"], ["حداکثر حافظه قابل پشتیبانی", "—"], ["رتبه پردازنده در بنچمارک", "—"]] },
        { title: "حافظه رم", icon: "ram", rows: [["حافظه داخلی رم", dash(f.mem)], ["نوع حافظه", "—"], ["اسلات‌های حافظه", "—"]] },
        { title: "ذخیره‌سازی", icon: "drive", rows: [["ظرفیت کل ذخیره‌سازی", "—"], ["رسانه ذخیره‌سازی", "SSD"], ["NVMe", "—"]] },
        { title: "گرافیک", icon: "gpu", rows: [["مدل گرافیک مجزا", dash(f.gpu)], ["سطح فناوری ساخت تراشه", "—"], ["معماری", "—"], ["حافظه گرافیک مجزا", "—"], ["نوع حافظه گرافیک", "—"], ["تعداد هسته‌های اصلی", "—"], ["فرکانس پایه", "—"], ["توان مصرفی", "—"], ["باس حافظه", "—"], ["پهنای باند حافظه", "—"], ["تعداد هسته‌های RT", "—"], ["تعداد هسته‌های تنسور", "—"], ["تاریخ شروع تولید", "—"], ["سرعت پردازش AI", "—"], ["فناوری‌ها", "—"]] },
        { title: "صدا", icon: "speaker", rows: [["سیستم صوتی", "استریو"], ["تعداد بلندگوهای داخلی", "2"], ["میکروفون داخلی", "بله"]] },
        { title: "دوربین", icon: "camera", rows: [["دوربین جلو", "بله"], ["رزولوشن دوربین", "1080p"]] },
        { title: "شبکه", icon: "wifi", rows: [["بالاترین استاندارد Wi-Fi", "—"], ["بلوتوث", "بله"]] },
        { title: "پورت‌ها و اتصالات", icon: "plug", rows: [["پورت‌ها", "—"], ["جک ترکیبی هدفون/میکروفون", "بله"]] },
        { title: "کیبورد", icon: "keyboard", rows: [["نور پس‌زمینه کیبورد", "—"], ["صفحه‌کلید عددی", "—"]] },
        { title: "نرم‌افزار", icon: "info", rows: [["سیستم‌عامل نصب‌شده", "Windows 11"], ["گارانتی", "۲ سال کورهِوس + گارانتی رسمی"]] },
        { title: "باتری", icon: "battery", rows: [["ظرفیت باتری", "—"]] },
        { title: "تغذیه و شارژ", icon: "power", rows: [["توان آداپتور", "—"], ["USB Power Delivery", "—"]] },
        { title: "امنیت", icon: "shield", rows: [["ماژول امنیتی TPM", "بله"]] },
        { title: "وزن و ابعاد", icon: "scale", rows: [["وزن", dash(f.weight)], ["ابعاد", "—"]] },
      ],
      inBox: initial?.inBox ?? ["خود دستگاه", "شارژر اصلی", "کابل برق", "دفترچه راهنما", "گزارش آزمایشگاه کورهِوس"],
      active: initial?.active ?? true,
    };
    onSave(p);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="overlay-in fixed inset-0 bg-ink/60" onClick={onClose} />
      <div className="panel-in relative mx-auto my-8 w-[min(720px,94vw)] border border-line bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{initial ? "ویرایش کالا" : "افزودن کالای جدید"}</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-red-400 hover:text-red-500"><IClose size={16} /></button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="نام کامل کالا *"><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="مثلاً لپ‌تاپ ایسوس VivoBook 15" /></Field>
          <Field label="نام کوتاه"><input className={inputCls} value={f.shortName} onChange={(e) => set("shortName", e.target.value)} placeholder="VivoBook 15" /></Field>
          <Field label="برند *"><input className={inputCls} value={f.brand} onChange={(e) => set("brand", e.target.value)} placeholder="ایسوس" /></Field>
          <Field label="سری"><input className={inputCls} value={f.series} onChange={(e) => set("series", e.target.value)} /></Field>
          <Field label="دسته">
            <select className={inputCls} value={f.category} onChange={(e) => set("category", e.target.value)}>
              {["گیمینگ", "خلاقیت و رندر", "بیزنس و اداری", "اولترابوک"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="سال"><input dir="ltr" type="number" className={inputCls} value={f.year} onChange={(e) => set("year", e.target.value)} /></Field>
          <Field label="قیمت (ریال) *"><input dir="ltr" type="number" className={inputCls} value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="120000000" /></Field>
          <Field label="قیمت قبل (اختیاری)"><input dir="ltr" type="number" className={inputCls} value={f.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} /></Field>
          <Field label="موجودی"><input dir="ltr" type="number" className={inputCls} value={f.stock} onChange={(e) => set("stock", e.target.value)} /></Field>
          <Field label="امتیاز (از ۵)"><input dir="ltr" type="number" step="0.1" className={inputCls} value={f.rating} onChange={(e) => set("rating", e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="آدرس تصویر (URL — خالی = تصویر پیش‌فرض)"><input dir="ltr" className={inputCls} value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="شعار یک‌خطی"><input className={inputCls} value={f.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="ویژگی‌های برجسته (با «،» جدا کنید)"><input className={inputCls} value={f.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder="RTX 4060، OLED 120Hz، ۱.۵ کیلوگرم" /></Field>
          </div>
          <Field label="پردازنده"><input className={inputCls} value={f.cpu} onChange={(e) => set("cpu", e.target.value)} placeholder="Intel Core i7-13700H" /></Field>
          <Field label="گرافیک"><input className={inputCls} value={f.gpu} onChange={(e) => set("gpu", e.target.value)} placeholder="RTX 4060 · 8GB" /></Field>
          <Field label="رم / حافظه"><input className={inputCls} value={f.mem} onChange={(e) => set("mem", e.target.value)} placeholder="16GB DDR5 / 512GB SSD" /></Field>
          <Field label="نمایشگر"><input className={inputCls} value={f.display} onChange={(e) => set("display", e.target.value)} placeholder="15.6&quot; FHD IPS 144Hz" /></Field>
          <Field label="وزن"><input className={inputCls} value={f.weight} onChange={(e) => set("weight", e.target.value)} placeholder="۱.۸ کیلوگرم" /></Field>
        </div>
        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
        <div className="mt-6 flex gap-3">
          <button onClick={submit} className="flex items-center gap-2 rounded-full bg-sea px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-seadeep">
            <ICheck size={16} /> ذخیره و انتشار فوری
          </button>
          <button onClick={onClose} className="rounded-full border border-line px-6 py-3 text-sm font-bold text-mist hover:border-ink hover:text-ink">انصراف</button>
        </div>
        <p className="mt-3 font-mono text-[10px] text-mist">به‌محض ذخیره، کالا در سایت مشتریان قابل‌مشاهده است — {toFa(products.length + (initial ? 0 : 1))} کالا در فروشگاه</p>
      </div>
    </div>
  );
}

/* --------------------------- bulk import --------------------------- */

function BulkImport({ products, onAdd, onClose }: { products: Laptop[]; onAdd: (items: Laptop[]) => void; onClose: () => void }) {
  const [text, setText] = useState("");
  useLockBody(true);

  const parsed = useMemo(() => {
    const ok: Laptop[] = [];
    let skipped = 0;
    for (const line of text.split("\n")) {
      const s = line.trim();
      if (!s) continue;
      const parts = s.split(/[|;،\t]/).map((x) => x.trim());
      const [name, brand, category, priceRaw, stockRaw] = parts;
      const price = Number(String(priceRaw ?? "").replace(/[,٬\s]/g, ""));
      if (!name || !brand || !price || price <= 0) {
        skipped++;
        continue;
      }
      ok.push({
        id: `p-${Date.now()}-${ok.length}`,
        sku: `CH-NEW-${String(Date.now() + ok.length).slice(-4)}`,
        name,
        shortName: name.split(" ").slice(-2).join(" "),
        brand,
        series: brand,
        category: category || "اولترابوک",
        year: 1404,
        price,
        stock: Math.max(0, Math.round(Number(stockRaw) || 0)),
        rating: 4.5,
        reviews: 0,
        image: placeholderImage(name.split(" ").slice(-2).join(" ")),
        tagline: "ورودی تازه فروشگاه کورهِوس — به‌زودی با کارنامه کامل آزمایشگاه.",
        highlights: [brand, category || "اولترابوک"],
        brief: [["پردازنده", "—"], ["گرافیک", "—"], ["رم / حافظه", "—"], ["نمایشگر", "—"], ["وزن", "—"]],
        specs: [
          { title: "طراحی", icon: "tag", rows: [["نوع محصول", "لپ‌تاپ"], ["برند سازنده", brand]] },
          { title: "صفحه نمایش", icon: "display", rows: [["پنل و رزولوشن", "به‌زودی"]] },
          { title: "پردازنده", icon: "cpu", rows: [["مدل پردازنده", "به‌زودی"], ["شرکت سازنده", brand], ["تعداد هسته و رشته", "—"], ["تاریخ شروع تولید", "—"], ["فرکانس پایه و حداکثر", "—"], ["توان مصرفی", "—"], ["گرافیک مجتمع", "—"], ["معماری", "—"], ["سطح تکنولوژی ساخت", "—"], ["مقدار حافظه کش", "—"], ["نوع حافظه قابل پشتیبانی", "—"], ["حداکثر حافظه قابل پشتیبانی", "—"], ["رتبه پردازنده در بنچمارک", "—"]] },
          { title: "حافظه رم", icon: "ram", rows: [["حافظه داخلی رم", "به‌زودی"]] },
          { title: "ذخیره‌سازی", icon: "drive", rows: [["ظرفیت کل ذخیره‌سازی", "به‌زودی"]] },
          { title: "گرافیک", icon: "gpu", rows: [["مدل گرافیک مجزا", "به‌زودی"], ["سطح فناوری ساخت تراشه", "—"], ["معماری", "—"], ["حافظه گرافیک مجزا", "—"], ["نوع حافظه گرافیک", "—"], ["تعداد هسته‌های اصلی", "—"], ["فرکانس پایه", "—"], ["توان مصرفی", "—"], ["باس حافظه", "—"], ["پهنای باند حافظه", "—"], ["تعداد هسته‌های RT", "—"], ["تعداد هسته‌های تنسور", "—"], ["تاریخ شروع تولید", "—"], ["سرعت پردازش AI", "—"], ["فناوری‌ها", "—"]] },
          { title: "صدا", icon: "speaker", rows: [["تعداد بلندگوهای داخلی", "2"]] },
          { title: "نرم‌افزار", icon: "info", rows: [["سیستم‌عامل نصب‌شده", "Windows 11"], ["گارانتی", "۲ سال کورهِوس + گارانتی رسمی"]] },
          { title: "وزن و ابعاد", icon: "scale", rows: [["وزن", "به‌زودی"]] },
        ],
        inBox: ["خود دستگاه", "شارژر اصلی", "گزارش آزمایشگاه کورهِوس"],
        active: true,
      });
    }
    return { ok, skipped };
  }, [text]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="overlay-in fixed inset-0 bg-ink/60" onClick={onClose} />
      <div className="panel-in relative mx-auto my-8 w-[min(680px,94vw)] border border-line bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold"><IUpload size={20} className="text-sea" /> ورود دسته‌جمعی کالاها</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-red-400 hover:text-red-500"><IClose size={16} /></button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          هر خط یک کالا — فیلدها را با <b className="text-ink">|</b> جدا کنید:
          <code dir="ltr" className="mx-1 rounded bg-skywash px-2 py-0.5 font-mono text-xs text-sea">نام | برند | دسته | قیمت (ریال) | موجودی</code>
        </p>
        <textarea
          dir="rtl"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          autoFocus
          className="mt-3 w-full rounded-xl border border-line bg-foam p-3 font-mono text-sm leading-7 outline-none transition-colors focus:border-sea"
          placeholder={`لپ‌تاپ لنوو IdeaPad 5 | لنوو | اولترابوک | 68000000 | 12\nلپ‌تاپ ایسوس TUF F15 | ایسوس | گیمینگ | 92000000 | 6`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-moss/10 px-3 py-1 font-bold text-moss">{toFa(parsed.ok.length)} کالا آماده</span>
          {parsed.skipped > 0 && <span className="rounded-full bg-red-50 px-3 py-1 font-bold text-red-500">{toFa(parsed.skipped)} خط نامعتبر</span>}
          <button
            disabled={parsed.ok.length === 0}
            onClick={() => onAdd(parsed.ok)}
            className="mr-auto flex items-center gap-2 rounded-full bg-sea px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-seadeep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ICheck size={15} /> افزودن {parsed.ok.length ? `${toFa(parsed.ok.length)} کالا` : ""} به سایت
          </button>
        </div>
        <p className="mt-3 font-mono text-[10px] text-mist">سرعت ورود: کل فهرست قیمت با یک Paste — بدون فرم جداگانه برای هر کالا</p>
      </div>
    </div>
  );
}

/* ------------------------------ orders ------------------------------ */

function Orders({ orders }: { orders: OrderRecord[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">سفارش‌ها</h1>
        <p className="mt-1 text-sm text-mist">{toFa(orders.length)} سفارش ثبت‌شده — برای جزئیات روی هر ردیف کلیک کنید</p>
      </div>
      <div className="divide-y divide-line border border-line bg-white">
        {orders.map((o) => (
          <div key={o.id}>
            <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full flex-wrap items-center gap-3 p-4 text-right text-sm transition-colors hover:bg-skywash/50">
              <span className="font-mono text-xs font-bold text-sea">{o.id}</span>
              <span className="font-bold">{o.customer}</span>
              <span className="text-mist">{o.city}</span>
              <span className="rounded-full bg-skywash px-2 py-0.5 text-[10px] font-bold text-sea">{o.pay}</span>
              <span className="mr-auto font-mono text-xs text-mist">{new Date(o.date).toLocaleDateString("fa-IR", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="font-mono text-sm font-bold">{fmt(o.total)}</span>
            </button>
            {open === o.id && (
              <div className="rise-in border-t border-dashed border-line bg-foam px-4 py-3">
                <ul className="space-y-1.5 text-sm">
                  {o.items.map((it) => (
                    <li key={it.id} className="flex justify-between gap-3">
                      <span>{it.name} <span className="text-mist">× {toFa(it.qty)}</span></span>
                      <span className="font-mono text-xs">{fmt(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 font-mono text-[11px] text-mist">
                  <span>جمع: {fmt(o.subtotal)}</span>
                  {o.discount > 0 && <span className="text-moss">تخفیف: {fmt(o.discount)}−</span>}
                  <span>ارسال: {o.shipping === 0 ? "رایگان" : fmt(o.shipping)}</span>
                  <span>مالیات: {fmt(o.tax)}</span>
                </dl>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ settings ------------------------------ */

function SettingsTab({ settings, onSettings }: { settings: Settings; onSettings: (s: Settings) => void }) {
  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">تنظیمات فروشگاه</h1>
        <p className="mt-1 text-sm text-mist">رفتار نمایش کالاها در سایت مشتریان</p>
      </div>

      <div className="flex items-start justify-between gap-4 border border-line bg-white p-5">
        <div>
          <p className="flex items-center gap-2 font-bold"><ILock size={16} className="text-sea" /> خاموشی خودکار کالای ناموجود</p>
          <p className="mt-1.5 text-sm leading-relaxed text-mist">
            وقتی روشن باشد، هر کالایی که موجودی آن صفر شود به‌طور خودکار از سایت مشتریان پنهان می‌شود و با شارژ مجدد موجودی، دوباره نمایش داده خواهد شد.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={settings.autoOff}
          onClick={() => onSettings({ ...settings, autoOff: !settings.autoOff })}
          className={`relative mt-1 h-7 w-14 shrink-0 rounded-full transition-colors ${settings.autoOff ? "bg-moss" : "bg-mist/40"}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${settings.autoOff ? "right-8" : "right-1"}`} />
        </button>
      </div>

      <div className="border border-line bg-white p-5 text-sm leading-relaxed text-mist">
        <p className="font-bold text-ink">نکته درباره سرعت</p>
        <p className="mt-1.5">
          پنل مدیریت به‌صورت جداگانه از بسته اصلی سایت بارگذاری می‌شود تا صفحه مشتریان سبک و سریع بماند. تغییرات این پنل نیز بدون نیاز به رفرش، بلافاصله در ویترین اعمال می‌شود.
        </p>
      </div>

      <div className="border border-red-200 bg-red-50/50 p-5">
        <p className="font-bold text-red-600">منطقه خطر</p>
        <p className="mt-1 text-sm text-mist">بازنشانی همه داده‌ها (کالاها، سفارش‌ها و تنظیمات) به حالت اولیه نمایشی.</p>
        <button onClick={() => { if (confirm("همه داده‌های محلی پاک و سایت به حالت اولیه برمی‌گردد. ادامه می‌دهید؟")) resetAll(); }} className="mt-3 rounded-full border border-red-400 px-5 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white">
          بازنشانی کامل داده‌ها
        </button>
      </div>
    </div>
  );
}
