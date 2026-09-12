import { type Laptop } from "../data/laptops";

interface BatteryComparisonProps {
  laptops: Laptop[];
}

export default function BatteryComparison({ laptops }: BatteryComparisonProps) {
  // استخراج مقادیر از مشخصات لپ‌تاپ‌ها
  const extractValues = (key: string) => {
    return laptops.map(laptop => {
      const batteryGroup = laptop.specs.find(s => s.title === "باتری و شارژ");
      
      if (key === "capacity") {
        return batteryGroup?.rows.find(r => r[0] === "ظرفیت باتری")?.[1] ?? "—";
      }
      if (key === "type") {
        const type = batteryGroup?.rows.find(r => r[0] === "نوع باتری")?.[1] ?? "";
        if (type.includes("Li-Po") || type.includes("لیتیوم پلیمر")) return "Li Po";
        if (type.includes("Li-Ion") || type.includes("لیتیوم یون")) return "Li Ion";
        return "—";
      }
      if (key === "replaceable") {
        const replaceable = batteryGroup?.rows.find(r => r[0] === "قابلیت تعویض")?.[1];
        return replaceable && (replaceable === "بله" || replaceable.includes("قابل")) ? "Yes" : "No";
      }
      if (key === "fastCharging") {
        const fast = batteryGroup?.rows.find(r => r[0] === "شارژ سریع")?.[1];
        return fast && fast === "بله" ? "Yes" : "No";
      }
      if (key === "chargingViaUSB") {
        const usb = batteryGroup?.rows.find(r => r[0] === "شارژ از طریق USB")?.[1];
        if (!usb || usb === "—") return "No";
        // استخراج توان
        const match = usb.match(/(\d+)\s*وات/);
        if (match) return `Yes, ${match[1]} W`;
        return "Yes";
      }
      if (key === "chargingPortPosition") {
        const position = batteryGroup?.rows.find(r => r[0] === "موقعیت پورت شارژ")?.[1];
        if (!position || position === "—") return "—";
        if (position.includes("چپ") || position.includes("Left")) return "Left";
        if (position.includes("راست") || position.includes("Right")) return "Right";
        return "—";
      }
      if (key === "chargePower") {
        const power = batteryGroup?.rows.find(r => r[0] === "توان شارژ")?.[1];
        if (!power || power === "—") return "—";
        const match = power.match(/(\d+)\s*وات/);
        if (match) return `${match[1]} W`;
        return "—";
      }
      return "—";
    });
  };

  // تعیین بهترین مقدار برای هایلایت
  const getBestValue = (key: string, values: string[]) => {
    if (key === "chargingViaUSB") {
      // "Yes, 100 W" بهتر از "Yes" است
      const hasPower = values.some(v => v.includes("Yes,"));
      if (hasPower) {
        return values.map(v => v.includes("Yes,"));
      }
      return values.map(() => false);
    }
    if (key === "chargePower") {
      // توان بیشتر بهتر است
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
    { label: "Capacity", key: "capacity", isSelector: true },
    { label: "Battery type", key: "type" },
    { label: "Replaceable", key: "replaceable" },
    { label: "Fast charging", key: "fastCharging" },
    { label: "Charging via USB (Power\nDelivery)", key: "chargingViaUSB" },
    { label: "Charging port position", key: "chargingPortPosition" },
    { label: "Charge power", key: "chargePower" },
  ];

  return (
    <div className="w-full bg-white">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="18" height="10" rx="1" fill="#1a73e8" />
          <rect x="20" y="10" width="2" height="4" fill="#1a73e8" />
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
            <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666] whitespace-pre-line">
              {row.label}
            </div>

            {/* مقادیر لپ‌تاپ‌ها */}
            {values.map((value, laptopIdx) => (
              <div
                key={laptopIdx}
                className={`col-span-1 flex items-center px-4 py-3 text-[14px] ${
                  hasHighlight && highlights[laptopIdx] 
                    ? "bg-[#d4edda] text-[#333333]" 
                    : row.isSelector 
                    ? "text-[#1a73e8]"
                    : "text-[#333333]"
                }`}
              >
                {row.isSelector && (
                  <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a73e8]">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                )}
                {value}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
