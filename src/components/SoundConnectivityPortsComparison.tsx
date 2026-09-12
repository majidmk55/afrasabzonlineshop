import { useMemo } from "react";
import { type Laptop } from "../data/laptops";

interface SoundConnectivityPortsComparisonProps {
  laptops: Laptop[];
}

// استخراج مشخصات صدا
function extractSoundSpecs(laptop: Laptop) {
  const soundGroup = laptop.specs.find(s => s.title === "صدا");
  if (!soundGroup) return { speakers: "—", dolby: "—", loudness: "—", mics: "—" };

  const getValue = (key: string) => soundGroup.rows.find(r => r[0] === key)?.[1] || "—";

  return {
    speakers: getValue("سیستم صوتی") || getValue("تعداد بلندگوهای داخلی"),
    dolby: getValue("Dolby Atmos") || getValue("DTS") || "—",
    loudness: getValue("بلندگی") || "—",
    mics: getValue("تعداد میکروفون") || getValue("میکروفون") || "—",
  };
}

// استخراج مشخصات اتصالات
function extractConnectivitySpecs(laptop: Laptop) {
  const networkGroup = laptop.specs.find(s => s.title === "شبکه");
  const portsGroup = laptop.specs.find(s => s.title === "پورت‌ها و اتصالات");
  
  if (!networkGroup && !portsGroup) return { wifi: "—", bluetooth: "—", fingerprint: "—", ir: "—", optical: "—", webcam: "—", webcamRes: "—" };

  const getNetworkValue = (key: string) => networkGroup?.rows.find(r => r[0] === key)?.[1] || "—";
  const getPortsValue = (key: string) => portsGroup?.rows.find(r => r[0] === key)?.[1] || "—";

  return {
    wifi: getNetworkValue("بالاترین استاندارد Wi-Fi") || "—",
    bluetooth: getNetworkValue("بلوتوث") || "—",
    fingerprint: getPortsValue("اثر انگشت") || "—",
    ir: getPortsValue("مادون قرمز") || "—",
    optical: getPortsValue("درایو نوری") || "No",
    webcam: getPortsValue("وب‌کم") || "—",
    webcamRes: getPortsValue("رزولوشن وب‌کم") || "—",
  };
}

// استخراج مشخصات پورت‌ها
function extractPortsSpecs(laptop: Laptop) {
  const portsGroup = laptop.specs.find(s => s.title === "پورت‌ها و اتصالات");
  if (!portsGroup) return { usbA: "—", usbC: "—", thunderbolt: "—", hdmi: "—", dp: "—", vga: "—", audio: "—", ethernet: "—", sd: "—", charging: "—" };

  const getValue = (key: string) => portsGroup.rows.find(r => r[0] === key)?.[1] || "—";

  return {
    usbA: getValue("USB-A") || getValue("تعداد USB-A") || "—",
    usbC: getValue("USB-C") || getValue("تعداد USB-C") || "—",
    thunderbolt: getValue("Thunderbolt") || getValue("تعداد Thunderbolt") || "—",
    hdmi: getValue("HDMI") || getValue("تعداد HDMI") || "—",
    dp: getValue("DisplayPort") || getValue("تعداد DisplayPort") || "—",
    vga: getValue("VGA") || getValue("تعداد VGA") || "No",
    audio: getValue("جک صدا") || getValue("جک 3.5") || "—",
    ethernet: getValue("Ethernet") || getValue("RJ45") || getValue("اتصال اترنت") || "—",
    sd: getValue("SD Card") || getValue("کارت‌خوان") || getValue("SD") || "—",
    charging: getValue("پورت شارژ") || getValue("شارژ") || "—",
  };
}

// تعیین برنده برای مقادیر عددی
function getWinner(values: string[], compareFn: (a: string, b: string) => number): number[] {
  if (values.length < 2) return [];
  
  let bestValue = values[0];
  let bestIndices: number[] = [0];
  
  for (let i = 1; i < values.length; i++) {
    const cmp = compareFn(values[i], bestValue);
    if (cmp > 0) {
      bestValue = values[i];
      bestIndices = [i];
    } else if (cmp === 0) {
      bestIndices.push(i);
    }
  }
  
  // اگر همه مقادیر یکسان باشند، برنده‌ای نیست
  if (bestIndices.length === values.length) return [];
  return bestIndices;
}

