export interface SpecGroup {
  title: string;
  icon: string; // key into icon map
  rows: [string, string][];
}

export interface Laptop {
  id: string;
  name: string;
  shortName: string;
  brand: string;
  series: string;
  category: "Gaming" | "Creator" | "Business" | "Ultrabook";
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  year: number;
  sku: string;
  image: string;
  tagline: string;
  highlights: string[];
  brief: Record<string, string>; // used by compare table + search index
  specs: SpecGroup[];
  inBox: string[];
}

const g = (title: string, icon: string, rows: [string, string][]): SpecGroup => ({ title, icon, rows });

export const WARRANTY_PRICE = 129;
export const FREE_SHIPPING_THRESHOLD = 1500;
export const SHIPPING_FLAT = 29;
export const TAX_RATE = 0.08;
export const PROMOS: Record<string, { kind: "percent" | "ship"; value: number; label: string }> = {
  VOLT10: { kind: "percent", value: 0.1, label: "10% off order" },
  FREESHIP: { kind: "ship", value: 0, label: "Free shipping" },
};

export const LAPTOPS: Laptop[] = [
  {
    id: "zephyrus-g14",
    name: "ASUS ROG Zephyrus G14 (2024)",
    shortName: "Zephyrus G14",
    brand: "ASUS",
    series: "ROG Zephyrus",
    category: "Gaming",
    price: 1999,
    oldPrice: 2199,
    rating: 4.8,
    reviews: 214,
    stock: 12,
    year: 2024,
    sku: "CH-ASU-G14-01",
    image: "https://image.qwenlm.ai/generated-images/5de97a10-ddc3-4152-bcab-c97cbffef0a3/_result.png",
    tagline: "A 1.5 kg OLED pocket-rocket with Ryzen AI silicon.",
    highlights: ["RTX 4070 · 105 W", "14\" OLED 120 Hz", "Ryzen 9 8945HS", "1.50 kg"],
    brief: {
      CPU: "AMD Ryzen 9 8945HS · 8C/16T · up to 5.2 GHz",
      GPU: "GeForce RTX 4070 · 8 GB GDDR6 · 105 W",
      RAM: "32 GB LPDDR5X-6400 (on-board)",
      Storage: "1 TB PCIe 4.0 NVMe",
      Display: "14\" OLED · 2880×1800 · 120 Hz · 500 nit",
      Battery: "73 Wh · up to 10 h video",
      Weight: "1.50 kg / 3.31 lb",
      Ports: "USB4, USB-C 3.2, 2× USB-A, HDMI 2.1, microSD",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "AMD Ryzen 9 8945HS (Zen 4, 4 nm)"],
        ["Cores / Threads", "8 cores / 16 threads"],
        ["Clock speed", "4.0 GHz base · 5.2 GHz boost"],
        ["NPU", "Ryzen AI · up to 16 TOPS"],
        ["TDP", "35–54 W configurable"],
      ]),
      g("Graphics", "gpu", [
        ["Discrete GPU", "NVIDIA GeForce RTX 4070 Laptop"],
        ["VRAM", "8 GB GDDR6"],
        ["Max TGP", "105 W with Dynamic Boost"],
        ["MUX / Advanced Optimus", "Yes, hardware MUX switch"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "32 GB LPDDR5X-6400 (on-board)"],
        ["Upgradeable", "No — soldered"],
        ["Storage", "1 TB M.2 2280 PCIe 4.0 NVMe"],
        ["Free slot", "1× M.2 2280 (PCIe 4.0)"],
      ]),
      g("Display", "display", [
        ["Panel", "14\" ROG Nebula OLED, glossy"],
        ["Resolution", "2880 × 1800 (2.8K, 16:10)"],
        ["Refresh / Response", "120 Hz · 0.2 ms G-Sync"],
        ["Brightness / Color", "500 nit peak · 100% DCI-P3 · ΔE < 1 (calibrated)"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Wi-Fi 6E (802.11ax) · Bluetooth 5.3"],
        ["Ports", "1× USB4 (DP/PD), 1× USB-C 3.2, 2× USB-A 3.2, HDMI 2.1, microSD UHS-II, 3.5 mm combo"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "73 Wh, 4-cell Li-ion"],
        ["Charging", "180 W barrel + 100 W USB-C PD"],
        ["Runtime (tested)", "10 h 05 m video · 6 h 40 m web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "311 × 220 × 15.9 mm"],
        ["Weight", "1.50 kg / 3.31 lb"],
        ["Chassis", "CNC-milled aluminum, Slash Lighting lid"],
        ["Keyboard", "Per-key RGB, 1.7 mm travel"],
        ["Audio", "6-speaker Dolby Atmos array"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Home"],
        ["Warranty", "1-year manufacturer + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["Zephyrus G14 notebook", "180 W power adapter", "USB-C 100 W charger", "ROG carry sleeve", "Corehaus calibration report"],
  },
  {
    id: "macbook-pro-14",
    name: "Apple MacBook Pro 14 (M4 Pro)",
    shortName: "MacBook Pro 14",
    brand: "Apple",
    series: "MacBook Pro",
    category: "Creator",
    price: 2399,
    rating: 4.9,
    reviews: 388,
    stock: 20,
    year: 2024,
    sku: "CH-APL-MBP14-02",
    image: "https://image.qwenlm.ai/generated-images/8dd519b5-f437-4086-9c54-c5ccd27c1919/_result.png",
    tagline: "The M4 Pro render-farm you can carry to set.",
    highlights: ["M4 Pro · 12-core CPU", "24 GB unified", "Liquid Retina XDR", "Thunderbolt 5 ×3"],
    brief: {
      CPU: "Apple M4 Pro · 12-core CPU / 16-core GPU",
      GPU: "16-core GPU · hardware ray tracing",
      RAM: "24 GB unified LPDDR5X-8533",
      Storage: "512 GB SSD",
      Display: "14.2\" Liquid Retina XDR · 3024×1964 · 120 Hz",
      Battery: "72.4 Wh · up to 22 h video",
      Weight: "1.55 kg / 3.4 lb",
      Ports: "3× Thunderbolt 5, HDMI 2.1, SDXC, MagSafe 3",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Apple M4 Pro (3 nm, 2nd gen)"],
        ["CPU", "12 cores · 8 performance + 4 efficiency"],
        ["Neural Engine", "16-core · 38 TOPS"],
        ["Media engines", "H.264/HEVC/ProRes encode + decode"],
      ]),
      g("Graphics", "gpu", [
        ["GPU", "16-core Apple GPU"],
        ["Features", "Hardware ray tracing · mesh shading · Dynamic Caching"],
        ["External displays", "Up to 2× 6K @ 60 Hz + internal"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "24 GB unified LPDDR5X-8533 · 273 GB/s"],
        ["Upgradeable", "No — unified architecture"],
        ["Storage", "512 GB NVMe SSD"],
      ]),
      g("Display", "display", [
        ["Panel", "14.2\" Liquid Retina XDR (mini-LED)"],
        ["Resolution", "3024 × 1964 · 254 ppi"],
        ["Brightness", "1000 nit sustained · 1600 nit peak HDR"],
        ["Refresh", "ProMotion 24–120 Hz adaptive"],
        ["Color", "P3 wide color · factory calibrated"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Wi-Fi 6E · Bluetooth 5.3"],
        ["Ports", "3× Thunderbolt 5 (USB-C, 120 Gb/s), HDMI 2.1, SDXC, MagSafe 3, 3.5 mm hi-impedance"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "72.4 Wh lithium-polymer"],
        ["Charging", "96 W USB-C (included) · MagSafe fast charge"],
        ["Runtime (tested)", "22 h video · 13 h wireless web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "312.6 × 221.2 × 15.5 mm"],
        ["Weight", "1.55 kg / 3.4 lb"],
        ["Chassis", "Space-black anodized aluminum unibody"],
        ["Keyboard", "Magic Keyboard, backlit, Touch ID"],
        ["Audio", "6-speaker system with force-cancelling woofers"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "macOS Sequoia"],
        ["Warranty", "1-year Apple limited + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["MacBook Pro 14", "96 W USB-C adapter", "USB-C to MagSafe 3 cable", "Corehaus calibration report"],
  },
  {
    id: "thinkpad-x1-carbon",
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    shortName: "X1 Carbon Gen 12",
    brand: "Lenovo",
    series: "ThinkPad X1",
    category: "Business",
    price: 1849,
    rating: 4.7,
    reviews: 162,
    stock: 8,
    year: 2024,
    sku: "CH-LEN-X1C-03",
    image: "https://image.qwenlm.ai/generated-images/71449d80-a863-4702-8155-1b614caec9bb/_result.png",
    tagline: "The boardroom standard, now with Core Ultra AI.",
    highlights: ["Core Ultra 7 155H", "2.8K OLED", "1.09 kg carbon", "3-yr onsite"],
    brief: {
      CPU: "Intel Core Ultra 7 155H · 16C/22T · 4.8 GHz",
      GPU: "Intel Arc · 8 Xe-cores",
      RAM: "32 GB LPDDR5x-6400 (on-board)",
      Storage: "1 TB PCIe 4.0 NVMe (OPAL)",
      Display: "14\" OLED · 2880×1800 · 120 Hz · 400 nit",
      Battery: "57 Wh · RapidCharge 80% in 1 h",
      Weight: "1.09 kg / 2.42 lb",
      Ports: "2× Thunderbolt 4, 2× USB-A, HDMI 2.1",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Intel Core Ultra 7 155H (Meteor Lake)"],
        ["Cores / Threads", "16 cores (6P+8E+2LPE) / 22 threads"],
        ["Clock speed", "Up to 4.8 GHz"],
        ["NPU", "Intel AI Boost · 11 TOPS"],
      ]),
      g("Graphics", "gpu", [
        ["GPU", "Intel Arc integrated · 8 Xe-cores"],
        ["Features", "AV1 encode · dual 4K external display"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "32 GB LPDDR5x-6400 (on-board)"],
        ["Storage", "1 TB M.2 2280 PCIe 4.0 NVMe, OPAL 2.0"],
      ]),
      g("Display", "display", [
        ["Panel", "14\" OLED anti-glare, Eyesafe 2.0"],
        ["Resolution", "2880 × 1800 (2.8K, 16:10)"],
        ["Refresh / Brightness", "120 Hz · 400 nit"],
        ["Color", "100% DCI-P3 · Dolby Vision"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Intel Wi-Fi 6E · Bluetooth 5.3 · optional 5G sub-6"],
        ["Ports", "2× Thunderbolt 4, 2× USB-A 3.2, HDMI 2.1, 3.5 mm combo"],
        ["Security", "dTPM 2.0 · fingerprint match-on-chip · IR camera + shutter"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "57 Wh RapidCharge"],
        ["Charging", "65 W USB-C · 80% in 60 min"],
        ["Runtime (tested)", "9 h 20 m mixed office"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "312.8 × 214.7 × 14.96 mm"],
        ["Weight", "1.09 kg / 2.42 lb"],
        ["Chassis", "Carbon-fiber top, magnesium bottom · MIL-STD-810H"],
        ["Keyboard", "ThinkPad precision, 1.5 mm · TrackPoint + haptic pad"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Pro"],
        ["Warranty", "3-year onsite Premier Support + Corehaus cover"],
      ]),
    ],
    inBox: ["X1 Carbon Gen 12", "65 W USB-C adapter", "ThinkPad sleeve", "Corehaus calibration report"],
  },
  {
    id: "xps-13-snapdragon",
    name: "Dell XPS 13 (9345)",
    shortName: "XPS 13 (9345)",
    brand: "Dell",
    series: "XPS",
    category: "Ultrabook",
    price: 1299,
    rating: 4.5,
    reviews: 97,
    stock: 15,
    year: 2024,
    sku: "CH-DEL-XPS13-04",
    image: "https://image.qwenlm.ai/generated-images/4a3cc636-1ba3-4965-9218-aa5abc272010/_result.png",
    tagline: "Arm-powered Copilot+ with multi-day stamina.",
    highlights: ["Snapdragon X Elite", "45 TOPS NPU", "13.4\" InfinityEdge", "1.19 kg"],
    brief: {
      CPU: "Snapdragon X Elite X1E-80-100 · 12C · 3.4 GHz",
      GPU: "Qualcomm Adreno (integrated)",
      RAM: "16 GB LPDDR5x-8448",
      Storage: "512 GB NVMe SSD",
      Display: "13.4\" FHD+ · 1920×1200 · 60 Hz · 500 nit",
      Battery: "55 Wh · up to 27 h video",
      Weight: "1.19 kg / 2.62 lb",
      Ports: "2× USB4 (USB-C)",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Qualcomm Snapdragon X Elite X1E-80-100"],
        ["Cores", "12× Oryon cores · up to 3.4 GHz"],
        ["NPU", "Hexagon · 45 TOPS (Copilot+)"],
      ]),
      g("Graphics", "gpu", [
        ["GPU", "Qualcomm Adreno integrated · 3.8 TFLOPS"],
        ["Features", "DirectX 12 · AV1 decode"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "16 GB LPDDR5x-8448 (on-board)"],
        ["Storage", "512 GB M.2 PCIe 4.0 NVMe"],
      ]),
      g("Display", "display", [
        ["Panel", "13.4\" InfinityEdge anti-glare"],
        ["Resolution", "1920 × 1200 (FHD+, 16:10)"],
        ["Brightness / Color", "500 nit · 100% sRGB"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Qualcomm FastConnect · Wi-Fi 7 · Bluetooth 5.4"],
        ["Ports", "2× USB4 (40 Gb/s, DP/PD) — USB-A/HDMI via adapter"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "55 Wh"],
        ["Charging", "60 W USB-C"],
        ["Runtime (tested)", "27 h video · 15 h web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "295.3 × 199.1 × 14.8 mm"],
        ["Weight", "1.19 kg / 2.62 lb"],
        ["Chassis", "CNC aluminum, Corning Gorilla Glass 3 palm rest"],
        ["Input", "Seamless glass haptic touchpad · zero-lattice keyboard"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Home (Arm)"],
        ["Warranty", "1-year Premium Support + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["XPS 13 (9345)", "60 W USB-C adapter", "USB-C to USB-A adapter", "Corehaus calibration report"],
  },
  {
    id: "razer-blade-16",
    name: "Razer Blade 16 (2024)",
    shortName: "Blade 16",
    brand: "Razer",
    series: "Blade",
    category: "Gaming",
    price: 3299,
    oldPrice: 3499,
    rating: 4.6,
    reviews: 74,
    stock: 5,
    year: 2024,
    sku: "CH-RZR-B16-05",
    image: "https://image.qwenlm.ai/generated-images/c9ffa312-56ee-45c2-bc4c-009641d97292/_result.png",
    tagline: "CNC-milled flagship. 240 Hz OLED. Zero compromise.",
    highlights: ["RTX 4080 · 175 W", "16\" OLED 240 Hz", "i9-14900HX", "280 W GaN"],
    brief: {
      CPU: "Intel Core i9-14900HX · 24C/32T · 5.8 GHz",
      GPU: "GeForce RTX 4080 · 12 GB · 175 W",
      RAM: "32 GB DDR5-5600 (2× SODIMM)",
      Storage: "1 TB PCIe 4.0 NVMe",
      Display: "16\" OLED · 2560×1600 · 240 Hz · 0.2 ms",
      Battery: "95.2 Wh",
      Weight: "2.45 kg / 5.4 lb",
      Ports: "Thunderbolt 4, 3× USB-A, HDMI 2.1, SD",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Intel Core i9-14900HX (Raptor Lake Refresh)"],
        ["Cores / Threads", "24 cores (8P+16E) / 32 threads"],
        ["Clock speed", "Up to 5.8 GHz"],
        ["TDP", "55 W base · 157 W turbo"],
      ]),
      g("Graphics", "gpu", [
        ["Discrete GPU", "NVIDIA GeForce RTX 4080 Laptop"],
        ["VRAM", "12 GB GDDR6"],
        ["Max TGP", "175 W with Dynamic Boost"],
        ["MUX", "Advanced Optimus + NVIDIA G-Sync"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "32 GB DDR5-5600 (2× 16 GB SODIMM)"],
        ["Max supported", "96 GB DDR5"],
        ["Storage", "1 TB M.2 PCIe 4.0 NVMe"],
        ["Free slot", "1× M.2 2280 (PCIe 4.0)"],
      ]),
      g("Display", "display", [
        ["Panel", "16\" OLED, anti-reflective glossy"],
        ["Resolution", "2560 × 1600 (QHD+, 16:10)"],
        ["Refresh / Response", "240 Hz · 0.2 ms · G-Sync"],
        ["Brightness / Color", "400 nit SDR · 100% DCI-P3 · VESA HDR True Black 500"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Killer Wi-Fi 7 · Bluetooth 5.4"],
        ["Ports", "1× Thunderbolt 4, 3× USB-A 3.2, HDMI 2.1, SD UHS-II, 3.5 mm combo"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "95.2 Wh"],
        ["Charging", "280 W GaN adapter + 140 W USB-C PD 3.1"],
        ["Runtime (tested)", "7 h 10 m video · 4 h 30 m web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "355 × 244 × 16.5–21.95 mm"],
        ["Weight", "2.45 kg / 5.4 lb"],
        ["Chassis", "CNC-milled unibody aluminum, matte black anodized"],
        ["Keyboard", "Per-key Chroma RGB, N-key rollover"],
        ["Audio", "THX Spatial · 6-speaker array"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Home"],
        ["Warranty", "1-year manufacturer + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["Blade 16", "280 W GaN adapter", "Thank-you card", "Microfiber cloth", "Corehaus calibration report"],
  },
  {
    id: "msi-raider-ge78",
    name: "MSI Raider GE78 HX 14V",
    shortName: "Raider GE78 HX",
    brand: "MSI",
    series: "Raider",
    category: "Gaming",
    price: 3999,
    rating: 4.7,
    reviews: 58,
    stock: 3,
    year: 2024,
    sku: "CH-MSI-GE78-06",
    image: "https://image.qwenlm.ai/generated-images/22d2b52b-b71b-46ad-9b5b-b039b0470b06/_result.png",
    tagline: "A desktop replacement with an RTX 4090 inside.",
    highlights: ["RTX 4090 · 175 W", "64 GB DDR5", "17.3\" QHD 240 Hz", "330 W adapter"],
    brief: {
      CPU: "Intel Core i9-14900HX · 24C/32T · 5.8 GHz",
      GPU: "GeForce RTX 4090 · 16 GB · 175 W",
      RAM: "64 GB DDR5-5600 (2× SODIMM)",
      Storage: "2 TB PCIe 4.0 NVMe",
      Display: "17.3\" IPS · 2560×1440 · 240 Hz · 400 nit",
      Battery: "99.9 Wh",
      Weight: "3.10 kg / 6.83 lb",
      Ports: "Thunderbolt 4, 3× USB-A, HDMI 2.1, RJ45, SD",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Intel Core i9-14900HX"],
        ["Cores / Threads", "24 cores / 32 threads"],
        ["Clock speed", "Up to 5.8 GHz"],
        ["Cooling headroom", "Sustained 120 W in Turbo mode"],
      ]),
      g("Graphics", "gpu", [
        ["Discrete GPU", "NVIDIA GeForce RTX 4090 Laptop"],
        ["VRAM", "16 GB GDDR6"],
        ["Max TGP", "175 W (140 W + 35 W Dynamic Boost)"],
        ["MUX", "Discrete-graphics mode via MUX switch"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "64 GB DDR5-5600 (2× 32 GB SODIMM)"],
        ["Max supported", "96 GB DDR5"],
        ["Storage", "2 TB M.2 PCIe 4.0 NVMe"],
        ["Free slot", "1× M.2 2280 (PCIe 5.0 ready)"],
      ]),
      g("Display", "display", [
        ["Panel", "17.3\" IPS-level, anti-glare"],
        ["Resolution", "2560 × 1440 (QHD, 16:9)"],
        ["Refresh", "240 Hz · 3 ms"],
        ["Brightness / Color", "400 nit · 100% DCI-P3"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Killer Wi-Fi 7 · Bluetooth 5.4"],
        ["Ports", "1× Thunderbolt 4, 1× USB-C 3.2, 3× USB-A 3.2, HDMI 2.1, 2.5G RJ45, SD Express, 3.5 mm"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "99.9 Wh (4-cell)"],
        ["Charging", "330 W adapter"],
        ["Runtime (tested)", "4 h 40 m video · 3 h 05 m web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "380 × 298 × 23–28.7 mm"],
        ["Weight", "3.10 kg / 6.83 lb"],
        ["Cooling", "Cooler Boost 5 · 2 fans / 6 pipes"],
        ["Keyboard", "SteelSeries per-key RGB"],
        ["Audio", "Dynaudio 6-speaker · Hi-Res DAC"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Home"],
        ["Warranty", "2-year manufacturer + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["Raider GE78 HX", "330 W adapter", "MSI gaming mouse", "Backpack", "Corehaus calibration report"],
  },
  {
    id: "framework-16",
    name: "Framework Laptop 16",
    shortName: "Framework 16",
    brand: "Framework",
    series: "Framework",
    category: "Creator",
    price: 1769,
    rating: 4.8,
    reviews: 143,
    stock: 10,
    year: 2024,
    sku: "CH-FRW-L16-07",
    image: "https://image.qwenlm.ai/generated-images/cc227e49-7661-4fed-8b02-c7887669a30d/_result.png",
    tagline: "The last laptop you'll ever have to throw away.",
    highlights: ["10/10 repairability", "Hot-swap 85 Wh battery", "Expansion bay modules", "32 GB · user-upgradeable"],
    brief: {
      CPU: "AMD Ryzen 7 7840HS · 8C/16T · 5.1 GHz",
      GPU: "Radeon 780M · GPU-bay ready",
      RAM: "32 GB DDR5-5600 (2× SODIMM, swappable)",
      Storage: "1 TB PCIe 4.0 NVMe",
      Display: "16\" IPS · 2560×1600 · 165 Hz · 500 nit",
      Battery: "85 Wh hot-swappable",
      Weight: "2.10 kg / 4.63 lb",
      Ports: "2× USB4, USB-A, DP — plus expansion cards",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "AMD Ryzen 7 7840HS (Zen 4)"],
        ["Cores / Threads", "8 cores / 16 threads · up to 5.1 GHz"],
        ["NPU", "Ryzen AI · 10 TOPS"],
        ["Mainboard", "User-swappable — upgrade CPU generation later"],
      ]),
      g("Graphics", "gpu", [
        ["iGPU", "AMD Radeon 780M (RDNA 3, 12 CUs)"],
        ["GPU bay", "Expansion bay accepts discrete GPU module (RTX 4070-class)"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "32 GB DDR5-5600 (2× 16 GB SODIMM)"],
        ["Max supported", "96 GB"],
        ["Storage", "1 TB M.2 2280 PCIe 4.0 NVMe"],
        ["Extra slot", "1× M.2 2230 + 1× M.2 2280"],
      ]),
      g("Display", "display", [
        ["Panel", "16\" IPS, 16:10, modular bezel"],
        ["Resolution", "2560 × 1600"],
        ["Refresh / Brightness", "165 Hz · 500 nit"],
        ["Color", "100% sRGB · FreeSync"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Wi-Fi 6E · Bluetooth 5.3 (swappable module)"],
        ["Ports", "2× USB4 (DP/PD), 1× USB-A 3.2, 3.5 mm + 4× Expansion Card slots (HDMI, extra USB-A/C, microSD…)"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "85 Wh — hot-swappable with one screw"],
        ["Charging", "180 W USB-C PD 3.1"],
        ["Runtime (tested)", "9 h 15 m mixed use"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "355.8 × 257.7 × 16.5–20.5 mm"],
        ["Weight", "2.10 kg / 4.63 lb"],
        ["Chassis", "70% recycled aluminum · iFixit repairability 10/10"],
        ["Keyboard", "RGB backlit, swappable per-deck module"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Pro / Ubuntu 22.04 certified"],
        ["Warranty", "3-year manufacturer + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["Framework Laptop 16", "180 W USB-C adapter", "4 expansion cards", "Screwdriver + spare screws", "Corehaus calibration report"],
  },
  {
    id: "lg-gram-17",
    name: "LG Gram 17 (2024)",
    shortName: "Gram 17",
    brand: "LG",
    series: "Gram",
    category: "Ultrabook",
    price: 1499,
    rating: 4.6,
    reviews: 121,
    stock: 18,
    year: 2024,
    sku: "CH-LGG-17-08",
    image: "https://image.qwenlm.ai/generated-images/e064a396-6a12-46c5-a44b-005876bc7f3e/_result.png",
    tagline: "17 inches of screen. 1.35 kg of laptop.",
    highlights: ["17\" WQXGA", "1.35 kg", "80 Wh battery", "MIL-STD-810H"],
    brief: {
      CPU: "Intel Core Ultra 7 155H · 16C/22T",
      GPU: "Intel Arc · 8 Xe-cores",
      RAM: "16 GB LPDDR5x (on-board)",
      Storage: "1 TB PCIe 4.0 NVMe",
      Display: "17\" IPS · 2560×1600 · 350 nit · 99% DCI-P3",
      Battery: "80 Wh · up to 19 h",
      Weight: "1.35 kg / 2.98 lb",
      Ports: "2× Thunderbolt 4, 2× USB-A, HDMI, microSD",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Intel Core Ultra 7 155H"],
        ["Cores / Threads", "16 cores / 22 threads"],
        ["NPU", "Intel AI Boost · 11 TOPS"],
      ]),
      g("Graphics", "gpu", [
        ["GPU", "Intel Arc integrated · 8 Xe-cores"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "16 GB LPDDR5x-6400 (on-board)"],
        ["Storage", "1 TB M.2 PCIe 4.0 NVMe"],
        ["Free slot", "1× M.2 2280"],
      ]),
      g("Display", "display", [
        ["Panel", "17\" IPS anti-glare, 16:10"],
        ["Resolution", "2560 × 1600 (WQXGA)"],
        ["Brightness / Color", "350 nit · 99% DCI-P3"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Wi-Fi 6E · Bluetooth 5.3"],
        ["Ports", "2× Thunderbolt 4, 2× USB-A 3.2, HDMI 2.0, microSD UHS-I, 3.5 mm"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "80 Wh"],
        ["Charging", "65 W USB-C"],
        ["Runtime (tested)", "19 h video · 11 h web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "378.8 × 258.8 × 17.8 mm"],
        ["Weight", "1.35 kg / 2.98 lb"],
        ["Chassis", "Nano-carbon magnesium alloy · MIL-STD-810H"],
        ["Keyboard", "Full-size with numpad, backlit"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Home"],
        ["Warranty", "1-year manufacturer + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["LG Gram 17", "65 W USB-C adapter", "USB-C to HDMI dongle", "Corehaus calibration report"],
  },
  {
    id: "hp-spectre-x360",
    name: "HP Spectre x360 14",
    shortName: "Spectre x360 14",
    brand: "HP",
    series: "Spectre",
    category: "Creator",
    price: 1549,
    rating: 4.7,
    reviews: 89,
    stock: 14,
    year: 2024,
    sku: "CH-HPS-SPX-09",
    image: "https://image.qwenlm.ai/generated-images/22705440-bebe-468c-8245-42a01bce3d4c/_result.png",
    tagline: "A gem-cut 2-in-1 with a 120 Hz OLED canvas.",
    highlights: ["2.8K OLED touch 120 Hz", "2-in-1 + pen", "Core Ultra 7", "Copper gem-cut edge"],
    brief: {
      CPU: "Intel Core Ultra 7 155H · 16C/22T",
      GPU: "Intel Arc · 8 Xe-cores",
      RAM: "16 GB LPDDR5x-7467 (on-board)",
      Storage: "1 TB PCIe 4.0 NVMe",
      Display: "14\" OLED touch · 2880×1800 · 120 Hz",
      Battery: "68 Wh · up to 17 h",
      Weight: "1.44 kg / 3.19 lb",
      Ports: "2× Thunderbolt 4, USB-A, microSD",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Intel Core Ultra 7 155H"],
        ["Cores / Threads", "16 cores / 22 threads · up to 4.8 GHz"],
        ["NPU", "Intel AI Boost · 11 TOPS"],
      ]),
      g("Graphics", "gpu", [
        ["GPU", "Intel Arc integrated · 8 Xe-cores"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "16 GB LPDDR5x-7467 (on-board)"],
        ["Storage", "1 TB M.2 PCIe 4.0 NVMe"],
      ]),
      g("Display", "display", [
        ["Panel", "14\" OLED edge-to-edge glass, touch + pen"],
        ["Resolution", "2880 × 1800 (2.8K, 3:2)"],
        ["Refresh / Brightness", "48–120 Hz variable · 400 nit SDR / 500 nit HDR"],
        ["Color", "100% DCI-P3 · IMAX Enhanced · Eyesafe"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Intel Wi-Fi 7 · Bluetooth 5.4"],
        ["Ports", "2× Thunderbolt 4, 1× USB-A 3.2, microSD, 3.5 mm combo"],
        ["Camera", "9 MP IR + 5 MP, AI noise removal, shutter"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "68 Wh"],
        ["Charging", "65 W USB-C · 50% in 30 min"],
        ["Runtime (tested)", "17 h video · 10 h web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "312 × 218 × 15.7 mm"],
        ["Weight", "1.44 kg / 3.19 lb"],
        ["Chassis", "Gem-cut CNC aluminum, Nightfall black + copper accent"],
        ["Hinge", "360° convertible · tent & tablet modes"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Home"],
        ["Warranty", "1-year Care Pack + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["Spectre x360 14", "HP MPP 2.0 Tilt Pen", "65 W USB-C adapter", "Corehaus calibration report"],
  },
  {
    id: "gigabyte-aorus-16x",
    name: "Gigabyte Aorus 16X (2024)",
    shortName: "Aorus 16X",
    brand: "Gigabyte",
    series: "Aorus",
    category: "Gaming",
    price: 1799,
    oldPrice: 1999,
    rating: 4.5,
    reviews: 66,
    stock: 9,
    year: 2024,
    sku: "CH-GBY-A16-10",
    image: "https://image.qwenlm.ai/generated-images/248160ed-9015-41f2-9152-87181460597d/_result.png",
    tagline: "Windforce-cooled esports value at 165 Hz.",
    highlights: ["RTX 4070 · 115 W", "16\" 165 Hz", "i7-14650HX", "99 Wh battery"],
    brief: {
      CPU: "Intel Core i7-14650HX · 16C/24T · 5.2 GHz",
      GPU: "GeForce RTX 4070 · 8 GB · 115 W",
      RAM: "16 GB DDR5-5600 (2× SODIMM)",
      Storage: "1 TB PCIe 4.0 NVMe",
      Display: "16\" IPS · 2560×1600 · 165 Hz · 400 nit",
      Battery: "99 Wh",
      Weight: "2.30 kg / 5.07 lb",
      Ports: "USB-C (TB4), 3× USB-A, HDMI 2.1, RJ45, SD",
    },
    specs: [
      g("Processor", "cpu", [
        ["Model", "Intel Core i7-14650HX"],
        ["Cores / Threads", "16 cores (8P+8E) / 24 threads"],
        ["Clock speed", "Up to 5.2 GHz"],
      ]),
      g("Graphics", "gpu", [
        ["Discrete GPU", "NVIDIA GeForce RTX 4070 Laptop"],
        ["VRAM", "8 GB GDDR6"],
        ["Max TGP", "115 W with Dynamic Boost"],
        ["MUX", "Hardware MUX switch"],
      ]),
      g("Memory & Storage", "ram", [
        ["Memory", "16 GB DDR5-5600 (2× 8 GB SODIMM)"],
        ["Max supported", "96 GB"],
        ["Storage", "1 TB M.2 PCIe 4.0 NVMe"],
        ["Free slot", "1× M.2 2280"],
      ]),
      g("Display", "display", [
        ["Panel", "16\" IPS anti-glare, 16:10"],
        ["Resolution", "2560 × 1600 (WQXGA)"],
        ["Refresh", "165 Hz · G-Sync"],
        ["Brightness / Color", "400 nit · 100% sRGB"],
      ]),
      g("Connectivity", "wifi", [
        ["Wireless", "Wi-Fi 6E · Bluetooth 5.3"],
        ["Ports", "1× USB-C (Thunderbolt 4), 3× USB-A 3.2, HDMI 2.1, 2.5G RJ45, SD, 3.5 mm"],
      ]),
      g("Battery & Power", "battery", [
        ["Battery", "99 Wh"],
        ["Charging", "230 W adapter + 100 W USB-C PD"],
        ["Runtime (tested)", "6 h 30 m video · 4 h 10 m web"],
      ]),
      g("Design & Build", "scale", [
        ["Dimensions", "354 × 251 × 19.9–26.8 mm"],
        ["Weight", "2.30 kg / 5.07 lb"],
        ["Cooling", "Windforce Infinity · 2 fans / 5 pipes / 118 blades"],
        ["Keyboard", "White-backlit, anti-ghost"],
      ]),
      g("Software & Warranty", "shield", [
        ["OS", "Windows 11 Home"],
        ["Warranty", "2-year manufacturer + Corehaus 2-year cover"],
      ]),
    ],
    inBox: ["Aorus 16X", "230 W adapter", "Aorus sticker pack", "Corehaus calibration report"],
  },
];

export const BRANDS = [...new Set(LAPTOPS.map((l) => l.brand))].sort();
export const CATEGORIES = ["Gaming", "Creator", "Business", "Ultrabook"] as const;

export interface CartLine {
  laptop: Laptop;
  qty: number;
  warranty: boolean;
}

export interface Totals {
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export function cartTotals(lines: CartLine[], promo: string | null): Totals {
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + (l.laptop.price + (l.warranty ? WARRANTY_PRICE : 0)) * l.qty, 0);
  const p = promo ? PROMOS[promo] : undefined;
  const discount = p?.kind === "percent" ? Math.round(subtotal * p.value) : 0;
  const shipFree = p?.kind === "ship" || subtotal - discount >= FREE_SHIPPING_THRESHOLD;
  const shipping = lines.length === 0 || shipFree ? 0 : SHIPPING_FLAT;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  return { count, subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax };
}

export const luhn = (num: string): boolean => {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 15) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
};

export const cardBrand = (num: string): "visa" | "mastercard" | "amex" | null => {
  const d = num.replace(/\D/g, "");
  if (d.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  return null;
};

export const fmt = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
export const fmt2 = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const REVIEW_QUOTES = [
  { quote: "The calibration report in the box isn't marketing — my G14 measured ΔE 0.8 out of the carton.", name: "Dana R.", role: "Colorist, post-house", rating: 5 },
  { quote: "Ordered Tuesday 2 PM, gaming on the Blade Wednesday night. The checkout took 40 seconds.", name: "Marcus T.", role: "Esports coach", rating: 5 },
  { quote: "Their compare table settled a two-week debate between the X1 Carbon and the Gram. Bought both, ironically.", name: "Priya S.", role: "IT procurement lead", rating: 5 },
  { quote: "Framework arrived with every module labeled and a stress-test log. This is how hardware should ship.", name: "Jonas K.", role: "Self-hosting enthusiast", rating: 4 },
  { quote: "Support answered a RAM-compatibility question in 11 minutes. On a Sunday.", name: "Elif A.", role: "Data engineer", rating: 5 },
  { quote: "The Raider GE78 replaced my desktop and my space heater. 10/10 would throttle thermals again.", name: "Chris B.", role: "3D generalist", rating: 4 },
];
