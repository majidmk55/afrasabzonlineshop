export type SpecIcon = "cpu" | "gpu" | "ram" | "display" | "wifi" | "battery" | "scale" | "shield";

export interface SpecGroup {
  title: string;
  icon: SpecIcon;
  rows: [string, string][];
}

export interface Laptop {
  id: string;
  sku: string;
  name: string;
  shortName: string;
  brand: string;
  series: string;
  category: string;
  year: number;
  price: number; // ریال
  oldPrice?: number;
  stock: number;
  rating: number;
  reviews: number;
  image: string;
  tagline: string;
  highlights: string[];
  brief: [string, string][];
  specs: SpecGroup[];
  inBox: string[];
}

export interface CartLine {
  laptop: Laptop;
  qty: number;
  warranty: boolean;
}

/* ---------- constants ---------- */

export const FREE_SHIPPING_THRESHOLD = 150_000_000;
export const SHIPPING_FLAT = 1_500_000;
export const WARRANTY_PRICE = 9_500_000;
export const TAX_RATE = 0.1;
export const PROMOS: Record<string, { pct?: number; freeShip?: boolean }> = {
  CORE10: { pct: 10 },
  RAYEGAN: { freeShip: true },
};

export const CATEGORIES = ["گیمینگ", "خلاقیت و رندر", "بیزنس و اداری", "اولترابوک"];
export const BRANDS = ["ایسوس", "اپل", "لنوو", "دل", "ریزر", "ام‌اس‌آی", "فریم‌ورک", "ال‌جی", "اچ‌پی", "گیگابایت"];

const IMG = {
  pro14: "https://image.qwenlm.ai/generated-images/8dd519b5-f437-4086-9c54-c5ccd27c1919/_result.png",
  thinkpad: "https://image.qwenlm.ai/generated-images/71449d80-a863-4702-8155-1b614caec9bb/_result.png",
  xps13: "https://image.qwenlm.ai/generated-images/4a3cc636-1ba3-4965-9218-aa5abc272010/_result.png",
  blade16: "https://image.qwenlm.ai/generated-images/22d2b52b-b71b-46ad-9b5b-b039b0470b06/_result.png",
  g14: "https://image.qwenlm.ai/generated-images/71449d80-a863-4702-8155-1b614caec9bb/_result.png",
  prestige16: "https://image.qwenlm.ai/generated-images/c9ffa312-56ee-45c2-bc4c-009641d97292/_result.png",
  framework16: "https://image.qwenlm.ai/generated-images/cc227e49-7661-4fed-8b02-c7887669a30d/_result.png",
  gram17: "https://image.qwenlm.ai/generated-images/e064a396-6a12-46c5-a44b-005876bc7f3e/_result.png",
  spectre14: "https://image.qwenlm.ai/generated-images/22705440-bebe-468c-8245-42a01bce3d4c/_result.png",
  aorus17: "https://image.qwenlm.ai/generated-images/248160ed-9015-41f2-9152-87181460597d/_result.png",
};

const CPU = (rows: [string, string][]): SpecGroup => ({ title: "پردازنده (CPU)", icon: "cpu", rows });
const GPU = (rows: [string, string][]): SpecGroup => ({ title: "کارت گرافیک (GPU)", icon: "gpu", rows });
const MEM = (rows: [string, string][]): SpecGroup => ({ title: "حافظه و ذخیره‌سازی", icon: "ram", rows });
const DISPLAY = (rows: [string, string][]): SpecGroup => ({ title: "نمایشگر", icon: "display", rows });
const PORTS = (rows: [string, string][]): SpecGroup => ({ title: "اتصالات و پورت‌ها", icon: "wifi", rows });
const BATTERY = (rows: [string, string][]): SpecGroup => ({ title: "باتری و شارژ", icon: "battery", rows });
const BUILD = (rows: [string, string][]): SpecGroup => ({ title: "بدنه و طراحی", icon: "scale", rows });
const SOFT = (rows: [string, string][]): SpecGroup => ({ title: "نرم‌افزار و گارانتی", icon: "shield", rows });

/* ---------- products ---------- */

