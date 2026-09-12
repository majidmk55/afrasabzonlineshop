import { useState, useMemo } from "react";
import { type Laptop } from "../data/laptops";

interface RamStorageComparisonProps {
  laptops: Laptop[];
}

// استخراج مشخصات RAM
function extractRamSpecs(laptop: Laptop) {
  const ramGroup = laptop.specs.find(s => s.title === "حافظه رم");
  if (!ramGroup) return { size: 0, channels: "—", clock: 0, type: "—", upgradable: "—", slots: "—", maxSize: "—" };

  const getValue = (key: string) => ramGroup.rows.find(r => r[0] === key)?.[1] || "—";

  // استخراج اندازه RAM (مثلاً "32GB" → 32)
  const ramStr = getValue("حافظه داخلی رم");
  const ramMatch = ramStr.match(/(\d+)/);
  const ramSize = ramMatch ? parseInt(ramMatch[1]) : 0;

  // استخراج فرکانس (مثلاً "5600 مگاهرتز" → 5600)
  const clockStr = getValue("نوع حافظه");
  const clockMatch = clockStr.match(/(\d+)/);
  const clock = clockMatch ? parseInt(clockMatch[1]) : 0;

  // استخراج نوع (DDR5, LPDDR5X, etc.)
  const type = clockStr.replace(/\d+.*$/, "").trim() || getValue("نوع حافظه");

  // استخراج کانال‌ها
  const channelsStr = getValue("تعداد اسلات‌ها و کانال‌های رم");
  const channels = channelsStr.includes("دو کاناله") ? "2x" : channelsStr.includes("یکپارچه") ? "1x" : "—";

  return {
    size: ramSize,
    channels: channels + (ramSize ? ramSize + " GB" : ""),
    clock: clock,
    type: type || "—",
    upgradable: getValue("نوع ماژول رم").includes("لحیم") ? "No" : "Yes",
    slots: getValue("تعداد اسلات‌ها و کانال‌های رم").includes("بدون") ? "—" : "2",
    maxSize: getValue("نوع ماژول رم").includes("لحیم") ? "—" : "64 GB",
  };
}

// استخراج مشخصات Storage
function extractStorageSpecs(laptop: Laptop): StorageSpecs {
  const storageGroup = laptop.specs.find(s => s.title === "ذخیره‌سازی");
  if (!storageGroup) return { size: 0, bus: "—", type: "—", channels: "—", upgradable: "—", slots: "—", nvme: "—" };

  const getValue = (key: string) => storageGroup.rows.find(r => r[0] === key)?.[1] || "—";

  // استخراج اندازه Storage
  const storageStr = getValue("ظرفیت کلی");
  const storageMatch = storageStr.match(/(\d+)/);
  const storageSize = storageMatch ? parseInt(storageMatch[1]) : 0;

  // استخراج Bus
  const busStr = getValue("رابط SSD");
  const bus = busStr.includes("5.0") ? "PCI-E Gen 5.0 (4x)" : busStr.includes("4.0") ? "PCI-E Gen 4.0 (4x)" : "—";

  // استخراج نوع
  const type = getValue("فرم فاکتور (Form Factor)").includes("M.2") ? "SSD (M2)" : "—";

  // استخراج کانال‌ها
  const channels = storageSize ? `1x${storageSize} GB` : "—";

  return {
    size: storageSize,
    bus,
    type,
    channels,
    upgradable: "Yes",
    slots: "1",
    nvme: getValue("نسخه NVMe") !== "—" ? "Yes" : "No",
  };
}

// تعیین برنده برای هر مشخصه
function getWinner(values: number[], higherIsBetter: boolean = true): number | null {
  if (values.length < 2) return null;
  
  let bestIdx = 0;
  for (let i = 1; i < values.length; i++) {
    if (higherIsBetter ? values[i] > values[bestIdx] : values[i] < values[bestIdx]) {
      bestIdx = i;
    }
  }
  
  // اگر همه مقادیر یکسان باشند، برنده‌ای نیست
  const allSame = values.every(v => v === values[0]);
  return allSame ? null : bestIdx;
}

