import { useState } from "react";
import { type Laptop } from "../data/laptops";

interface DisplayProps {
  laptops: Laptop[];
}

export default function Display({ laptops }: DisplayProps) {
  const [selectedResolutions, setSelectedResolutions] = useState<Record<string, string>>({});

  // استخراج اطلاعات نمایشگر از لپ‌تاپ‌ها
  const displayInfo = laptops.map((laptop) => {
    const displaySpec = laptop.specs.find((s) => s.title === "نمایشگر");
    if (!displaySpec) return null;

    const size = displaySpec.rows.find((r) => r[0] === "اندازه صفحه نمایش")?.[1] || "-";
    const type = displaySpec.rows.find((r) => r[0] === "نوع پنل")?.[1] || "-";
    const refreshRate = displaySpec.rows.find((r) => r[0] === "نرخ نوسازی")?.[1] || "-";
    const resolution = displaySpec.rows.find((r) => r[0] === "رزولوشن")?.[1] || "-";
    const ppi = displaySpec.rows.find((r) => r[0] === "تراکم پیکسلی")?.[1] || "-";
    const aspectRatio = displaySpec.rows.find((r) => r[0] === "نسبت تصویر")?.[1] || "-";
    const hdr = displaySpec.rows.find((r) => r[0] === "پشتیبانی HDR")?.[1] || "-";
    const sync = displaySpec.rows.find((r) => r[0] === "فناوری همگام‌سازی")?.[1] || "-";
    const touch = displaySpec.rows.find((r) => r[0] === "صفحه لمسی")?.[1] || "-";
    const coating = displaySpec.rows.find((r) => r[0] === "پوشش")?.[1] || "-";
    const adaptiveRefresh = displaySpec.rows.find((r) => r[0] === "نرخ نوسازی تطبیقی")?.[1] || "-";

    return {
      name: laptop.name,
      size,
      type,
      refreshRate,
      resolution,
      ppi,
      aspectRatio,
      hdr,
      sync,
      touch,
      coating,
      adaptiveRefresh,
    };
  });

  // تعیین برنده برای هر ردیف
  const getWinner = (field: string): number | null => {
    const values = displayInfo.map((d) => d?.[field as keyof typeof d] || "-");
    
    // منطق هایلایت بر اساس نوع فیلد
    switch (field) {
      case "size": {
        const sizes = values.map((v) => parseFloat(v) || 0);
        const max = Math.max(...sizes);
        return sizes.indexOf(max);
      }
      case "type": {
        const priority: Record<string, number> = { "OLED": 4, "Mini-LED": 3, "IPS LCD": 2, "TN": 1 };
        const priorities = values.map((v) => priority[v] || 0);
        const max = Math.max(...priorities);
        return priorities.indexOf(max);
      }
      case "refreshRate": {
        const rates = values.map((v) => parseFloat(v) || 0);
        const max = Math.max(...rates);
        return rates.indexOf(max);
      }
      case "adaptiveRefresh": {
        const hasYes = values.includes("Yes");
        return hasYes ? values.indexOf("Yes") : null;
      }
      case "ppi": {
        const ppis = values.map((v) => parseFloat(v) || 0);
        const max = Math.max(...ppis);
        return ppis.indexOf(max);
      }
      case "resolution": {
        const pixels = values.map((v) => {
          const match = v.match(/(\d+)\s*x\s*(\d+)/);
          return match ? parseInt(match[1]) * parseInt(match[2]) : 0;
        });
        const max = Math.max(...pixels);
        return pixels.indexOf(max);
      }
      case "hdr": {
        const priority: Record<string, number> = { "Yes, Dolby Vision": 3, "Yes, HDR1000": 3, "Yes": 2, "No": 1 };
        const priorities = values.map((v) => priority[v] || 0);
        const max = Math.max(...priorities);
        return priorities.indexOf(max);
      }
      case "sync": {
        const priority: Record<string, number> = { "G-Sync": 3, "FreeSync": 2, "No": 1 };
        const priorities = values.map((v) => priority[v] || 0);
        const max = Math.max(...priorities);
        return priorities.indexOf(max);
      }
      case "touch": {
        const hasYes = values.includes("Yes");
        return hasYes ? values.indexOf("Yes") : null;
      }
      default:
        return null;
    }
  };

  const rows = [
    { label: "اندازه", field: "size" },
    { label: "نوع", field: "type" },
    { label: "نرخ نوسازی", field: "refreshRate" },
    { label: "نرخ نوسازی تطبیقی", field: "adaptiveRefresh" },
    { label: "تراکم پیکسلی", field: "ppi" },
    { label: "نسبت تصویر", field: "aspectRatio" },
    { label: "رزولوشن", field: "resolution" },
    { label: "پشتیبانی HDR", field: "hdr" },
    { label: "فناوری همگام‌سازی", field: "sync" },
    { label: "صفحه لمسی", field: "touch" },
    { label: "پوشش", field: "coating" },
  ];

  if (!displayInfo || displayInfo.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[1200px] rounded-b-xl border-t border-line bg-white p-6 pt-6 shadow-sm">
      {/* هدر */}
      <div className="mb-5 flex items-center border-b border-line pb-3">
        <svg
          className="mr-2 h-[18px] w-[18px] text-[#818cf8]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        <h3 className="text-[17px] font-bold text-ink">نمایشگر</h3>
      </div>

      {/* انتخاب رزولوشن */}
      <div className="mb-5 flex flex-wrap justify-around gap-8 px-5">
        {displayInfo.map((info, idx) => {
          if (!info) return null;
          const resolutions = [info.resolution];
          // اگر لپ‌تاپ رزولوشن دوم دارد (مثلاً MacBook)
          if (laptops[idx].specs.find((s) => s.title === "نمایشگر")?.rows.find((r) => r[0] === "رزولوشن دوم")) {
            resolutions.push(laptops[idx].specs.find((s) => s.title === "نمایشگر")?.rows.find((r) => r[0] === "رزولوشن دوم")?.[1] || "");
          }

          return (
            <div key={idx} className="flex flex-col gap-2">
              {resolutions.map((res, resIdx) => (
                <label key={resIdx} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name={`resolution-${idx}`}
                    value={res}
                    checked={selectedResolutions[idx] === res || (!selectedResolutions[idx] && resIdx === 0)}
                    onChange={() => setSelectedResolutions({ ...selectedResolutions, [idx]: res })}
                    className="hidden"
                  />
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                      selectedResolutions[idx] === res || (!selectedResolutions[idx] && resIdx === 0)
                        ? "border-sea bg-sea"
                        : "border-line"
                    }`}
                  >
                    {(selectedResolutions[idx] === res || (!selectedResolutions[idx] && resIdx === 0)) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-[13.5px] font-medium text-ink">{res}</span>
                </label>
              ))}
            </div>
          );
        })}
      </div>

      {/* جدول */}
      <div className="flex flex-col" style={{ "--num-laptops": laptops.length } as React.CSSProperties}>
        {rows.map((row, rowIdx) => {
          const winnerIdx = getWinner(row.field);
          return (
            <div
              key={rowIdx}
              className="grid border-b border-line last:border-b-0"
              style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}
            >
              {/* برچسب */}
              <div className="flex items-center py-3 pr-6 text-[13.5px] font-medium text-mist">
                {row.label}
              </div>

              {/* مقادیر */}
              {displayInfo.map((info, idx) => {
                if (!info) return <div key={idx} />;
                const value = info[row.field as keyof typeof info] || "-";
                const isWinner = winnerIdx === idx;
                const isDash = value === "-";

                return (
                  <div
                    key={idx}
                    className={`relative py-3 pl-4 text-[13.5px] ${
                      isWinner
                        ? "bg-[#ecfdf5] font-medium text-ink"
                        : isDash
                        ? "text-mist"
                        : "text-ink"
                    }`}
                  >
                    {isWinner && (
                      <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-moss" />
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
