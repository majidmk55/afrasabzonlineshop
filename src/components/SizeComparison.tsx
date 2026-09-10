import { useMemo } from "react";
import { type Laptop } from "../data/laptops";

interface SizeComparisonProps {
  laptops: Laptop[];
  maxLaptops?: number;
}

// استخراج ابعاد از لپ‌تاپ
function extractDimensions(laptop: Laptop): { width: number; depth: number; thickness: number } {
  const dims = laptop.specs.find(s => s.title === "وزن و ابعاد");
  if (!dims) return { width: 0, depth: 0, thickness: 0 };

  const lengthRow = dims.rows.find(r => r[0] === "طول");
  const widthRow = dims.rows.find(r => r[0] === "عرض");
  const thicknessRow = dims.rows.find(r => r[0] === "ضخامت");

  // استخراج عدد از متن (میلی‌متر به اینچ)
  const extractMM = (text: string): number => {
    const match = text.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) / 25.4 : 0;
  };

  return {
    width: lengthRow ? extractMM(lengthRow[1]) : 0,
    depth: widthRow ? extractMM(widthRow[1]) : 0,
    thickness: thicknessRow ? extractMM(thicknessRow[1]) : 0,
  };
}

// رنگ‌های متمایز برای لپ‌تاپ‌ها
const LAPTOP_COLORS = [
  { color: "#4f46e5", colorDark: "#3730a3" }, // نیلی
  { color: "#10b981", colorDark: "#047857" }, // سبز
  { color: "#f59e0b", colorDark: "#b45309" }, // کهربایی
  { color: "#ef4444", colorDark: "#b91c1c" }, // قرمز
];

export default function SizeComparison({ laptops, maxLaptops = 4 }: SizeComparisonProps) {
  // استخراج ابعاد و مرتب‌سازی از بزرگ به کوچک
  const sortedLaptops = useMemo(() => {
    return laptops
      .slice(0, maxLaptops)
      .map((laptop, index) => ({
        laptop,
        ...extractDimensions(laptop),
        ...LAPTOP_COLORS[index % LAPTOP_COLORS.length],
      }))
      .sort((a, b) => (b.width * b.depth) - (a.width * a.depth));
  }, [laptops, maxLaptops]);

  // محاسبه مقیاس
  const { scaleFactor, thicknessScale } = useMemo(() => {
    const maxDim = Math.max(...sortedLaptops.map(l => Math.max(l.width, l.depth)));
    return {
      scaleFactor: 22, // پیکسل بر اینچ
      thicknessScale: 10, // اغراق ضخامت
    };
  }, [sortedLaptops]);

  if (sortedLaptops.length < 2) return null;

  return (
    <div className="mx-auto w-full max-w-[1200px] rounded-xl border-t border-[#e5e7eb] bg-white px-8 pb-8 pt-6">
      {/* هدر */}
      <div className="mb-4 flex items-center border-b border-[#f3f4f6] pb-3">
        <div className="mr-2 h-3.5 w-3.5 flex-shrink-0 rounded-sm bg-[#818cf8]" />
        <h3 className="text-[17px] font-bold tracking-tight text-[#111827]">
          مقایسه اندازه
        </h3>
      </div>

      {/* راهنمای رنگ‌ها */}
      <div className="mb-6 flex flex-wrap gap-4 px-1">
        {sortedLaptops.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="h-3.5 w-3.5 flex-shrink-0 rounded-full shadow-sm"
              style={{ background: item.color }}
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
            const pixelWidth = item.width * scaleFactor;
            const pixelDepth = item.depth * scaleFactor;
            const pixelThickness = item.thickness * thicknessScale;
            const offset = idx * 20;

            return (
              <div
                key={idx}
                className="absolute transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  bottom: `${20 + offset}px`,
                  right: `${20 + offset}px`,
                  zIndex: idx + 1,
                  width: `${pixelWidth}px`,
                  height: `${pixelDepth}px`,
                  transformStyle: "preserve-3d",
                  animation: `slideInLaptop 0.6s cubic-bezier(0.4,0,0.2,1) ${idx * 0.1}s forwards`,
                  opacity: 0,
                }}
                title={`${item.laptop.shortName}: ${item.width.toFixed(2)}" × ${item.depth.toFixed(2)}" × ${item.thickness.toFixed(2)}"`}
              >
                {/* سطح بالا */}
                <div
                  className="absolute flex items-center justify-center rounded-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-filter duration-300 hover:brightness-110"
                  style={{
                    width: `${pixelWidth}px`,
                    height: `${pixelDepth}px`,
                    background: item.color,
                  }}
                >
                  <span
                    className="absolute bottom-[20%] right-[15%] whitespace-nowrap text-[13px] font-semibold text-white"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    {item.width.toFixed(2)}"
                  </span>
                  <span
                    className="absolute bottom-[20%] left-[15%] whitespace-nowrap text-[13px] font-semibold text-white"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    {item.depth.toFixed(2)}"
                  </span>
                </div>

                {/* وجه جلویی */}
                <div
                  className="absolute rounded-[2px]"
                  style={{
                    width: `${pixelWidth}px`,
                    height: `${pixelThickness}px`,
                    bottom: 0,
                    background: item.colorDark,
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
                    background: item.colorDark,
                    opacity: 0.6,
                    transformOrigin: "right",
                    transform: "rotateY(90deg)",
                  }}
                />

                {/* برچسب ضخامت */}
                <span
                  className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[3px] bg-white/95 px-1.5 py-0.5 text-[12px] font-semibold text-[#374151] shadow-[0_1px_3px_rgba(0,0,0,0.1)] ${
                    idx % 2 === 0 ? "-left-[50px]" : "-right-[50px]"
                  }`}
                >
                  {item.thickness.toFixed(2)}"
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideInLaptop {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
