import { useState, useMemo, useRef, useEffect } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { IClose, ICart } from "./icons";

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

// رنگ‌های متمایز برای هر لپ‌تاپ
const LAPTOP_COLORS = [
  { color: "#6366f1", colorDark: "#4f46e5" }, // نیلی
  { color: "#2dd4bf", colorDark: "#14b8a6" }, // فیروزه‌ای
  { color: "#f59e0b", colorDark: "#d97706" }, // کهربایی
  { color: "#ef4444", colorDark: "#dc2626" }, // قرمز
];

// تعیین برنده برای هر ردیف (کمتر بهتر یا بیشتر بهتر)
function getWinnerIndex<T extends number | string>(values: T[], lowerIsBetter: boolean = false): number[] {
  const validIndices: number[] = [];
  const validValues: (number | string)[] = [];
  
  values.forEach((v, i) => {
    if (v !== "—" && v !== "" && v !== null && v !== undefined) {
      validIndices.push(i);
      validValues.push(v);
    }
  });
  
  if (validValues.length < 2) return [];
  
  // تبدیل به عدد برای مقایسه
  const numericValues = validValues.map(v => {
    if (typeof v === "number") return v;
    const num = extractNumber(String(v));
    return num > 0 ? num : 0;
  });
  
  const bestValue = lowerIsBetter 
    ? Math.min(...numericValues.filter(v => v > 0))
    : Math.max(...numericValues.filter(v => v > 0));
  
  if (bestValue === 0) return [];
  
  const winners: number[] = [];
  numericValues.forEach((v, i) => {
    if (v === bestValue) {
      winners.push(validIndices[i]);
    }
  });
  
  return winners.length > 1 ? [] : winners; // اگر تساوی باشد، برنده‌ای نیست
}