interface RamSpecs {
  size: number;
  channels: string;
  clock: number;
  type: string;
  upgradable: string;
  slots: string;
  maxSize: string;
}

interface StorageSpecs {
  size: number;
  bus: string;
  type: string;
  channels: string;
  upgradable: string;
  slots: string;
  nvme: string;
}

export default function RamStorageComparison({ laptops }: RamStorageComparisonProps) {
  const [selectedRam, setSelectedRam] = useState<Record<number, number>>({});
  const [selectedStorage, setSelectedStorage] = useState<Record<number, number>>({});

  // استخراج مشخصات RAM برای همه لپ‌تاپ‌ها
  const ramSpecs: RamSpecs[] = useMemo(() => {
    return laptops.slice(0, 4).map(laptop => extractRamSpecs(laptop));
  }, [laptops]);

  // استخراج مشخصات Storage برای همه لپ‌تاپ‌ها
  const storageSpecs: StorageSpecs[] = useMemo(() => {
    return laptops.slice(0, 4).map(laptop => extractStorageSpecs(laptop));
  }, [laptops]);

  // تعیین برنده‌ها برای RAM
  const ramWinners = useMemo(() => ({
    size: getWinner(ramSpecs.map(s => s.size), true),
    clock: getWinner(ramSpecs.map(s => s.clock), true),
    upgradable: getWinner(ramSpecs.map(s => s.upgradable === "Yes" ? 1 : 0), true),
  }), [ramSpecs]);

  // تعیین برنده‌ها برای Storage
  const storageWinners = useMemo(() => ({
    size: getWinner(storageSpecs.map(s => s.size), true),
  }), [storageSpecs]);

  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white">
      {/* بخش RAM */}
      <div className="border-t border-[#e8e8e8]">
        {/* هدر RAM */}
        <div className="flex items-center gap-2.5 px-4 py-4">
          <svg className="h-5 w-5 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
            <path d="M7 8V6M10 8V6M14 8V6M17 8V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 16v2M10 16v2M14 16v2M17 16v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3 className="text-[18px] font-bold text-[#1a1a2e]">RAM</h3>
        </div>

        {/* جدول RAM */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                <th className="w-[30%] px-4 py-3 text-left text-[14px] font-medium text-[#666666]">
                  RAM size
                </th>
                {laptops.slice(0, 4).map((laptop, idx) => (
                  <th key={idx} className="w-[calc(70%/{laptops.slice(0, 4).length})] px-4 py-3 text-left">
                    <div className="space-y-2">
                      {[16, 32].map((size) => (
                        <label key={size} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name={`ram-${idx}`}
                            checked={selectedRam[idx] === size || (!selectedRam[idx] && ramSpecs[idx]?.size === size)}
                            onChange={() => setSelectedRam({ ...selectedRam, [idx]: size })}
                            className="h-4 w-4 accent-[#1a73e8]"
                          />
                          <span className={`text-[14px] ${
                            selectedRam[idx] === size || (!selectedRam[idx] && ramSpecs[idx]?.size === size)
                              ? "text-[#1a73e8]"
                              : "text-[#333333]"
                          }`}>
                            {size}GB
                          </span>
                        </label>
                      ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Channels */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Channels</td>
                {ramSpecs.map((spec, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-3 text-[14px] text-[#333333] ${
                      ramWinners.size === idx ? "bg-[#d4edda]" : ""
                    }`}
                  >
                    {spec.channels}
                  </td>
                ))}
              </tr>

              {/* Clock */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Clock</td>
                {ramSpecs.map((spec, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-3 text-[14px] text-[#333333] ${
                      ramWinners.clock === idx ? "bg-[#d4edda]" : ""
                    }`}
                  >
                    {spec.clock}
                  </td>
                ))}
              </tr>

              {/* Type */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Type</td>
                {ramSpecs.map((spec, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-3 text-[14px] text-[#333333] ${
                      ramWinners.clock === idx ? "bg-[#d4edda]" : ""
                    }`}
                  >
                    {spec.type}
                  </td>
                ))}
              </tr>

              {/* Upgradable */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Upgradable</td>
                {ramSpecs.map((spec, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-3 text-[14px] text-[#333333] ${
                      ramWinners.upgradable === idx ? "bg-[#d4edda]" : ""
                    }`}
                  >
                    {spec.upgradable}
                  </td>
                ))}
              </tr>

              {/* Total slots */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Total slots</td>
                {ramSpecs.map((spec, idx) => (
                  <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                    {spec.slots}
                  </td>
                ))}
              </tr>

              {/* Max. ram size */}
              <tr>
                <td className="px-4 py-3 text-[14px] text-[#666666]">Max. ram size</td>
                {ramSpecs.map((spec, idx) => (
                  <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                    {spec.maxSize}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* جداکننده بین RAM و Storage */}
      <div className="my-8 border-t-2 border-[#e0e0e0]" />

      {/* بخش Storage */}
      <div>
        {/* هدر Storage */}
        <div className="flex items-center gap-2.5 px-4 py-4">
          <svg className="h-5 w-5 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="2" />
            <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" strokeWidth="2" />
            <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <h3 className="text-[18px] font-bold text-[#1a1a2e]">Storage</h3>
        </div>

        {/* جدول Storage */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                <th className="w-[30%] px-4 py-3 text-left text-[14px] font-medium text-[#666666]">
                  Storage size
                </th>
                {laptops.slice(0, 4).map((laptop, idx) => (
                  <th key={idx} className="px-4 py-3 text-left">
                    <div className="space-y-2">
                      {[256, 512, 1024].map((size) => (
                        <label key={size} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name={`storage-${idx}`}
                            checked={selectedStorage[idx] === size || (!selectedStorage[idx] && storageSpecs[idx]?.size === size)}
                            onChange={() => setSelectedStorage({ ...selectedStorage, [idx]: size })}
                            className="h-4 w-4 accent-[#1a73e8]"
                          />
                          <span className={`text-[14px] ${
                            selectedStorage[idx] === size || (!selectedStorage[idx] && storageSpecs[idx]?.size === size)
                              ? "text-[#1a73e8]"
                              : "text-[#333333]"
                          }`}>
                            {size}GB
                          </span>
                        </label>
                      ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Bus */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Bus</td>
                {storageSpecs.map((spec, idx) => (
                  <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                    {spec.bus}
                  </td>
                ))}
              </tr>

              {/* Storage type */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Storage type</td>
                {storageSpecs.map((spec, idx) => (
                  <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                    {spec.type}
                  </td>
                ))}
              </tr>

              {/* Channels */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Channels</td>
                {storageSpecs.map((spec, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-3 text-[14px] text-[#333333] ${
                      storageWinners.size === idx ? "bg-[#d4edda]" : ""
                    }`}
                  >
                    {spec.channels}
                  </td>
                ))}
              </tr>

              {/* Upgradable */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Upgradable</td>
                {storageSpecs.map((spec, idx) => (
                  <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                    {spec.upgradable}
                  </td>
                ))}
              </tr>

              {/* Total slots */}
              <tr className="border-b border-[#e8e8e8]">
                <td className="px-4 py-3 text-[14px] text-[#666666]">Total slots</td>
                {storageSpecs.map((spec, idx) => (
                  <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                    {spec.slots}
                  </td>
                ))}
              </tr>

              {/* NVMe */}
              <tr>
                <td className="px-4 py-3 text-[14px] text-[#666666]">NVMe</td>
                {storageSpecs.map((spec, idx) => (
                  <td key={idx} className="px-4 py-3 text-[14px] text-[#333333]">
                    {spec.nvme}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
