import { useState, useEffect } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { IClose, IPlus, IShare, IPrint, ICart, ICheck } from "./icons";

interface ComparePageProps {
  products: Laptop[];
  ids: string[];
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

const PRODUCT_COLORS = {
  0: { primary: "#3b82f6", gradient: "from-blue-400 to-blue-600", bg: "#60a5fa" },
  1: { primary: "#10b981", gradient: "from-emerald-400 to-emerald-600", bg: "#34d399" },
  2: { primary: "#a855f7", gradient: "from-purple-400 to-purple-600", bg: "#c084fc" },
};

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
      baseFreq: extractSpecs2(laptop, "پردازنده", "فرکانس پایه و حداکثر"),
      boostFreq: extractSpecs2(laptop, "پردازنده", "فرکانس پایه و حداکثر"),
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
      hdd: "ندارد",
    },
    display: {
      size: extractSpecs2(laptop, "صفحه نمایش", "اندازه صفحه نمایش"),
      resolution: extractSpecs2(laptop, "صفحه نمایش", "رزولوشن"),
      panel: extractSpecs2(laptop, "صفحه نمایش", "نوع پنل"),
      refresh: extractSpecs2(laptop, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)"),
      brightness: extractSpecs2(laptop, "صفحه نمایش", "اندازه روشنایی"),
      color: extractSpecs2(laptop, "صفحه نمایش", "تعداد رنگ"),
    },
    battery: {
      capacity: extractSpecs2(laptop, "باتری و شارژ", "ظرفیت باتری"),
      life: extractSpecs2(laptop, "باتری و شارژ", "عمر شارژ"),
      charger: extractSpecs2(laptop, "باتری و شارژ", "توان آداپتور"),
    },
    dimensions: {
      weight: extractSpecs2(laptop, "وزن و ابعاد", "وزن"),
      thickness: extractSpecs2(laptop, "وزن و ابعاد", "ضخامت"),
    },
    ports: {
      usbc: extractSpecs2(laptop, "پورت‌ها و اتصالات", "تعداد Thunderbolt 4 (USB-C)") || extractSpecs2(laptop, "پورت‌ها و اتصالات", "تعداد USB4 (USB-C)"),
      usba: extractSpecs2(laptop, "پورت‌ها و اتصالات", "تعداد USB-A 3.2") || extractSpecs2(laptop, "پورت‌ها و اتصالات", "تعداد USB-A 3.2 Gen 2"),
      hdmi: extractSpecs2(laptop, "پورت‌ها و اتصالات", "تعداد پورت HDMI"),
      jack: extractSpecs2(laptop, "پورت‌ها و اتصالات", "جک ترکیبی هدفون/میکروفون"),
      wifi: extractSpecs2(laptop, "شبکه", "بالاترین استاندارد Wi-Fi"),
      bluetooth: extractSpecs2(laptop, "شبکه", "بلوتوث"),
    },
  };
}