export const LAPTOPS: Laptop[] = [
  {
    id: "razer-blade-16",
    sku: "CH-RZ16-5090",
    name: "لپ‌تاپ ریزر Blade 16 (2025)",
    shortName: "Blade 16",
    brand: "ریزر",
    series: "Blade",
    category: "گیمینگ",
    year: 2025,
    price: 248_000_000,
    oldPrice: 268_000_000,
    stock: 3,
    rating: 4.8,
    reviews: 187,
    image: IMG.blade16,
    tagline: "پرچم‌دار شاسی CNC با قوی‌ترین گرافیک بازار؛ هم برای فریم‌ریت، هم برای پرستیژ.",
    highlights: ["RTX 5090 · 175W", "OLED 240Hz", "Core Ultra 9 275HX", "شاسی آلومینیوم CNC"],
    brief: [
      ["پردازنده", "Intel Core Ultra 9 275HX"],
      ["گرافیک", "NVIDIA RTX 5090 · 24GB"],
      ["رم / حافظه", "32GB DDR5 / 2TB SSD"],
      ["نمایشگر", "16\" OLED QHD+ 240Hz"],
      ["وزن", "۲.۴۵ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "Intel Core Ultra 9 275HX"],
        ["هسته / رشته", "۲۴ هسته (۸ عملکردی + ۱۶ کم‌مصرف) / ۲۴ رشته"],
        ["حداکثر فرکانس بوست", "5.4 گیگاهرتز"],
        ["حافظه کش", "36MB Intel Smart Cache"],
        ["توان مصرفی", "PL2 تا 160 وات"],
        ["واحد هوش مصنوعی", "NPU داخلی نسل چهارم"],
      ]),
      GPU([
        ["مدل", "NVIDIA GeForce RTX 5090 لپ‌تاپ"],
        ["معماری", "Blackwell"],
        ["حافظه ویدیویی", "24GB GDDR7"],
        ["توان گرافیکی (TGP)", "175 وات با Dynamic Boost"],
        ["فناوری‌ها", "DLSS 4 · Ray Tracing · Reflex 2 · AV1"],
      ]),
      MEM([
        ["حافظه رم", "32GB DDR5-5600 (دو کاناله)"],
        ["قابلیت ارتقا", "تا 96GB (دو اسلات SO-DIMM)"],
        ["حافظه داخلی", "2TB NVMe PCIe Gen5"],
        ["اسلات M.2", "دو اسلات (Gen5 + Gen4)"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "16 اینچ OLED"],
        ["رزولوشن", "2560×1600 (QHD+)"],
        ["نرخ نوسازی", "240 هرتز با G-Sync"],
        ["روشنایی", "500 نیت اوج"],
        ["پوشش رنگ", "100% DCI-P3"],
        ["زمان پاسخ", "0.2 میلی‌ثانیه"],
      ]),
      PORTS([
        ["پورت‌ها", "3× USB-C (Thunderbolt 5) · 2× USB-A 3.2 · HDMI 2.1 · جک صدا"],
        ["بی‌سیم", "Wi-Fi 7 · Bluetooth 5.4"],
        ["وب‌کم", "5MP با مادون‌قرمز (Windows Hello)"],
        ["امنیت", "TPM 2.0 · شاتر وب‌کم"],
      ]),
      BATTERY([
        ["ظرفیت", "90Wh لیتیوم‌پلیمر"],
        ["آداپتور", "330 وات GaN"],
        ["شارژ USB-C", "تا 140 وات"],
        ["عمر شارژ (تست کورهِوس)", "۷ ساعت وب‌گردی"],
      ]),
      BUILD([
        ["جنس بدنه", "آلومینیوم CNC یکپارچه"],
        ["ابعاد", "355 × 244 × 16.9 میلی‌متر"],
        ["وزن", "2.45 کیلوگرم"],
        ["کیبورد", "بک‌لایت RGB تک‌کلیدی"],
        ["رنگ", "مشکی مات ضدلک"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Home (لایسنس اورجینال)"],
        ["نرم‌افزار همراه", "Razer Synapse"],
        ["گارانتی", "۲ سال کورهِوس + ۱ سال رسمی"],
      ]),
    ],
    inBox: ["شارژر 330 وات GaN", "کابل برق", "دستمال میکروفایبر", "برچسب‌های ریزر", "گزارش بنچمارک و کالیبراسیون کورهِوس", "دفترچه راهنما"],
  },
  {
    id: "macbook-pro-14",
    sku: "CH-AP14-M4P",
    name: "لپ‌تاپ اپل MacBook Pro 14 با تراشه M4 Pro",
    shortName: "MacBook Pro 14",
    brand: "اپل",
    series: "MacBook Pro",
    category: "خلاقیت و رندر",
    year: 2024,
    price: 185_000_000,
    stock: 4,
    rating: 4.9,
    reviews: 342,
    image: IMG.pro14,
    tagline: "استاندارد طلایی رندر و تدوین؛ خاموش، خنک و بی‌رقیب روی باتری.",
    highlights: ["Apple M4 Pro", "رم یکپارچه 24GB", "Liquid Retina XDR", "تا ۲۴ ساعت باتری"],
    brief: [
      ["پردازنده", "Apple M4 Pro (12C CPU)"],
      ["گرافیک", "16 هسته GPU یکپارچه"],
      ["رم / حافظه", "24GB یکپارچه / 512GB SSD"],
      ["نمایشگر", "14.2\" XDR 120Hz"],
      ["وزن", "۱.۶ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["تراشه", "Apple M4 Pro"],
        ["پردازنده", "12 هسته (۱۰ عملکردی + ۲ کم‌مصرف)"],
        ["پردازنده عصبی", "16 هسته Neural Engine"],
        ["پهنای باند حافظه", "273GB/s"],
        ["ترانزیستور", "28 میلیارد (فناوری 3 نانومتری نسل دوم)"],
      ]),
      GPU([
        ["مدل", "Apple M4 Pro GPU"],
        ["هسته گرافیکی", "16 هسته"],
        ["فناوری‌ها", "Ray Tracing سخت‌افزاری · Dynamic Caching"],
        ["خروجی تصویر", "تا ۲ نمایشگر خارجی 6K + داخلی"],
      ]),
      MEM([
        ["حافظه یکپارچه", "24GB LPDDR5X"],
        ["حافظه داخلی", "512GB SSD"],
        ["سرعت SSD (تست کورهِوس)", "خواندن 6.5GB/s"],
        ["قابلیت ارتقا", "ندارد (لحیم‌شده)"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "14.2 اینچ Liquid Retina XDR (Mini-LED)"],
        ["رزولوشن", "3024×1964 (254ppi)"],
        ["نرخ نوسازی", "ProMotion تا 120 هرتز"],
        ["روشنایی", "1000 نیت پایدار · 1600 نیت اوج HDR"],
        ["پوشش رنگ", "P3 + nano-texture اختیاری"],
      ]),
      PORTS([
        ["پورت‌ها", "3× Thunderbolt 5 · HDMI 2.1 · SDXC · جک 3.5"],
        ["بی‌سیم", "Wi-Fi 6E · Bluetooth 5.3"],
        ["وب‌کم", "12MP Center Stage"],
        ["صدا", "۶ بلندگو با صدای فضایی"],
      ]),
      BATTERY([
        ["ظرفیت", "72.4Wh"],
        ["عمر شارژ (ادعای سازنده)", "تا ۲۴ ساعت پخش ویدیو"],
        ["شارژر", "96 وات USB-C در جعبه"],
        ["شارژ سریع", "۵۰٪ در ۳۰ دقیقه"],
      ]),
      BUILD([
        ["جنس بدنه", "آلومینیوم بازیافتی یکپارچه"],
        ["ابعاد", "312.6 × 221.2 × 15.5 میلی‌متر"],
        ["وزن", "1.6 کیلوگرم"],
        ["رنگ", "خاکستری فضایی / نقره‌ای"],
      ]),
      SOFT([
        ["سیستم‌عامل", "macOS Sequoia"],
        ["سازگاری", "Final Cut · Logic · DaVinci (بومی Apple Silicon)"],
        ["گارانتی", "۲ سال کورهِوس + ۱ سال اپل"],
      ]),
    ],
    inBox: ["شارژر 96 وات USB-C", "کابل بافت‌دار USB-C به MagSafe 3", "گزارش کالیبراسیون کورهِوس", "استیکر اپل", "دفترچه راهنما"],
  },
  {
    id: "asus-zephyrus-g14",
    sku: "CH-AS14-G14",
    name: "لپ‌تاپ ایسوس ROG Zephyrus G14 (2025)",
    shortName: "Zephyrus G14",
    brand: "ایسوس",
    series: "ROG Zephyrus",
    category: "گیمینگ",
    year: 2025,
    price: 145_000_000,
    oldPrice: 162_000_000,
    stock: 7,
    rating: 4.8,
    reviews: 214,
    image: IMG.g14,
    tagline: "قدرت گیمینگ در ۱.۵ کیلوگرم؛ همراهِ هر روزِ دانشجوی مهندسی و گیمرِ جدی.",
    highlights: ["Ryzen AI 9 HX 370", "RTX 5070", "OLED 3K 120Hz", "فقط ۱.۵ کیلوگرم"],
    brief: [
      ["پردازنده", "AMD Ryzen AI 9 HX 370"],
      ["گرافیک", "NVIDIA RTX 5070 · 8GB"],
      ["رم / حافظه", "32GB LPDDR5X / 1TB SSD"],
      ["نمایشگر", "14\" OLED 3K 120Hz"],
      ["وزن", "۱.۵ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "AMD Ryzen AI 9 HX 370"],
        ["هسته / رشته", "۱۲ هسته (Zen 5) / ۲۴ رشته"],
        ["حداکثر فرکانس بوست", "5.1 گیگاهرتز"],
        ["حافظه کش", "36MB"],
        ["واحد هوش مصنوعی", "XDNA 2 تا 50 TOPS"],
      ]),
      GPU([
        ["مدل", "NVIDIA GeForce RTX 5070 لپ‌تاپ"],
        ["معماری", "Blackwell"],
        ["حافظه ویدیویی", "8GB GDDR7"],
        ["توان گرافیکی (TGP)", "110 وات با Dynamic Boost"],
        ["فناوری‌ها", "DLSS 4 · Ray Tracing · Advanced Optimus"],
      ]),
      MEM([
        ["حافظه رم", "32GB LPDDR5X-7500 (لحیم‌شده)"],
        ["حافظه داخلی", "1TB NVMe PCIe Gen4"],
        ["اسلات M.2", "یک اسلات"],
        ["قابلیت ارتقا", "فقط SSD"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "14 اینچ OLED (ROG Nebula)"],
        ["رزولوشن", "2880×1800 (3K)"],
        ["نرخ نوسازی", "120 هرتز · 0.2ms"],
        ["روشنایی", "500 نیت اوج"],
        ["پوشش رنگ", "100% DCI-P3 · Pantone Validated"],
        ["محافظ", "Gorilla Glass با پوشش ضدبازتاب"],
      ]),
      PORTS([
        ["پورت‌ها", "2× USB4 (DP + PD) · 2× USB-A 3.2 · HDMI 2.1 · microSD · جک صدا"],
        ["بی‌سیم", "Wi-Fi 7 · Bluetooth 5.4"],
        ["وب‌کم", "1080p با مادون‌قرمز"],
        ["صدا", "۶ بلندگو با Dolby Atmos"],
      ]),
      BATTERY([
        ["ظرفیت", "73Wh"],
        ["شارژر", "200 وات"],
        ["شارژ USB-C", "تا 100 وات"],
        ["عمر شارژ (تست کورهِوس)", "۹ ساعت وب‌گردی"],
      ]),
      BUILD([
        ["جنس بدنه", "آلومینیوم CNC با نوار Slash Lighting"],
        ["ابعاد", "311 × 220 × 15.9 میلی‌متر"],
        ["وزن", "1.5 کیلوگرم"],
        ["استاندارد نظامی", "MIL-STD-810H"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Home"],
        ["نرم‌افزار همراه", "Armoury Crate + MyASUS"],
        ["گارانتی", "۲ سال کورهِوس + ۲ سال ایسوس"],
      ]),
    ],
    inBox: ["شارژر 200 وات", "ماوس ROG Harpe (هدیه کورهِوس)", "کابل برق", "گزارش بنچمارک و کالیبراسیون کورهِوس", "دفترچه راهنما"],
  },
  {
    id: "thinkpad-x1-carbon",
    sku: "CH-LN14-X1C",
    name: "لپ‌تاپ لنوو ThinkPad X1 Carbon نسل ۱۳ (Aura Edition)",
    shortName: "ThinkPad X1",
    brand: "لنوو",
    series: "ThinkPad X1",
    category: "بیزنس و اداری",
    year: 2025,
    price: 158_000_000,
    stock: 6,
    rating: 4.7,
    reviews: 128,
    image: IMG.thinkpad,
    tagline: "کیبوردِ افسانه‌ای و بدنه فیبرکربن؛ انتخاب اول مدیران و برنامه‌نویسان.",
    highlights: ["فیبرکربن ۱.۰۶ کیلوگرمی", "MIL-STD-810H", "TrackPoint قرمز", "Intel Evo"],
    brief: [
      ["پردازنده", "Intel Core Ultra 7 258V"],
      ["گرافیک", "Intel Arc 140V"],
      ["رم / حافظه", "32GB / 1TB SSD"],
      ["نمایشگر", "14\" OLED 2.8K"],
      ["وزن", "۱.۰۶ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "Intel Core Ultra 7 258V (Lunar Lake)"],
        ["هسته / رشته", "۸ هسته / ۸ رشته"],
        ["حداکثر فرکانس بوست", "4.8 گیگاهرتز"],
        ["واحد هوش مصنوعی", "NPU تا 47 TOPS (سازگار با Copilot+ PC)"],
      ]),
      GPU([
        ["مدل", "Intel Arc Graphics 140V"],
        ["هسته Xe", "۸ هسته"],
        ["فناوری‌ها", "XeSS · رمزگشایی AV1"],
      ]),
      MEM([
        ["حافظه رم", "32GB LPDDR5X-8533 (یکپارچه با پردازنده)"],
        ["حافظه داخلی", "1TB NVMe PCIe Gen4 (OPAL 2.0)"],
        ["قابلیت ارتقا", "ندارد (لحیم‌شده)"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "14 اینچ OLED ضدبازتاب"],
        ["رزولوشن", "2880×1800 (2.8K)"],
        ["نرخ نوسازی", "120 هرتز متغیر"],
        ["پوشش رنگ", "100% DCI-P3 · Eyesafe"],
        ["لمسی", "ندارد"],
      ]),
      PORTS([
        ["پورت‌ها", "2× Thunderbolt 4 · 2× USB-A 3.2 · HDMI 2.1 · جک صدا"],
        ["بی‌سیم", "Wi-Fi 7 · Bluetooth 5.4 · NFC"],
        ["وب‌کم", "8MP با شاتر حریم خصوصی ThinkShutter"],
        ["امنیت", "اثر انگشت روی دکمه پاور · dTPM 2.0 · تشخیص حضور"],
      ]),
      BATTERY([
        ["ظرفیت", "57Wh"],
        ["شارژ سریع", "RapidCharge — ۸۰٪ در ۶۰ دقیقه"],
        ["عمر شارژ (تست کورهِوس)", "۱۴ ساعت کاری"],
      ]),
      BUILD([
        ["جنس بدنه", "فیبرکربن (درب) + آلیاژ منیزیم (کف)"],
        ["ابعاد", "312.8 × 214.7 × 14.4 میلی‌متر"],
        ["وزن", "1.06 کیلوگرم"],
        ["استاندارد نظامی", "MIL-STD-810H (۱۲ تست)"],
        ["کیبورد", "مقاوم در برابر ریزش مایعات + TrackPoint"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Pro"],
        ["نرم‌افزار همراه", "Lenovo Commercial Vantage"],
        ["گارانتی", "۲ سال کورهِوس + ۳ سال Premier Support لنوو"],
      ]),
    ],
    inBox: ["شارژر 65 وات USB-C", "کابل برق", "مبدل USB به اترنت", "گزارش بنچمارک کورهِوس", "دفترچه راهنما"],
  },
  {
    id: "dell-xps-13",
    sku: "CH-DL13-XPS",
    name: "لپ‌تاپ دل XPS 13 (9345) نسخه Snapdragon",
    shortName: "XPS 13",
    brand: "دل",
    series: "XPS",
    category: "اولترابوک",
    year: 2024,
    price: 128_000_000,
    oldPrice: 139_000_000,
    stock: 9,
    rating: 4.5,
    reviews: 96,
    image: IMG.xps13,
    tagline: "معماری ARM با روزها شارژدهی؛ سبک‌ترین راه برای همیشه‌آنلاین‌بودن.",
    highlights: ["Snapdragon X Elite", "باتری تا ۲۷ ساعت", "NPU 45 TOPS", "طراحی بدون قاب"],
    brief: [
      ["پردازنده", "Snapdragon X Elite X1E-80"],
      ["گرافیک", "Adreno یکپارچه"],
      ["رم / حافظه", "16GB / 512GB SSD"],
      ["نمایشگر", "13.4\" FHD+ 120Hz"],
      ["وزن", "۱.۱۹ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "Qualcomm Snapdragon X Elite X1E-80-100"],
        ["هسته", "۱۲ هسته Oryon"],
        ["حداکثر فرکانس", "4.0 گیگاهرتز (Dual Core Boost)"],
        ["واحد هوش مصنوعی", "Hexagon NPU تا 45 TOPS"],
      ]),
      GPU([
        ["مدل", "Qualcomm Adreno (یکپارچه)"],
        ["توان", "3.8 ترافلاپس"],
        ["فناوری‌ها", "DirectX 12 · رمزگشایی AV1"],
      ]),
      MEM([
        ["حافظه رم", "16GB LPDDR5X-8448"],
        ["حافظه داخلی", "512GB NVMe"],
        ["قابلیت ارتقا", "ندارد"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "13.4 اینچ IPS بدون قاب InfinityEdge"],
        ["رزولوشن", "1920×1200 (FHD+)"],
        ["نرخ نوسازی", "120 هرتز"],
        ["روشنایی", "500 نیت"],
        ["پوشش رنگ", "100% sRGB"],
      ]),
      PORTS([
        ["پورت‌ها", "3× USB-C (USB4 / DP / PD)"],
        ["بی‌سیم", "Wi-Fi 7 · Bluetooth 5.4"],
        ["وب‌کم", "1080p با مادون‌قرمز"],
        ["صدا", "۴ بلندگو"],
      ]),
      BATTERY([
        ["ظرفیت", "55Wh"],
        ["عمر شارژ (ادعای سازنده)", "تا ۲۷ ساعت پخش ویدیو"],
        ["عمر شارژ (تست کورهِوس)", "۱۸ ساعت وب‌گردی"],
        ["شارژر", "60 وات USB-C"],
      ]),
      BUILD([
        ["جنس بدنه", "آلومینیوم CNC"],
        ["ابعاد", "295.3 × 199.1 × 14.8 میلی‌متر"],
        ["وزن", "1.19 کیلوگرم"],
        ["کیبورد", "Zero-Lattice با تاچ‌پد شیشه‌ای یکپارچه"],
      ]),
      SOFT([
        ["سیستم‌عملکرد", "Windows 11 (نسخه ARM)"],
        ["سازگاری", "Prism شبیه‌ساز اپ‌های x86"],
        ["گارانتی", "۲ سال کورهِوس + ۱ سال دل"],
      ]),
    ],
    inBox: ["شارژر 60 وات USB-C", "مبدل USB-C به USB-A", "گزارش بنچمارک کورهِوس", "دفترچه راهنما"],
  },
  {
    id: "msi-prestige-16",
    sku: "CH-MS16-PRE",
    name: "لپ‌تاپ ام‌اس‌آی Prestige 16 AI Evo",
    shortName: "Prestige 16",
    brand: "ام‌اس‌آی",
    series: "Prestige",
    category: "اولترابوک",
    year: 2025,
    price: 112_000_000,
    stock: 8,
    rating: 4.6,
    reviews: 74,
    image: IMG.prestige16,
    tagline: "باتری غول‌پیکر ۹۹ وات‌ساعتی در ۱.۵ کیلوگرم؛ دفتر کارِ سیارِ تمام‌عیار.",
    highlights: ["باتری 99Wh", "۱۶ اینچ با ۱.۵ کیلوگرم", "NPU هوش مصنوعی", "MIL-STD-810H"],
    brief: [
      ["پردازنده", "Intel Core Ultra 7 255H"],
      ["گرافیک", "Intel Arc 140T"],
      ["رم / حافظه", "32GB / 1TB SSD"],
      ["نمایشگر", "16\" 2.5K IPS 120Hz"],
      ["وزن", "۱.۵ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "Intel Core Ultra 7 255H (Arrow Lake)"],
        ["هسته / رشته", "۱۶ هسته / ۱۶ رشته"],
        ["حداکثر فرکانس بوست", "5.1 گیگاهرتز"],
        ["واحد هوش مصنوعی", "NPU تا 13 TOPS"],
      ]),
      GPU([
        ["مدل", "Intel Arc Graphics 140T"],
        ["هسته Xe", "۸ هسته"],
        ["فناوری‌ها", "XeSS · AV1"],
      ]),
      MEM([
        ["حافظه رم", "32GB LPDDR5X-8400"],
        ["حافظه داخلی", "1TB NVMe PCIe Gen4"],
        ["اسلات M.2", "دو اسلات"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "16 اینچ IPS"],
        ["رزولوشن", "2560×1600"],
        ["نرخ نوسازی", "120 هرتز"],
        ["پوشش رنگ", "100% DCI-P3"],
        ["کالیبراسیون", "کارخانه‌ای ΔE < 2 + کالیبراسیون کورهِوس"],
      ]),
      PORTS([
        ["پورت‌ها", "2× Thunderbolt 4 · 2× USB-A 3.2 · HDMI 2.1 · microSD · جک صدا"],
        ["بی‌سیم", "Wi-Fi 7 · Bluetooth 5.4"],
        ["وب‌کم", "1080p با مادون‌قرمز و شاتر"],
        ["امنیت", "اثر انگشت + TPM 2.0"],
      ]),
      BATTERY([
        ["ظرفیت", "99.9Wh (حداکثر مجاز پروازی)"],
        ["عمر شارژ (تست کورهِوس)", "۱۶ ساعت وب‌گردی"],
        ["شارژ سریع", "۵۰٪ در ۳۵ دقیقه"],
      ]),
      BUILD([
        ["جنس بدنه", "آلیاژ منیزیم-آلومینیوم"],
        ["ابعاد", "358.4 × 254 × 16.8 میلی‌متر"],
        ["وزن", "1.5 کیلوگرم"],
        ["استاندارد نظامی", "MIL-STD-810H"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Home"],
        ["نرم‌افزار همراه", "MSI Center"],
        ["گارانتی", "۲ سال کورهِوس + ۲ سال ام‌اس‌آی"],
      ]),
    ],
    inBox: ["شارژر 100 وات USB-C", "کابل برق", "گزارش کالیبراسیون کورهِوس", "دفترچه راهنما"],
  },
  {
    id: "framework-16",
    sku: "CH-FW16-MOD",
    name: "لپ‌تاپ فریم‌ورک Framework 16 (نسخه ماژولار)",
    shortName: "Framework 16",
    brand: "فریم‌ورک",
    series: "Framework",
    category: "خلاقیت و رندر",
    year: 2024,
    price: 135_000_000,
    stock: 5,
    rating: 4.7,
    reviews: 61,
    image: IMG.framework16,
    tagline: "لپ‌تاپی که خودتان ارتقا و تعمیرش می‌دهید؛ سرمایه‌گذاری ده‌ساله، نه دو ساله.",
    highlights: ["امتیاز تعمیر ۱۰/۱۰ iFixit", "ماژول گرافیک جداشونده", "رم قابل‌تعویض", "قطعات یدکی رسمی"],
    brief: [
      ["پردازنده", "AMD Ryzen 7 7840HS"],
      ["گرافیک", "Radeon 780M + ماژول گرافیک"],
      ["رم / حافظه", "32GB DDR5 / 1TB SSD"],
      ["نمایشگر", "16\" 2.5K 165Hz مات"],
      ["وزن", "۲.۱ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "AMD Ryzen 7 7840HS"],
        ["هسته / رشته", "۸ هسته Zen 4 / ۱۶ رشته"],
        ["حداکثر فرکانس بوست", "5.1 گیگاهرتز"],
        ["واحد هوش مصنوعی", "Ryzen AI تا 16 TOPS"],
        ["نکته", "پردازنده روی سوکت قابل‌تعویض است"],
      ]),
      GPU([
        ["مدل پایه", "AMD Radeon 780M (یکپارچه)"],
        ["ماژول گرافیک", "اسلات Expansion Bay برای کارت جداشونده"],
        ["فناوری‌ها", "FSR 3 · رمزگشایی AV1"],
      ]),
      MEM([
        ["حافظه رم", "32GB DDR5-5600 (دو اسلات SO-DIMM — قابل‌تعویض)"],
        ["حافظه داخلی", "1TB NVMe (دو اسلات M.2)"],
        ["کارت‌خوان", "ماژول microSD قابل‌جابجایی"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "16 اینچ IPS مات 16:10"],
        ["رزولوشن", "2560×1600"],
        ["نرخ نوسازی", "165 هرتز"],
        ["روشنایی", "400 نیت"],
        ["پوشش رنگ", "100% sRGB"],
        ["نکته", "پنل با ۴ پیچ قابل‌تعویض"],
      ]),
      PORTS([
        ["پورت‌ها", "۶ ماژول پورت دلخواه (USB-C / USB-A / HDMI / DP / microSD / اترنت)"],
        ["بی‌سیم", "Wi-Fi 6E · Bluetooth 5.3"],
        ["وب‌کم", "1080p با شاتر فیزیکی"],
      ]),
      BATTERY([
        ["ظرفیت", "85Wh (ماژول قابل‌تعویض با یک پیچ)"],
        ["عمر شارژ (تست کورهِوس)", "۸ ساعت وب‌گردی"],
        ["شارژر", "180 وات USB-C"],
      ]),
      BUILD([
        ["جنس بدنه", "آلومینیوم بازیافتی + پلاستیک تقویت‌شده"],
        ["ابعاد", "364 × 268 × 20.3 میلی‌متر"],
        ["وزن", "2.1 کیلوگرم"],
        ["تعمیرپذیری", "۱۰ از ۱۰ iFixit — فقط یک پیچ‌گوشتی Torx"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Pro یا لینوکس (Fedora تأییدشده)"],
        ["فروشگاه قطعات", "دسترسی دائمی به قطعات یدکی رسمی"],
        ["گارانتی", "۲ سال کورهِوس + ۳ سال فریم‌ورک"],
      ]),
    ],
    inBox: ["پیچ‌گوشتی Torx اختصاصی", "شارژر 180 وات USB-C", "ماژول پورت نصب‌شده", "گزارش بنچمارک کورهِوس", "راهنمای تصویری تعمیرات"],
  },
  {
    id: "lg-gram-17",
    sku: "CH-LG17-GRM",
    name: "لپ‌تاپ ال‌جی Gram 17 (2025)",
    shortName: "LG Gram 17",
    brand: "ال‌جی",
    series: "Gram",
    category: "اولترابوک",
    year: 2025,
    price: 118_000_000,
    stock: 10,
    rating: 4.6,
    reviews: 88,
    image: IMG.gram17,
    tagline: "۱۷ اینچِ واقعی که کمتر از خیلی ۱۳ اینچی‌ها وزن دارد؛ دفتر کارِ پروازکننده.",
    highlights: ["۱.۳۵ کیلوگرم در ۱۷ اینچ", "نمایشگر 16:10", "منیزیم آلیاژی", "MIL-STD-810H"],
    brief: [
      ["پردازنده", "Intel Core Ultra 7 255H"],
      ["گرافیک", "Intel Arc 140T"],
      ["رم / حافظه", "32GB / 1TB SSD"],
      ["نمایشگر", "17\" WQXGA IPS"],
      ["وزن", "۱.۳۵ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "Intel Core Ultra 7 255H"],
        ["هسته / رشته", "۱۶ هسته / ۱۶ رشته"],
        ["حداکثر فرکانس بوست", "5.1 گیگاهرتز"],
        ["واحد هوش مصنوعی", "NPU تا 13 TOPS"],
      ]),
      GPU([
        ["مدل", "Intel Arc Graphics 140T"],
        ["هسته Xe", "۸ هسته"],
      ]),
      MEM([
        ["حافظه رم", "32GB LPDDR5X"],
        ["حافظه داخلی", "1TB NVMe + اسلات خالی M.2"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "17 اینچ IPS نسبت 16:10"],
        ["رزولوشن", "2560×1600 (WQXGA)"],
        ["نرخ نوسازی", "60 هرتز"],
        ["روشنایی", "350 نیت"],
        ["پوشش رنگ", "99% DCI-P3"],
      ]),
      PORTS([
        ["پورت‌ها", "2× Thunderbolt 4 · 2× USB-A 3.2 · HDMI 2.1 · microSD · جک صدا"],
        ["بی‌سیم", "Wi-Fi 7 · Bluetooth 5.4"],
        ["وب‌کم", "1080p با مادون‌قرمز"],
      ]),
      BATTERY([
        ["ظرفیت", "77Wh"],
        ["عمر شارژ (تست کورهِوس)", "۱۳ ساعت وب‌گردی"],
        ["شارژر", "65 وات USB-C"],
      ]),
      BUILD([
        ["جنس بدنه", "آلیاژ منیزیم-نانوکربن"],
        ["ابعاد", "379 × 259 × 17 میلی‌متر"],
        ["وزن", "1.35 کیلوگرم"],
        ["استاندارد نظامی", "MIL-STD-810H"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Home"],
        ["نرم‌افزار همراه", "LG Glance + Smart Assistant"],
        ["گارانتی", "۲ سال کورهِوس + ۲ سال ال‌جی"],
      ]),
    ],
    inBox: ["شارژر 65 وات USB-C", "کابل برق", "گزارش بنچمارک کورهِوس", "دفترچه راهنما"],
  },
  {
    id: "hp-spectre-x360",
    sku: "CH-HP14-SPX",
    name: "لپ‌تاپ اچ‌پی Spectre x360 14 (2025)",
    shortName: "Spectre x360",
    brand: "اچ‌پی",
    series: "Spectre",
    category: "خلاقیت و رندر",
    year: 2025,
    price: 122_000_000,
    stock: 6,
    rating: 4.7,
    reviews: 102,
    image: IMG.spectre14,
    tagline: "کانورتیبل لوکس با قلم؛ از صورت‌جلسه تا طراحی دیجیتال، با یک چرخش.",
    highlights: ["تاشو ۳۶۰ درجه", "OLED لمسی 2.8K", "قلم همراه", "وب‌کم 9MP"],
    brief: [
      ["پردازنده", "Intel Core Ultra 7 258V"],
      ["گرافیک", "Intel Arc 140V"],
      ["رم / حافظه", "32GB / 1TB SSD"],
      ["نمایشگر", "14\" OLED لمسی 2.8K"],
      ["وزن", "۱.۴۴ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "Intel Core Ultra 7 258V (Lunar Lake)"],
        ["هسته / رشته", "۸ هسته / ۸ رشته"],
        ["واحد هوش مصنوعی", "NPU تا 47 TOPS (Copilot+ PC)"],
      ]),
      GPU([
        ["مدل", "Intel Arc Graphics 140V"],
        ["هسته Xe", "۸ هسته"],
      ]),
      MEM([
        ["حافظه رم", "32GB LPDDR5X-8533 (یکپارچه)"],
        ["حافظه داخلی", "1TB NVMe PCIe Gen4"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "14 اینچ OLED لمسی نسبت 3:2"],
        ["رزولوشن", "2880×1920 (2.8K)"],
        ["نرخ نوسازی", "تا 120 هرتز متغیر"],
        ["پوشش رنگ", "100% DCI-P3 · IMAX Enhanced"],
        ["قلم", "HP Slim Pen با MPP 2.0 و بازخورد لمسی"],
        ["محافظ", "Gorilla Glass"],
      ]),
      PORTS([
        ["پورت‌ها", "2× Thunderbolt 4 · USB-A 3.2 · جک صدا"],
        ["بی‌سیم", "Wi-Fi 7 · Bluetooth 5.4"],
        ["وب‌کم", "9MP با هوش مصنوعی کادر خودکار"],
        ["صدا", "۴ بلندگو Poly Studio"],
      ]),
      BATTERY([
        ["ظرفیت", "68Wh"],
        ["عمر شارژ (تست کورهِوس)", "۱۲ ساعت وب‌گردی"],
        ["شارژ سریع", "۵۰٪ در ۳۰ دقیقه"],
      ]),
      BUILD([
        ["جنس بدنه", "آلومینیوم CNC با تراش‌کاری جواهری"],
        ["ابعاد", "313 × 220 × 16.9 میلی‌متر"],
        ["وزن", "1.44 کیلوگرم"],
        ["لولا", "چرخش ۳۶۰ درجه با حالت چادر و تبلت"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Home"],
        ["نرم‌افزار همراه", "HP Command Center + Palette"],
        ["گارانتی", "۲ سال کورهِوس + ۲ سال اچ‌پی"],
      ]),
    ],
    inBox: ["قلم HP MPP 2.0", "شارژر 65 وات USB-C", "کیف آستین چرمی", "گزارش کالیبراسیون کورهِوس", "دفترچه راهنما"],
  },
  {
    id: "gigabyte-aorus-17x",
    sku: "CH-GB17-4090",
    name: "لپ‌تاپ گیگابایت Aorus 17X (2024)",
    shortName: "Aorus 17X",
    brand: "گیگابایت",
    series: "Aorus",
    category: "گیمینگ",
    year: 2024,
    price: 198_000_000,
    oldPrice: 215_000_000,
    stock: 2,
    rating: 4.9,
    reviews: 156,
    image: IMG.aorus17,
    tagline: "جایگزین دسکتاپ؛ RTX 4090 با توان کامل و ۶۴ گیگابایت رم برای سنگین‌ترین صحنه‌ها.",
    highlights: ["RTX 4090 · 175W", "رم 64GB DDR5", "صفحه 240Hz", "خنک‌کننده ۵ لوله‌ای"],
    brief: [
      ["پردازنده", "Intel Core i9-14900HX"],
      ["گرافیک", "NVIDIA RTX 4090 · 16GB"],
      ["رم / حافظه", "64GB DDR5 / 2TB SSD"],
      ["نمایشگر", "17.3\" QHD 240Hz"],
      ["وزن", "۲.۸ کیلوگرم"],
    ],
    specs: [
      CPU([
        ["مدل", "Intel Core i9-14900HX"],
        ["هسته / رشته", "۲۴ هسته / ۳۲ رشته"],
        ["حداکثر فرکانس بوست", "5.8 گیگاهرتز"],
        ["حافظه کش", "36MB"],
        ["توان مصرفی", "PL2 تا 157 وات"],
      ]),
      GPU([
        ["مدل", "NVIDIA GeForce RTX 4090 لپ‌تاپ"],
        ["معماری", "Ada Lovelace"],
        ["حافظه ویدیویی", "16GB GDDR6"],
        ["توان گرافیکی (TGP)", "175 وات کامل"],
        ["فناوری‌ها", "DLSS 3.5 · Ray Tracing · Reflex"],
      ]),
      MEM([
        ["حافظه رم", "64GB DDR5-5600 (دو کاناله)"],
        ["قابلیت ارتقا", "تا 96GB"],
        ["حافظه داخلی", "2TB NVMe PCIe Gen4"],
        ["اسلات M.2", "دو اسلات Gen4"],
      ]),
      DISPLAY([
        ["اندازه و پنل", "17.3 اینچ IPS"],
        ["رزولوشن", "2560×1440 (QHD)"],
        ["نرخ نوسازی", "240 هرتز"],
        ["پوشش رنگ", "100% DCI-P3 · Pantone Validated"],
        ["زمان پاسخ", "3 میلی‌ثانیه"],
      ]),
      PORTS([
        ["پورت‌ها", "Thunderbolt 4 · USB-C · 3× USB-A · HDMI 2.1 · Mini DP 1.4 · اترنت 2.5G · جک صدا"],
        ["بی‌سیم", "Wi-Fi 6E · Bluetooth 5.2"],
        ["وب‌کم", "1080p"],
        ["صدا", "دولبی اتموس + بلندگوی پرقدرت"],
      ]),
      BATTERY([
        ["ظرفیت", "99Wh"],
        ["آداپتور", "330 وات"],
        ["عمر شارژ (تست کورهِوس)", "۴.۵ ساعت وب‌گردی"],
      ]),
      BUILD([
        ["جنس بدنه", "آلومینیوم + پلاستیک تقویت‌شده"],
        ["ابعاد", "398 × 273 × 30.5 میلی‌متر"],
        ["وزن", "2.8 کیلوگرم"],
        ["خنک‌کننده", "WINDFORCE Infinity — ۵ لوله حرارتی + ۲ فن ۱۲ ولتی"],
        ["کیبورد", "RGB تک‌کلیدی با کلیدهای ماکرو"],
      ]),
      SOFT([
        ["سیستم‌عامل", "Windows 11 Home"],
        ["نرم‌افزار همراه", "Aorus AI Nexus"],
        ["گارانتی", "۲ سال کورهِوس + ۲ سال گیگابایت"],
      ]),
    ],
    inBox: ["شارژر 330 وات", "کابل برق", "کاور کیبورد", "گزارش بنچمارک و تست حرارتی کورهِوس", "دفترچه راهنما"],
  },
];

