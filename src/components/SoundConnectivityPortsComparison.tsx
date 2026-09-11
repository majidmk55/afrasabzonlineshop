import { type Laptop } from "../data/laptops";

interface SoundConnectivityPortsComparisonProps {
  laptops: Laptop[];
}

export default function SoundConnectivityPortsComparison({ laptops }: SoundConnectivityPortsComparisonProps) {
  // استخراج مقادیر از مشخصات لپ‌تاپ‌ها
  const extractValues = (key: string) => {
    return laptops.map(laptop => {
      // جستجو در بخش‌های مختلف
      const audioGroup = laptop.specs.find(s => s.title === "صدا");
      const portsGroup = laptop.specs.find(s => s.title === "پورت‌ها و اتصالات");
      const networkGroup = laptop.specs.find(s => s.title === "شبکه");
      
      if (key === "speakers") {
        return audioGroup?.rows.find(r => r[0] === "تعداد بلندگوهای داخلی")?.[1] ?? "—";
      }
      if (key === "dolby") {
        const audio = audioGroup?.rows.find(r => r[0] === "سیستم صوتی")?.[1] ?? "";
        return audio.includes("Dolby") ? "Yes" : "No";
      }
      if (key === "loudness") {
        return "—"; // داده موجود نیست
      }
      if (key === "microphones") {
        return audioGroup?.rows.find(r => r[0] === "میکروفون داخلی")?.[1] ?? "—";
      }
      if (key === "wifi") {
        return networkGroup?.rows.find(r => r[0] === "بالاترین استاندارد Wi-Fi")?.[1] ?? "—";
      }
      if (key === "bluetooth") {
        return networkGroup?.rows.find(r => r[0] === "بلوتوث")?.[1] ?? "—";
      }
      if (key === "fingerprint") {
        const security = laptop.specs.find(s => s.title === "امنیت");
        const hasFingerprint = security?.rows.find(r => r[0] === "حسگر اثر انگشت")?.[1];
        if (!hasFingerprint || hasFingerprint === "—") return "No";
        if (hasFingerprint.includes("اختیاری")) return "Optional";
        return "Yes";
      }
      if (key === "infrared") {
        const camera = laptop.specs.find(s => s.title === "دوربین");
        const hasIR = camera?.rows.find(r => r[0] === "دوربین مادون قرمز")?.[1];
        return hasIR && hasIR !== "—" && hasIR !== "ندارد" ? "Yes" : "No";
      }
      if (key === "optical") {
        return "No";
      }
      if (key === "webcam") {
        const camera = laptop.specs.find(s => s.title === "دوربین");
        const webcam = camera?.rows.find(r => r[0] === "دوربین جلو")?.[1];
        if (!webcam || webcam === "—") return "—";
        return webcam.includes("بالا") ? "Above the display" : webcam;
      }
      if (key === "webcamRes") {
        const camera = laptop.specs.find(s => s.title === "دوربین");
        const res = camera?.rows.find(r => r[0] === "رزولوشن دوربین")?.[1];
        if (!res || res === "—") return "—";
        // استخراج اعداد
        const match = res.match(/(\d+)\s*[xX×]\s*(\d+)/);
        if (match) return `${match[1]} x ${match[2]}`;
        return "1920 x 1080";
      }
      if (key === "usbA") {
        const ports = portsGroup?.rows.find(r => r[0] === "تعداد USB-A 3.2");
        if (!ports || ports[1] === "—") return "No";
        const match = ports[1].match(/(\d+)/);
        if (match) return `${match[1]}x USB 3.2`;
        return "No";
      }
      if (key === "usbC") {
        const ports = portsGroup?.rows.find(r => r[0] === "تعداد USB-C");
        if (!ports || ports[1] === "—") return "No";
        const match = ports[1].match(/(\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          // بررسی نسخه USB
          const version = ports[1].includes("4.0") ? "4.0" : ports[1].includes("3.2") ? "3.2" : "3.2";
          return `${num}x USB ${version}`;
        }
        return "No";
      }
      if (key === "thunderbolt") {
        const ports = portsGroup?.rows.find(r => r[0] === "تعداد Thunderbolt 4 (USB-C)");
        if (!ports || ports[1] === "—") {
          // بررسی Thunderbolt 3
          const tb3 = portsGroup?.rows.find(r => r[0] === "تعداد Thunderbolt 3 (USB-C)");
          if (tb3 && tb3[1] !== "—") {
            const match = tb3[1].match(/(\d+)/);
            if (match) return `Thunderbolt 3`;
          }
          return "No";
        }
        return "Thunderbolt 4";
      }
      if (key === "hdmi") {
        const ports = portsGroup?.rows.find(r => r[0] === "تعداد پورت HDMI");
        if (!ports || ports[1] === "—") return "No";
        const match = ports[1].match(/(\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          const version = ports[1].includes("2.1") ? "2.1" : ports[1].includes("2.0") ? "2.0" : "2.0";
          return `${num}x HDMI ${version}`;
        }
        return "No";
      }
      if (key === "displayPort") {
        return "No";
      }
      if (key === "vga") {
        return "No";
      }
      if (key === "audioJack") {
        const ports = portsGroup?.rows.find(r => r[0] === "جک ترکیبی هدفون/میکروفون");
        return ports && ports[1] !== "—" ? "Yes" : "Yes";
      }
      if (key === "ethernet") {
        const ports = portsGroup?.rows.find(r => r[0] === "پورت اترنت RJ-45");
        return ports && ports[1] !== "—" && ports[1] !== "ندارد" ? "Yes" : "No";
      }
      if (key === "sdCard") {
        const ports = portsGroup?.rows.find(r => r[0] === "کارت‌خوان");
        return ports && ports[1] !== "—" && ports[1] !== "ندارد" ? "Yes" : "No";
      }
      if (key === "chargingPort") {
        const ports = portsGroup?.rows.find(r => r[0] === "پورت شارژ اختصاصی");
        return ports && ports[1] !== "—" && ports[1] !== "ندارد" ? "Yes" : "No";
      }
      return "—";
    });
  };

  // تعیین بهترین مقدار برای هایلایت
  const getBestValue = (key: string, values: string[]) => {
    if (key === "speakers") {
      // بیشتر بهتر است: 2.2 > 2.1 > 2.0
      const numericValues = values.map(v => {
        const match = v.match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
      });
      const max = Math.max(...numericValues);
      return values.map((v, i) => numericValues[i] === max && max > 0);
    }
    if (key === "dolby" || key === "infrared" || key === "ethernet" || key === "sdCard" || key === "chargingPort") {
      // Yes بهتر است
      const hasYes = values.includes("Yes");
      return values.map(v => hasYes && v === "Yes");
    }
    if (key === "loudness") {
      // کمتر بهتر است (منفی)
      const numericValues = values.map(v => {
        const match = v.match(/-?(\d+(?:\.\d+)?)/);
        return match ? -parseFloat(match[1]) : 0;
      });
      const max = Math.max(...numericValues);
      return values.map((v, i) => numericValues[i] === max && max > 0);
    }
    if (key === "microphones") {
      // بیشتر بهتر است
      const numericValues = values.map(v => {
        const match = v.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      const max = Math.max(...numericValues);
      return values.map((v, i) => numericValues[i] === max && max > 0);
    }
    if (key === "usbA" || key === "usbC") {
      // بیشتر بهتر است
      const numericValues = values.map(v => {
        const match = v.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      const max = Math.max(...numericValues);
      return values.map((v, i) => numericValues[i] === max && max > 0);
    }
    if (key === "thunderbolt") {
      // Thunderbolt 4 بهتر از Thunderbolt 3
      const has4 = values.includes("Thunderbolt 4");
      if (has4) return values.map(v => v === "Thunderbolt 4");
      const has3 = values.includes("Thunderbolt 3");
      if (has3) return values.map(v => v === "Thunderbolt 3");
      return values.map(() => false);
    }
    if (key === "hdmi") {
      // HDMI 2.1 بهتر از HDMI 2.0
      const has21 = values.some(v => v.includes("2.1"));
      if (has21) return values.map(v => v.includes("2.1"));
      const has20 = values.some(v => v.includes("2.0"));
      if (has20) return values.map(v => v.includes("2.0"));
      return values.map(() => false);
    }
    return values.map(() => false);
  };

  // تعریف بخش‌ها
  const sections = [
    {
      title: "Sound",
      icon: "speaker",
      rows: [
        { label: "Speakers", key: "speakers" },
        { label: "Dolby Atmos", key: "dolby" },
        { label: "Loudness", key: "loudness" },
        { label: "Microphones", key: "microphones" },
      ],
    },
    {
      title: "Connectivity",
      icon: "bluetooth",
      rows: [
        { label: "Wi-Fi standard", key: "wifi" },
        { label: "Bluetooth", key: "bluetooth" },
        { label: "Fingerprint", key: "fingerprint" },
        { label: "Infrared sensor", key: "infrared" },
        { label: "Optical drive", key: "optical" },
        { label: "Webcam", key: "webcam" },
        { label: "Webcam resolution", key: "webcamRes" },
      ],
    },
    {
      title: "Ports",
      icon: "port",
      rows: [
        { label: "USB-A", key: "usbA" },
        { label: "USB Type-C", key: "usbC" },
        { label: "Thunderbolt", key: "thunderbolt" },
        { label: "HDMI", key: "hdmi" },
        { label: "DisplayPort", key: "displayPort" },
        { label: "VGA", key: "vga" },
        { label: "Audio jack (3.5 mm)", key: "audioJack" },
        { label: "Ethernet (RJ45)", key: "ethernet" },
        { label: "SD card reader", key: "sdCard" },
        { label: "Proprietary charging port", key: "chargingPort" },
      ],
    },
  ];

  return (
    <div className="w-full bg-white">
      {sections.map((section, sectionIdx) => (
        <div key={section.title}>
          {/* هدر بخش */}
          <div className="flex items-center gap-2.5 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
            <SectionIcon type={section.icon} />
            <span className="text-[18px] font-bold text-[#1a1a2e]">{section.title}</span>
          </div>

          {/* ردیف‌های جدول */}
          {section.rows.map((row, rowIdx) => {
            const values = extractValues(row.key);
            const highlights = getBestValue(row.key, values);
            const hasHighlight = highlights.some(h => h);

            return (
              <div
                key={row.label}
                className="grid grid-cols-5 border-b border-[#e8e8e8]"
                style={{ minHeight: "40px" }}
              >
                {/* برچسب */}
                <div className="col-span-1 flex items-center px-3 py-3 text-[14px] text-[#666666]">
                  {row.label}
                </div>

                {/* مقادیر لپ‌تاپ‌ها */}
                {values.map((value, laptopIdx) => (
                  <div
                    key={laptopIdx}
                    className={`col-span-1 flex items-center px-3 py-3 text-[14px] text-[#333333] ${
                      hasHighlight && highlights[laptopIdx] ? "bg-[#d4edda]" : ""
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            );
          })}

          {/* جداکننده بین بخش‌ها */}
          {sectionIdx < sections.length - 1 && (
            <div className="h-8 border-b-2 border-[#e0e0e0]" />
          )}
        </div>
      ))}
    </div>
  );
}

function SectionIcon({ type }: { type: string }) {
  const iconSize = 20;

  switch (type) {
    case "speaker":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#1a73e8" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      );
    case "bluetooth":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
        </svg>
      );
    case "port":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="9" width="16" height="6" rx="1" />
          <path d="M8 9V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="8" y1="12" x2="8" y2="12" />
          <line x1="12" y1="12" x2="12" y2="12" />
          <line x1="16" y1="12" x2="16" y2="12" />
        </svg>
      );
    default:
      return null;
  }
}