export default function ComparePage({ products, ids, onClose, onAddToCart }: ComparePageProps) {
  const comparisonProducts = ids.map(id => products.find(p => p.id === id)).filter((p): p is Laptop => !!p);
  
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

  const SAMPLE_COMPARISON = comparisonProducts.map((product, idx) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    scores: {
      cpu: getScoreFromRating(product.rating) + (idx * 5),
      gpu: getScoreFromRating(product.rating) - (idx * 3),
      memory: getScoreFromRating(product.rating) + (idx * 2),
      display: getScoreFromRating(product.rating) + (idx * 4),
      battery: getScoreFromRating(product.rating) - (idx * 2),
      value: 100 - (product.price / 10000000),
    },
    overall: getScoreFromRating(product.rating),
    specs: extractSpecs(product),
    pros: product.highlights.slice(0, 2).join("، "),
    cons: "اطلاعات بیشتر در صفحه محصول",
  }));
  const [activeTab, setActiveTab] = useState<"graphical" | "table">("graphical");
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [animatedScores, setAnimatedScores] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(SAMPLE_COMPARISON.map((p) => p.overall));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#22c55e";
    if (score >= 75) return "#3b82f6";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getWinner = (category: keyof typeof SAMPLE_COMPARISON[0]["scores"]) => {
    const scores = SAMPLE_COMPARISON.map((p) => p.scores[category]);
    const max = Math.max(...scores);
    return scores.indexOf(max);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: "#f5f5f7" }}>
      {/* هدر مقایسه */}
      <header className="sticky top-0 z-[100] bg-white shadow-sm" style={{ height: "120px" }}>
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            {SAMPLE_COMPARISON.map((product, idx) => (
              <div key={product.id} className="relative flex w-[220px] flex-col items-center">
                <button
                  className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                  aria-label="حذف"
                >
                  <IClose size={14} />
                </button>
                <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                <h3 className="mt-2 line-clamp-2 text-center text-[13px] font-bold text-[#222]">{product.name}</h3>
                <p className="text-[14px] font-bold" style={{ color: "#2563eb" }}>
                  {fmt(product.price)}
                </p>
              </div>
            ))}
            <button className="flex h-[120px] w-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#ccc] transition-colors hover:border-[#2563eb] hover:bg-[#f0f7ff]">
              <IPlus size={32} className="text-[#999]" />
              <span className="mt-2 text-[13px] text-[#666]">افزودن محصول</span>
            </button>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] transition-colors hover:bg-[#f9fafb]">
            <IClose size={20} />
          </button>
        </div>
      </header>

      {/* تب‌های ناوبری */}
      <nav className="sticky top-[120px] z-50 border-b-2 border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-7xl gap-8 px-6">
          <button
            onClick={() => setActiveTab("graphical")}
            className={`relative py-4 text-[14px] font-bold transition-colors ${
              activeTab === "graphical" ? "text-[#2563eb]" : "text-[#666] hover:text-[#333]"
            }`}
          >
            مقایسه گرافیکی
            {activeTab === "graphical" && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2563eb]" />}
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`relative py-4 text-[14px] transition-colors ${
              activeTab === "table" ? "font-bold text-[#2563eb]" : "text-[#666] hover:text-[#333]"
            }`}
          >
            جدول مشخصات
            {activeTab === "table" && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2563eb]" />}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* حالت مقایسه گرافیکی */}
        {activeTab === "graphical" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {/* امتیاز کلی */}
            <div className="mb-8 grid grid-cols-3 gap-6">
              {SAMPLE_COMPARISON.map((product, idx) => (
                <div key={product.id} className="flex flex-col items-center rounded-xl border border-[#e5e7eb] p-5">
                  <div className="relative h-[90px] w-[90px]">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={getScoreColor(animatedScores[idx])}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(animatedScores[idx] / 100) * 264} 264`}
                        style={{ transition: "stroke-dasharray 1.5s ease-out" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[28px] font-bold">{toFa(animatedScores[idx])}</span>
                      <span className="text-[11px] text-[#999]">از 100</span>
                    </div>
                  </div>
                  <h4 className="mt-3 text-[13px] font-bold">{product.name}</h4>
                  {idx === 2 && (
                    <span className="mt-2 rounded-full bg-[#fbbf24] px-3 py-1 text-[11px] font-bold text-white">
                      رتبه ۱
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* نمودارهای میله‌ای */}
            <div className="space-y-6">
              {(["cpu", "gpu", "memory", "display", "battery", "value"] as const).map((category, catIdx) => {
                const winner = getWinner(category);
                const labels = {
                  cpu: "عملکرد پردازنده",
                  gpu: "عملکرد گرافیک",
                  memory: "حافظه و ذخیره‌سازی",
                  display: "نمایشگر",
                  battery: "باتری",
                  value: "ارزش خرید",
                };

                return (
                  <div key={category} className={catIdx > 0 ? "border-t border-[#f0f0f0] pt-6" : ""}>
                    <h5 className="mb-3 text-[14px] font-bold text-[#222]">{labels[category]}</h5>
                    <div className="space-y-3">
                      {SAMPLE_COMPARISON.map((product, idx) => {
                        const score = product.scores[category];
                        const color = PRODUCT_COLORS[idx as keyof typeof PRODUCT_COLORS];
                        return (
                          <div key={product.id} className="flex items-center gap-3">
                            <span className="w-[100px] text-[12px] text-[#555]">{product.name.split(" ")[0]}</span>
                            <div className="relative flex-1">
                              <div className="h-6 overflow-hidden rounded-md bg-[#f0f0f0]">
                                <div
                                  className={`h-full rounded-md bg-gradient-to-l ${color.gradient}`}
                                  style={{
                                    width: `${score}%`,
                                    transition: "width 1s ease-out",
                                    transitionDelay: `${idx * 0.2}s`,
                                  }}
                                />
                              </div>
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-white">
                                {toFa(score)}%
                              </span>
                            </div>
                            {idx === winner && (
                              <span className="rounded-full bg-[#fbbf24] px-2 py-0.5 text-[10px] font-bold text-white">
                                برنده
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* جدول برتری */}
            <div className="mt-8 overflow-hidden rounded-xl border border-[#e5e7eb]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="p-3 text-right text-[13px] font-bold">ویژگی</th>
                    {SAMPLE_COMPARISON.map((p) => (
                      <th key={p.id} className="p-3 text-center text-[13px] font-bold">
                        {p.name.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#e5e7eb]">
                    <td className="border-l border-[#e5e7eb] p-3 text-[12px] font-bold text-[#333]">نقاط قوت</td>
                    {SAMPLE_COMPARISON.map((p) => (
                      <td key={p.id} className="p-3 text-center text-[12px] text-[#444]">
                        {p.pros}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-[#e5e7eb]">
                    <td className="border-l border-[#e5e7eb] p-3 text-[12px] font-bold text-[#333]">نقاط ضعف</td>
                    {SAMPLE_COMPARISON.map((p) => (
                      <td key={p.id} className="p-3 text-center text-[12px] text-[#444]">
                        {p.cons}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* حالت جدول مشخصات */}
        {activeTab === "table" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <input
                type="text"
                placeholder="جستجو در مشخصات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] outline-none focus:border-[#2563eb]"
              />
              <label className="flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={showOnlyDifferences}
                  onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                  className="h-4 w-4 accent-[#2563eb]"
                />
                فقط نمایش تفاوت‌ها
              </label>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-4 text-right text-[14px] font-bold"></th>
                    {SAMPLE_COMPARISON.map((p) => (
                      <th key={p.id} className="p-4 text-center">
                        <img src={p.image} alt={p.name} className="mx-auto h-12 w-12 rounded-lg object-cover" />
                        <span className="mt-2 block text-[14px] font-bold">{p.name.split(" ")[0]}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* پردازنده */}
                  <tr className="border-r-4 border-r-[#3b82f6] bg-[#f0f7ff]">
                    <td colSpan={4} className="p-3 text-[13px] font-bold text-[#222]">
                      پردازنده (CPU)
                    </td>
                  </tr>
                  {[
                    ["مدل پردازنده", "model"],
                    ["تعداد هسته", "cores"],
                    ["فرکانس پایه", "baseFreq"],
                    ["فرکانس بوست", "boostFreq"],
                    ["حافظه کش", "cache"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-[#e5e7eb] transition-colors hover:bg-[#fafafa]">
                      <td className="border-l border-[#e5e7eb] p-3 text-[13px] font-bold text-[#333]">{label}</td>
                      {SAMPLE_COMPARISON.map((p) => {
                        const value = p.specs.cpu[key as keyof typeof p.specs.cpu];
                        return (
                          <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* گرافیک */}
                  <tr className="border-r-4 border-r-[#10b981] bg-[#f0fdf4]">
                    <td colSpan={4} className="p-3 text-[13px] font-bold text-[#222]">
                      گرافیک (GPU)
                    </td>
                  </tr>
                  {[
                    ["مدل گرافیک", "model"],
                    ["حافظه گرافیک", "memory"],
                    ["توان گرافیک", "power"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-[#e5e7eb] transition-colors hover:bg-[#fafafa]">
                      <td className="border-l border-[#e5e7eb] p-3 text-[13px] font-bold text-[#333]">{label}</td>
                      {SAMPLE_COMPARISON.map((p) => {
                        const value = p.specs.gpu[key as keyof typeof p.specs.gpu];
                        return (
                          <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* حافظه */}
                  <tr className="border-r-4 border-r-[#f59e0b] bg-[#fef3c7]">
                    <td colSpan={4} className="p-3 text-[13px] font-bold text-[#222]">
                      حافظه (Memory)
                    </td>
                  </tr>
                  {[
                    ["RAM", "ram"],
                    ["نوع RAM", "ramType"],
                    ["SSD", "ssd"],
                    ["HDD", "hdd"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-[#e5e7eb] transition-colors hover:bg-[#fafafa]">
                      <td className="border-l border-[#e5e7eb] p-3 text-[13px] font-bold text-[#333]">{label}</td>
                      {SAMPLE_COMPARISON.map((p) => {
                        const value = p.specs.memory[key as keyof typeof p.specs.memory];
                        return (
                          <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* نمایشگر */}
                  <tr className="border-r-4 border-r-[#ec4899] bg-[#fce7f3]">
                    <td colSpan={4} className="p-3 text-[13px] font-bold text-[#222]">
                      نمایشگر (Display)
                    </td>
                  </tr>
                  {[
                    ["اندازه", "size"],
                    ["رزولوشن", "resolution"],
                    ["نوع پنل", "panel"],
                    ["نرخ نوسازی", "refresh"],
                    ["روشنایی", "brightness"],
                    ["پوشش رنگی", "color"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-[#e5e7eb] transition-colors hover:bg-[#fafafa]">
                      <td className="border-l border-[#e5e7eb] p-3 text-[13px] font-bold text-[#333]">{label}</td>
                      {SAMPLE_COMPARISON.map((p) => {
                        const value = p.specs.display[key as keyof typeof p.specs.display];
                        return (
                          <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* باتری */}
                  <tr className="border-r-4 border-r-[#a855f7] bg-[#f5f3ff]">
                    <td colSpan={4} className="p-3 text-[13px] font-bold text-[#222]">
                      باتری و انرژی
                    </td>
                  </tr>
                  {[
                    ["ظرفیت باتری", "capacity"],
                    ["عمر باتری", "life"],
                    ["توان شارژر", "charger"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-[#e5e7eb] transition-colors hover:bg-[#fafafa]">
                      <td className="border-l border-[#e5e7eb] p-3 text-[13px] font-bold text-[#333]">{label}</td>
                      {SAMPLE_COMPARISON.map((p) => {
                        const value = p.specs.battery[key as keyof typeof p.specs.battery];
                        return (
                          <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* ابعاد */}
                  <tr className="border-r-4 border-r-[#059669] bg-[#ecfdf5]">
                    <td colSpan={4} className="p-3 text-[13px] font-bold text-[#222]">
                      ابعاد و وزن
                    </td>
                  </tr>
                  {[
                    ["وزن", "weight"],
                    ["ضخامت", "thickness"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-[#e5e7eb] transition-colors hover:bg-[#fafafa]">
                      <td className="border-l border-[#e5e7eb] p-3 text-[13px] font-bold text-[#333]">{label}</td>
                      {SAMPLE_COMPARISON.map((p) => {
                        const value = p.specs.dimensions[key as keyof typeof p.specs.dimensions];
                        return (
                          <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* اتصالات */}
                  <tr className="border-r-4 border-r-[#ea580c] bg-[#fff7ed]">
                    <td colSpan={4} className="p-3 text-[13px] font-bold text-[#222]">
                      اتصالات
                    </td>
                  </tr>
                  {[
                    ["USB-C", "usbc"],
                    ["USB-A", "usba"],
                    ["HDMI", "hdmi"],
                    ["جک هدفون", "jack"],
                    ["Wi-Fi", "wifi"],
                    ["بلوتوث", "bluetooth"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-[#e5e7eb] transition-colors hover:bg-[#fafafa]">
                      <td className="border-l border-[#e5e7eb] p-3 text-[13px] font-bold text-[#333]">{label}</td>
                      {SAMPLE_COMPARISON.map((p) => {
                        const value = p.specs.ports[key as keyof typeof p.specs.ports];
                        return (
                          <td key={p.id} className="p-3 text-center text-[13px] text-[#444]">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* دکمه‌های اکشن */}
      <footer className="sticky bottom-0 border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex gap-3">
            {SAMPLE_COMPARISON.map((p) => (
              <button
                key={p.id}
                onClick={() => onAddToCart(p.id)}
                className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                <ICart size={16} />
                افزودن به سبد
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-[#ddd] bg-white px-4 py-2.5 text-[13px] transition-colors hover:bg-[#f9fafb]">
              <IShare size={16} />
              اشتراک‌گذاری
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-[#ddd] bg-white px-4 py-2.5 text-[13px] transition-colors hover:bg-[#f9fafb]">
              <IPrint size={16} />
              چاپ مقایسه
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
