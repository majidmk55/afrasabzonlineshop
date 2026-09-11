import { type Laptop } from "../data/laptops";

interface BatteryComparisonProps {
  laptops: Laptop[];
}

export default function BatteryComparison({ laptops }: BatteryComparisonProps) {
  // استخراج مقادیر از مشخصات لپ‌تاپ‌ها
  const extractValues = (key: string) => {
    return laptops.map(laptop => {
      const batteryGroup = laptop.specs.find(s => s.title === "باتری و شارژ");
      const portsGroup = laptop.specs.find(s => s.title === "پورت‌ها و اتصالات");
      
      if (key === "capacity") {
        const capacity = batteryGroup?.rows.find(r => r[0] === "ظرفیت باتری")?.[1] ?? "—";
        const match = capacity.match(/(\d+)/);
        return match ? `${match[1]} Wh` : "—";
      }
      if (key === "type") {
        const type = batteryGroup?.rows.find(r => r[0] === "نوع باتری")?.[1] ?? "—";
        if (type.includes("Li-Po") || type.includes("لیتیوم‌پلیمر")) return "Li Po";
        if (type.includes("Li-Ion") || type.includes("لیتیوم‌یون")) return "Li Ion";
        return "—";
      }
      if (key === "replaceable") {
        const type = batteryGroup?.rows.find(r => r[0] === "نوع ماژول رم")?.[1] ?? "";
        return type.includes("لحیم") ? "No" : "Yes";
      }
      if (key === "fastCharging") {
        const charging = batteryGroup?.rows.find(r => r[0] === "شارژ سریع")?.[1] ?? "";
        return charging && charging !== "—" ? "Yes" : "No";
      }
      if (key === "chargingViaUSB") {
        const ports = portsGroup?.rows.find(r => r[0] === "پورت شارژ USB-C")?.[1] ?? "";
        if (!ports || ports === "—") return "No";
        const match = ports.match(/(\d+)\s*وات/);
        if (match) return `Yes, ${match[1]} W`;
        return "Yes";
      }
      if (key === "chargingPortPosition") {
        const position = batteryGroup?.rows.find(r => r[0] === "موقعیت پورت شارژ")?.[1] ?? "";
        if (position.includes("چپ")) return "Left";
        if (position.includes("راست")) return "Right";
        if (position.includes("پشت")) return "Back";
        return "—";
      }
      if (key === "chargePower") {
        const power = batteryGroup?.rows.find(r => r[0] === "توان شارژر")?.[1] ?? "";
        const match = power.match(/(\d+)/);
        return match ? `${match[1]} W` : "—";
      }
      return "—";
    });
  };

  // تعیین بهترین مقدار برای هایلایت
  const getBestValue = (key: string, values: string[]) => {
    if (key === "capacity") {
      // بیشتر بهتر است
      const numericValues = values.map(v => {
        const match = v.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      const max = Math.max(...numericValues);
      return values.map((v, i) => numericValues[i] === max && max > 0);
    }
    if (key === "chargingViaUSB") {
      // "Yes, X W" بهتر از "Yes" است
      const hasPower = values.some(v => v.includes("Yes,") && v.includes("W"));
      if (hasPower) {
        return values.map(v => v.includes("Yes,") && v.includes("W"));
      }
      return values.map(() => false);
    }
    if (key === "chargePower") {
      // بیشتر بهتر است
      const numericValues = values.map(v => {
        const match = v.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      const max = Math.max(...numericValues);
      return values.map((v, i) => numericValues[i] === max && max > 0);
    }
    return values.map(() => false);
  };

  // تعریف ردیف‌ها
  const rows = [
    { label: "Capacity", key: "capacity" },
    { label: "Battery type", key: "type" },
    { label: "Replaceable", key: "replaceable" },
    { label: "Fast charging", key: "fastCharging" },
    { label: "Charging via USB (Power Delivery)", key: "chargingViaUSB" },
    { label: "Charging port position", key: "chargingPortPosition" },
    { label: "Charge power", key: "chargePower" },
  ];

  return (
    <div className="w-full bg-white">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#1a73e8">
          <rect x="2" y="7" width="18" height="10" rx="1" />
          <rect x="20" y="10" width="2" height="4" />
        </svg>
        <span className="text-[18px] font-bold text-[#1a1a2e]">Battery</span>
      </div>

      {/* ردیف‌های جدول */}
      {rows.map((row) => {
        const values = extractValues(row.key);
        const highlights = getBestValue(row.key, values);
        const hasHighlight = highlights.some(h => h);

        return (
          <div
            key={row.label}
            className="grid grid-cols-3 border-b border-[#e8e8e8]"
            style={{ minHeight: "40px" }}
          >
            {/* برچسب */}
            <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
              {row.label}
            </div>

            {/* مقادیر لپ‌تاپ‌ها */}
            {values.map((value, laptopIdx) => (
              <div
                key={laptopIdx}
                className={`col-span-1 flex items-center px-4 py-3 text-[14px] text-[#333333] ${
                  hasHighlight && highlights[laptopIdx] ? "bg-[#d4edda]" : ""
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
