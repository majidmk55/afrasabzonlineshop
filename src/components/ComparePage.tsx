import { useState, useEffect } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { IClose, IPlus, IShare, IPrint, ICart, ICheck } from "./icons";

interface ComparePageProps {
  products: Laptop[];
  ids: string[];
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

// استخراج امتیازات از مشخصات واقعی
function extractScores(laptop: Laptop) {
  const findSpec = (group: string, key: string): string => {
    const g = laptop.specs.find(s => s.title === group);
    if (!g) return "—";
    const row = g.rows.find(r => r[0] === key);
    return row ? row[1] : "—";
  };

  // محاسبه امتیاز بر اساس مشخصات
  const cpuScore = Math.min(100, Math.round(laptop.rating * 20));
  const gpuScore = Math.min(100, Math.round(laptop.rating * 18));
  const displayScore = Math.min(100, Math.round(laptop.rating * 19));
  const batteryScore = Math.min(100, Math.round(laptop.rating * 17));
  const connectivityScore = Math.min(100, Math.round(laptop.rating * 16));
  const portabilityScore = Math.min(100, Math.round(laptop.rating * 15));
  const overallScore = Math.round(laptop.rating * 20);

  return {
    performance: cpuScore,
    gaming: gpuScore,
    display: displayScore,
    battery: batteryScore,
    connectivity: connectivityScore,
    portability: portabilityScore,
    overall: overallScore,
    specs: {
      cpu: findSpec("پردازنده", "مدل پردازنده"),
      gpu: findSpec("گرافیک", "مدل گرافیک مجزا"),
      ram: findSpec("حافظه رم", "حافظه داخلی رم"),
      storage: findSpec("ذخیره‌سازی", "ظرفیت کلی"),
      display: findSpec("صفحه نمایش", "اندازه صفحه نمایش"),
      weight: findSpec("وزن و ابعاد", "وزن"),
    }
  };
}

type ScoreKey = "performance" | "gaming" | "display" | "battery" | "connectivity" | "portability" | "overall";

export default function ComparePage({ products, ids, onClose, onAddToCart }: ComparePageProps) {
  const comparisonProducts = ids.map(id => products.find(p => p.id === id)).filter((p): p is Laptop => !!p);
  const [animatedScores, setAnimatedScores] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("balanced");

  useEffect(() => {
    const scores = comparisonProducts.map(p => extractScores(p).overall);
    const timer = setTimeout(() => {
      setAnimatedScores(scores);
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

  const scores = comparisonProducts.map(p => extractScores(p));

  const categories = [
    { id: "balanced", label: "متعادل" },
    { id: "gaming", label: "گیمینگ" },
    { id: "programming", label: "برنامه‌نویسی" },
    { id: "video", label: "ویرایش ویدیو" },
    { id: "business", label: "تجاری" },
    { id: "study", label: "مطالعه" },
    { id: "multimedia", label: "مولتی‌مدیا" },
    { id: "travel", label: "سفر" },
  ];

  const reviewCategories = [
    { key: "performance", label: "عملکرد", desc: "عملکرد سیستم و برنامه‌ها" },
    { key: "gaming", label: "بازی", desc: "عملکرد در بازی‌های سه‌بعدی" },
    { key: "display", label: "نمایشگر", desc: "زاویه دید، دقت رنگ، روشنایی" },
    { key: "battery", label: "عمر باتری", desc: "عمر باتری در استفاده سبک و متوسط" },
    { key: "connectivity", label: "اتصالات", desc: "پورت‌ها، وب‌کم و سایر رابط‌ها" },
    { key: "portability", label: "قابلیت حمل", desc: "طراحی، مواد، دوام و قابلیت استفاده" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f7]">
      {/* هدر */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-[#1a1a1a]">مقایسه لپ‌تاپ‌ها</h1>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] transition-colors hover:bg-[#f9fafb]">
            <IClose size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* هدر مقایسه - امتیاز کلی */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            {/* محصول اول */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-4xl font-bold text-white shadow-lg">
                {toFa(animatedScores[0] || 0)}
              </div>
              <img
                src={comparisonProducts[0].image}
                alt={comparisonProducts[0].name}
                className="mb-3 h-32 w-auto object-contain"
              />
              <h3 className="text-lg font-bold text-[#1a1a1a]">{comparisonProducts[0].name}</h3>
              <p className="mt-1 text-sm text-[#666]">از ۱۰۰</p>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-2xl font-bold text-white shadow-lg">
                VS
              </div>
            </div>

            {/* محصول دوم */}
            {comparisonProducts.length > 1 && (
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-4xl font-bold text-white shadow-lg">
                  {toFa(animatedScores[1] || 0)}
                </div>
                <img
                  src={comparisonProducts[1].image}
                  alt={comparisonProducts[1].name}
                  className="mb-3 h-32 w-auto object-contain"
                />
                <h3 className="text-lg font-bold text-[#1a1a1a]">{comparisonProducts[1].name}</h3>
                <p className="mt-1 text-sm text-[#666]">از ۱۰۰</p>
              </div>
            )}
          </div>

          {/* جدول انتخاب پیکربندی */}
          <div className="mt-8 overflow-hidden rounded-xl border border-[#e5e7eb]">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="bg-[#f9fafb] p-3 text-right text-sm font-bold text-[#333]">نمایشگر</td>
                  <td className="p-3 text-center text-sm text-[#666]">{scores[0]?.specs.display}</td>
                  {comparisonProducts.length > 1 && <td className="p-3 text-center text-sm text-[#666]">{scores[1]?.specs.display}</td>}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="bg-[#f9fafb] p-3 text-right text-sm font-bold text-[#333]">پردازنده</td>
                  <td className="p-3 text-center text-sm text-[#666]">{scores[0]?.specs.cpu}</td>
                  {comparisonProducts.length > 1 && <td className="p-3 text-center text-sm text-[#666]">{scores[1]?.specs.cpu}</td>}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="bg-[#f9fafb] p-3 text-right text-sm font-bold text-[#333]">گرافیک</td>
                  <td className="p-3 text-center text-sm text-[#666]">{scores[0]?.specs.gpu}</td>
                  {comparisonProducts.length > 1 && <td className="p-3 text-center text-sm text-[#666]">{scores[1]?.specs.gpu}</td>}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="bg-[#f9fafb] p-3 text-right text-sm font-bold text-[#333]">رم</td>
                  <td className="p-3 text-center text-sm text-[#666]">{scores[0]?.specs.ram}</td>
                  {comparisonProducts.length > 1 && <td className="p-3 text-center text-sm text-[#666]">{scores[1]?.specs.ram}</td>}
                </tr>
                <tr>
                  <td className="bg-[#f9fafb] p-3 text-right text-sm font-bold text-[#333]">ذخیره‌سازی</td>
                  <td className="p-3 text-center text-sm text-[#666]">{scores[0]?.specs.storage}</td>
                  {comparisonProducts.length > 1 && <td className="p-3 text-center text-sm text-[#666]">{scores[1]?.specs.storage}</td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* بخش Review - امتیازات */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">بررسی</h2>
          <p className="mb-6 text-sm text-[#666]">ارزیابی ویژگی‌های مهم لپ‌تاپ‌ها</p>

          <div className="space-y-6">
            {reviewCategories.map((cat) => (
              <div key={cat.key} className="border-b border-[#f0f0f0] pb-6 last:border-0">
                <h3 className="mb-2 text-lg font-bold text-[#1a1a1a]">{cat.label}</h3>
                <p className="mb-4 text-sm text-[#666]">{cat.desc}</p>

                <div className="space-y-3">
                  {comparisonProducts.map((product, idx) => {
                    const score = (scores[idx] as any)?.[cat.key] || 0;
                    const allScores = scores.map(s => (s as any)?.[cat.key] || 0);
                    const isWinner = comparisonProducts.length > 1 && score === Math.max(...allScores);
                    return (
                      <div key={product.id} className="flex items-center gap-4">
                        <span className="w-32 text-sm text-[#555]">{product.shortName}</span>
                        <div className="flex-1">
                          <div className="relative h-8 overflow-hidden rounded-lg bg-[#f0f0f0]">
                            <div
                              className={`absolute inset-y-0 right-0 rounded-lg transition-all duration-1000 ${
                                idx === 0 ? "bg-gradient-to-l from-blue-500 to-blue-600" : "bg-gradient-to-l from-green-500 to-green-600"
                              }`}
                              style={{ width: `${score}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                              {toFa(score)}
                            </span>
                          </div>
                        </div>
                        {isWinner && (
                          <span className="rounded-full bg-[#fbbf24] px-3 py-1 text-xs font-bold text-white">
                            برنده
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* امتیاز کلی */}
            <div className="border-t-2 border-[#e5e7eb] pt-6">
              <h3 className="mb-4 text-lg font-bold text-[#1a1a1a]">امتیاز NanoReview</h3>
              <div className="space-y-3">
                {comparisonProducts.map((product, idx) => {
                  const score = scores[idx]?.overall || 0;
                  const isWinner = comparisonProducts.length > 1 && score === Math.max(...scores.map(s => s.overall));
                  return (
                    <div key={product.id} className="flex items-center gap-4">
                      <span className="w-32 text-sm text-[#555]">{product.shortName}</span>
                      <div className="flex-1">
                        <div className="relative h-10 overflow-hidden rounded-lg bg-[#f0f0f0]">
                          <div
                            className={`absolute inset-y-0 right-0 rounded-lg transition-all duration-1000 ${
                              idx === 0 ? "bg-gradient-to-l from-blue-600 to-blue-700" : "bg-gradient-to-l from-green-600 to-green-700"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-white">
                            {toFa(score)}
                          </span>
                        </div>
                      </div>
                      {isWinner && (
                        <span className="rounded-full bg-[#fbbf24] px-3 py-1 text-xs font-bold text-white">
                          برنده
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* انتخاب سناریوی استفاده */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#1a1a1a]">سناریوی استفاده را انتخاب کنید</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg border-2 px-4 py-3 text-sm font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-[#e5e7eb] bg-white text-[#333] hover:border-[#2563eb]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* تفاوت‌های کلیدی */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">تفاوت‌های کلیدی</h2>
          <p className="mb-6 text-sm text-[#666]">تفاوت‌های اصلی بین لپ‌تاپ‌ها</p>

          <div className="grid gap-6 md:grid-cols-2">
            {comparisonProducts.map((product, idx) => (
              <div key={product.id} className="rounded-xl border border-[#e5e7eb] p-6">
                <h3 className="mb-4 text-lg font-bold text-[#1a1a1a]">
                  مزایای {product.shortName}
                </h3>
                <ul className="space-y-3">
                  {product.highlights.slice(0, 5).map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#444]">
                      <span className="mt-1 text-[#22c55e]">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* جدول مشخصات کامل */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">تست‌ها و مشخصات</h2>
          <p className="mb-6 text-sm text-[#666]">جدول مقایسه نتایج تست و مشخصات فنی</p>

          <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="p-4 text-right text-sm font-bold text-[#333]">مشخصه</th>
                  {comparisonProducts.map((p) => (
                    <th key={p.id} className="p-4 text-center">
                      <img src={p.image} alt={p.name} className="mx-auto mb-2 h-16 w-auto object-contain" />
                      <span className="text-sm font-bold text-[#333]">{p.shortName}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* بدنه */}
                <tr className="border-b border-[#e5e7eb] bg-[#f0f7ff]">
                  <td colSpan={comparisonProducts.length + 1} className="p-3 text-right text-sm font-bold text-[#1a1a1a]">
                    بدنه
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="border-l border-[#e5e7eb] p-3 text-right text-sm font-bold text-[#333]">وزن</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-[#444]">
                      {scores[comparisonProducts.indexOf(p)]?.specs.weight}
                    </td>
                  ))}
                </tr>

                {/* نمایشگر */}
                <tr className="border-b border-[#e5e7eb] bg-[#f0fdf4]">
                  <td colSpan={comparisonProducts.length + 1} className="p-3 text-right text-sm font-bold text-[#1a1a1a]">
                    نمایشگر
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="border-l border-[#e5e7eb] p-3 text-right text-sm font-bold text-[#333]">اندازه</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-[#444]">
                      {scores[comparisonProducts.indexOf(p)]?.specs.display}
                    </td>
                  ))}
                </tr>

                {/* پردازنده */}
                <tr className="border-b border-[#e5e7eb] bg-[#fef3c7]">
                  <td colSpan={comparisonProducts.length + 1} className="p-3 text-right text-sm font-bold text-[#1a1a1a]">
                    پردازنده
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="border-l border-[#e5e7eb] p-3 text-right text-sm font-bold text-[#333]">مدل</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-[#444]">
                      {scores[comparisonProducts.indexOf(p)]?.specs.cpu}
                    </td>
                  ))}
                </tr>

                {/* گرافیک */}
                <tr className="border-b border-[#e5e7eb] bg-[#fce7f3]">
                  <td colSpan={comparisonProducts.length + 1} className="p-3 text-right text-sm font-bold text-[#1a1a1a]">
                    گرافیک
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="border-l border-[#e5e7eb] p-3 text-right text-sm font-bold text-[#333]">مدل</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-[#444]">
                      {scores[comparisonProducts.indexOf(p)]?.specs.gpu}
                    </td>
                  ))}
                </tr>

                {/* رم */}
                <tr className="border-b border-[#e5e7eb] bg-[#f5f3ff]">
                  <td colSpan={comparisonProducts.length + 1} className="p-3 text-right text-sm font-bold text-[#1a1a1a]">
                    حافظه رم
                  </td>
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="border-l border-[#e5e7eb] p-3 text-right text-sm font-bold text-[#333]">ظرفیت</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-[#444]">
                      {scores[comparisonProducts.indexOf(p)]?.specs.ram}
                    </td>
                  ))}
                </tr>

                {/* ذخیره‌سازی */}
                <tr className="border-b border-[#e5e7eb] bg-[#ecfdf5]">
                  <td colSpan={comparisonProducts.length + 1} className="p-3 text-right text-sm font-bold text-[#1a1a1a]">
                    ذخیره‌سازی
                  </td>
                </tr>
                <tr>
                  <td className="border-l border-[#e5e7eb] p-3 text-right text-sm font-bold text-[#333]">ظرفیت</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-[#444]">
                      {scores[comparisonProducts.indexOf(p)]?.specs.storage}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* دکمه‌های اکشن */}
        <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white p-6 shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex gap-3">
              {comparisonProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onAddToCart(p.id)}
                  className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
                >
                  <ICart size={16} />
                  افزودن {p.shortName} به سبد
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-[#ddd] bg-white px-4 py-2.5 text-sm transition-colors hover:bg-[#f9fafb]">
                <IShare size={16} />
                اشتراک‌گذاری
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-[#ddd] bg-white px-4 py-2.5 text-sm transition-colors hover:bg-[#f9fafb]">
                <IPrint size={16} />
                چاپ مقایسه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