// مقایسه نسخه‌های USB
function compareUsb(a: string, b: string): number {
  const getVersion = (s: string) => {
    const match = s.match(/(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };
  return getVersion(a) - getVersion(b);
}

// مقایسه نسخه‌های HDMI
function compareHdmi(a: string, b: string): number {
  const getVersion = (s: string) => {
    const match = s.match(/(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };
  return getVersion(a) - getVersion(b);
}

// مقایسه Thunderbolt
function compareThunderbolt(a: string, b: string): number {
  const getVersion = (s: string) => {
    const match = s.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };
  return getVersion(a) - getVersion(b);
}

// مقایسه تعداد پورت
function compareCount(a: string, b: string): number {
  const getCount = (s: string) => {
    const match = s.match(/(\d+)x/);
    return match ? parseInt(match[1]) : (s === "Yes" ? 1 : (s === "No" ? 0 : 0));
  };
  return getCount(a) - getCount(b);
}

// مقایسه وجود ویژگی
function comparePresence(a: string, b: string): number {
  const hasFeature = (s: string) => (s === "Yes" || s === "بله") ? 1 : 0;
  return hasFeature(a) - hasFeature(b);
}

export default function SoundConnectivityPortsComparison({ laptops }: SoundConnectivityPortsComparisonProps) {
  // استخراج مشخصات برای همه لپ‌تاپ‌ها
  const soundSpecs = useMemo(() => laptops.map(l => extractSoundSpecs(l)), [laptops]);
  const connectivitySpecs = useMemo(() => laptops.map(l => extractConnectivitySpecs(l)), [laptops]);
  const portsSpecs = useMemo(() => laptops.map(l => extractPortsSpecs(l)), [laptops]);

  // تعیین برنده‌ها برای Sound
  const soundWinners = useMemo(() => ({
    speakers: getWinner(soundSpecs.map(s => s.speakers), (a, b) => {
      const getScore = (s: string) => {
        if (s.includes("2.2")) return 3;
        if (s.includes("2.1")) return 2;
        if (s.includes("2.0")) return 1;
        return 0;
      };
      return getScore(a) - getScore(b);
    }),
    dolby: getWinner(soundSpecs.map(s => s.dolby), comparePresence),
    loudness: getWinner(soundSpecs.map(s => s.loudness), (a, b) => {
      const getDb = (s: string) => {
        const match = s.match(/-?(\d+\.?\d*)/);
        return match ? -parseFloat(match[1]) : 0; // منفی چون dB کمتر بهتر است
      };
      return getDb(a) - getDb(b);
    }),
    mics: getWinner(soundSpecs.map(s => s.mics), (a, b) => parseInt(a) - parseInt(b)),
  }), [soundSpecs]);

  // تعیین برنده‌ها برای Connectivity
  const connectivityWinners = useMemo(() => ({
    ir: getWinner(connectivitySpecs.map(s => s.ir), comparePresence),
  }), [connectivitySpecs]);

  // تعیین برنده‌ها برای Ports
  const portsWinners = useMemo(() => ({
    usbA: getWinner(portsSpecs.map(s => s.usbA), compareCount),
    usbC: getWinner(portsSpecs.map(s => s.usbC), compareUsb),
    thunderbolt: getWinner(portsSpecs.map(s => s.thunderbolt), compareThunderbolt),
    hdmi: getWinner(portsSpecs.map(s => s.hdmi), compareHdmi),
    ethernet: getWinner(portsSpecs.map(s => s.ethernet), comparePresence),
    sd: getWinner(portsSpecs.map(s => s.sd), comparePresence),
    charging: getWinner(portsSpecs.map(s => s.charging), comparePresence),
  }), [portsSpecs]);

  const isWinner = (winners: number[], index: number) => winners.includes(index);

  return (
    <div className="w-full bg-white">
      {/* بخش Sound */}
      <div>
        <div className="flex items-center gap-2 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <span className="text-lg font-bold text-[#1a1a2e]">Sound</span>
        </div>
        <div className="grid grid-cols-5">
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Speakers</div>
          {soundSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(soundWinners.speakers, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.speakers}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Dolby Atmos</div>
          {soundSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(soundWinners.dolby, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.dolby}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Loudness</div>
          {soundSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(soundWinners.loudness, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.loudness}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Microphones</div>
          {soundSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(soundWinners.mics, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.mics}
            </div>
          ))}
        </div>
      </div>

      {/* بخش Connectivity */}
      <div className="mt-8">
        <div className="flex items-center gap-2 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8">
            <path d="M14.88 16.29L13.47 17.7l2.58 2.58-4.58 4.59-4.59-4.59 2.58-2.58-1.41-1.41 6-6 1.41 1.41-4.59 4.59 2.58 2.58 4.59-4.59-1.41-1.41-6 6z"/>
          </svg>
          <span className="text-lg font-bold text-[#1a1a2e]">Connectivity</span>
        </div>
        <div className="grid grid-cols-5">
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Wi-Fi standard</div>
          {connectivitySpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.wifi}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Bluetooth</div>
          {connectivitySpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.bluetooth}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Fingerprint</div>
          {connectivitySpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.fingerprint}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Infrared sensor</div>
          {connectivitySpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(connectivityWinners.ir, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.ir}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Optical drive</div>
          {connectivitySpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.optical}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Webcam</div>
          {connectivitySpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.webcam}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Webcam resolution</div>
          {connectivitySpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.webcamRes}
            </div>
          ))}
        </div>
      </div>

      {/* بخش Ports */}
      <div className="mt-8">
        <div className="flex items-center gap-2 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-lg font-bold text-[#1a1a2e]">Ports</span>
        </div>
        <div className="grid grid-cols-5">
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">USB-A</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(portsWinners.usbA, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.usbA}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">USB Type-C</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(portsWinners.usbC, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.usbC}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Thunderbolt</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(portsWinners.thunderbolt, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.thunderbolt}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">HDMI</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(portsWinners.hdmi, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.hdmi}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">DisplayPort</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.dp}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">VGA</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.vga}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Audio jack (3.5 mm)</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333]">
              {spec.audio}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Ethernet (RJ45)</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(portsWinners.ethernet, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.ethernet}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">SD card reader</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(portsWinners.sd, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.sd}
            </div>
          ))}
          <div className="border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#666666]">Proprietary charging port</div>
          {portsSpecs.map((spec, idx) => (
            <div key={idx} className={`border-b border-[#e8e8e8] px-3 py-3 text-sm text-[#333333] ${isWinner(portsWinners.charging, idx) ? "bg-[#d4edda]" : ""}`}>
              {spec.charging}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