// کامپوننت نوار امتیاز با 4 لپ‌تاپ
function ScoreBar({ label, scores, laptopNames }: {
  label: string;
  scores: number[];
  laptopNames: string[];
}) {
  const maxScore = Math.max(...scores);
  
  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-[#1a1a1a]">{label}</span>
      </div>
      <div className="space-y-2.5">
        {scores.map((score, index) => {
          const isWinner = score === maxScore && scores.filter(s => s === maxScore).length === 1;
          return (
            <div key={index} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-[#4b5563]">{laptopNames[index]}</span>
              <div className="flex-1">
                <div className="relative h-6 overflow-hidden rounded bg-[#f3f4f6]">
                  <div
                    className={`h-full rounded transition-all duration-500 ${
                      isWinner ? "bg-[#10b981]" : "bg-[#3b4cc0]"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {toFa(score)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePage({ products, ids, onClose, onAddToCart }: ComparePageProps) {
  const laptops = ids.map(id => products.find(p => p.id === id)).filter((p): p is Laptop => !!p);
  const [scenario, setScenario] = useState("gaming");

  if (laptops.length < 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-600">حداقل ۲ محصول برای مقایسه انتخاب کنید</p>
          <button onClick={onClose} className="mt-4 rounded-lg bg-[#2563eb] px-6 py-3 text-white font-bold">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const [laptopA, laptopB] = laptops;
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
        {/* Two Products Header */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr]">
          {/* Laptop A */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex justify-center">
              <img src={laptopA.image} alt={laptopA.name} className="h-40 w-auto object-contain" />
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-[#1a1a1a]">{laptopA.name}</h2>
            <div className="flex justify-center">
              <div className="rounded-full bg-[#2563eb] px-6 py-2 text-2xl font-bold text-white">
                {toFa(scoresA.overall)} / ۱۰۰
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-[#f59e0b] px-6 py-4 text-3xl font-bold text-white shadow-lg">
              VS
            </div>
          </div>

          {/* Laptop B */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex justify-center">
              <img src={laptopB.image} alt={laptopB.name} className="h-40 w-auto object-contain" />
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-[#1a1a1a]">{laptopB.name}</h2>
            <div className="flex justify-center">
              <div className="rounded-full bg-[#2563eb] px-6 py-2 text-2xl font-bold text-white">
                {toFa(scoresB.overall)} / ۱۰۰
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">بررسی</h2>
          <p className="mb-6 text-sm text-[#6b7280]">ارزیابی ویژگی‌های مهم</p>

          {/* Scenario Selector */}
          <div className="mb-6 rounded-xl bg-[#f9fafb] p-4">
            <p className="mb-3 text-sm font-bold text-[#1a1a1a]">سناریوی استفاده را انتخاب کنید:</p>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm"
            >
              <option value="gaming">گیمینگ</option>
              <option value="business">تجاری</option>
              <option value="programming">برنامه‌نویسی</option>
              <option value="student">دانشجویی</option>
              <option value="content">تولید محتوا</option>
              <option value="engineering">مهندسی</option>
            </select>
          </div>

          {/* Score Bars */}
          <div className="space-y-6">
            <ScoreBar label="عملکرد" scoreA={scoresA.performance} scoreB={scoresB.performance} laptopAName={laptopA.shortName} laptopBName={laptopB.shortName} />
            <ScoreBar label="گیمینگ" scoreA={scoresA.gaming} scoreB={scoresB.gaming} laptopAName={laptopA.shortName} laptopBName={laptopB.shortName} />
            <ScoreBar label="نمایشگر" scoreA={scoresA.display} scoreB={scoresB.display} laptopAName={laptopA.shortName} laptopBName={laptopB.shortName} />
            <ScoreBar label="عمر باتری" scoreA={scoresA.battery} scoreB={scoresB.battery} laptopAName={laptopA.shortName} laptopBName={laptopB.shortName} />
            <ScoreBar label="اتصالات" scoreA={scoresA.connectivity} scoreB={scoresB.connectivity} laptopAName={laptopA.shortName} laptopBName={laptopB.shortName} />
            <ScoreBar label="قابلیت حمل" scoreA={scoresA.portability} scoreB={scoresB.portability} laptopAName={laptopA.shortName} laptopBName={laptopB.shortName} />
          </div>
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

        {/* Key Differences */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">تفاوت‌های کلیدی</h2>
          <p className="mb-6 text-sm text-[#6b7280]">تفاوت‌های اصلی بین دو لپ‌تاپ</p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">مزایای {laptopA.shortName}</h3>
              <ul className="space-y-2">
                {scoresA.performance > scoresB.performance && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>عملکرد پردازنده قوی‌تر</span>
                  </li>
                )}
                {scoresA.gaming > scoresB.gaming && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>عملکرد گرافیکی بهتر</span>
                  </li>
                )}
                {scoresA.display > scoresB.display && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>نمایشگر بهتر</span>
                  </li>
                )}
                {scoresA.battery > scoresB.battery && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>باتری قوی‌تر</span>
                  </li>
                )}
                {scoresA.portability > scoresB.portability && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>سبک‌تر و قابل‌حمل‌تر</span>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">مزایای {laptopB.shortName}</h3>
              <ul className="space-y-2">
                {scoresB.performance > scoresA.performance && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>عملکرد پردازنده قوی‌تر</span>
                  </li>
                )}
                {scoresB.gaming > scoresA.gaming && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>عملکرد گرافیکی بهتر</span>
                  </li>
                )}
                {scoresB.display > scoresA.display && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>نمایشگر بهتر</span>
                  </li>
                )}
                {scoresB.battery > scoresA.battery && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>باتری قوی‌تر</span>
                  </li>
                )}
                {scoresB.portability > scoresA.portability && (
                  <li className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="text-green-600">✓</span>
                    <span>سبک‌تر و قابل‌حمل‌تر</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">تست‌ها و مشخصات فنی</h2>
          <p className="mb-6 text-sm text-[#6b7280]">جدول مقایسه نتایج تست و مشخصات فنی</p>

          {/* Case Table */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">بدنه</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">وزن</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "وزن و ابعاد", "وزن")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "وزن و ابعاد", "وزن")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">طول</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "وزن و ابعاد", "طول")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "وزن و ابعاد", "طول")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">عرض</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "وزن و ابعاد", "عرض")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "وزن و ابعاد", "عرض")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">ضخامت</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "وزن و ابعاد", "ضخامت")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "وزن و ابعاد", "ضخامت")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Display Table */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">نمایشگر</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">اندازه صفحه نمایش</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "صفحه نمایش", "اندازه صفحه نمایش")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "صفحه نمایش", "اندازه صفحه نمایش")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">رزولوشن</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "صفحه نمایش", "رزولوشن")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "صفحه نمایش", "رزولوشن")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">نرخ نوسازی</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">نوع پنل</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "صفحه نمایش", "فناوری و نوع صفحه")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "صفحه نمایش", "فناوری و نوع صفحه")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CPU Table */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">پردازنده</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">مدل پردازنده</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "پردازنده", "مدل پردازنده")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "پردازنده", "مدل پردازنده")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">تعداد هسته و رشته</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "پردازنده", "تعداد هسته و رشته")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "پردازنده", "تعداد هسته و رشته")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">فرکانس پایه و حداکثر</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "پردازنده", "فرکانس پایه و حداکثر")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "پردازنده", "فرکانس پایه و حداکثر")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">بنچمارک تک هسته‌ای</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "پردازنده", "بنچمارک تک هسته‌ای")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "پردازنده", "بنچمارک تک هسته‌ای")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">بنچمارک چند هسته‌ای</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "پردازنده", "بنچمارک چند هسته‌ای")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "پردازنده", "بنچمارک چند هسته‌ای")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* GPU Table */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">کارت گرافیک</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">مدل گرافیک مجزا</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "گرافیک", "مدل گرافیک مجزا")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "گرافیک", "مدل گرافیک مجزا")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">حافظه گرافیک مجزا</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "گرافیک", "حافظه گرافیک مجزا")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "گرافیک", "حافظه گرافیک مجزا")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">نوع حافظه گرافیک</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "گرافیک", "نوع حافظه گرافیک")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "گرافیک", "نوع حافظه گرافیک")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RAM Table */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">حافظه رم</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">حافظه داخلی رم</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "حافظه رم", "حافظه داخلی رم")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "حافظه رم", "حافظه داخلی رم")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">نوع حافظه</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "حافظه رم", "نوع حافظه")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "حافظه رم", "نوع حافظه")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">CAS latency</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "حافظه رم", "CAS latency")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "حافظه رم", "CAS latency")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Storage Table */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">ذخیره‌سازی</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">ظرفیت کلی</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "ذخیره‌سازی", "ظرفیت کلی")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "ذخیره‌سازی", "ظرفیت کلی")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">رابط SSD</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "ذخیره‌سازی", "رابط SSD")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "ذخیره‌سازی", "رابط SSD")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">نسخه NVMe</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "ذخیره‌سازی", "نسخه NVMe")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "ذخیره‌سازی", "نسخه NVMe")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Battery Table */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-[#1a1a1a]">باتری و شارژ</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="p-3 text-right text-sm font-bold text-[#1a1a1a]">مشخصه</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopA.shortName}</th>
                    <th className="p-3 text-center text-sm font-bold text-[#1a1a1a]">{laptopB.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">ظرفیت باتری</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "باتری و شارژ", "ظرفیت باتری")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "باتری و شارژ", "ظرفیت باتری")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">عمر شارژ</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "باتری و شارژ", "عمر شارژ")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "باتری و شارژ", "عمر شارژ")}</td>
                  </tr>
                  <tr className="border-b border-[#f3f4f6]">
                    <td className="p-3 text-sm font-medium text-[#1a1a1a]">توان آداپتور</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopA, "باتری و شارژ", "توان آداپتور")}</td>
                    <td className="p-3 text-center text-sm text-[#4b5563]">{extractSpec(laptopB, "باتری و شارژ", "توان آداپتور")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white p-6 shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex gap-3">
              {laptops.map((laptop) => (
                <button
                  key={laptop.id}
                  onClick={() => onAddToCart(laptop.id)}
                  className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
                >
                  <ICart size={16} />
                  افزودن {laptop.shortName} به سبد
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
