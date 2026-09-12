import { type Laptop } from "../data/laptops";

interface CaseComparisonProps {
  laptops: Laptop[];
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

// تعیین برنده برای هر ردیف
function getWinner(laptops: Laptop[], key: string, lowerIsBetter: boolean): number | null {
  const values = laptops.map(l => {
    if (key === "weight") {
      return extractNumber(extractSpec(l, "وزن و ابعاد", "وزن"));
    } else if (key === "thickness") {
      return extractNumber(extractSpec(l, "وزن و ابعاد", "ضخامت"));
    }
    return 0;
  });

  const validValues = values.filter(v => v > 0);
  if (validValues.length < 2) return null;

  const bestValue = lowerIsBetter ? Math.min(...validValues) : Math.max(...validValues);
  const winnerIndex = values.indexOf(bestValue);
  
  // اگر چند لپ‌تاپ مقدار یکسانی دارند، برنده‌ای نیست
  if (values.filter(v => v === bestValue).length > 1) return null;
  
  return winnerIndex;
}

export default function CaseComparisonTable({ laptops }: CaseComparisonProps) {
  if (laptops.length < 2) return null;

  // داده‌های جدول
  const rows = [
    {
      label: "وزن",
      key: "weight",
      lowerIsBetter: true,
      values: laptops.map(l => extractSpec(l, "وزن و ابعاد", "وزن")),
    },
    {
      label: "طول",
      key: "length",
      lowerIsBetter: true,
      values: laptops.map(l => extractSpec(l, "وزن و ابعاد", "طول")),
    },
    {
      label: "عرض",
      key: "width",
      lowerIsBetter: true,
      values: laptops.map(l => extractSpec(l, "وزن و ابعاد", "عرض")),
    },
    {
      label: "ضخامت",
      key: "thickness",
      lowerIsBetter: true,
      values: laptops.map(l => extractSpec(l, "وزن و ابعاد", "ضخامت")),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* هدر مقایسه */}
      <div className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] bg-white p-4">
        <span className="text-sm font-semibold text-[#374151]">لپ‌تاپ:</span>
        <div className="flex flex-1 flex-wrap items-center justify-center gap-2">
          {laptops.map((laptop, index) => (
            <span key={laptop.id} className="text-sm font-semibold text-[#3B82F6]">
              {laptop.shortName}
              {index < laptops.length - 1 && <span className="mx-2 text-[#6b7280]">vs</span>}
            </span>
          ))}
        </div>
      </div>

      {/* عنوان بخش */}
      <div className="flex items-center gap-2.5 border-b border-[#e5e7eb] bg-white px-6 py-4">
        <svg
          className="h-[22px] w-[22px] shrink-0 text-[#3B82F6]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="4" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="2" />
          <path d="M2 20h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h3 className="text-lg font-bold text-[#111827]" style={{ letterSpacing: "-0.3px" }}>
          بدنه
        </h3>
      </div>

      {/* بدنه جدول */}
      <div className="flex flex-col">
        {rows.map((row, rowIndex) => {
          const winnerIndex = getWinner(laptops, row.key, row.lowerIsBetter);

          return (
            <div
              key={rowIndex}
              className="grid border-b border-[#f3f4f6] last:border-b-0"
              style={{
                gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)`,
              }}
            >
              {/* برچسب */}
              <div className="flex items-center bg-white px-6 py-3.5 text-[13.5px] font-medium text-[#4b5563]">
                {row.label}
              </div>

              {/* مقادیر */}
              {row.values.map((value, colIndex) => {
                const isWinner = winnerIndex === colIndex;

                return (
                  <div
                    key={colIndex}
                    className={`flex items-center px-6 py-3.5 text-[13.5px] ${
                      isWinner
                        ? "relative bg-[#ecfdf5] font-medium text-[#1f2937]"
                        : "bg-white font-normal text-[#374151]"
                    }`}
                  >
                    {isWinner && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[2px] bg-[#10b981]" />
                    )}
                    {value}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
