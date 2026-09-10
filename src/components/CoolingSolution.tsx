import { useMemo } from "react";
import { type Laptop } from "../data/laptops";

interface CoolingSolutionProps {
  laptops: Laptop[];
  maxLaptops?: number;
}

// داده‌های پیش‌فرض خنک‌کنندگی برای لپ‌تاپ‌ها
const COOLING_DATA: Record<string, {
  coolingSystem: string;
  vaporChamber: boolean;
  liquidMetal: boolean;
  numberOfFans: number;
  noiseLevel: string | null;
}> = {
  "razer-blade-16": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: true,
    numberOfFans: 2,
    noiseLevel: "48.2 dB",
  },
  "macbook-pro-14": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 2,
    noiseLevel: "41.8 dB",
  },
  "asus-zephyrus-g14": {
    coolingSystem: "Active",
    vaporChamber: true,
    liquidMetal: true,
    numberOfFans: 2,
    noiseLevel: "45.5 dB",
  },
  "thinkpad-x1-carbon": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 1,
    noiseLevel: "39.2 dB",
  },
  "dell-xps-13": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 1,
    noiseLevel: "40.5 dB",
  },
  "msi-prestige-16": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 2,
    noiseLevel: "43.7 dB",
  },
  "framework-16": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 2,
    noiseLevel: "44.1 dB",
  },
  "lg-gram-17": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 1,
    noiseLevel: "38.9 dB",
  },
  "hp-spectre-x360": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 1,
    noiseLevel: "42.3 dB",
  },
  "gigabyte-aorus-17x": {
    coolingSystem: "Active",
    vaporChamber: false,
    liquidMetal: false,
    numberOfFans: 2,
    noiseLevel: "51.9 dB",
  },
};

export default function CoolingSolution({ laptops, maxLaptops = 4 }: CoolingSolutionProps) {
  const selectedLaptops = useMemo(() => {
    return laptops.slice(0, maxLaptops);
  }, [laptops, maxLaptops]);

  // استخراج داده‌های خنک‌کنندگی
  const coolingInfo = useMemo(() => {
    return selectedLaptops.map((laptop) => {
      const data = COOLING_DATA[laptop.id];
      return {
        name: laptop.shortName,
        ...data,
      };
    });
  }, [selectedLaptops]);

  // محاسبه برنده‌ها
  const winners = useMemo(() => {
    const maxFans = Math.max(...coolingInfo.map((l) => l.numberOfFans));
    const validNoiseLevels = coolingInfo
      .map((l, i) => ({ level: l.noiseLevel, index: i }))
      .filter((l) => l.level !== null);
    const minNoise =
      validNoiseLevels.length > 0
        ? Math.min(...validNoiseLevels.map((l) => parseFloat(l.level!)))
        : null;

    return {
      vaporChamber: coolingInfo.map((l) => l.vaporChamber),
      liquidMetal: coolingInfo.map((l) => l.liquidMetal),
      numberOfFans: coolingInfo.map((l) => l.numberOfFans === maxFans),
      noiseLevel: coolingInfo.map((l, i) => {
        if (l.noiseLevel === null) return false;
        return parseFloat(l.noiseLevel) === minNoise;
      }),
    };
  }, [coolingInfo]);

  const formatValue = (value: any, isBoolean = false): string => {
    if (value === null || value === undefined) return "-";
    if (isBoolean) return value ? "Yes" : "No";
    return value;
  };

  const rows = [
    {
      label: "سیستم خنک‌کنندگی",
      key: "coolingSystem",
      isBoolean: false,
      hasWinner: false,
    },
    {
      label: "محفظه بخار",
      key: "vaporChamber",
      isBoolean: true,
      hasWinner: true,
      winnerKey: "vaporChamber",
    },
    {
      label: "فلز مایع",
      key: "liquidMetal",
      isBoolean: true,
      hasWinner: true,
      winnerKey: "liquidMetal",
    },
    {
      label: "تعداد فن‌ها",
      key: "numberOfFans",
      isBoolean: false,
      hasWinner: true,
      winnerKey: "numberOfFans",
    },
    {
      label: "سطح نویز (حداکثر بار)",
      key: "noiseLevel",
      isBoolean: false,
      hasWinner: true,
      winnerKey: "noiseLevel",
    },
  ];

  if (coolingInfo.length < 2) return null;

  return (
    <div className="mx-auto w-full max-w-[1200px] rounded-b-xl border-t border-[#e5e7eb] bg-white px-8 pb-7 pt-6">
      {/* هدر */}
      <div className="mb-5 flex items-center border-b border-[#f3f4f6] pb-3">
        <div className="mr-2 h-3.5 w-3.5 flex-shrink-0 rounded-sm bg-[#818cf8]" />
        <h3 className="text-[17px] font-bold tracking-tight text-[#111827]">
          راه حل خنک‌کنندگی
        </h3>
      </div>

      {/* جدول */}
      <div className="flex flex-col">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid border-b border-[#f3f4f6] last:border-b-0"
            style={{
              gridTemplateColumns: `200px repeat(${coolingInfo.length}, 1fr)`,
            }}
          >
            {/* برچسب */}
            <div className="flex items-center bg-white px-0 py-3.5 text-[13.5px] font-medium text-[#4b5563]">
              {row.label}
            </div>

            {/* مقادیر */}
            {coolingInfo.map((item, laptopIdx) => {
              const value = (item as any)[row.key];
              const isWinner = row.hasWinner && row.winnerKey && (winners as any)[row.winnerKey][laptopIdx];
              const isDash = value === null || value === undefined;

              return (
                <div
                  key={laptopIdx}
                  className={`flex items-center px-4 py-3.5 text-[13.5px] ${
                    isWinner
                      ? "relative bg-[#ecfdf5] font-medium text-[#1f2937]"
                      : isDash
                      ? "bg-white text-[#9ca3af]"
                      : "bg-white font-normal text-[#374151]"
                  }`}
                >
                  {isWinner && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[2px] bg-[#10b981]" />
                  )}
                  {formatValue(value, row.isBoolean)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