/* ---------- editorial content ---------- */

export const REVIEW_QUOTES = [
  { name: "امیر محمدی", role: "توسعه‌دهنده بازی", rating: 5, quote: "گزارش بنچمارک داخل جعبه شوخی نیست؛ دقیقاً همان عددی بود که خودم با Cinebench گرفتم. Blade را گرفتم و تا امروز حتی یک افت فریم عجیب ندیدم." },
  { name: "نگار شریفی", role: "تدوینگر ویدیو", rating: 5, quote: "مک‌بوک را با کالیبراسیون کورهِوس گرفتم و رنگ‌های پروژه‌ام از روز اول با مانیتور استودیو یکی بود. این یعنی صرفه‌جویی یک هفته‌ای." },
  { name: "پویا رستمی", role: "دانشجوی مهندسی مکانیک", rating: 5, quote: "G14 را برای سالیدورکس و کتیا خریدم. سنگین‌ترین اسمبلی‌ها هم بدون فن‌صدا اجرا می‌شوند و توی کلاس فقط ۱.۵ کیلوگرم است." },
  { name: "مریم کاظمی", role: "مدیر محصول", rating: 5, quote: "از مقایسه سایت سه مدل را کنار هم گذاشتم و X1 را انتخاب کردم. کیبوردش واقعاً همان چیزی است که ده سال درباره‌اش شنیده‌ام." },
  { name: "آرش توکلی", role: "استریمر", rating: 4, quote: "Aorus را با ۶۴ گیگابایت رم گرفتم؛ هم‌زمان استریم و رندر می‌گیرم و هنوز ۲۰ گیگابایت آزاد است. فقط سنگین است — طبیعتاً." },
  { name: "شیرین موسوی", role: "طراح رابط کاربری", rating: 5, quote: "Spectre با قلمش جایگزین تبلتم شد. OLED لمسی برای پروتوتایپ مستقیم روی صفحه فوق‌العاده است." },
  { name: "کیان فرهمند", role: "عکاس خبری", rating: 5, quote: "Gram 17 را در سفرهای کاری باور نمی‌کنم: مانیتور بزرگ برای ادیت، وزن کمتر از دوربینم. ارسال به شیراز هم ۴۸ ساعته رسید." },
];

