import { useState } from "react";
import { type Laptop } from "../data/laptops";

interface DisplayComparisonProps {
  laptops: Laptop[];
}

// استخراج اطلاعات نمایشگر از لپ‌تاپ
function getDisplayInfo(laptop: Laptop) {
  const displaySpec = laptop.specs.find(s => s.title === "نمایشگر");
  if (!displaySpec) return null;

  const getRow = (key: string) => {
    const row = displaySpec.rows.find(r => r[0] === key);
    return row ? row[1] : "—";
  };

  // استخراج اندازه صفحه (اینچ)
  const sizeMatch = getRow("اندازه صفحه نمایش").match(/(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;

  // استخراج رزولوشن
  const resolution = getRow("رزولوشن");
  const resMatch = resolution.match(/(\d+)\s*[x×]\s*(\d+)/);
  const resWidth = resMatch ? parseInt(resMatch[1]) : 0;
  const resHeight = resMatch ? parseInt(resMatch[2]) : 0;
  const totalPixels = resWidth * resHeight;

  // استخراج نرخ نوسازی
  const refreshMatch = getRow("نرخ نوسازی").match(/(\d+)/);
  const refreshRate = refreshMatch ? parseInt(refreshMatch[1]) : 0;

  // استخراج PPI
  const ppiMatch = getRow("تراکم پیکسل").match(/(\d+)/);
  const ppi = ppiMatch ? parseInt(ppiMatch[1]) : 0;

  // نوع پنل
  const panelType = getRow("نوع پنل");

  // HDR
  const hdr = getRow("HDR");

  // Sync technology
  const sync = getRow("Sync");

  // Touchscreen
  const touchscreen = getRow("لمسی");

  // Coating
  const coating = getRow("پوشش");

  // Adaptive refresh
  const adaptive = getRow("نرخ نوسازی تطبیقی");

  return {
    size,
    resolution,
    totalPixels,
    refreshRate,
    ppi,
    panelType,
    hdr,
    sync,
    touchscreen,
    coating,
    adaptive,
  };
}

// تعیین برنده برای هر ردیف
function getWinner(values: any[], type: string): number[] {
  const winners: number[] = [];

  switch (type) {
    case "size":
      // اینچ بیشتر برتر است
      const maxSize = Math.max(...values.map(v => v.size));
      values.forEach((v, i) => {
        if (v.size === maxSize) winners.push(i);
      });
      break;

    case "type":
      // OLED > Mini-LED > IPS LCD > TN
      const typeOrder = ["OLED", "Mini-LED", "IPS LCD", "TN"];
      const bestType = values.reduce((best, v) => {
        const bestIdx = typeOrder.findIndex(t => v.panelType.includes(t));
        const currentIdx = typeOrder.findIndex(t => (best as any).panelType.includes(t));
        return bestIdx !== -1 && (currentIdx === -1 || bestIdx < currentIdx) ? v : best;
      }, values[0]);
      values.forEach((v, i) => {
        if (v.panelType === (bestType as any).panelType) winners.push(i);
      });
      break;

    case "refreshRate":
      // Hz بیشتر برتر است
      const maxRefresh = Math.max(...values.map(v => v.refreshRate));
      values.forEach((v, i) => {
        if (v.refreshRate === maxRefresh) winners.push(i);
      });
      break;

    case "adaptive":
      // Yes برتر از No
      values.forEach((v, i) => {
        if (v.adaptive === "بله") winners.push(i);
      });
      break;

    case "ppi":
      // PPI بالاتر برتر است
      const maxPpi = Math.max(...values.map(v => v.ppi));
      values.forEach((v, i) => {
        if (v.ppi === maxPpi) winners.push(i);
      });
      break;

    case "totalPixels":
      // پیکسل بیشتر برتر است
      const maxPixels = Math.max(...values.map(v => v.totalPixels));
      values.forEach((v, i) => {
        if (v.totalPixels === maxPixels) winners.push(i);
      });
      break;

    case "hdr":
      // HDR با Dolby Vision > HDR معمولی > بدون HDR
      const hdrOrder = ["Dolby Vision", "HDR", "بدون"];
      const bestHdr = values.reduce((best, v) => {
        const bestIdx = hdrOrder.findIndex(h => (v as any).hdr.includes(h));
        const currentIdx = hdrOrder.findIndex(h => (best as any).hdr.includes(h));
        return bestIdx !== -1 && (currentIdx === -1 || bestIdx < currentIdx) ? v : best;
      }, values[0]);
      values.forEach((v, i) => {
        if (v.hdr === (bestHdr as any).hdr) winners.push(i);
      });
      break;

    case "sync":
      // G-Sync > FreeSync > بدون
      const syncOrder = ["G-Sync", "FreeSync", "بدون"];
      const bestSync = values.reduce((best, v) => {
        const bestIdx = syncOrder.findIndex(s => (v as any).sync.includes(s));
        const currentIdx = syncOrder.findIndex(s => (best as any).sync.includes(s));
        return bestIdx !== -1 && (currentIdx === -1 || bestIdx < currentIdx) ? v : best;
      }, values[0]);
      values.forEach((v, i) => {
        if (v.sync === (bestSync as any).sync) winners.push(i);
      });
      break;

    case "touchscreen":
      // Yes برتر از No
      values.forEach((v, i) => {
        if (v.touchscreen === "بله") winners.push(i);
      });
      break;
  }

  return winners;
}

export default function DisplayComparison({ laptops }: DisplayComparisonProps) {
  const [selectedResolutions, setSelectedResolutions] = useState<Record<number, number>>({});

  const displayInfos = laptops.map(laptop => getDisplayInfo(laptop)).filter(info => info !== null);

  if (displayInfos.length === 0) return null;

  // محاسبه برنده‌ها برای هر ردیف
  const sizeWinners = getWinner(displayInfos, "size");
  const typeWinners = getWinner(displayInfos, "type");
  const refreshWinners = getWinner(displayInfos, "refreshRate");
  const adaptiveWinners = getWinner(displayInfos, "adaptive");
  const ppiWinners = getWinner(displayInfos, "ppi");
  const resolutionWinners = getWinner(displayInfos, "totalPixels");
  const hdrWinners = getWinner(displayInfos, "hdr");
  const syncWinners = getWinner(displayInfos, "sync");
  const touchscreenWinners = getWinner(displayInfos, "touchscreen");

  return (
    <div className="mx-auto w-full max-w-[1200px] rounded-b-xl border-t border-line bg-white p-6 pt-7 shadow-sm">
      {/* هدر */}
      <div className="mb-5 flex items-center border-b border-line pb-3">
        <svg className="mr-2 h-[18px] w-[18px] text-sea" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        <h3 className="text-[17px] font-bold text-ink">نمایشگر</h3>
      </div>

      {/* انتخاب رزولوشن */}
      <div className="mb-5 flex flex-wrap justify-around gap-10 px-5">
        {laptops.map((laptop, idx) => {
          const info = displayInfos[idx];
          if (!info) return null;

          // رزولوشن‌های موجود برای این لپ‌تاپ
          const resolutions = [
            { width: 1920, height: 1080, label: "1920 x 1080" },
            { width: 2560, height: 1440, label: "2560 x 1440" },
            { width: 2560, height: 1600, label: "2560 x 1600" },
            { width: 3840, height: 2160, label: "3840 x 2160" },
          ];

          // فیلتر رزولوشن‌های منطقی (بزرگتر از رزولوشن فعلی)
          const availableRes = resolutions.filter(r => 
            r.width * r.height >= (info.resolution.match(/(\d+)\s*[x×]\s*(\d+)/) ? 
              parseInt(RegExp.$1) * parseInt(RegExp.$2) : 0)
          ).slice(0, 2);

          if (availableRes.length === 0) return null;

          const selectedIdx = selectedResolutions[idx] ?? 0;

          return (
            <div key={laptop.id} className="flex flex-col gap-2">
              {availableRes.map((res, resIdx) => (
                <label key={resIdx} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name={`resolution-${laptop.id}`}
                    checked={selectedIdx === resIdx}
                    onChange={() => setSelectedResolutions(prev => ({ ...prev, [idx]: resIdx }))}
                    className="hidden"
                  />
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                    selectedIdx === resIdx
                      ? "border-sea bg-sea"
                      : "border-line"
                  }`}>
                    {selectedIdx === resIdx && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-[13.5px] font-medium text-ink">{res.label}</span>
                </label>
              ))}
            </div>
          );
        })}
      </div>

      {/* جدول مقایسه */}
      <div className="flex flex-col" style={{ ["--num-laptops" as any]: laptops.length }}>
        {/* ردیف 1: Size */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">اندازه</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${sizeWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {sizeWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.size} اینچ
            </div>
          ))}
        </div>

        {/* ردیف 2: Type */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">نوع</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${typeWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {typeWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.panelType}
            </div>
          ))}
        </div>

        {/* ردیف 3: Refresh rate */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">نرخ نوسازی</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${refreshWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {refreshWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.refreshRate} هرتز
            </div>
          ))}
        </div>

        {/* ردیف 4: Adaptive refresh rate */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">نرخ نوسازی تطبیقی</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${adaptiveWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {adaptiveWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.adaptive}
            </div>
          ))}
        </div>

        {/* ردیف 5: PPI */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">PPI</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${ppiWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {ppiWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.ppi} ppi
            </div>
          ))}
        </div>

        {/* ردیف 6: Aspect ratio */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">نسبت تصویر</div>
          {displayInfos.map((info, idx) => {
            const resMatch = info.resolution.match(/(\d+)\s*[x×]\s*(\d+)/);
            const aspectRatio = resMatch ? `${Math.round(parseInt(resMatch[1]) / parseInt(resMatch[2]) * 10) / 10}:${(parseInt(resMatch[2]) / parseInt(resMatch[1]) * 10).toFixed(1)}` : "—";
            return (
              <div key={idx} className="flex items-center p-3 px-4 text-ink">
                {aspectRatio}
              </div>
            );
          })}
        </div>

        {/* ردیف 7: Resolution */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">رزولوشن</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${resolutionWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {resolutionWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.resolution} پیکسل
            </div>
          ))}
        </div>

        {/* ردیف 8: HDR support */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">پشتیبانی HDR</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${hdrWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {hdrWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.hdr}
            </div>
          ))}
        </div>

        {/* ردیف 9: Sync technology */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">فناوری Sync</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${syncWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {syncWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.sync}
            </div>
          ))}
        </div>

        {/* ردیف 10: Touchscreen */}
        <div className="grid border-b border-line" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">صفحه لمسی</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className={`flex items-center p-3 px-4 ${touchscreenWinners.includes(idx) ? "bg-moss/10 font-medium text-ink" : "text-ink"}`}>
              {touchscreenWinners.includes(idx) && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-moss" />}
              {info.touchscreen}
            </div>
          ))}
        </div>

        {/* ردیف 11: Coating */}
        <div className="grid" style={{ gridTemplateColumns: `180px repeat(${laptops.length}, 1fr)` }}>
          <div className="flex items-center p-3 pr-6 font-medium text-ink">پوشش</div>
          {displayInfos.map((info, idx) => (
            <div key={idx} className="flex items-center p-3 px-4 text-ink">
              {info.coating}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
