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

// کامپوننت Radio Selector Row
function RadioSelectorRow({ 
  label, 
  options, 
  selectedValues,
  onChange 
}: { 
  label: string; 
  options: string[]; 
  selectedValues: string[];
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="mb-4 grid grid-cols-5 gap-3">
      <div className="text-sm text-[#6b7280]">{label}</div>
      {selectedValues.map((selected, index) => (
        <div key={index} className="flex flex-wrap gap-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={`option-${index}`}
                checked={selected === option}
                onChange={() => onChange(index, option)}
                className="h-3.5 w-3.5 accent-[#3b4cc0]"
              />
              <span className="text-xs text-[#1a1a2e]">{option}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

// کامپوننت CPU Section
function CPUSection({ laptops }: { laptops: Laptop[] }) {
  const [selectedCPUs, setSelectedCPUs] = useState<string[]>(
    laptops.map(l => extractSpec(l, "پردازنده", "مدل پردازنده"))
  );

  const cpuOptions = [
    "Intel Core Ultra 5 235HX",
    "Intel Core Ultra 7 251HX",
    "Intel Core Ultra 9 275HX",
    "AMD Ryzen 7 7840HS",
    "AMD Ryzen 9 7940HS",
  ];

  const cpuData = {
    baseFrequency: laptops.map(l => extractSpec(l, "پردازنده", "فرکانس پایه و حداکثر").split("·")[0].trim()),
    turboFrequency: laptops.map(l => extractSpec(l, "پردازنده", "فرکانس پایه و حداکثر").split("·")[1]?.trim() || "—"),
    cores: laptops.map(l => extractSpec(l, "پردازنده", "تعداد هسته و رشته")),
    threads: laptops.map(l => {
          const spec = extractSpec(l, "پردازنده", "تعداد هسته و رشته");
          const match = spec.match(/(\d+)\s رشته/);
          return match ? match[1] : "—";
        }),
    l3Cache: laptops.map(l => extractSpec(l, "پردازنده", "مقدار حافظه کش")),
    integratedGPU: laptops.map(l => extractSpec(l, "پردازنده", "گرافیک مجتمع")),
    fabricationProcess: laptops.map(l => extractSpec(l, "پردازنده", "سطح تکنولوژی ساخت")),
  };

  const handleCPUChange = (index: number, value: string) => {
    const newSelected = [...selectedCPUs];
    newSelected[index] = value;
    setSelectedCPUs(newSelected);
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z" fill="#3b4cc0"/></svg>} 
        title="پردازنده" 
      />

      <RadioSelectorRow
        label="نام پردازنده"
        options={cpuOptions}
        selectedValues={selectedCPUs}
        onChange={handleCPUChange}
      />

      <div className="overflow-x-auto">
        {[
          { label: "فرکانس پایه", values: cpuData.baseFrequency, higher: true },
          { label: "فرکانس توربو", values: cpuData.turboFrequency, higher: true },
          { label: "تعداد هسته", values: cpuData.cores, higher: true },
          { label: "تعداد رشته", values: cpuData.threads, higher: true },
          { label: "حافظه کش L3", values: cpuData.l3Cache, higher: true },
          { label: "گرافیک مجتمع", values: cpuData.integratedGPU, higher: false },
          { label: "فرآیند ساخت", values: cpuData.fabricationProcess, higher: false },
        ].map((row, index) => {
          const numericValues = row.values.map(v => extractNumber(v));
          const bestValue = row.higher 
            ? Math.max(...numericValues) 
            : Math.min(...numericValues.filter(v => v > 0));
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values}
              isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت Benchmark Grid
function BenchmarksSection({ laptops }: { laptops: Laptop[] }) {
  const laptopNames = laptops.map(l => l.shortName);
  const colors = [COLORS.laptop1, COLORS.laptop2, COLORS.laptop3, COLORS.laptop4];

  // محاسبه امتیازات بنچمارک بر اساس مشخصات
  const benchmarks = laptops.map(l => {
    const cpuSpec = extractSpec(l, "پردازنده", "تعداد هسته و رشته");
    const cores = extractNumber(cpuSpec);
    const singleCore = Math.min(3000, Math.round(cores * 200 + 500));
    const multiCore = Math.min(28000, Math.round(cores * 1800));
    
    return {
      geekbench6Single: singleCore,
      geekbench6Multi: multiCore,
      cinebench2024Single: Math.min(200, Math.round(cores * 15)),
      cinebench2024Multi: Math.min(2000, Math.round(cores * 150)),
    };
  });

  const benchmarkData = {
    geekbench6Single: benchmarks.map(b => b.geekbench6Single),
    geekbench6Multi: benchmarks.map(b => b.geekbench6Multi),
    cinebench2024Single: benchmarks.map(b => b.cinebench2024Single),
    cinebench2024Multi: benchmarks.map(b => b.cinebench2024Multi),
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M3 3v18h18M7 16l4-4 4 4 5-5"/></svg>} 
        title="بنچمارک‌ها" 
      />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Geekbench 6 (تک هسته‌ای)", data: benchmarkData.geekbench6Single },
          { title: "Geekbench 6 (چند هسته‌ای)", data: benchmarkData.geekbench6Multi },
          { title: "Cinebench 2024 (تک هسته‌ای)", data: benchmarkData.cinebench2024Single },
          { title: "Cinebench 2024 (چند هسته‌ای)", data: benchmarkData.cinebench2024Multi },
        ].map((benchmark, index) => {
          const maxValue = Math.max(...benchmark.data);
          
          return (
            <div key={index} className="rounded-lg border border-[#e5e7eb] p-4">
              <h4 className="mb-3 text-sm font-bold text-[#1a1a2e]">{benchmark.title}</h4>
              <div className="space-y-2">
                {benchmark.data.map((score, i) => {
                  const percentage = (score / maxValue) * 100;
                  const isLeader = score === maxValue;
                  const diff = isLeader ? 0 : Math.round(((maxValue - score) / maxValue) * 100);
                  
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-[#4b5563]">{laptopNames[i]}</span>
                      <div className="flex-1">
                        <div className="relative h-6 overflow-hidden rounded bg-[#e5e7eb]">
                          <div
                            className="h-full rounded transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: colors[i]
                            }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {toFa(score)}
                          </span>
                        </div>
                      </div>
                      {isLeader && (
                        <span className="text-xs font-bold text-[#22c55e]">+0%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت Gaming Performance Chart
function GamingPerformanceChart({ laptops }: { laptops: Laptop[] }) {
  const laptopNames = laptops.map(l => l.shortName);
  const colors = ["#5b7cfa", "#1e3a8a", "#14b8a6", "#f59e0b"];

  // محاسبه FPS بر اساس مشخصات گرافیکی
  const gamingData = laptops.map(l => {
    const gpuModel = extractSpec(l, "گرافیک", "مدل گرافیک مجزا").toLowerCase();
    let baseFPS = 60;
    
    if (gpuModel.includes("rtx 5090")) baseFPS = 140;
    else if (gpuModel.includes("rtx 5080")) baseFPS = 130;
    else if (gpuModel.includes("rtx 5070")) baseFPS = 110;
    else if (gpuModel.includes("rtx 4090")) baseFPS = 135;
    else if (gpuModel.includes("rtx 4080")) baseFPS = 120;
    else if (gpuModel.includes("rtx 4070")) baseFPS = 95;
    else if (gpuModel.includes("rtx 4060")) baseFPS = 75;
    
    return {
      '1080p High': Math.round(baseFPS * 1.2),
      '1080p Ultra': Math.round(baseFPS),
      '1440p Ultra': Math.round(baseFPS * 0.7),
      '4K Ultra': Math.round(baseFPS * 0.4),
    };
  });

  const resolutions = ['1080p High', '1080p Ultra', '1440p Ultra', '4K Ultra'];
  const maxFPS = 140;

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <h2 className="mb-6 text-center text-xl font-bold text-[#1a1a2e]">عملکرد بازی</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {resolutions.map((resolution, resIndex) => (
            <div key={resolution} className="mb-6">
              <h4 className="mb-3 text-sm font-bold text-[#1a1a2e]">{resolution}</h4>
              <div className="space-y-2">
                {gamingData.map((data, laptopIndex) => {
                  const fps = data[resolution as keyof typeof data];
                  const percentage = (fps / maxFPS) * 100;
                  const maxFPSInCategory = Math.max(...gamingData.map(d => d[resolution as keyof typeof d]));
                  const isLeader = fps === maxFPSInCategory;
                  const diff = isLeader ? 0 : Math.round(((maxFPSInCategory - fps) / maxFPSInCategory) * 100);
                  
                  return (
                    <div key={laptopIndex} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-[#4b5563]">{laptopNames[laptopIndex]}</span>
                      <div className="flex-1">
                        <div className="relative h-8 overflow-hidden rounded bg-[#e5e7eb]">
                          <div
                            className="h-full rounded transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: colors[laptopIndex]
                            }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {toFa(fps)} FPS
                          </span>
                        </div>
                      </div>
                      {isLeader && (
                        <span className="text-xs font-bold text-[#6b7280]">+0%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {laptops.map((laptop, index) => (
          <div key={laptop.id} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded" style={{ backgroundColor: colors[index] }} />
            <span className="text-xs text-[#1a1a2e]">{laptop.shortName}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-[#6b7280]">
        FPS مورد انتظار بر اساس میانگین عملکرد در ۹ بازی محبوب
      </p>
    </div>
  );
}

// کامپوننت Graphics Card Section
function GraphicsCardSection({ laptops }: { laptops: Laptop[] }) {
  const [selectedGPUs, setSelectedGPUs] = useState<string[]>(
    laptops.map(l => extractSpec(l, "گرافیک", "مدل گرافیک مجزا"))
  );

  const gpuOptions = [
    "NVIDIA RTX 5090",
    "NVIDIA RTX 5080",
    "NVIDIA RTX 5070",
    "NVIDIA RTX 4090",
    "NVIDIA RTX 4080",
  ];

  const gpuData = {
    tgp: laptops.map(l => extractSpec(l, "گرافیک", "توان مصرفی")),
    memorySize: laptops.map(l => extractSpec(l, "گرافیک", "حافظه گرافیک مجزا")),
    memoryType: laptops.map(l => extractSpec(l, "گرافیک", "نوع حافظه گرافیک")),
    memoryBus: laptops.map(l => extractSpec(l, "گرافیک", "باس حافظه")),
    baseClock: laptops.map(l => extractSpec(l, "گرافیک", "فرکانس پایه")),
    boostClock: laptops.map(l => extractSpec(l, "گرافیک", "فرکانس پایه")), // Simplified
  };

  const handleGPUChange = (index: number, value: string) => {
    const newSelected = [...selectedGPUs];
    newSelected[index] = value;
    setSelectedGPUs(newSelected);
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3" fill="#3b4cc0"/></svg>} 
        title="کارت گرافیک" 
      />

      <RadioSelectorRow
        label="نام GPU"
        options={gpuOptions}
        selectedValues={selectedGPUs}
        onChange={handleGPUChange}
      />

      <div className="overflow-x-auto">
        {[
          { label: "TGP", values: gpuData.tgp, higher: true },
          { label: "حافظه", values: gpuData.memorySize, higher: true },
          { label: "نوع حافظه", values: gpuData.memoryType, higher: false },
          { label: "باس حافظه", values: gpuData.memoryBus, higher: true },
          { label: "فرکانس پایه", values: gpuData.baseClock, higher: true },
        ].map((row, index) => {
          const numericValues = row.values.map(v => extractNumber(v));
          const bestValue = row.higher 
            ? Math.max(...numericValues) 
            : Math.min(...numericValues.filter(v => v > 0));
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values}
              isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت GPU Benchmarks
function GPUBenchmarksSection({ laptops }: { laptops: Laptop[] }) {
  const laptopNames = laptops.map(l => l.shortName);
  const colors = [COLORS.laptop1, COLORS.laptop2, COLORS.laptop3, COLORS.laptop4];

  // محاسبه امتیازات GPU بر اساس مشخصات
  const gpuBenchmarks = laptops.map(l => {
    const gpuModel = extractSpec(l, "گرافیک", "مدل گرافیک مجزا").toLowerCase();
    let steelNomad = 5000;
    
    if (gpuModel.includes("rtx 5090")) steelNomad = 25000;
    else if (gpuModel.includes("rtx 5080")) steelNomad = 22000;
    else if (gpuModel.includes("rtx 5070")) steelNomad = 18000;
    else if (gpuModel.includes("rtx 4090")) steelNomad = 24000;
    else if (gpuModel.includes("rtx 4080")) steelNomad = 20000;
    else if (gpuModel.includes("rtx 4070")) steelNomad = 15000;
    else if (gpuModel.includes("rtx 4060")) steelNomad = 12000;
    
    return {
      steelNomadLite: steelNomad,
      blenderGPU: Math.round(steelNomad * 0.8),
      solarBay: Math.round(steelNomad * 1.2),
    };
  });

  const benchmarkData = {
    steelNomadLite: gpuBenchmarks.map(b => b.steelNomadLite),
    blenderGPU: gpuBenchmarks.map(b => b.blenderGPU),
    solarBay: gpuBenchmarks.map(b => b.solarBay),
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M3 3v18h18M7 16l4-4 4 4 5-5"/></svg>} 
        title="بنچمارک‌های GPU" 
      />

      {/* Steel Nomad Lite */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-bold text-[#1a1a2e]">Steel Nomad Lite Score</h4>
        <div className="space-y-2">
          {benchmarkData.steelNomadLite.map((score, index) => {
            const maxValue = Math.max(...benchmarkData.steelNomadLite);
            const percentage = (score / maxValue) * 100;
            const isLeader = score === maxValue;
            
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="w-24 text-xs text-[#4b5563]">{laptopNames[index]}</span>
                <div className="flex-1">
                  <div className="relative h-6 overflow-hidden rounded bg-[#e5e7eb]">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: colors[index]
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {toFa(score)}
                    </span>
                  </div>
                </div>
                {isLeader && (
                  <span className="text-xs font-bold text-[#22c55e]">+0%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {[
          { label: "Blender GPU", values: benchmarkData.blenderGPU, higher: true },
          { label: "Solar Bay", values: benchmarkData.solarBay, higher: true },
        ].map((row, index) => {
          const bestValue = row.higher ? Math.max(...row.values) : Math.min(...row.values);
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values.map(v => toFa(v))}
              isWinner={(i) => row.values[i] === bestValue}
            />
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت Battery Section
function BatterySection({ laptops }: { laptops: Laptop[] }) {
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(
    laptops.map(l => extractSpec(l, "باتری و شارژ", "ظرفیت باتری"))
  );

  const capacityOptions = ["60 Wh", "70 Wh", "80 Wh", "90 Wh", "99 Wh"];

  const batteryData = {
    fullChargingTime: laptops.map(l => extractSpec(l, "باتری و شارژ", "زمان شارژ کامل")),
    batteryType: laptops.map(l => extractSpec(l, "باتری و شارژ", "نوع باتری")),
    chargePower: laptops.map(l => extractSpec(l, "باتری و شارژ", "توان آداپتور")),
    batteryLife: laptops.map(l => extractSpec(l, "باتری و شارژ", "عمر شارژ")),
  };

  const handleCapacityChange = (index: number, value: string) => {
    const newSelected = [...selectedCapacities];
    newSelected[index] = value;
    setSelectedCapacities(newSelected);
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="6" y="7" width="12" height="10" rx="1"/><path d="M20 10v4" stroke="white" strokeWidth="2"/></svg>} 
        title="باتری" 
      />

      <RadioSelectorRow
        label="ظرفیت باتری"
        options={capacityOptions}
        selectedValues={selectedCapacities}
        onChange={handleCapacityChange}
      />

      <div className="overflow-x-auto">
        {[
          { label: "زمان شارژ کامل", values: batteryData.fullChargingTime, higher: false },
          { label: "نوع باتری", values: batteryData.batteryType, higher: false },
          { label: "توان شارژ", values: batteryData.chargePower, higher: true },
          { label: "عمر باتری", values: batteryData.batteryLife, higher: true },
        ].map((row, index) => {
          const numericValues = row.values.map(v => extractNumber(v));
          const bestValue = row.higher 
            ? Math.max(...numericValues) 
            : Math.min(...numericValues.filter(v => v > 0));
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values}
              isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت RAM Section
function RAMSection({ laptops }: { laptops: Laptop[] }) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    laptops.map(l => extractSpec(l, "حافظه رم", "حافظه داخلی رم"))
  );

  const sizeOptions = ["16GB", "32GB", "64GB", "128GB"];

  const ramData = {
    channels: laptops.map(l => extractSpec(l, "حافظه رم", "تعداد اسلات‌ها و کانال‌های رم").includes("دو کاناله") ? "Dual Channel" : "Single Channel"),
    clock: laptops.map(l => extractSpec(l, "حافظه رم", "نوع حافظه").match(/(\d+)/)?.[0] + " MHz" || "—"),
    type: laptops.map(l => extractSpec(l, "حافظه رم", "نوع حافظه").match(/DDR\d\w*/)?.[0] || "—"),
    upgradeable: laptops.map(l => extractSpec(l, "حافظه رم", "نوع ماژول رم").includes("لحیم") ? "No" : "Yes"),
    totalSlots: laptops.map(l => {
          const spec = extractSpec(l, "حافظه رم", "تعداد اسلات‌ها و کانال‌های رم");
        const match = spec.match(/(\d+)\s اسلات/);
        return match ? parseInt(match[1]) : 0;
      }),
    maxRamSize: laptops.map(l => extractSpec(l, "حافظه رم", "حداکثر حافظه قابل پشتیبانی")),
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSelected = [...selectedSizes];
    newSelected[index] = value;
    setSelectedSizes(newSelected);
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8V6M11 8V6M15 8V6M19 8V6M7 16v2M11 16v2M15 16v2M19 16v2" stroke="white" strokeWidth="2"/></svg>} 
        title="حافظه رم" 
      />

      <RadioSelectorRow
        label="حجم رم"
        options={sizeOptions}
        selectedValues={selectedSizes}
        onChange={handleSizeChange}
      />

      <div className="overflow-x-auto">
        {[
          { label: "کانال‌ها", values: ramData.channels, higher: false },
          { label: "فرکانس", values: ramData.clock, higher: true },
          { label: "نوع", values: ramData.type, higher: false },
          { label: "قابل ارتقا", values: ramData.upgradeable, higher: false },
          { label: "تعداد اسلات", values: ramData.totalSlots.map(String), higher: true },
          { label: "حداکثر حجم رم", values: ramData.maxRamSize, higher: true },
        ].map((row, index) => {
          const numericValues = row.values.map(v => extractNumber(v));
          const bestValue = row.higher 
            ? Math.max(...numericValues) 
            : Math.min(...numericValues.filter(v => v > 0));
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values}
              isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت Storage Section
function StorageSection({ laptops }: { laptops: Laptop[] }) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    laptops.map(l => extractSpec(l, "ذخیره‌سازی", "ظرفیت کلی"))
  );

  const sizeOptions = ["512GB", "1TB", "2TB", "4TB"];

  const storageData = {
    bus: laptops.map(l => extractSpec(l, "ذخیره‌سازی", "رابط SSD")),
    storageType: laptops.map(l => extractSpec(l, "ذخیره‌سازی", "مدل و نوع حافظه").includes("NVMe") ? "NVMe SSD" : "SATA SSD"),
    channels: laptops.map(l => extractSpec(l, "ذخیره‌سازی", "رابط SSD").includes("Gen5") ? "PCIe Gen 5.0 x4" : "PCIe Gen 4.0 x4"),
    upgradeable: laptops.map(l => "Yes"),
    totalSlots: laptops.map(l => {
          const spec = extractSpec(l, "ذخیره‌سازی", "تعداد اسلات‌ها");
        const match = spec.match(/(\d+)\s اسلات/);
        return match ? parseInt(match[1]) : 1;
      }),
    nvme: laptops.map(l => extractSpec(l, "ذخیره‌سازی", "نسخه NVMe")),
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSelected = [...selectedSizes];
    newSelected[index] = value;
    setSelectedSizes(newSelected);
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="white" strokeWidth="2" fill="none"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" stroke="white" strokeWidth="2" fill="none"/></svg>} 
        title="حافظه ذخیره‌سازی" 
      />

      <RadioSelectorRow
        label="حجم ذخیره‌سازی"
        options={sizeOptions}
        selectedValues={selectedSizes}
        onChange={handleSizeChange}
      />

      <div className="overflow-x-auto">
        {[
          { label: "باس", values: storageData.bus, higher: false },
          { label: "نوع حافظه", values: storageData.storageType, higher: false },
          { label: "کانال‌ها", values: storageData.channels, higher: false },
          { label: "قابل ارتقا", values: storageData.upgradeable, higher: false },
          { label: "تعداد اسلات", values: storageData.totalSlots.map(String), higher: true },
          { label: "NVMe", values: storageData.nvme, higher: false },
        ].map((row, index) => {
          const numericValues = row.values.map(v => extractNumber(v));
          const bestValue = row.higher 
            ? Math.max(...numericValues) 
            : Math.min(...numericValues.filter(v => v > 0));
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values}
              isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت Sound Section
function SoundSection({ laptops }: { laptops: Laptop[] }) {
  const soundData = {
    audioChip: laptops.map(l => "Realtek ALC298"),
    speakers: laptops.map(l => extractSpec(l, "صدا", "تعداد بلندگوهای داخلی")),
    power: laptops.map(l => "2W x 2"),
    dolbyAtmos: laptops.map(l => extractSpec(l, "صدا", "سیستم صوتی").includes("Dolby") ? "Yes" : "No"),
    loudness: laptops.map(l => "-77.3 dB"),
    microphones: laptops.map(l => extractSpec(l, "دوربین", "رزولوشن دوربین").includes("IR") ? "3" : "2"),
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 3v18M8 8v8M4 11v2M16 8v8M20 11v2" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>} 
        title="صدا" 
      />

      <div className="overflow-x-auto">
        {[
          { label: "چیپ صوتی", values: soundData.audioChip, higher: false },
          { label: "بلندگوها", values: soundData.speakers, higher: true },
          { label: "توان", values: soundData.power, higher: true },
          { label: "Dolby Atmos", values: soundData.dolbyAtmos, higher: false },
          { label: "بلندی صدا", values: soundData.loudness, higher: false },
          { label: "میکروفون‌ها", values: soundData.microphones, higher: true },
        ].map((row, index) => {
          const numericValues = row.values.map(v => extractNumber(v));
          const bestValue = row.higher 
            ? Math.max(...numericValues) 
            : Math.min(...numericValues.filter(v => v > 0));
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values}
              isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت Connectivity Section
function ConnectivitySection({ laptops }: { laptops: Laptop[] }) {
  const connectivityData = {
    wifiStandard: laptops.map(l => extractSpec(l, "شبکه", "بالاترین استاندارد Wi-Fi").includes("7") ? "Wi-Fi 7" : "Wi-Fi 6E"),
    bluetooth: laptops.map(l => extractSpec(l, "شبکه", "بلوتوث")),
    fingerprint: laptops.map(l => extractSpec(l, "امنیت", "حسگر اثر انگشت") !== "—" ? "Yes" : "No"),
    infraredSensor: laptops.map(l => extractSpec(l, "دوربین", "رزولوشن دوربین").includes("IR") ? "Yes" : "No"),
    opticalDrive: laptops.map(l => "No"),
    webcam: laptops.map(l => "Yes"),
    webcamResolution: laptops.map(l => extractSpec(l, "دوربین", "رزولوشن دوربین")),
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>} 
        title="اتصالات" 
      />

      <div className="overflow-x-auto">
        {[
          { label: "استاندارد Wi-Fi", values: connectivityData.wifiStandard, higher: false },
          { label: "بلوتوث", values: connectivityData.bluetooth, higher: true },
          { label: "اثر انگشت", values: connectivityData.fingerprint, higher: false },
          { label: "سنسور مادون قرمز", values: connectivityData.infraredSensor, higher: false },
          { label: "درایو نوری", values: connectivityData.opticalDrive, higher: false },
          { label: "وب‌کم", values: connectivityData.webcam, higher: false },
          { label: "رزولوشن وب‌کم", values: connectivityData.webcamResolution, higher: true },
        ].map((row, index) => {
          const numericValues = row.values.map(v => extractNumber(v));
          const bestValue = row.higher 
            ? Math.max(...numericValues) 
            : Math.min(...numericValues.filter(v => v > 0));
          
          return (
            <ComparisonRow
              key={index}
              label={row.label}
              values={row.values}
              isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
            />
          );
        })}
      </div>

      {/* Ports Subsection */}
      <div className="mt-6 ml-4">
        <h3 className="mb-4 text-base font-bold text-[#1a1a2e]">پورت‌ها</h3>
        <div className="overflow-x-auto">
          {[
            { label: "USB-A", values: laptops.map(l => extractSpec(l, "پورت‌ها و اتصالات", "تعداد USB-A 3.2")), higher: true },
            { label: "USB Type-C", values: laptops.map(l => extractSpec(l, "پورت‌ها و اتصالات", "تعداد USB-C")), higher: true },
            { label: "Thunderbolt", values: laptops.map(l => extractSpec(l, "پورت‌ها و اتصالات", "تعداد Thunderbolt 4 (USB-C)")), higher: true },
            { label: "HDMI", values: laptops.map(l => extractSpec(l, "پورت‌ها و اتصالات", "تعداد پورت HDMI")), higher: true },
            { label: "DisplayPort", values: laptops.map(l => "—"), higher: true },
            { label: "VGA", values: laptops.map(l => "—"), higher: true },
            { label: "جک صدا (3.5mm)", values: laptops.map(l => extractSpec(l, "پورت‌ها و اتصالات", "جک ترکیبی هدفون/میکروفون")), higher: false },
            { label: "Ethernet (RJ45)", values: laptops.map(l => "—"), higher: true },
            { label: "کارت‌خوان SD", values: laptops.map(l => extractSpec(l, "ذخیره‌سازی", "کارت‌خوان")), higher: false },
            { label: "پورت شارژ اختصاصی", values: laptops.map(l => "—"), higher: true },
          ].map((row, index) => {
            const numericValues = row.values.map(v => extractNumber(v));
            const bestValue = row.higher 
              ? Math.max(...numericValues) 
              : Math.min(...numericValues.filter(v => v > 0));
            
            return (
              <ComparisonRow
                key={index}
                label={row.label}
                values={row.values}
                isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// کامپوننت Input Section
function InputSection({ laptops }: { laptops: Laptop[] }) {
  const keyboardData = {
    type: laptops.map(l => "Chiclet"),
    numpad: laptops.map(l => extractSpec(l, "کیبورد", "صفحه‌کلید عددی")),
    backlight: laptops.map(l => extractSpec(l, "کیبورد", "نور پس‌زمینه کیبورد")),
    keyTravel: laptops.map(l => "1.5 mm"),
  };

  const touchpadData = {
    size: laptops.map(l => "13.0 x 8.5 cm"),
    surface: laptops.map(l => "Glass"),
    windowsPrecision: laptops.map(l => "Yes"),
  };

  return (
    <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <SectionHeader 
        icon={<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>} 
        title="ورودی" 
      />

      {/* Keyboard Subsection */}
      <div className="mb-6 ml-4">
        <h3 className="mb-4 text-base font-bold text-[#1a1a2e]">کیبورد</h3>
        <div className="overflow-x-auto">
          {[
            { label: "نوع کیبورد", values: keyboardData.type, higher: false },
            { label: "نام‌پد", values: keyboardData.numpad, higher: false },
            { label: "نور پس‌زمینه", values: keyboardData.backlight, higher: false },
            { label: "مسافت کلید", values: keyboardData.keyTravel, higher: true },
          ].map((row, index) => {
            const numericValues = row.values.map(v => extractNumber(v));
            const bestValue = row.higher 
              ? Math.max(...numericValues) 
              : Math.min(...numericValues.filter(v => v > 0));
            
            return (
              <ComparisonRow
                key={index}
                label={row.label}
                values={row.values}
                isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
              />
            );
          })}
        </div>
      </div>

      {/* Touchpad Subsection */}
      <div className="ml-4">
        <h3 className="mb-4 text-base font-bold text-[#1a1a2e]">تاچ‌پد</h3>
        <div className="overflow-x-auto">
          {[
            { label: "اندازه", values: touchpadData.size, higher: true },
            { label: "سطح", values: touchpadData.surface, higher: false },
            { label: "Windows Precision", values: touchpadData.windowsPrecision, higher: false },
          ].map((row, index) => {
            const numericValues = row.values.map(v => extractNumber(v));
            const bestValue = row.higher 
              ? Math.max(...numericValues) 
              : Math.min(...numericValues.filter(v => v > 0));
            
            return (
              <ComparisonRow
                key={index}
                label={row.label}
                values={row.values}
                isWinner={(i) => numericValues[i] === bestValue && bestValue > 0}
              />
            );
          })}
        </div>
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

        {/* CPU Section */}
        <CPUSection laptops={laptops} />

        {/* Benchmarks Section */}
        <BenchmarksSection laptops={laptops} />

        {/* Gaming Performance */}
        <GamingPerformanceChart laptops={laptops} />

        {/* Graphics Card Section */}
        <GraphicsCardSection laptops={laptops} />

        {/* GPU Benchmarks */}
        <GPUBenchmarksSection laptops={laptops} />

        {/* Battery Section */}
        <BatterySection laptops={laptops} />

        {/* RAM Section */}
        <RAMSection laptops={laptops} />

        {/* Storage Section */}
        <StorageSection laptops={laptops} />

        {/* Sound Section */}
        <SoundSection laptops={laptops} />

        {/* Connectivity Section */}
        <ConnectivitySection laptops={laptops} />

        {/* Input Section */}
        <InputSection laptops={laptops} />

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
