import { useMemo } from "react";
import { type Laptop } from "../data/laptops";

interface SizeComparisonProps {
  laptops: Laptop[];
}

// استخراج ابعاد از لپ‌تاپ (بر حسب اینچ)
function extractDimensions(laptop: Laptop): { length: number; width: number; thickness: number } {
  const lengthStr = laptop.specs.find(s => s.title === "وزن و ابعاد")?.rows.find(r => r[0] === "طول")?.[1] || "0";
  const widthStr = laptop.specs.find(s => s.title === "وزن و ابعاد")?.rows.find(r => r[0] === "عرض")?.[1] || "0";
  const thicknessStr = laptop.specs.find(s => s.title === "وزن و ابعاد")?.rows.find(r => r[0] === "ضخامت")?.[1] || "0";

  // استخراج عدد از متن (مثلاً "355 میلی‌متر" → 355)
  const extractNum = (str: string) => {
    const match = str.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // تبدیل میلی‌متر به اینچ (اگر عدد بزرگ‌تر از 20 باشد، میلی‌متر است)
  const toInches = (mm: number) => mm > 20 ? mm / 25.4 : mm;

  return {
    length: toInches(extractNum(lengthStr)),
    width: toInches(extractNum(widthStr)),
    thickness: toInches(extractNum(thicknessStr)),
  };
}

// رنگ‌های متمایز برای هر لپ‌تاپ
const COLORS = [
  { color: "#4f46e5", colorDark: "#3730a3" }, // نیلی
  { color: "#10b981", colorDark: "#047857" }, // سبز
  { color: "#f59e0b", colorDark: "#b45309" }, // کهربایی
  { color: "#ef4444", colorDark: "#b91c1c" }, // قرمز
];

export default function SizeComparison({ laptops }: SizeComparisonProps) {
  // استخراج ابعاد و مرتب‌سازی از بزرگ به کوچک
  const sortedLaptops = useMemo(() => {
    return laptops
      .slice(0, 4)
      .map((laptop, idx) => ({
        laptop,
        dims: extractDimensions(laptop),
        color: COLORS[idx % COLORS.length],
      }))
      .sort((a, b) => (b.dims.length * b.dims.width) - (a.dims.length * a.dims.width));
  }, [laptops]);

  // محاسبه مقیاس
  const scaleFactor = useMemo(() => {
    if (sortedLaptops.length === 0) return 20;
    const maxDim = Math.max(...sortedLaptops.map(l => Math.max(l.dims.length, l.dims.width)));
    return Math.min(22, 280 / maxDim);
  }, [sortedLaptops]);

  const thicknessScale = 10; // اغراق ضخامت برای نمایش بهتر

  return (
    <div className="mx-auto w-full max-w-[1200px] rounded-xl border-t border-[#e5e7eb] bg-white p-6 sm:p-8">
      {/* هدر */}
      <div className="mb-4 flex items-center border-b border-[#f3f4f6] pb-3">
        <div className="mr-2 h-3.5 w-3.5 rounded-[2px] bg-[#818cf8]" />
        <h3 className="text-[17px] font-bold text-[#111827]" style={{ letterSpacing: "-0.3px" }}>
          مقایسه اندازه
        </h3>
      </div>

      {/* راهنمای رنگ‌ها */}
      <div className="mb-6 flex flex-wrap gap-4 px-1">
        {sortedLaptops.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="h-3.5 w-3.5 rounded-full shadow-sm"
              style={{ background: item.color.color }}
            />
            <span className="text-[13.5px] font-medium text-[#374151]">
              {item.laptop.shortName}
            </span>
          </div>
        ))}
      </div>

      {/* نمودار سه‌بعدی */}
      <div className="relative flex h-[420px] items-center justify-center overflow-visible">
        <div className="relative h-[300px] w-[400px]" style={{ perspective: "1200px" }}>
          {sortedLaptops.map((item, idx) => {
            const pixelWidth = item.dims.length * scaleFactor;
            const pixelDepth = item.dims.width * scaleFactor;
            const pixelThickness = item.dims.thickness * thicknessScale;
            const offset = idx * 20;

            return (
              <div
                key={idx}
                className="absolute transition-all duration-600 ease-out"
                style={{
                  bottom: `${20 + offset}px`,
                  right: `${20 + offset}px`,
                  zIndex: idx + 1,
                  width: `${pixelWidth}px`,
                  height: `${pixelDepth}px`,
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                }}
                title={`${item.laptop.shortName}: ${item.dims.length.toFixed(2)}" × ${item.dims.width.toFixed(2)}" × ${item.dims.thickness.toFixed(2)}"`}
              >
                {/* سطح بالا */}
                <div
                  className="absolute rounded-[3px] shadow-lg transition-all duration-300 hover:brightness-110"
                  style={{
                    width: `${pixelWidth}px`,
                    height: `${pixelDepth}px`,
                    background: item.color.color,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* برچسب طول */}
                  <span
                    className="pointer-events-none absolute whitespace-nowrap text-[13px] font-semibold text-white"
                    style={{
                      bottom: "20%",
                      right: "15%",
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    {item.dims.length.toFixed(2)}"
                  </span>
                  {/* برچسب عرض */}
                  <span
                    className="pointer-events-none absolute whitespace-nowrap text-[13px] font-semibold text-white"
                    style={{
                      bottom: "20%",
                      left: "15%",
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    {item.dims.width.toFixed(2)}"
                  </span>
                </div>

                {/* وجه جلویی */}
                <div
                  className="absolute rounded-[2px]"
                  style={{
                    width: `${pixelWidth}px`,
                    height: `${pixelThickness}px`,
                    bottom: 0,
                    background: item.color.colorDark,
                    opacity: 0.8,
                    transformOrigin: "bottom",
                    transform: "rotateX(-90deg)",
                  }}
                />

                {/* وجه راست */}
                <div
                  className="absolute rounded-[2px]"
                  style={{
                    width: `${pixelThickness}px`,
                    height: `${pixelDepth}px`,
                    right: 0,
                    background: item.color.colorDark,
                    opacity: 0.6,
                    transformOrigin: "right",
                    transform: "rotateY(90deg)",
                  }}
                />

                {/* برچسب ضخامت */}
                <span
                  className="pointer-events-none absolute whitespace-nowrap rounded-[3px] px-1.5 py-0.5 text-[12px] font-semibold text-[#374151]"
                  style={{
                    left: idx % 2 === 0 ? "-50px" : "auto",
                    right: idx % 2 === 0 ? "auto" : "-50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {item.dims.thickness.toFixed(2)}"
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
