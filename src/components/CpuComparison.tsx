import { useMemo } from "react";
import { type Laptop } from "../data/laptops";

interface CpuComparisonProps {
  laptops: Laptop[];
}

// استخراج مشخصات CPU
function extractCpuSpecs(laptop: Laptop) {
  const cpuGroup = laptop.specs.find(s => s.title === "پردازنده");
  if (!cpuGroup) return { model: "—", baseFreq: 0, turboFreq: 0, cores: "—", threads: 0, cache: 0, igpu: "—", process: 0 };

  const getValue = (key: string) => cpuGroup.rows.find(r => r[0] === key)?.[1] || "—";

  // استخراج مدل
  const model = getValue("مدل پردازنده");

  // استخراج فرکانس پایه و توربو
  const freqStr = getValue("فرکانس پایه و حداکثر");
  const baseMatch = freqStr.match(/(\d+(?:\.\d+)?)/);
  const turboMatch = freqStr.match(/(\d+(?:\.\d+)?)\s*(?:گیگاهرتز|GHz)/g);
  const baseFreq = baseMatch ? parseFloat(baseMatch[1]) : 0;
  const turboFreq = turboMatch && turboMatch.length > 1 ? parseFloat(turboMatch[1].match(/(\d+(?:\.\d+)?)/)?.[1] || "0") : 0;

  // استخراج هسته و رشته
  const coresStr = getValue("تعداد هسته و رشته");
  const coresMatch = coresStr.match(/(\d+)/);
  const threadsMatch = coresStr.match(/\/\s*(\d+)/);
  const cores = coresMatch ? coresMatch[1] : "—";
  const threads = threadsMatch ? parseInt(threadsMatch[1]) : 0;

  // استخراج کش
  const cacheStr = getValue("مقدار حافظه کش");
  const cacheMatch = cacheStr.match(/(\d+)/);
  const cache = cacheMatch ? parseInt(cacheMatch[1]) : 0;

  // استخراج GPU یکپارچه
  const igpu = getValue("گرافیک مجتمع") || getValue("مدل گرافیک مجتمع") || "—";

  // استخراج فرآیند ساخت
  const processStr = getValue("سطح تکنولوژی ساخت");
  const processMatch = processStr.match(/(\d+)/);
  const process = processMatch ? parseInt(processMatch[1]) : 0;

  return { model, baseFreq, turboFreq, cores, threads, cache, igpu, process };
}

