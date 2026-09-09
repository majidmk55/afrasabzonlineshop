import { useState, useEffect } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { IClose, ICart } from "./icons";

interface ComparePageProps {
  products: Laptop[];
  ids: string[];
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

const PRODUCT_COLORS = [
  { primary: "#3b82f6", light: "#60a5fa", name: "آبی" },
  { primary: "#10b981", light: "#34d399", name: "سبز" },
  { primary: "#a855f7", light: "#c084fc", name: "بنفش" },
];

function getScoreFromRating(rating: number): number {
  return Math.round(rating * 20);
}

function extractSpecs2(laptop: Laptop, groupTitle: string, rowKey: string): string {
  const group = laptop.specs.find(g => g.title === groupTitle);
  if (!group) return "—";
  const row = group.rows.find(r => r[0] === rowKey);
  return row ? row[1] : "—";
}

function extractSpecs(laptop: Laptop) {
  return {
    cpu: {
      model: extractSpecs2(laptop, "پردازنده", "مدل پردازنده"),
      cores: extractSpecs2(laptop, "پردازنده", "تعداد هسته و رشته"),
      freq: extractSpecs2(laptop, "پردازنده", "فرکانس پایه و حداکثر"),
      cache: extractSpecs2(laptop, "پردازنده", "مقدار حافظه کش"),
    },
    gpu: {
      model: extractSpecs2(laptop, "گرافیک", "مدل گرافیک مجزا"),
      memory: extractSpecs2(laptop, "گرافیک", "حافظه گرافیک مجزا"),
      power: extractSpecs2(laptop, "گرافیک", "توان مصرفی"),
    },
    memory: {
      ram: extractSpecs2(laptop, "حافظه رم", "حافظه داخلی رم"),
      ramType: extractSpecs2(laptop, "حافظه رم", "نوع حافظه"),
      ssd: extractSpecs2(laptop, "ذخیره‌سازی", "ظرفیت کلی"),
    },
    display: {
      size: extractSpecs2(laptop, "صفحه نمایش", "اندازه صفحه نمایش"),
      resolution: extractSpecs2(laptop, "صفحه نمایش", "رزولوشن"),
      panel: extractSpecs2(laptop, "صفحه نمایش", "نوع پنل"),
      refresh: extractSpecs2(laptop, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)"),
    },
    battery: {
      capacity: extractSpecs2(laptop, "باتری و شارژ", "ظرفیت باتری"),
      life: extractSpecs2(laptop, "باتری و شارژ", "عمر شارژ"),
      charger: extractSpecs2(laptop, "باتری و شارژ", "توان آداپتور"),
    },
    dimensions: {
      weight: extractSpecs2(laptop, "وزن و ابعاد", "وزن"),
    },
  };
}

export default function ComparePage({ products, ids, onClose, onAddToCart }: ComparePageProps) {
  const comparisonProducts = ids.map(id => products.find(p => p.id === id)).filter((p): p is Laptop => !!p);
  
  const [animatedScores, setAnimatedScores] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(comparisonProducts.map(p => getScoreFromRating(p.rating)));
    }, 100);
    return () => clearTimeout(timer);
  }, [comparisonProducts]);

  if (comparisonProducts.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-600">محصولی برای مقایسه انتخاب نشده است</p>
          <button onClick={onClose} className="mt-4 rounded-lg bg-[#2563eb] px-6 py-3 text-white font-bold">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const productData = comparisonProducts.map((product, idx) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    overall: getScoreFromRating(product.rating),
    specs: extractSpecs(product),
    scores: {
      performance: 60 + idx * 10,
      gaming: 50 + idx * 12,
      display: 65 + idx * 8,
      battery: 55 + idx * 7,
      connectivity: 60 + idx * 5,
      portability: 55 + idx * 10,
    },
  }));

  const reviewCategories = [
    { key: "performance", label: "عملکرد", desc: "عملکرد سیستم و برنامه‌ها" },
    { key: "gaming", label: "بازی", desc: "عملکرد در بازی‌های سه‌بعدی" },
    { key: "display", label: "نمایشگر", desc: "زاویه دید، دقت رنگ، روشنایی" },
    { key: "battery", label: "باتری", desc: "عمر باتری در استفاده معمولی" },
    { key: "connectivity", label: "اتصالات", desc: "پورت‌ها، وب‌کم و سایر رابط‌ها" },
    { key: "portability", label: "قابلیت حمل", desc: "طراحی، مواد، دوام و کاربری" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f7]">
      {/* هدر */}
      <header className="sticky top-0 z-[100] bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">مقایسه لپ‌تاپ‌ها</h1>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] transition-colors hover:bg-[#f9fafb]">
            <IClose size={20} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* امتیاز کلی */}
        <section className="mb-12">
          <div className="flex items-center justify-center gap-8">
            {productData.map((product, idx) => (
              <div key={product.id} className="flex flex-col items-center">
                <div className="relative h-[120px] w-[120px]">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke={PRODUCT_COLORS[idx].primary}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(animatedScores[idx] / 100) * 327} 327`}
                      style={{ transition: "stroke-dasharray 1.5s ease-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[32px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                      {toFa(animatedScores[idx])}
                    </span>
                    <span className="text-[11px] text-[#999]">از 100</span>
                  </div>
                </div>
                <img src={product.image} alt={product.name} className="mt-4 h-20 w-20 rounded-lg object-cover" />
                <h3 className="mt-2 text-center text-[14px] font-bold text-[#1a1a1a]">{product.name}</h3>
                <p className="text-[13px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                  {fmt(product.price)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Review */}
        <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[20px] font-bold text-[#1a1a1a]">بررسی</h2>
          <p className="mb-6 text-[14px] text-[#666]">ارزیابی ویژگی‌های مهم لپ‌تاپ‌ها</p>

          <div className="space-y-6">
            {reviewCategories.map((category) => (
              <div key={category.key}>
                <h3 className="mb-2 text-[16px] font-bold text-[#1a1a1a]">{category.label}</h3>
                <p className="mb-4 text-[13px] text-[#666]">{category.desc}</p>

                <div className="space-y-3">
                  {productData.map((product, idx) => {
                    const score = product.scores[category.key as keyof typeof product.scores];
                    const maxScore = Math.max(...productData.map(p => p.scores[category.key as keyof typeof p.scores]));
                    const diff = score === maxScore ? ((score - Math.min(...productData.map(p => p.scores[category.key as keyof typeof p.scores]))) / maxScore * 100).toFixed(0) : null;

                    return (
                      <div key={product.id} className="flex items-center gap-4">
                        <span className="w-[140px] text-[13px] text-[#555]">{product.name.split(" ").slice(0, 2).join(" ")}</span>
                        <div className="relative flex-1">
                          <div className="h-[32px] overflow-hidden rounded-lg bg-[#f0f0f0]">
                            <div
                              className="h-full rounded-lg transition-all duration-1000"
                              style={{
                                width: `${score}%`,
                                background: `linear-gradient(to left, ${PRODUCT_COLORS[idx].primary}, ${PRODUCT_COLORS[idx].light})`,
                              }}
                            />
                          </div>
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-white">
                            {toFa(score)}
                          </span>
                        </div>
                        {diff && (
                          <span className="text-[13px] font-bold text-[#10b981]">+{toFa(diff)}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Differences */}
        <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[20px] font-bold text-[#1a1a1a]">تفاوت‌های کلیدی</h2>
          <p className="mb-6 text-[14px] text-[#666]">تفاوت‌های اصلی بین لپ‌تاپ‌ها</p>

          <div className="space-y-6">
            {productData.map((product, idx) => (
              <div key={product.id}>
                <h3 className="mb-3 text-[15px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                  مزایای {product.name.split(" ").slice(0, 2).join(" ")}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[13px] text-[#444]">
                    <span className="mt-1 text-[#10b981]">✓</span>
                    <span>عملکرد پردازنده قوی‌تر</span>
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-[#444]">
                    <span className="mt-1 text-[#10b981]">✓</span>
                    <span>نمایشگر با کیفیت بالاتر</span>
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-[#444]">
                    <span className="mt-1 text-[#10b981]">✓</span>
                    <span>عمر باتری بیشتر</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tests and Specifications */}
        <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[20px] font-bold text-[#1a1a1a]">تست‌ها و مشخصات فنی</h2>
          <p className="mb-6 text-[14px] text-[#666]">جدول مقایسه کامل نتایج تست و مشخصات فنی</p>

          <div className="space-y-8">
            {/* پردازنده */}
            <div>
              <h3 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">پردازنده</h3>
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb]">
                      <th className="p-3 text-right text-[13px] font-bold text-[#666]"></th>
                      {productData.map((p, idx) => (
                        <th key={p.id} className="p-3 text-center text-[13px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                          {p.name.split(" ").slice(0, 2).join(" ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">مدل</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.cpu.model}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">هسته / رشته</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.cpu.cores}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">فرکانس</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.cpu.freq}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">حافظه کش</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.cpu.cache}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* گرافیک */}
            <div>
              <h3 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">گرافیک</h3>
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb]">
                      <th className="p-3 text-right text-[13px] font-bold text-[#666]"></th>
                      {productData.map((p, idx) => (
                        <th key={p.id} className="p-3 text-center text-[13px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                          {p.name.split(" ").slice(0, 2).join(" ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">مدل</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.gpu.model}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">حافظه</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.gpu.memory}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">توان</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.gpu.power}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* حافظه */}
            <div>
              <h3 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">حافظه</h3>
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb]">
                      <th className="p-3 text-right text-[13px] font-bold text-[#666]"></th>
                      {productData.map((p, idx) => (
                        <th key={p.id} className="p-3 text-center text-[13px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                          {p.name.split(" ").slice(0, 2).join(" ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">RAM</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.memory.ram}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">نوع RAM</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.memory.ramType}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">SSD</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.memory.ssd}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* نمایشگر */}
            <div>
              <h3 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">نمایشگر</h3>
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb]">
                      <th className="p-3 text-right text-[13px] font-bold text-[#666]"></th>
                      {productData.map((p, idx) => (
                        <th key={p.id} className="p-3 text-center text-[13px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                          {p.name.split(" ").slice(0, 2).join(" ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">اندازه</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.display.size}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">رزولوشن</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.display.resolution}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">نوع پنل</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.display.panel}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">نرخ نوسازی</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.display.refresh}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* باتری */}
            <div>
              <h3 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">باتری</h3>
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb]">
                      <th className="p-3 text-right text-[13px] font-bold text-[#666]"></th>
                      {productData.map((p, idx) => (
                        <th key={p.id} className="p-3 text-center text-[13px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                          {p.name.split(" ").slice(0, 2).join(" ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">ظرفیت</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.battery.capacity}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">عمر باتری</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.battery.life}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">شارژر</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.battery.charger}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* وزن */}
            <div>
              <h3 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">وزن</h3>
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb]">
                      <th className="p-3 text-right text-[13px] font-bold text-[#666]"></th>
                      {productData.map((p, idx) => (
                        <th key={p.id} className="p-3 text-center text-[13px] font-bold" style={{ color: PRODUCT_COLORS[idx].primary }}>
                          {p.name.split(" ").slice(0, 2).join(" ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb]">
                      <td className="p-3 text-[13px] font-bold text-[#333]">وزن</td>
                      {productData.map((p) => (
                        <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">{p.specs.dimensions.weight}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* دکمه‌های خرید */}
        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {productData.map((product, idx) => (
              <button
                key={product.id}
                onClick={() => onAddToCart(product.id)}
                className="flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: PRODUCT_COLORS[idx].primary }}
              >
                <ICart size={16} />
                افزودن {product.name.split(" ").slice(0, 2).join(" ")} به سبد
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
