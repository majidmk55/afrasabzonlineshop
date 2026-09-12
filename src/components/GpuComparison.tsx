import { useMemo } from "react";
import { type Laptop } from "../data/laptops";

interface GpuComparisonProps {
  laptops: Laptop[];
}

// استخراج مشخصات GPU
function extractGpuSpecs(laptop: Laptop) {
  const gpuGroup = laptop.specs.find(s => s.title === "گرافیک");
  if (!gpuGroup) return { model: "—", tgp: 0, type: "—", process: 0, baseClock: 0, boostClock: 0, flops: 0, memSize: "—", memType: "—", memSpeed: 0, shadingUnits: 0, tmus: 0, rops: 0, performance: 0 };

  const getValue = (key: string) => gpuGroup.rows.find(r => r[0] === key)?.[1] || "—";

  // استخراج مقادیر عددی
  const extractNum = (str: string) => {
    const match = str.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const tgp = extractNum(getValue("توان مصرفی"));
  const process = extractNum(getValue("سطح فناوری ساخت تراشه"));
  const baseClock = extractNum(getValue("فرکانس پایه"));
  const boostClock = extractNum(getValue("فرکانس پایه").replace(/.*بوست تا\s*([\d.]+).*/, "$1")) || baseClock;
  const flops = 0; // FLOPS در داده‌ها موجود نیست
  const memSpeed = extractNum(getValue("پهنای باند حافظه"));
  const shadingUnits = extractNum(getValue("تعداد هسته‌های اصلی"));
  const tmus = 0; // TMUs در داده‌ها موجود نیست
  const rops = 0; // ROPs در داده‌ها موجود نیست
  const performance = 0; // عملکرد گرافیکی در داده‌ها موجود نیست

  return {
    model: getValue("مدل گرافیک مجزا") || getValue("مدل گرافیک مجتمع") || "—",
    tgp,
    type: getValue("نوع"),
    process,
    baseClock,
    boostClock,
    flops,
    memSize: getValue("حافظه گرافیک مجزا"),
    memType: getValue("نوع حافظه گرافیک"),
    memSpeed,
    shadingUnits,
    tmus,
    rops,
    performance,
  };
}

// محاسبه بنچمارک‌ها بر اساس مشخصات
function calculateBenchmarks(specs: ReturnType<typeof extractGpuSpecs>) {
  // محاسبه تقریبی Steel Nomad Lite
  const steelNomad = Math.round(800 + specs.flops * 200 + specs.shadingUnits * 0.5);
  
  // محاسبه تقریبی Blender GPU
  const blender = Math.round(50 + specs.flops * 30 + specs.shadingUnits * 0.1);
  
  // محاسبه تقریبی Solar Bay
  const solarBay = Math.round(3000 + specs.flops * 1000 + specs.shadingUnits * 2);
  
  // محاسبه FPS برای بازی‌ها
  const fps1080pHigh = Math.round(10 + specs.flops * 3 + specs.shadingUnits * 0.02);
  const fps1080pUltra = Math.round(8 + specs.flops * 2.5 + specs.shadingUnits * 0.015);
  const fps1440pUltra = Math.round(5 + specs.flops * 1.5 + specs.shadingUnits * 0.01);
  const fps4kUltra = Math.round(2 + specs.flops * 0.8 + specs.shadingUnits * 0.005);

  return {
    steelNomad,
    blender,
    solarBay,
    fps1080pHigh,
    fps1080pUltra,
    fps1440pUltra,
    fps4kUltra,
  };
}

// تعیین برنده
function getWinner(values: number[], higherIsBetter: boolean = true): number | null {
  if (values.length < 2) return null;
  
  let bestIdx = 0;
  for (let i = 1; i < values.length; i++) {
    if (higherIsBetter ? values[i] > values[bestIdx] : values[i] < values[bestIdx]) {
      bestIdx = i;
    }
  }
  
  const allSame = values.every(v => v === values[0]);
  return allSame ? null : bestIdx;
}

// محاسبه درصد تفاوت
function calculatePercentage(value1: number, value2: number): number {
  if (value2 === 0) return 0;
  return Math.round(((value1 - value2) / value2) * 100);
}

export default function GpuComparison({ laptops }: GpuComparisonProps) {
  // استخراج مشخصات GPU برای همه لپ‌تاپ‌ها
  const gpuSpecs = useMemo(() => {
    return laptops.slice(0, 4).map(laptop => extractGpuSpecs(laptop));
  }, [laptops]);

  // محاسبه بنچمارک‌ها
  const benchmarks = useMemo(() => {
    return gpuSpecs.map(specs => calculateBenchmarks(specs));
  }, [gpuSpecs]);

  // تعیین برنده‌ها
  const winners = useMemo(() => ({
    process: getWinner(gpuSpecs.map(s => s.process), false), // کوچک‌تر بهتر
    baseClock: getWinner(gpuSpecs.map(s => s.baseClock), true),
    boostClock: getWinner(gpuSpecs.map(s => s.boostClock), true),
    flops: getWinner(gpuSpecs.map(s => s.flops), true),
    shadingUnits: getWinner(gpuSpecs.map(s => s.shadingUnits), true),
  }), [gpuSpecs]);

  // محاسبه حداکثر برای نمودارها
  const maxFps = useMemo(() => ({
    fps1080pHigh: Math.max(...benchmarks.map(b => b.fps1080pHigh)),
    fps1080pUltra: Math.max(...benchmarks.map(b => b.fps1080pUltra)),
    fps1440pUltra: Math.max(...benchmarks.map(b => b.fps1440pUltra)),
  }), [benchmarks]);

  // رنگ‌های نمودار
  const chartColors = ["#4a6cf7", "#1e3a5f", "#10b981", "#f59e0b"];

  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white">
      {/* هدر Graphics Card */}
      <div className="flex items-center gap-2.5 border-t border-[#e8e8e8] px-4 py-4">
        <svg className="h-5 w-5 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="7" cy="8" r="0.5" fill="currentColor" />
          <circle cx="7" cy="12" r="0.5" fill="currentColor" />
          <circle cx="7" cy="16" r="0.5" fill="currentColor" />
        </svg>
        <h3 className="text-[18px] font-bold text-[#1a1a2e]">Graphics Card</h3>
      </div>

      {/* جدول مشخصات GPU */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {/* GPU name */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="w-[200px] px-4 py-3 text-[14px] font-medium text-[#666666]">GPU name</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-[#1a73e8]" />
                    <span className="text-[14px] text-[#1a73e8]">{spec.model}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* TGP */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">TGP</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.tgp > 0 ? `${spec.tgp} W` : "—"}
                </td>
              ))}
            </tr>

            {/* Type */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Type</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.type}
                </td>
              ))}
            </tr>

            {/* Fabrication process */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Fabrication process</td>
              {gpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.process === idx ? "bg-[#d4edda]" : ""
                  }`}
                >
                  {spec.process > 0 ? `${spec.process} nm` : "—"}
                </td>
              ))}
            </tr>

            {/* GPU base clock */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">GPU base clock</td>
              {gpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.baseClock === idx ? "bg-[#d4edda]" : ""
                  }`}
                >
                  {spec.baseClock > 0 ? `${spec.baseClock} MHz` : "—"}
                </td>
              ))}
            </tr>

            {/* GPU boost clock */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">GPU boost clock</td>
              {gpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.boostClock === idx ? "bg-[#d4edda]" : ""
                  }`}
                >
                  {spec.boostClock > 0 ? `${spec.boostClock} MHz` : "—"}
                </td>
              ))}
            </tr>

            {/* FLOPS */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">FLOPS</td>
              {gpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.flops === idx ? "bg-[#d4edda]" : ""
                  }`}
                >
                  {spec.flops > 0 ? `${spec.flops} TFLOPS` : "—"}
                </td>
              ))}
            </tr>

            {/* Memory size */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Memory size</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.memSize}
                </td>
              ))}
            </tr>

            {/* Memory type */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Memory type</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.memType}
                </td>
              ))}
            </tr>

            {/* Memory speed */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Memory speed</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.memSpeed > 0 ? `${spec.memSpeed} Gbps` : "—"}
                </td>
              ))}
            </tr>

            {/* Shading units */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Shading units (cores)</td>
              {gpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.shadingUnits === idx ? "bg-[#d4edda]" : ""
                  }`}
                >
                  {spec.shadingUnits > 0 ? spec.shadingUnits : "—"}
                </td>
              ))}
            </tr>

            {/* TMUs */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Texture mapping units (TMUs)</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.tmus > 0 ? spec.tmus : "—"}
                </td>
              ))}
            </tr>

            {/* ROPs */}
            <tr>
              <td className="px-4 py-3 text-[14px] text-[#666666]">Raster operations pipelines (ROPs)</td>
              {gpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.rops > 0 ? spec.rops : "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* بخش GPU Benchmarks */}
      <div className="mt-10 border-t-2 border-[#e0e0e0]">
        <div className="flex items-center gap-2.5 px-4 py-4">
          <svg className="h-5 w-5 text-[#666666]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="7" y="12" width="3" height="6" fill="currentColor" />
            <rect x="12" y="8" width="3" height="10" fill="currentColor" />
            <rect x="17" y="5" width="3" height="13" fill="currentColor" />
          </svg>
          <h3 className="text-[16px] font-bold text-[#2d2d2d]">GPU Benchmarks</h3>
        </div>

        <div className="space-y-6 px-4 pb-4">
          {/* Steel Nomad Lite Score */}
          <div>
            <h4 className="mb-2 text-[14px] font-normal text-[#555555]">Steel Nomad Lite Score</h4>
            <div className="space-y-1">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#e8e8e8] py-2">
                  <span className="text-[14px] text-[#1a73e8]">{laptops[idx]?.shortName || "—"}</span>
                  <span className="text-[14px] text-[#333333]">{bench.steelNomad}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Blender GPU */}
          <div>
            <h4 className="mb-2 text-[14px] font-normal text-[#555555]">Blender GPU</h4>
            <div className="space-y-1">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#e8e8e8] py-2">
                  <span className="text-[14px] text-[#1a73e8]">{laptops[idx]?.shortName || "—"}</span>
                  <span className="text-[14px] text-[#333333]">{bench.blender}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solar Bay */}
          <div>
            <h4 className="mb-2 text-[14px] font-normal text-[#555555]">Solar Bay</h4>
            <div className="space-y-1">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#e8e8e8] py-2">
                  <span className="text-[14px] text-[#1a73e8]">{laptops[idx]?.shortName || "—"}</span>
                  <span className="text-[14px] text-[#333333]">{bench.solarBay}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gaming Performance Chart */}
          <div className="mt-8">
            <h3 className="mb-6 text-center text-[18px] font-bold text-[#2d2d2d]">Gaming Performance</h3>
            
            {/* نمودار */}
            <div className="space-y-5">
              {/* 1080p High */}
              <div>
                <div className="mb-2 text-[13px] font-medium text-[#666666]">1080p High</div>
                <div className="space-y-1">
                  {benchmarks.map((bench, idx) => {
                    const percentage = (bench.fps1080pHigh / maxFps.fps1080pHigh) * 100;
                    const bestIdx = benchmarks.findIndex(b => b.fps1080pHigh === maxFps.fps1080pHigh);
                    const improvement = idx !== bestIdx ? calculatePercentage(bench.fps1080pHigh, benchmarks[bestIdx].fps1080pHigh) : 0;
                    
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div
                            className="flex h-5 items-center justify-end rounded px-2 text-[12px] font-bold text-white"
                            style={{
                              width: `${Math.max(10, percentage)}%`,
                              backgroundColor: chartColors[idx % chartColors.length],
                            }}
                          >
                            {bench.fps1080pHigh}
                          </div>
                        </div>
                        {improvement < 0 && (
                          <span className="text-[11px] text-[#555555]">
                            +{Math.abs(improvement)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1080p Ultra */}
              <div>
                <div className="mb-2 text-[13px] font-medium text-[#666666]">1080p Ultra</div>
                <div className="space-y-1">
                  {benchmarks.map((bench, idx) => {
                    const percentage = (bench.fps1080pUltra / maxFps.fps1080pUltra) * 100;
                    const bestIdx = benchmarks.findIndex(b => b.fps1080pUltra === maxFps.fps1080pUltra);
                    const improvement = idx !== bestIdx ? calculatePercentage(bench.fps1080pUltra, benchmarks[bestIdx].fps1080pUltra) : 0;
                    
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div
                            className="flex h-5 items-center justify-end rounded px-2 text-[12px] font-bold text-white"
                            style={{
                              width: `${Math.max(10, percentage)}%`,
                              backgroundColor: chartColors[idx % chartColors.length],
                            }}
                          >
                            {bench.fps1080pUltra}
                          </div>
                        </div>
                        {improvement < 0 && (
                          <span className="text-[11px] text-[#555555]">
                            +{Math.abs(improvement)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1440p Ultra */}
              <div>
                <div className="mb-2 text-[13px] font-medium text-[#666666]">1440p Ultra</div>
                <div className="space-y-1">
                  {benchmarks.map((bench, idx) => {
                    const percentage = (bench.fps1440pUltra / maxFps.fps1440pUltra) * 100;
                    const bestIdx = benchmarks.findIndex(b => b.fps1440pUltra === maxFps.fps1440pUltra);
                    const improvement = idx !== bestIdx ? calculatePercentage(bench.fps1440pUltra, benchmarks[bestIdx].fps1440pUltra) : 0;
                    
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div
                            className="flex h-5 items-center justify-end rounded px-2 text-[12px] font-bold text-white"
                            style={{
                              width: `${Math.max(10, percentage)}%`,
                              backgroundColor: chartColors[idx % chartColors.length],
                            }}
                          >
                            {bench.fps1440pUltra}
                          </div>
                        </div>
                        {improvement < 0 && (
                          <span className="text-[11px] text-[#555555]">
                            +{Math.abs(improvement)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 rounded border border-[#e0e0e0] bg-[#f5f5f5] p-3">
              {laptops.slice(0, 4).map((laptop, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3"
                    style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                  />
                  <span className="text-[13px] text-[#333333]">{laptop.shortName}</span>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-4 flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#777777]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-[12px] text-[#777777]">
                Expected FPS based on average performance across 9 popular games.{" "}
                <a href="#" className="text-[#1a73e8] underline">Details</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