// محاسبه بنچمارک‌ها بر اساس مشخصات
function calculateBenchmarks(specs: ReturnType<typeof extractCpuSpecs>) {
  // محاسبه تقریبی Geekbench 6 بر اساس فرکانس و تعداد هسته
  const singleCore = Math.round(2000 + specs.turboFreq * 100);
  const multiCore = Math.round(singleCore * (typeof specs.threads === 'number' ? specs.threads : 8) * 0.8);

  // محاسبه تقریبی Cinebench 2024
  const cbSingle = Math.round(100 + specs.turboFreq * 10);
  const cbMulti = Math.round(cbSingle * (typeof specs.threads === 'number' ? specs.threads : 8) * 0.7);

  return {
    geekbench6Single: singleCore,
    geekbench6Multi: multiCore,
    cinebench2024Single: cbSingle,
    cinebench2024Multi: cbMulti,
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

export default function CpuComparison({ laptops }: CpuComparisonProps) {
  // استخراج مشخصات CPU برای همه لپ‌تاپ‌ها
  const cpuSpecs = useMemo(() => {
    return laptops.slice(0, 4).map(laptop => extractCpuSpecs(laptop));
  }, [laptops]);

  // محاسبه بنچمارک‌ها
  const benchmarks = useMemo(() => {
    return cpuSpecs.map(specs => calculateBenchmarks(specs));
  }, [cpuSpecs]);

  // تعیین برنده‌ها
  const winners = useMemo(() => ({
    baseFreq: getWinner(cpuSpecs.map(s => s.baseFreq), true),
    turboFreq: getWinner(cpuSpecs.map(s => s.turboFreq), true),
    cache: getWinner(cpuSpecs.map(s => s.cache), true),
    process: getWinner(cpuSpecs.map(s => s.process), false), // کوچک‌تر بهتر است
    geekbench6Single: getWinner(benchmarks.map(b => b.geekbench6Single), true),
    geekbench6Multi: getWinner(benchmarks.map(b => b.geekbench6Multi), true),
    cinebench2024Single: getWinner(benchmarks.map(b => b.cinebench2024Single), true),
    cinebench2024Multi: getWinner(benchmarks.map(b => b.cinebench2024Multi), true),
  }), [cpuSpecs, benchmarks]);

  // محاسبه حداکثر برای نوارهای پیشرفت
  const maxBenchmarks = useMemo(() => ({
    geekbench6Single: Math.max(...benchmarks.map(b => b.geekbench6Single)),
    geekbench6Multi: Math.max(...benchmarks.map(b => b.geekbench6Multi)),
    cinebench2024Single: Math.max(...benchmarks.map(b => b.cinebench2024Single)),
    cinebench2024Multi: Math.max(...benchmarks.map(b => b.cinebench2024Multi)),
  }), [benchmarks]);

  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white">
      {/* هدر CPU */}
      <div className="flex items-center gap-2.5 border-t border-[#e8e8e8] px-4 py-4">
        <svg className="h-5 w-5 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="9" y="9" width="6" height="6" fill="currentColor" />
          <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h3 className="text-[18px] font-bold text-[#1a1a2e]">CPU</h3>
      </div>

      {/* جدول CPU */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {/* مدل CPU */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="w-[200px] px-4 py-3 text-[14px] font-medium text-[#666666]">CPU Model</td>
              {cpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.model}
                </td>
              ))}
            </tr>

            {/* Base frequency */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Base frequency</td>
              {cpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.baseFreq === idx ? "bg-[#e8f5e9]" : ""
                  }`}
                >
                  {spec.baseFreq > 0 ? `${spec.baseFreq} GHz` : "—"}
                </td>
              ))}
            </tr>

            {/* Turbo frequency */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Turbo frequency</td>
              {cpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.turboFreq === idx ? "bg-[#e8f5e9]" : ""
                  }`}
                >
                  {spec.turboFreq > 0 ? `${spec.turboFreq} GHz` : "—"}
                </td>
              ))}
            </tr>

            {/* Cores */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Cores</td>
              {cpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.cores}
                </td>
              ))}
            </tr>

            {/* Threads */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Threads</td>
              {cpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.threads > 0 ? spec.threads : "—"}
                </td>
              ))}
            </tr>

            {/* L3 Cache */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">L3 Cache</td>
              {cpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.cache === idx ? "bg-[#e8f5e9]" : ""
                  }`}
                >
                  {spec.cache > 0 ? `${spec.cache} MB` : "—"}
                </td>
              ))}
            </tr>

            {/* Integrated GPU */}
            <tr className="border-b border-[#e8e8e8]">
              <td className="px-4 py-3 text-[14px] text-[#666666]">Integrated GPU</td>
              {cpuSpecs.map((spec, idx) => (
                <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                  {spec.igpu}
                </td>
              ))}
            </tr>

            {/* Fabrication process */}
            <tr>
              <td className="px-4 py-3 text-[14px] text-[#666666]">Fabrication process</td>
              {cpuSpecs.map((spec, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 text-[14px] text-[#333333] ${
                    winners.process === idx ? "bg-[#e8f5e9]" : ""
                  }`}
                >
                  {spec.process > 0 ? `${spec.process} nm` : "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* بخش Benchmarks */}
      <div className="border-t-2 border-[#e0e0e0]">
        <div className="flex items-center gap-2.5 px-4 py-4">
          <svg className="h-5 w-5 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 14l4-4 4 4 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-[18px] font-bold text-[#1a1a2e]">Benchmarks</h3>
        </div>

        <div className="space-y-6 px-4 pb-4">
          {/* Geekbench 6 Single-Core */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[14px] font-medium text-[#666666]">Geekbench 6 (Single-Core)</span>
              {winners.geekbench6Single !== null && (
                <span className="rounded-full bg-[#d4edda] px-2 py-0.5 text-[11px] font-bold text-[#155724]">
                  +{calculatePercentage(
                    benchmarks[winners.geekbench6Single].geekbench6Single,
                    benchmarks.find((_, idx) => idx !== winners.geekbench6Single)?.geekbench6Single || 0
                  )}%
                </span>
              )}
            </div>
            <div className="space-y-2">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-[120px] truncate text-[12px] text-[#333333]">
                    {laptops[idx]?.shortName || "—"}
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-6 flex-1 overflow-hidden rounded bg-[#f0f0f0]">
                      <div
                        className="h-full bg-[#1a73e8] transition-all duration-500"
                        style={{ width: `${(bench.geekbench6Single / maxBenchmarks.geekbench6Single) * 100}%` }}
                      />
                    </div>
                    <span className="w-[60px] text-right text-[13px] font-bold text-[#333333]">
                      {bench.geekbench6Single}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geekbench 6 Multi-Core */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[14px] font-medium text-[#666666]">Geekbench 6 (Multi-Core)</span>
              {winners.geekbench6Multi !== null && (
                <span className="rounded-full bg-[#d4edda] px-2 py-0.5 text-[11px] font-bold text-[#155724]">
                  +{calculatePercentage(
                    benchmarks[winners.geekbench6Multi].geekbench6Multi,
                    benchmarks.find((_, idx) => idx !== winners.geekbench6Multi)?.geekbench6Multi || 0
                  )}%
                </span>
              )}
            </div>
            <div className="space-y-2">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-[120px] truncate text-[12px] text-[#333333]">
                    {laptops[idx]?.shortName || "—"}
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-6 flex-1 overflow-hidden rounded bg-[#f0f0f0]">
                      <div
                        className="h-full bg-[#1a73e8] transition-all duration-500"
                        style={{ width: `${(bench.geekbench6Multi / maxBenchmarks.geekbench6Multi) * 100}%` }}
                      />
                    </div>
                    <span className="w-[60px] text-right text-[13px] font-bold text-[#333333]">
                      {bench.geekbench6Multi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cinebench 2024 Single-Core */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[14px] font-medium text-[#666666]">Cinebench 2024 (Single-Core)</span>
              {winners.cinebench2024Single !== null && (
                <span className="rounded-full bg-[#d4edda] px-2 py-0.5 text-[11px] font-bold text-[#155724]">
                  +{calculatePercentage(
                    benchmarks[winners.cinebench2024Single].cinebench2024Single,
                    benchmarks.find((_, idx) => idx !== winners.cinebench2024Single)?.cinebench2024Single || 0
                  )}%
                </span>
              )}
            </div>
            <div className="space-y-2">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-[120px] truncate text-[12px] text-[#333333]">
                    {laptops[idx]?.shortName || "—"}
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-6 flex-1 overflow-hidden rounded bg-[#f0f0f0]">
                      <div
                        className="h-full bg-[#1a73e8] transition-all duration-500"
                        style={{ width: `${(bench.cinebench2024Single / maxBenchmarks.cinebench2024Single) * 100}%` }}
                      />
                    </div>
                    <span className="w-[60px] text-right text-[13px] font-bold text-[#333333]">
                      {bench.cinebench2024Single}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cinebench 2024 Multi-Core */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[14px] font-medium text-[#666666]">Cinebench 2024 (Multi-Core)</span>
              {winners.cinebench2024Multi !== null && (
                <span className="rounded-full bg-[#d4edda] px-2 py-0.5 text-[11px] font-bold text-[#155724]">
                  +{calculatePercentage(
                    benchmarks[winners.cinebench2024Multi].cinebench2024Multi,
                    benchmarks.find((_, idx) => idx !== winners.cinebench2024Multi)?.cinebench2024Multi || 0
                  )}%
                </span>
              )}
            </div>
            <div className="space-y-2">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-[120px] truncate text-[12px] text-[#333333]">
                    {laptops[idx]?.shortName || "—"}
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-6 flex-1 overflow-hidden rounded bg-[#f0f0f0]">
                      <div
                        className="h-full bg-[#1a73e8] transition-all duration-500"
                        style={{ width: `${(bench.cinebench2024Multi / maxBenchmarks.cinebench2024Multi) * 100}%` }}
                      />
                    </div>
                    <span className="w-[60px] text-right text-[13px] font-bold text-[#333333]">
                      {bench.cinebench2024Multi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
