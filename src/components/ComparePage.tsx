import { useState } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { IClose, ICart } from "./icons";
import Review from "./Review";
import NanoReviewScore from "./NanoReviewScore";
import KeyDifferences from "./KeyDifferences";

interface ComparePageProps {
  products: Laptop[];
  ids: string[];
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

// استخراج مشخصات از لپ‌تاپ
function extractSpec(laptop: Laptop, group: string, key: string): string {
  const g = laptop.specs.find(s => s.title === group);
  if (!g) return "—";
  const row = g.rows.find(r => r[0] === key);
  return row ? row[1] : "—";
}

// استخراج عدد از متن
function extractNumber(text: string): number {
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

// تولید مزایای هر لپ‌تاپ بر اساس مقایسه با همه لپ‌تاپ‌های دیگر
function generateAdvantagesForAll(laptop: Laptop, allLaptops: Laptop[]): string[] {
  const advantages: string[] = [];
  const otherLaptops = allLaptops.filter(l => l.id !== laptop.id);
  
  if (otherLaptops.length === 0) return [];
  
  // مقایسه وزن - آیا سبک‌ترین است؟
  const weights = allLaptops.map(l => extractNumber(extractSpec(l, "وزن و ابعاد", "وزن")));
  const myWeight = extractNumber(extractSpec(laptop, "وزن و ابعاد", "وزن"));
  const minWeight = Math.min(...weights);
  if (myWeight > 0 && myWeight === minWeight && weights.filter(w => w === minWeight).length === 1) {
    const maxWeight = Math.max(...weights);
    const diff = maxWeight - myWeight;
    advantages.push(`سبک‌ترین: ${diff.toFixed(2)} کیلوگرم سبک‌تر از سنگین‌ترین`);
  }
  
  // مقایسه باتری - آیا بیشترین ظرفیت را دارد؟
  const batteries = allLaptops.map(l => extractNumber(extractSpec(l, "باتری و شارژ", "ظرفیت باتری")));
  const myBattery = extractNumber(extractSpec(laptop, "باتری و شارژ", "ظرفیت باتری"));
  const maxBattery = Math.max(...batteries);
  if (myBattery > 0 && myBattery === maxBattery && batteries.filter(b => b === maxBattery).length === 1) {
    const minBattery = Math.min(...batteries.filter(b => b > 0));
    const percent = Math.round(((myBattery - minBattery) / minBattery) * 100);
    advantages.push(`بیشترین ظرفیت باتری: ${percent}% بیشتر از کمترین`);
  }
  
  // مقایسه نمایشگر - آیا بزرگ‌ترین است؟
  const displays = allLaptops.map(l => extractNumber(extractSpec(l, "صفحه نمایش", "اندازه صفحه نمایش")));
  const myDisplay = extractNumber(extractSpec(laptop, "صفحه نمایش", "اندازه صفحه نمایش"));
  const maxDisplay = Math.max(...displays);
  if (myDisplay > 0 && myDisplay === maxDisplay && displays.filter(d => d === maxDisplay).length === 1) {
    advantages.push(`بزرگ‌ترین نمایشگر: ${myDisplay} اینچ`);
  }
  
  // مقایسه نرخ نوسازی - آیا بالاترین است؟
  const refreshRates = allLaptops.map(l => extractNumber(extractSpec(l, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)")));
  const myRefresh = extractNumber(extractSpec(laptop, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)"));
  const maxRefresh = Math.max(...refreshRates);
  if (myRefresh > 0 && myRefresh === maxRefresh && refreshRates.filter(r => r === maxRefresh).length === 1) {
    advantages.push(`بالاترین نرخ نوسازی: ${myRefresh} هرتز`);
  }
  
  // مقایسه رم - آیا بیشترین را دارد؟
  const rams = allLaptops.map(l => extractNumber(extractSpec(l, "حافظه رم", "حافظه داخلی رم")));
  const myRam = extractNumber(extractSpec(laptop, "حافظه رم", "حافظه داخلی رم"));
  const maxRam = Math.max(...rams);
  if (myRam > 0 && myRam === maxRam && rams.filter(r => r === maxRam).length === 1) {
    advantages.push(`بیشترین حافظه رم: ${myRam}GB`);
  }
  
  // مقایسه ذخیره‌سازی - آیا بیشترین را دارد؟
  const storages = allLaptops.map(l => extractNumber(extractSpec(l, "ذخیره‌سازی", "ظرفیت کلی")));
  const myStorage = extractNumber(extractSpec(laptop, "ذخیره‌سازی", "ظرفیت کلی"));
  const maxStorage = Math.max(...storages);
  if (myStorage > 0 && myStorage === maxStorage && storages.filter(s => s === maxStorage).length === 1) {
    advantages.push(`بیشترین حافظه ذخیره‌سازی: ${myStorage}GB`);
  }
  
  // مقایسه قیمت - آیا ارزان‌ترین است؟
  const prices = allLaptops.map(l => l.price);
  const myPrice = laptop.price;
  const minPrice = Math.min(...prices);
  if (myPrice === minPrice && prices.filter(p => p === minPrice).length === 1) {
    const maxPrice = Math.max(...prices);
    const diff = maxPrice - myPrice;
    advantages.push(`ارزان‌ترین: ${fmt(diff)} ارزان‌تر از گران‌ترین`);
  }
  
  return advantages.slice(0, 6); // حداکثر 6 مزیت
}

// محاسبه امتیاز دسته‌ها
function calculateCategoryScores(laptop: Laptop) {
  const cpuSpec = extractSpec(laptop, "پردازنده", "تعداد هسته و رشته");
  const cores = extractNumber(cpuSpec);
  const cpuScore = Math.min(100, Math.round(cores * 4));

  const gpuModel = extractSpec(laptop, "گرافیک", "مدل گرافیک مجزا").toLowerCase();
  let gpuScore = 50;
  if (gpuModel.includes("rtx 5090")) gpuScore = 98;
  else if (gpuModel.includes("rtx 5080")) gpuScore = 95;
  else if (gpuModel.includes("rtx 5070")) gpuScore = 90;
  else if (gpuModel.includes("rtx 4090")) gpuScore = 95;
  else if (gpuModel.includes("rtx 4080")) gpuScore = 90;
  else if (gpuModel.includes("rtx 4070")) gpuScore = 85;
  else if (gpuModel.includes("rtx 4060")) gpuScore = 75;
  else if (gpuModel.includes("rtx 4050")) gpuScore = 70;

  const displayRes = extractSpec(laptop, "صفحه نمایش", "رزولوشن");
  let displayScore = 70;
  if (displayRes.includes("3840") || displayRes.includes("4K")) displayScore = 95;
  else if (displayRes.includes("2560") || displayRes.includes("QHD")) displayScore = 85;
  else if (displayRes.includes("1920") || displayRes.includes("FHD")) displayScore = 70;

  const batteryCap = extractSpec(laptop, "باتری و شارژ", "ظرفیت باتری");
  const batteryScore = Math.min(100, Math.round(extractNumber(batteryCap) * 1.1));

  const weight = extractNumber(extractSpec(laptop, "وزن و ابعاد", "وزن"));
  const portabilityScore = Math.max(0, Math.min(100, Math.round((3 - weight) * 50 + 50)));

  const overall = Math.round((cpuScore + gpuScore + displayScore + batteryScore + portabilityScore) / 5);

  return {
    performance: cpuScore,
    gaming: gpuScore,
    display: displayScore,
    battery: batteryScore,
    connectivity: 75,
    portability: portabilityScore,
    overall,
  };
}



// کامپوننت جدول مقایسه
function ComparisonTable({ title, rows }: {
  title: string;
  rows: { label: string; valueA: string; valueB: string }[];
}) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
              <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
              <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">لپ‌تاپ A</th>
              <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">لپ‌تاپ B</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-[#f3f4f6]">
                <td className="p-3 text-sm font-medium text-[#1a1a1a]">{row.label}</td>
                <td className="p-3 text-center text-sm text-[#4b5563]">{row.valueA}</td>
                <td className="p-3 text-center text-sm text-[#4b5563]">{row.valueB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage({ products, ids, onClose, onAddToCart }: ComparePageProps) {
  const laptops = ids.map(id => products.find(p => p.id === id)).filter((p): p is Laptop => !!p);
  const [scenario, setScenario] = useState("gaming");

  if (laptops.length < 2 || laptops.length > 4) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-600">
            {laptops.length < 2 
              ? "حداقل ۲ محصول برای مقایسه انتخاب کنید" 
              : "حداکثر ۴ محصول برای مقایسه انتخاب کنید"}
          </p>
          <button onClick={onClose} className="mt-4 rounded-lg bg-[#2563eb] px-6 py-3 text-white font-bold">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const laptopA = laptops[0];
  const laptopB = laptops[1];
  const scoresA = calculateCategoryScores(laptopA);
  const scoresB = calculateCategoryScores(laptopB);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f7]" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-[#e5e7eb]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-[#1a1a1a]">مقایسه لپ‌تاپ‌ها</h1>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] transition-colors hover:bg-[#f9fafb]">
            <IClose size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Products Header - تا ۴ لپ‌تاپ */}
        <div className="mb-8">
          <div className={`grid gap-4 ${
            laptops.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            laptops.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            'grid-cols-2 md:grid-cols-4'
          }`}>
            {laptops.map((laptop, index) => {
              const scores = calculateCategoryScores(laptop);
              return (
                <div key={laptop.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-3 flex justify-center">
                    <img src={laptop.image} alt={laptop.name} className="h-32 w-auto object-contain" />
                  </div>
                  <h2 className="mb-2 text-center text-sm font-bold text-[#1a1a1a] line-clamp-2">
                    {laptop.name}
                  </h2>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-[#2563eb] px-4 py-1.5 text-lg font-bold text-white">
                      {toFa(scores.overall)} / ۱۰۰
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Section - پیکسل پرفکت مطابق NanoReview */}
        <div className="mb-8">
          <Review
            laptops={laptops.map(laptop => {
              const scores = calculateCategoryScores(laptop);
              return {
                name: laptop.name,
                scores: {
                  performance: scores.performance,
                  gaming: scores.gaming,
                  display: scores.display,
                  battery: scores.battery,
                  connectivity: scores.connectivity,
                  portability: scores.portability,
                },
              };
            })}
          />
        </div>

        {/* NanoReview Score Section */}
        <div className="mb-8">
          <NanoReviewScore
            laptops={laptops.map(laptop => {
              const scores = calculateCategoryScores(laptop);
              return {
                name: laptop.name,
                score: scores.overall,
              };
            })}
          />
        </div>

        {/* Value for Money */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">ارزش خرید</h2>
          <p className="mb-6 text-sm text-[#6b7280]">مقایسه قیمت و عملکرد</p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-[#f9fafb] p-6 text-center">
              <p className="mb-2 text-sm text-[#6b7280]">قیمت</p>
              <p className="mb-2 text-2xl font-bold text-[#1a1a1a]">{fmt(laptopA.price)}</p>
              <p className="text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</p>
              <div className="mt-4 rounded-lg bg-[#2563eb] px-4 py-2 text-white">
                <p className="text-xs">شاخص ارزش</p>
                <p className="text-xl font-bold">{toFa(Math.round((scoresA.overall / laptopA.price) * 100000000))}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#f9fafb] p-6 text-center">
              <p className="mb-2 text-sm text-[#6b7280]">قیمت</p>
              <p className="mb-2 text-2xl font-bold text-[#1a1a1a]">{fmt(laptopB.price)}</p>
              <p className="text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</p>
              <div className="mt-4 rounded-lg bg-[#2563eb] px-4 py-2 text-white">
                <p className="text-xs">شاخص ارزش</p>
                <p className="text-xl font-bold">{toFa(Math.round((scoresB.overall / laptopB.price) * 100000000))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Differences - پیکسل پرفکت مطابق NanoReview */}
        <div className="mb-8">
          <KeyDifferences
            laptops={laptops.map(laptop => ({
              name: laptop.name,
              advantages: generateAdvantagesForAll(laptop, laptops),
            }))}
          />
        </div>

        {/* Technical Specifications */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">تست‌ها و مشخصات فنی</h2>
          <p className="mb-6 text-sm text-[#6b7280]">جدول مقایسه نتایج تست و مشخصات فنی</p>

          {/* Case Table */}
          <ComparisonTable
            title="بدنه"
            rows={[
              { label: "وزن", valueA: extractSpec(laptopA, "وزن و ابعاد", "وزن"), valueB: extractSpec(laptopB, "وزن و ابعاد", "وزن") },
              { label: "طول", valueA: extractSpec(laptopA, "وزن و ابعاد", "طول"), valueB: extractSpec(laptopB, "وزن و ابعاد", "طول") },
              { label: "عرض", valueA: extractSpec(laptopA, "وزن و ابعاد", "عرض"), valueB: extractSpec(laptopB, "وزن و ابعاد", "عرض") },
              { label: "ضخامت", valueA: extractSpec(laptopA, "وزن و ابعاد", "ضخامت"), valueB: extractSpec(laptopB, "وزن و ابعاد", "ضخامت") },
            ]}
          />

          {/* Display Table */}
          <ComparisonTable
            title="نمایشگر"
            rows={[
              { label: "اندازه صفحه نمایش", valueA: extractSpec(laptopA, "صفحه نمایش", "اندازه صفحه نمایش"), valueB: extractSpec(laptopB, "صفحه نمایش", "اندازه صفحه نمایش") },
              { label: "رزولوشن", valueA: extractSpec(laptopA, "صفحه نمایش", "رزولوشن"), valueB: extractSpec(laptopB, "صفحه نمایش", "رزولوشن") },
              { label: "نرخ نوسازی", valueA: extractSpec(laptopA, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)"), valueB: extractSpec(laptopB, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)") },
              { label: "نوع پنل", valueA: extractSpec(laptopA, "صفحه نمایش", "فناوری و نوع صفحه"), valueB: extractSpec(laptopB, "صفحه نمایش", "فناوری و نوع صفحه") },
              { label: "زاویه دید", valueA: extractSpec(laptopA, "صفحه نمایش", "زاویه دید"), valueB: extractSpec(laptopB, "صفحه نمایش", "زاویه دید") },
              { label: "Color Gamut", valueA: extractSpec(laptopA, "صفحه نمایش", "Color Gamut"), valueB: extractSpec(laptopB, "صفحه نمایش", "Color Gamut") },
            ]}
          />

          {/* CPU Table */}
          <ComparisonTable
            title="پردازنده"
            rows={[
              { label: "مدل پردازنده", valueA: extractSpec(laptopA, "پردازنده", "مدل پردازنده"), valueB: extractSpec(laptopB, "پردازنده", "مدل پردازنده") },
              { label: "تعداد هسته و رشته", valueA: extractSpec(laptopA, "پردازنده", "تعداد هسته و رشته"), valueB: extractSpec(laptopB, "پردازنده", "تعداد هسته و رشته") },
              { label: "فرکانس پایه و حداکثر", valueA: extractSpec(laptopA, "پردازنده", "فرکانس پایه و حداکثر"), valueB: extractSpec(laptopB, "پردازنده", "فرکانس پایه و حداکثر") },
              { label: "بنچمارک تک هسته‌ای", valueA: extractSpec(laptopA, "پردازنده", "بنچمارک تک هسته‌ای"), valueB: extractSpec(laptopB, "پردازنده", "بنچمارک تک هسته‌ای") },
              { label: "بنچمارک چند هسته‌ای", valueA: extractSpec(laptopA, "پردازنده", "بنچمارک چند هسته‌ای"), valueB: extractSpec(laptopB, "پردازنده", "بنچمارک چند هسته‌ای") },
              { label: "واحد پردازش عصبی (NPU)", valueA: extractSpec(laptopA, "پردازنده", "واحد پردازش عصبی (NPU)"), valueB: extractSpec(laptopB, "پردازنده", "واحد پردازش عصبی (NPU)") },
            ]}
          />

          {/* GPU Table */}
          <ComparisonTable
            title="کارت گرافیک"
            rows={[
              { label: "مدل گرافیک مجزا", valueA: extractSpec(laptopA, "گرافیک", "مدل گرافیک مجزا"), valueB: extractSpec(laptopB, "گرافیک", "مدل گرافیک مجزا") },
              { label: "حافظه گرافیک مجزا", valueA: extractSpec(laptopA, "گرافیک", "حافظه گرافیک مجزا"), valueB: extractSpec(laptopB, "گرافیک", "حافظه گرافیک مجزا") },
              { label: "نوع حافظه گرافیک", valueA: extractSpec(laptopA, "گرافیک", "نوع حافظه گرافیک"), valueB: extractSpec(laptopB, "گرافیک", "نوع حافظه گرافیک") },
              { label: "توان مصرفی", valueA: extractSpec(laptopA, "گرافیک", "توان مصرفی"), valueB: extractSpec(laptopB, "گرافیک", "توان مصرفی") },
            ]}
          />

          {/* RAM Table */}
          <ComparisonTable
            title="حافظه رم"
            rows={[
              { label: "حافظه داخلی رم", valueA: extractSpec(laptopA, "حافظه رم", "حافظه داخلی رم"), valueB: extractSpec(laptopB, "حافظه رم", "حافظه داخلی رم") },
              { label: "نوع حافظه", valueA: extractSpec(laptopA, "حافظه رم", "نوع حافظه"), valueB: extractSpec(laptopB, "حافظه رم", "نوع حافظه") },
              { label: "CAS latency", valueA: extractSpec(laptopA, "حافظه رم", "CAS latency"), valueB: extractSpec(laptopB, "حافظه رم", "CAS latency") },
              { label: "رابط/اینترفیس", valueA: extractSpec(laptopA, "حافظه رم", "رابط/اینترفیس"), valueB: extractSpec(laptopB, "حافظه رم", "رابط/اینترفیس") },
            ]}
          />

          {/* Storage Table */}
          <ComparisonTable
            title="ذخیره‌سازی"
            rows={[
              { label: "ظرفیت کلی", valueA: extractSpec(laptopA, "ذخیره‌سازی", "ظرفیت کلی"), valueB: extractSpec(laptopB, "ذخیره‌سازی", "ظرفیت کلی") },
              { label: "رابط SSD", valueA: extractSpec(laptopA, "ذخیره‌سازی", "رابط SSD"), valueB: extractSpec(laptopB, "ذخیره‌سازی", "رابط SSD") },
              { label: "نسخه NVMe", valueA: extractSpec(laptopA, "ذخیره‌سازی", "نسخه NVMe"), valueB: extractSpec(laptopB, "ذخیره‌سازی", "نسخه NVMe") },
            ]}
          />

          {/* Battery Table */}
          <ComparisonTable
            title="باتری و شارژ"
            rows={[
              { label: "ظرفیت باتری", valueA: extractSpec(laptopA, "باتری و شارژ", "ظرفیت باتری"), valueB: extractSpec(laptopB, "باتری و شارژ", "ظرفیت باتری") },
              { label: "عمر شارژ", valueA: extractSpec(laptopA, "باتری و شارژ", "عمر شارژ"), valueB: extractSpec(laptopB, "باتری و شارژ", "عمر شارژ") },
              { label: "توان آداپتور", valueA: extractSpec(laptopA, "باتری و شارژ", "توان آداپتور"), valueB: extractSpec(laptopB, "باتری و شارژ", "توان آداپتور") },
            ]}
          />

          {/* Sound Table */}
          <ComparisonTable
            title="صدا"
            rows={[
              { label: "سیستم صوتی", valueA: extractSpec(laptopA, "صدا", "سیستم صوتی"), valueB: extractSpec(laptopB, "صدا", "سیستم صوتی") },
              { label: "تعداد بلندگوها", valueA: extractSpec(laptopA, "صدا", "تعداد بلندگوهای داخلی"), valueB: extractSpec(laptopB, "صدا", "تعداد بلندگوهای داخلی") },
              { label: "میکروفون", valueA: extractSpec(laptopA, "صدا", "میکروفون داخلی"), valueB: extractSpec(laptopB, "صدا", "میکروفون داخلی") },
            ]}
          />

          {/* Connectivity Table */}
          <ComparisonTable
            title="اتصالات"
            rows={[
              { label: "Wi-Fi", valueA: extractSpec(laptopA, "اتصالات و پورت‌ها", "بالاترین استاندارد Wi-Fi"), valueB: extractSpec(laptopB, "اتصالات و پورت‌ها", "بالاترین استاندارد Wi-Fi") },
              { label: "Bluetooth", valueA: extractSpec(laptopA, "اتصالات و پورت‌ها", "بلوتوث"), valueB: extractSpec(laptopB, "اتصالات و پورت‌ها", "بلوتوث") },
              { label: "USB-C", valueA: extractSpec(laptopA, "اتصالات و پورت‌ها", "تعداد USB-C"), valueB: extractSpec(laptopB, "اتصالات و پورت‌ها", "تعداد USB-C") },
              { label: "USB-A", valueA: extractSpec(laptopA, "اتصالات و پورت‌ها", "تعداد USB-A"), valueB: extractSpec(laptopB, "اتصالات و پورت‌ها", "تعداد USB-A") },
              { label: "HDMI", valueA: extractSpec(laptopA, "اتصالات و پورت‌ها", "تعداد پورت HDMI"), valueB: extractSpec(laptopB, "اتصالات و پورت‌ها", "تعداد پورت HDMI") },
            ]}
          />

          {/* Input Table */}
          <ComparisonTable
            title="ورودی / کیبورد / تاچ‌پد"
            rows={[
              { label: "کیبورد", valueA: extractSpec(laptopA, "کیبورد", "نوع کیبورد"), valueB: extractSpec(laptopB, "کیبورد", "نوع کیبورد") },
              { label: "نور پس‌زمینه", valueA: extractSpec(laptopA, "کیبورد", "نور پس‌زمینه"), valueB: extractSpec(laptopB, "کیبورد", "نور پس‌زمینه") },
              { label: "تاچ‌پد", valueA: extractSpec(laptopA, "کیبورد", "تاچ‌پد"), valueB: extractSpec(laptopB, "کیبورد", "تاچ‌پد") },
            ]}
          />
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white p-6 shadow-lg">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3">
            {laptops.map((laptop) => (
              <button
                key={laptop.id}
                onClick={() => onAddToCart(laptop.id)}
                className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                <ICart size={16} />
                افزودن {laptop.shortName} به سبد
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