export const FAQS = [
  { q: "لپ‌تاپ‌های کورهِوس آکبند هستند؟", a: "بله؛ همه دستگاه‌ها آکبند و با پلمپ کارخانه‌اند. فقط برای تست آزمایشگاهی — بنچمارک، کالیبراسیون نمایشگر و تست حرارتی ۳۰ دقیقه‌ای — باز می‌شوند و گزارش امضاشده هر دستگاه همراه جعبه ارسال می‌شود." },
  { q: "شرایط مرجوعی چیست؟", a: "تا ۷ روز پس از تحویل، بدون قیدوشرط و با برچسب مرجوعی رایگان. مبلغ حداکثر ۳ روز کاری پس از رسیدن دستگاه به آزمایشگاه به همان روش پرداخت برگشت می‌خورد." },
  { q: "قیمت‌ها شامل مالیات است؟", a: "بله؛ همه قیمت‌ها به ریال و شامل ۱۰٪ مالیات بر ارزش افزوده است و در مرحله تسویه حساب به‌صورت شفاف تفکیک می‌شود." },
  { q: "ارسال به چه صورت انجام می‌شود؟", a: "سفارش‌های بالای ۱۵۰ میلیون ریال با پیک اختصاصی ۴۸ ساعته و رایگان، و بقیه با تیپاکس یا پست ویژه (۲ تا ۴ روز کاری، ۱٬۵۰۰٬۰۰۰ ریال) به سراسر ایران ارسال می‌شود. همه مرسولات بیمه کامل دارند." },
  { q: "گارانتی دستگاه‌ها چیست؟", a: "هر دستگاه ۲ سال پوشش کورهِوس دارد که روی گارانتی رسمی سازنده سوار می‌شود. پوشش حوادث (ضربه، مایعات، شکست پنل) نیز به‌صورت اختیاری هنگام خرید قابل افزودن است." },
  { q: "آیا خرید اقساطی دارید؟", a: "بله؛ با اعتبارسنجی دیجی‌پی و اسنپ‌پی، خرید اقساطی ۳ تا ۱۲ ماهه برای همه مدل‌ها فعال است. در مرحله پرداخت گزینه «اقساطی» را انتخاب کنید." },
];

/* ---------- helpers ---------- */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export const toFa = (s: string | number): string => String(s).replace(/\d/g, (d) => FA_DIGITS[+d]);

export const fmt = (n: number): string => `${n.toLocaleString("fa-IR")} ریال`;

export const fmtShort = (n: number): string => `${Math.round(n / 1_000_000).toLocaleString("fa-IR")} میلیون ریال`;

export function luhn(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length !== 16) return false;
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let d = parseInt(digits[15 - i], 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function cardBrand(num: string): string | null {
  const d = num.replace(/\D/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^6/.test(d)) return "shetab";
  return null;
}

export function cartTotals(lines: CartLine[], promoCode: string | null) {
  const subtotal = lines.reduce((a, l) => a + (l.laptop.price + (l.warranty ? WARRANTY_PRICE : 0)) * l.qty, 0);
  const promo = promoCode ? PROMOS[promoCode] : undefined;
  const discount = promo?.pct ? Math.round((subtotal * promo.pct) / 100) : 0;
  const shipping = lines.length === 0 ? 0 : promo?.freeShip || subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  return { subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax, count: lines.reduce((a, l) => a + l.qty, 0) };
}
