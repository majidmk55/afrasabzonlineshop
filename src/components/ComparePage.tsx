import { useState, useMemo, useRef, useEffect } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { IClose, ICart } from "./icons";

interface ComparePageProps {
  products: Laptop[];
  ids: string[];
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

// رنگ‌های طراحی
const COLORS = {
  laptop1: "#6366f1",
  laptop2: "#2dd4bf",
  laptop3: "#f59e0b",
  laptop4: "#ef4444",
  primary: "#3b4cc0",
  winner: "#e8f5e9",
  background: "#ffffff",
  headerBg: "#f5f6f8",
  textPrimary: "#1a1a2e",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  barTrack: "#e5e7eb",
};

// استخراج مشخصات
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

// کامپوننت Comparison Header
function ComparisonHeader({ laptops }: { laptops: Laptop[] }) {
  return (
    <div className="sticky top-0 z-10 border-b border-[#e5e7eb] bg-[#f5f6f8] px-6 py-4">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-bold text-[#1a1a2e]">لپ‌تاپ‌ها:</span>
          <div className="flex items-center gap-2 text-sm">
            {laptops.map((laptop, index) => (
              <span key={laptop.id} className="flex items-center gap-2">
                <span className="font-bold text-[#3b4cc0]">{laptop.shortName}</span>
                {index < laptops.length - 1 && (
                  <span className="text-xs text-[#6b7280]">vs</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// کامپوننت Section Header
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3b4cc0]">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-[#1a1a2e]">{title}</h2>
      </div>
      {subtitle && <p className="mt-2 text-sm text-[#6b7280]">{subtitle}</p>}
    </div>
  );
}

// کامپوننت Comparison Row
function ComparisonRow({ 
  label, 
  values, 
  isWinner 
}: { 
  label: string; 
  values: string[]; 
  isWinner: (index: number) => boolean;
}) {
  return (
    <div className="grid grid-cols-5 border-b border-[#e5e7eb] py-3 hover:bg-[#f9fafb]">
      <div className="px-3 text-sm text-[#6b7280]">{label}</div>
      {values.map((value, index) => (
        <div
          key={index}
          className={`px-3 text-sm font-medium ${isWinner(index) ? "bg-[#e8f5e9] text-[#166534]" : "text-[#1a1a2e]"}`}
        >
          {value}
        </div>
      ))}
    </div>
  );
}

// کامپوننت Four Column Table
function FourColumnTable({ 
  title, 
  icon, 
  rows 
}: { 
  title: string; 
  icon: React.ReactNode;
  rows: { label: string; values: string[]; isWinner: (index: number) => boolean }[];
}) {
  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader icon={icon} title={title} />
      <div className="overflow-x-auto">
        {rows.map((row, index) => (
          <ComparisonRow
            key={index}
            label={row.label}
            values={row.values}
            isWinner={row.isWinner}
          />
        ))}
      </div>
    </div>
  );
}

// کامپوننت Score Bar
function ScoreBar({ 
  label, 
  scores, 
  laptopNames,
  colors 
}: { 
  label: string; 
  scores: number[]; 
  laptopNames: string[];
  colors: string[];
}) {
  const maxScore = Math.max(...scores);
  
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-[#1a1a2e]">{label}</span>
      </div>
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-24 text-xs text-[#4b5563]">{laptopNames[index]}</span>
            <div className="flex-1">
              <div className="relative h-6 overflow-hidden rounded bg-[#e5e7eb]">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{ 
                    width: `${score}%`,
                    backgroundColor: colors[index]
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {toFa(score)}
                </span>
              </div>
            </div>
            {score === maxScore && (
              <span className="rounded bg-[#3b4cc0] px-2 py-1 text-xs font-bold text-white">
                برنده
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// کامپوننت Size Comparison 3D
function SizeComparison3D({ laptops }: { laptops: Laptop[] }) {
  const colors = [COLORS.laptop1, COLORS.laptop2, COLORS.laptop3, COLORS.laptop4];
  
  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>} 
        title="مقایسه اندازه" 
      />
      
      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4">
        {laptops.map((laptop, index) => (
          <div key={laptop.id} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index] }} />
            <span className="text-sm text-[#1a1a2e]">{laptop.shortName}</span>
          </div>
        ))}
      </div>

      {/* 3D Visualization */}
      <div className="relative flex h-64 items-center justify-center">
        <div className="relative" style={{ width: "400px", height: "250px" }}>
          {laptops.map((laptop, index) => {
            const weight = extractNumber(extractSpec(laptop, "وزن و ابعاد", "وزن"));
            const scale = Math.max(0.6, Math.min(1, 3 - weight));
            const offset = index * 20;
            
            return (
              <div
                key={laptop.id}
                className="absolute flex items-center justify-center rounded-lg shadow-lg transition-all duration-500"
                style={{
                  width: `${scale * 300}px`,
                  height: `${scale * 200}px`,
                  backgroundColor: colors[index],
                  left: `${offset}px`,
                  top: `${offset}px`,
                  opacity: 0.8,
                  zIndex: index,
                }}
              >
                <div className="text-center text-white">
                  <div className="text-sm font-bold">{laptop.shortName}</div>
                  <div className="text-xs">{toFa(weight)} کیلوگرم</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// کامپوننت Key Differences
function KeyDifferences({ laptops }: { laptops: Laptop[] }) {
  const colors = [COLORS.laptop1, COLORS.laptop2, COLORS.laptop3, COLORS.laptop4];
  
  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/></svg>} 
        title="تفاوت‌های کلیدی" 
        subtitle="تفاوت‌های اصلی بین لپ‌تاپ‌ها"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {laptops.map((laptop, index) => (
          <div key={laptop.id} className="rounded-lg border border-[#e5e7eb] p-4">
            <h3 className="mb-3 text-sm font-bold" style={{ color: colors[index] }}>
              مزایای {laptop.shortName}
            </h3>
            <ul className="space-y-2">
              {laptop.highlights.slice(0, 5).map((highlight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#4b5563]">
                  <div 
                    className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: colors[index] }}
                  >
                    <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// کامپوننت Review Scores Grid
function ReviewScoresGrid({ laptops }: { laptops: Laptop[] }) {
  const colors = [COLORS.laptop1, COLORS.laptop2, COLORS.laptop3, COLORS.laptop4];
  const laptopNames = laptops.map(l => l.shortName);
  
  const categories = [
    { key: "performance", label: "عملکرد" },
    { key: "gaming", label: "بازی" },
    { key: "display", label: "نمایشگر" },
    { key: "battery", label: "باتری" },
    { key: "connectivity", label: "اتصالات" },
    { key: "portability", label: "قابلیت حمل" },
  ];

  const allScores = laptops.map(l => calculateCategoryScores(l));

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M3 3v18h18M7 16l4-4 4 4 5-5"/></svg>} 
        title="بررسی" 
        subtitle="ارزیابی ویژگی‌های مهم"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.key} className="rounded-lg border border-[#e5e7eb] p-4">
            <ScoreBar
              label={category.label}
              scores={allScores.map(s => s[category.key as keyof typeof s] as number)}
              laptopNames={laptopNames}
              colors={colors}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// کامپوننت NanoReview Summary
function NanoReviewSummary({ laptops }: { laptops: Laptop[] }) {
  const colors = [COLORS.laptop1, COLORS.laptop2, COLORS.laptop3, COLORS.laptop4];
  const scores = laptops.map(l => calculateCategoryScores(l).overall);
  const maxScore = Math.max(...scores);

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6">
      <h2 className="mb-4 text-xl font-bold text-[#1a1a2e]">امتیاز NanoReview</h2>
      <div className="space-y-4">
        {laptops.map((laptop, index) => (
          <div key={laptop.id} className="flex items-center gap-4">
            <span className="w-32 text-sm font-medium text-[#1a1a2e]">{laptop.shortName}</span>
            <div className="flex-1">
              <div className="relative h-8 overflow-hidden rounded bg-[#e5e7eb]">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{ 
                    width: `${scores[index]}%`,
                    backgroundColor: colors[index]
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                  {toFa(scores[index])}
                </span>
              </div>
            </div>
            {scores[index] === maxScore && (
              <span className="rounded bg-[#3b4cc0] px-3 py-1 text-sm font-bold text-white">
                برنده
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// کامپوننت اصلی
export default function ComparePage({ products, ids, onClose, onAddToCart }: ComparePageProps) {
  const laptops = ids.map(id => products.find(p => p.id === id)).filter((p): p is Laptop => !!p);

  if (laptops.length === 0) {
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

  // استخراج داده‌های مقایسه
  const caseSpecs = {
    weight: laptops.map(l => extractSpec(l, "وزن و ابعاد", "وزن")),
    dimensions: laptops.map(l => {
      const length = extractSpec(l, "وزن و ابعاد", "طول");
      const width = extractSpec(l, "وزن و ابعاد", "عرض");
      const thickness = extractSpec(l, "وزن و ابعاد", "ضخامت");
      return `${length} × ${width} × ${thickness}`;
    }),
  };

  const displaySpecs = {
    size: laptops.map(l => extractSpec(l, "صفحه نمایش", "اندازه صفحه نمایش")),
    resolution: laptops.map(l => extractSpec(l, "صفحه نمایش", "رزولوشن")),
    refreshRate: laptops.map(l => extractSpec(l, "صفحه نمایش", "نرخ نوسازی (Refresh Rate)")),
  };

  // محاسبه برنده‌ها
  const getCaseWinners = (key: keyof typeof caseSpecs) => {
    const values = caseSpecs[key];
    if (key === "weight") {
      const weights = values.map(v => extractNumber(v));
      const minWeight = Math.min(...weights);
      return weights.map(w => w === minWeight);
    }
    return values.map(() => false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f7]">
      <ComparisonHeader laptops={laptops} />

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Case Specs */}
        <FourColumnTable
          title="مشخصات بدنه"
          icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
          rows={[
            {
              label: "وزن",
              values: caseSpecs.weight,
              isWinner: (index) => getCaseWinners("weight")[index],
            },
            {
              label: "ابعاد",
              values: caseSpecs.dimensions,
              isWinner: () => false,
            },
          ]}
        />

        {/* Display Specs */}
        <FourColumnTable
          title="مشخصات نمایشگر"
          icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/></svg>}
          rows={[
            {
              label: "اندازه",
              values: displaySpecs.size,
              isWinner: () => false,
            },
            {
              label: "رزولوشن",
              values: displaySpecs.resolution,
              isWinner: () => false,
            },
            {
              label: "نرخ نوسازی",
              values: displaySpecs.refreshRate,
              isWinner: () => false,
            },
          ]}
        />

        {/* Size Comparison 3D */}
        <SizeComparison3D laptops={laptops} />

        {/* Key Differences */}
        <KeyDifferences laptops={laptops} />

        {/* Review Scores */}
        <ReviewScoresGrid laptops={laptops} />

        {/* NanoReview Summary */}
        <NanoReviewSummary laptops={laptops} />

        {/* Action Buttons */}
        <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white p-6 shadow-lg">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between">
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
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg border border-[#ddd] bg-white px-4 py-2.5 text-sm transition-colors hover:bg-[#f9fafb]"
            >
              <IClose size={16} />
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
