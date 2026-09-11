import { useState } from "react";
import type { Laptop } from "../data/laptops";

interface DisplayComparisonData {
  size: string;
  type: string;
  refreshRate: string;
  adaptiveRefresh: string;
  ppi: string;
  aspectRatio: string;
  resolution: string;
  hdr: string;
  sync: string;
  touchscreen: string;
  coating: string;
  ambientSensor: string;
}

interface DisplayTestsData {
  contrast: string;
  srgb: string;
  adobeRgb: string;
}

interface BrightnessData {
  name: string;
  nits: number;
  percentage?: number;
}

interface CoolingData {
  type: string;
  fans: string;
  heatPipes: string;
  vaporChamber: string;
  liquidMetal: string;
  noiseLevel: string;
}

interface ComparisonTableProps {
  products: Laptop[];
}

export default function ComparisonTable({ products }: ComparisonTableProps) {
  const [selectedResolutions, setSelectedResolutions] = useState<Record<number, number>>({});

  if (products.length === 0) return null;

  // Extract display data from products
  const getDisplayData = (laptop: Laptop): DisplayComparisonData => {
    const displaySpec = laptop.specs.find(s => s.title === "نمایشگر");
    if (!displaySpec) {
      return {
        size: "—",
        type: "—",
        refreshRate: "—",
        adaptiveRefresh: "—",
        ppi: "—",
        aspectRatio: "—",
        resolution: "—",
        hdr: "—",
        sync: "—",
        touchscreen: "—",
        coating: "—",
        ambientSensor: "—",
      };
    }

    const getRow = (key: string) => {
      const row = displaySpec.rows.find(r => r[0] === key);
      return row ? row[1] : "—";
    };

    // Extract size
    const sizeText = getRow("اندازه صفحه نمایش");
    const sizeMatch = sizeText.match(/(\d+(?:\.\d+)?)/);
    const size = sizeMatch ? `${sizeMatch[1]} inches]` : sizeText;

    // Extract type
    const type = getRow("نوع پنل");

    // Extract refresh rate
    const refreshText = getRow("نرخ نوسازی");
    const refreshMatch = refreshText.match(/(\d+)/);
    const refreshRate = refreshMatch ? `${refreshMatch[1]} Hz` : refreshText;

    // Extract adaptive refresh
    const adaptive = getRow("نرخ نوسازی تطبیقی");

    // Extract PPI
    const ppiText = getRow("تراکم پیکسل");
    const ppiMatch = ppiText.match(/(\d+)/);
    const ppi = ppiMatch ? `${ppiMatch[1]} ppi` : ppiText;

    // Extract aspect ratio
    const resolution = getRow("رزولوشن");
    const resMatch = resolution.match(/(\d+)\s*[x××]\s*(\d+)/);
    const aspectRatio = resMatch ? `${Math.round(parseInt(resMatch[1]) / parseInt(resMatch[2]) * 10) / 10}:${(parseInt(resMatch[2]) / parseInt(resMatch[1]) * 10).toFixed(1)}` : "—";

    // Extract HDR
    const hdr = getRow("HDR");

    // Extract sync
    const sync = getRow("Sync");

    // Extract touchscreen
    const touchscreen = getRow("لمسی");

    // Extract coating
    const coating = getRow("پوشش");

    return {
      size,
      type,
      refreshRate,
      adaptiveRefresh: adaptive,
      ppi,
      aspectRatio,
      resolution: `${resolution} pixels`,
      hdr,
      sync,
      touchscreen,
      coating,
      ambientSensor: "—",
    };
  };

  // Extract display tests data
  const getDisplayTestsData = (laptop: Laptop): DisplayTestsData => {
    const displaySpec = laptop.specs.find(s => s.title === "نمایشگر");
    if (!displaySpec) {
      return {
        contrast: "—",
        srgb: "—",
        adobeRgb: "—",
      };
    }

    const getRow = (key: string) => {
      const row = displaySpec.rows.find(r => r[0] === key);
      return row ? row[1] : "—";
    };

    return {
      contrast: getRow("نسبت کنتراست") || "—",
      srgb: getRow("پوشش sRGB") || "—",
      adobeRgb: getRow("پوشش Adobe RGB") || "—",
    };
  };

  // Extract brightness data
  const getBrightnessData = (laptop: Laptop): BrightnessData => {
    const displaySpec = laptop.specs.find(s => s.title === "نمایشگر");
    if (!displaySpec) {
      return {
        name: laptop.shortName,
        nits: 0,
      };
    }

    const brightnessText = displaySpec.rows.find(r => r[0] === "روشنایی")?.[1] || "0";
    const brightnessMatch = brightnessText.match(/(\d+)/);
    const nits = brightnessMatch ? parseInt(brightnessMatch[1]) : 0;

    return {
      name: laptop.shortName,
      nits,
    };
  };

  // Extract cooling data
  const getCoolingData = (laptop: Laptop): CoolingData => {
    return {
      type: "Active",
      fans: "—",
      heatPipes: "—",
      vaporChamber: "—",
      liquidMetal: "—",
      noiseLevel: "—",
    };
  };

  const displayData = products.map(getDisplayData);
  const displayTestsData = products.map(getDisplayTestsData);
  const brightnessData = products.map(getBrightnessData);
  const coolingData = products.map(getCoolingData);

  // Calculate max brightness for percentage calculation
  const maxBrightness = Math.max(...brightnessData.map(d => d.nits));

  // Determine winners for each row
  const getRefreshWinner = () => {
    const rates = displayData.map(d => parseInt(d.refreshRate.match(/(\d+)/)?.[1] || "0"));
    const maxRate = Math.max(...rates);
    return rates.map(r => r === maxRate);
  };

  const getPpiWinner = () => {
    const ppis = displayData.map(d => parseInt(d.ppi.match(/(\d+)/)?.[1] || "0"));
    const maxPpi = Math.max(...ppis);
    return ppis.map(p => p === maxPpi);
  };

  const refreshWinners = getRefreshWinner();
  const ppiWinners = getPpiWinner();

  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white">
      {/* SECTION 1: Display */}
      <div className="border-t border-gray-200">
        <div className="flex items-center border-b border-gray-100 px-6 py-4">
          <div className="mr-2 h-4 w-4 bg-sea" />
          <h3 className="text-lg font-bold text-ink">نمایشگر</h3>
        </div>

        {/* Resolution Selection */}
        <div className="flex justify-around gap-10 px-8 py-5">
          {products.map((laptop, idx) => {
            const resolutions = [
              { label: "1920 × 1200", selected: true },
              { label: "2560 × 1600", selected: false },
            ];

            return (
              <div key={laptop.id} className="flex flex-col gap-2">
                {resolutions.map((res, resIdx) => (
                  <label key={resIdx} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name={`resolution-${laptop.id}`}
                      checked={(selectedResolutions[idx] ?? 0) === resIdx}
                      onChange={() => setSelectedResolutions(prev => ({ ...prev, [idx]: resIdx }))}
                      className="hidden"
                    />
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                      (selectedResolutions[idx] ?? 0) === resIdx
                        ? "border-sea bg-sea"
                        : "border-gray-300"
                    }`}>
                      {(selectedResolutions[idx] ?? 0) === resIdx && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-ink">{res.label}</span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>

        {/* Display Table */}
        <div className="flex flex-col">
          {/* Size */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Size</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.size}</div>
            ))}
          </div>

          {/* Type */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Type</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.type}</div>
            ))}
          </div>

          {/* Refresh rate */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Refresh rate</div>
            {displayData.map((data, idx) => (
              <div key={idx} className={`flex items-center justify-end p-3 px-4 ${refreshWinners[idx] ? "bg-[#d5f5e3] font-medium" : ""} text-ink`}>
                {data.refreshRate}
              </div>
            ))}
          </div>

          {/* Adaptive refresh rate */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Adaptive refresh rate</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.adaptiveRefresh}</div>
            ))}
          </div>

          {/* PPI */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">PPI</div>
            {displayData.map((data, idx) => (
              <div key={idx} className={`flex items-center justify-end p-3 px-4 ${ppiWinners[idx] ? "bg-[#d5f5e3] font-medium" : ""} text-ink`}>
                {data.ppi}
              </div>
            ))}
          </div>

          {/* Aspect ratio */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Aspect ratio</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.aspectRatio}</div>
            ))}
          </div>

          {/* Resolution */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Resolution</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.resolution}</div>
            ))}
          </div>

          {/* HDR support */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">HDR support</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.hdr}</div>
            ))}
          </div>

          {/* Sync technology */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Sync technology</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.sync}</div>
            ))}
          </div>

          {/* Touchscreen */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Touchscreen</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.touchscreen}</div>
            ))}
          </div>

          {/* Coating */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Coating</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.coating}</div>
            ))}
          </div>

          {/* Ambient light sensor */}
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Ambient light sensor</div>
            {displayData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.ambientSensor}</div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Display tests */}
      <div className="border-t border-gray-200">
        <div className="flex items-center border-b border-gray-100 px-6 py-4">
          <div className="mr-2 h-4 w-4 bg-sea" />
          <h3 className="text-lg font-bold text-ink">تست‌های نمایشگر</h3>
        </div>

        <div className="flex flex-col">
          {/* Contrast */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Contrast</div>
            {displayTestsData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.contrast}</div>
            ))}
          </div>

          {/* sRGB color space */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">sRGB color space</div>
            {displayTestsData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.srgb}</div>
            ))}
          </div>

          {/* Adobe RGB profile */}
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">Adobe RGB profile</div>
            {displayTestsData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.adobeRgb}</div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Max. brightness */}
      <div className="border-t border-gray-200 px-6 py-5">
        <h3 className="mb-4 text-lg font-bold text-ink">حداکثر روشنایی</h3>
        <div className="space-y-4">
          {brightnessData.map((data, idx) => {
            const percentage = (data.nits / maxBrightness) * 100;
            const isHighest = data.nits === maxBrightness;
            
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-48 text-sm font-medium text-ink">{data.name}</div>
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded bg-gray-100">
                      <div 
                        className="h-full rounded bg-sea transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">{data.nits} nits</span>
                    {isHighest && (
                      <span className="rounded bg-[#d5f5e3] px-2 py-0.5 text-xs font-bold text-moss">
                        +{Math.round(((data.nits - Math.min(...brightnessData.map(d => d.nits))) / Math.min(...brightnessData.map(d => d.nits))) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Cooling Solution */}
      <div className="border-t border-gray-200">
        <div className="flex items-center border-b border-gray-100 px-6 py-4">
          <div className="mr-2 h-4 w-4 bg-sea" />
          <h3 className="text-lg font-bold text-ink">راه حل خنک‌کنندگی</h3>
        </div>

        <div className="flex flex-col">
          {/* Cooling type */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">نوع خنک‌کنندگی</div>
            {coolingData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.type}</div>
            ))}
          </div>

          {/* Fans */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">تعداد فن‌ها</div>
            {coolingData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.fans}</div>
            ))}
          </div>

          {/* Heat pipes */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">لوله‌های حرارتی</div>
            {coolingData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.heatPipes}</div>
            ))}
          </div>

          {/* Vapor chamber */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">محفظه بخار</div>
            {coolingData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.vaporChamber}</div>
            ))}
          </div>

          {/* Liquid metal */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">فلز مایع</div>
            {coolingData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.liquidMetal}</div>
            ))}
          </div>

          {/* Noise level */}
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
            <div className="flex items-center p-3 pr-6 font-medium text-ink">سطح نویز</div>
            {coolingData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-end p-3 px-4 text-ink">{data.noiseLevel}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
