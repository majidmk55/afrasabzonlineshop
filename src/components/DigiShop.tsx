import { useState } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { ICpu, IDisplay, IGpu, IRam, IFilter, IChevron, ICompare } from "./icons";

interface DigiShopProps {
  products: Laptop[];
  onSpecs: (id: string) => void;
  onBrand: (brand: string) => void;
  onToggleCompare?: (id: string) => void;
  compareIds?: string[];
}

const BRANDS = [
  { fa: "اچ‌پی", en: "HP", src: "https://cdn.simpleicons.org/hp/0096D6" },
  { fa: "لنوو", en: "Lenovo", src: "https://cdn.simpleicons.org/lenovo/E2231A" },
  { fa: "اپل", en: "Apple", src: "https://cdn.simpleicons.org/apple/000000" },
  { fa: "ام‌اس‌آی", en: "MSI", src: "https://cdn.simpleicons.org/msi/FF0000" },
  { fa: "ایسوس", en: "ASUS", src: "https://cdn.simpleicons.org/asus/00539B" },
  { fa: "ایسر", en: "Acer", src: "https://cdn.simpleicons.org/acer/83B81A" },
  { fa: "دل", en: "Dell", src: "https://cdn.simpleicons.org/dell/0672CB" },
  { fa: "مایکروسافت", en: "Microsoft", src: "https://cdn.simpleicons.org/microsoft/000000" },
];

const SORT_OPTIONS = [
  { id: "bestseller", label: "پرفروش ترین", active: true },
  { id: "highprice", label: "بیشترین قیمت" },
  { id: "lowprice", label: "کمترین قیمت" },
  { id: "newest", label: "جدیدترین" },
  { id: "discount", label: "بیشترین تخفیف" },
];

const FILTER_ITEMS = [
  "فقط کالاهای موجود",
  "فیلتر بر اساس قیمت",
  "برندها",
  "ظرفیت حافظه RAM",
  "نوع پنل",
  "ابعاد نمایشگر",
  "صفحه نمایش لمسی",
  "پوشش نمایشگر",
  "سری پردازنده مرکزی",
  "نسل پردازنده مرکزی",
  "نوع پردازنده گرافیکی",
  "مدل پردازنده گرافیکی",
  "ظرفیت حافظه HDD",
  "ظرفیت حافظه SSD",
  "وب‌کم",
  "حسگر اثر انگشت",
  "سیم‌کارت",
  "باتری",
  "رنگ",
  "سری لپ‌تاپ",
  "کاربرد لپ‌تاپ",
];

function ProductCard({ product, onSpecs, onToggleCompare, compared }: { product: Laptop; onSpecs: (id: string) => void; onToggleCompare?: (id: string) => void; compared?: boolean }) {
  const cpu = product.brief.find((b) => b[0] === "پردازنده")?.[1] ?? "—";
  const gpu = product.brief.find((b) => b[0] === "گرافیک")?.[1] ?? "—";
  const ram = product.brief.find((b) => b[0] === "رم / حافظه")?.[1] ?? "—";
  const display = product.brief.find((b) => b[0] === "نمایشگر")?.[1] ?? "—";

  // حذف نام شرکت‌های سازنده از مشخصات
  const removeBrand = (text: string) => {
    return text
      .split(" ")
      .filter(word => !["APPLE", "AMD", "INTEL", "NVIDIA", "Apple", "Amd", "Intel", "Nvidia", "apple", "amd", "intel", "nvidia"].includes(word))
      .join(" ");
  };

  const cpuShort = removeBrand(cpu).split(" ").slice(0, 3).join(" ");
  const gpuShort = removeBrand(gpu).split(" ").slice(0, 2).join(" ");
  const ramShort = removeBrand(ram).split(" ")[0];
  const displayShort = removeBrand(display).split(" ")[0];

  return (
    <div
      className="group relative flex h-full w-full flex-col rounded-xl border border-[#e5e7eb] bg-white p-4 text-right transition-all duration-200 hover:border-[#3b82f6] hover:shadow-lg"
    >
      {/* دکمه مقایسه */}
      {onToggleCompare && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product.id);
          }}
          className={`absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
            compared ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#e5e7eb] bg-white text-[#666] hover:border-[#2563eb] hover:text-[#2563eb]"
          }`}
          aria-label={compared ? "حذف از مقایسه" : "افزودن به مقایسه"}
        >
          <ICompare size={16} />
        </button>
      )}
      
      {/* تصویر */}
      <button onClick={() => onSpecs(product.id)} className="relative mb-3 flex h-[180px] items-center justify-center overflow-hidden rounded-lg bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* نقطه‌های رنگی */}
        {product.oldPrice && (
          <div className="absolute right-2 top-2 flex gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="h-2 w-2 rounded-full bg-gray-500" />
          </div>
        )}
      </button>

      {/* آیکون‌های مشخصات */}
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#f0f0f0] pb-3">
        <div className="flex flex-col items-center gap-1">
          <IRam size={16} className="text-[#666]" />
          <span className="text-[9px] text-[#666]">{ramShort}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ICpu size={16} className="text-[#666]" />
          <span className="text-[9px] text-[#666]">{cpuShort}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <IGpu size={16} className="text-[#666]" />
          <span className="text-[9px] text-[#666]">{gpuShort}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <IDisplay size={16} className="text-[#666]" />
          <span className="text-[9px] text-[#666]">{displayShort}</span>
        </div>
      </div>

      {/* نام محصول */}
      <h3 className="mb-2 line-clamp-2 h-[44px] text-[13px] leading-[1.7] text-[#333] transition-colors group-hover:text-[#2563eb]">
        {product.name}
      </h3>

      {/* امتیاز و موجودی */}
      <div className="mb-2 flex items-center gap-2">
        <span className="flex items-center gap-0.5 text-[12px]">
          <span className="text-yellow-400">★</span>
          <span className="text-[#666]">{toFa(product.rating.toFixed(1))}</span>
        </span>
        {product.stock <= 5 && (
          <span className="flex items-center gap-1 text-[11px] text-[#dc2626]">
            <span>⚠</span>
            <span>{toFa(product.stock)} عدد باقی مانده</span>
          </span>
        )}
      </div>

      {/* قیمت */}
      <div className="mt-auto flex items-center justify-end">
        <div className="rounded-lg border border-[#e5e7eb] px-4 py-2">
          <span className="text-[14px] font-bold text-[#2c2c2c]">{fmt(product.price)}</span>
        </div>
      </div>
    </div>
  );
}

function FilterSidebar() {
  const [openFilters, setOpenFilters] = useState<number[]>([]);

  const toggleFilter = (index: number) => {
    setOpenFilters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // داده‌های فیلترها با زیرشاخه‌های کامل
  const filterData = {
    brands: [
      { name: "اپل", count: 2 },
      { name: "ایسوس", count: 1 },
      { name: "لنوو", count: 1 },
      { name: "دل", count: 1 },
      { name: "اچ‌پی", count: 1 },
      { name: "مایکروسافت", count: 1 },
      { name: "ایسر", count: 1 },
      { name: "ام‌اس‌آی", count: 1 },
      { name: "ریزر", count: 1 },
      { name: "فریم‌ورک", count: 1 },
      { name: "ال‌جی", count: 1 },
      { name: "گیگابایت", count: 1 },
    ],
    ram: ["8 گیگابایت", "16 گیگابایت", "32 گیگابایت", "64 گیگابایت"],
    panel: ["IPS", "OLED", "Mini-LED", "TFT"],
    screenSize: ["13 اینچ", "14 اینچ", "15.6 اینچ", "16 اینچ", "17 اینچ"],
    touchscreen: ["لمسی", "غیر لمسی"],
    screenCover: ["مات", "براق"],
    cpuSeries: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Core Ultra", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3", "Apple M4", "Snapdragon X"],
    cpuGen: ["نسل 11 اینتل", "نسل 12 اینتل", "نسل 13 اینتل", "نسل 14 اینتل", "AMD Zen 3", "AMD Zen 4", "AMD Zen 5", "Apple Silicon"],
    gpuType: ["یکپارچه", "مجزا"],
    gpuModel: ["Intel Iris Xe", "Intel Arc", "NVIDIA GTX 1650", "NVIDIA RTX 3050", "NVIDIA RTX 4050", "NVIDIA RTX 4060", "NVIDIA RTX 4070", "NVIDIA RTX 4080", "NVIDIA RTX 4090", "NVIDIA RTX 5070", "NVIDIA RTX 5090", "AMD Radeon", "Apple M Series"],
    hdd: ["ندارد", "500 گیگابایت", "1 ترابایت", "2 ترابایت"],
    ssd: ["256 گیگابایت", "512 گیگابایت", "1 ترابایت", "2 ترابایت", "4 ترابایت"],
    webcam: ["ندارد", "720p HD", "1080p Full HD", "1440p QHD", "IR (تشخیص چهره)"],
    fingerprint: ["ندارد", "روی دکمه پاور", "روی تاچ‌پد", "مجزا"],
    simCard: ["ندارد", "4G LTE", "5G"],
    battery: ["40-50 وات‌ساعت", "50-60 وات‌ساعت", "60-70 وات‌ساعت", "70-80 وات‌ساعت", "80-90 وات‌ساعت", "90+ وات‌ساعت"],
    color: ["مشکی", "سفید", "نقره‌ای", "خاکستری", "آبی", "طلایی", "سبز", "قرمز"],
    laptopSeries: ["IdeaPad", "ThinkPad", "Yoga", "Legion", "ROG", "VivoBook", "ZenBook", "TUF", "Predator", "Swift", "Aspire", "Nitro", "Pavilion", "Victus", "Omen", "Spectre", "Envy", "XPS", "Inspiron", "Latitude", "Precision", "Surface", "Gram", "Gram Pro", "MacBook Air", "MacBook Pro", "Aorus", "Prestige", "Katana", "Creator", "Framework"],
    laptopUsage: ["گیمینگ", "اداری و کاری", "دانشجویی", "طراحی و گرافیک", "برنامه‌نویسی", "مهندسی", "ترید و بورس", "مولتی‌مدیا", "اولترابوک", "ورک‌استیشن"],
  };

  return (
    <aside className="sticky top-5 w-[230px] rounded-xl border border-[#e5e7eb] bg-white" style={{ maxHeight: "calc(100vh - 40px)" }}>
      {/* هدر */}
      <div className="flex h-[52px] items-center justify-between border-b border-[#e8e8e8] px-4">
        <div className="flex items-center gap-2">
          <IFilter size={18} className="text-[#333]" />
          <span className="text-[15px] font-bold text-[#333]">فیلترها</span>
        </div>
        <IChevron size={16} className="text-[#999] rotate-90" />
      </div>

      {/* آیتم‌های فیلتر */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 92px)" }}>
        {FILTER_ITEMS.map((item, index) => (
          <div key={index} className="border-b border-[#f0f0f0] transition-colors hover:bg-[#f9f9f9]">
            <button
              onClick={() => toggleFilter(index)}
              className="flex h-[46px] w-full items-center justify-between px-4"
            >
              <span className="text-[13px] text-[#333]">{item}</span>
              <IChevron
                size={16}
                className={`text-[#999] transition-transform duration-300 ${
                  openFilters.includes(index) ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* محتوای فیلتر */}
            {openFilters.includes(index) && (
              <div className="border-t border-[#f0f0f0] bg-[#fafafa] p-4">
                {index === 0 && (
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-[13px] text-[#333]">فقط کالاهای موجود</span>
                    <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                  </label>
                )}

                {index === 1 && (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="400000000"
                      step="5000000"
                      className="w-full accent-[#2563eb]"
                    />
                    <div className="flex justify-between text-[11px] text-[#666]">
                      <span>۰</span>
                      <span>۴۰۰ میلیون ریال</span>
                    </div>
                  </div>
                )}

                {index === 2 && (
                  <div className="space-y-2">
                    {filterData.brands.map((brand) => (
                      <label key={brand.name} className="flex cursor-pointer items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                          <span className="text-[13px] text-[#333]">{brand.name}</span>
                        </div>
                        <span className="text-[11px] text-[#999]">({brand.count})</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 3 && (
                  <div className="space-y-2">
                    {filterData.ram.map((ram) => (
                      <label key={ram} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{ram}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 4 && (
                  <div className="space-y-2">
                    {filterData.panel.map((panel) => (
                      <label key={panel} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{panel}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 5 && (
                  <div className="space-y-2">
                    {filterData.screenSize.map((size) => (
                      <label key={size} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{size}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 6 && (
                  <div className="space-y-2">
                    {filterData.touchscreen.map((touch) => (
                      <label key={touch} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{touch}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 7 && (
                  <div className="space-y-2">
                    {filterData.screenCover.map((cover) => (
                      <label key={cover} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{cover}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 8 && (
                  <div className="space-y-2">
                    {filterData.cpuSeries.map((cpu) => (
                      <label key={cpu} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{cpu}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 9 && (
                  <div className="space-y-2">
                    {filterData.cpuGen.map((gen) => (
                      <label key={gen} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{gen}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 10 && (
                  <div className="space-y-2">
                    {filterData.gpuType.map((gpu) => (
                      <label key={gpu} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{gpu}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 11 && (
                  <div className="space-y-2">
                    {filterData.gpuModel.map((gpu) => (
                      <label key={gpu} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{gpu}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 12 && (
                  <div className="space-y-2">
                    {filterData.hdd.map((hdd) => (
                      <label key={hdd} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{hdd}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 13 && (
                  <div className="space-y-2">
                    {filterData.ssd.map((ssd) => (
                      <label key={ssd} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{ssd}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 14 && (
                  <div className="space-y-2">
                    {filterData.webcam.map((webcam) => (
                      <label key={webcam} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{webcam}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 15 && (
                  <div className="space-y-2">
                    {filterData.fingerprint.map((fingerprint) => (
                      <label key={fingerprint} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{fingerprint}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 16 && (
                  <div className="space-y-2">
                    {filterData.simCard.map((sim) => (
                      <label key={sim} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{sim}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 17 && (
                  <div className="space-y-2">
                    {filterData.battery.map((battery) => (
                      <label key={battery} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{battery}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 18 && (
                  <div className="space-y-2">
                    {filterData.color.map((color) => (
                      <label key={color} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{color}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 19 && (
                  <div className="space-y-2">
                    {filterData.laptopSeries.map((series) => (
                      <label key={series} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{series}</span>
                      </label>
                    ))}
                  </div>
                )}

                {index === 20 && (
                  <div className="space-y-2">
                    {filterData.laptopUsage.map((usage) => (
                      <label key={usage} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{usage}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function DigiShop({ products, onSpecs, onBrand, onToggleCompare, compareIds }: DigiShopProps) {
  const [sortBy, setSortBy] = useState("bestseller");
  const displayProducts = products.slice(0, 10); // فقط ۱۰ محصول

  return (
    <div className="mx-auto max-w-[90%] px-2 py-6 sm:px-4">
      {/* نوار لوگو برندها */}
      <section className="mb-4 flex items-center justify-center gap-8 rounded-xl bg-white py-4">
        {BRANDS.map((brand) => (
          <button
            key={brand.en}
            onClick={() => onBrand(brand.fa)}
            className="group transition-all hover:scale-110"
            title={brand.fa}
          >
            <img
              src={brand.src}
              alt={brand.en}
              className="h-14 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100"
              loading="lazy"
            />
          </button>
        ))}
      </section>

      {/* بخش ۲: نوار ابزار */}
      <section className="mb-4 flex items-center justify-between rounded-[10px] bg-[#f3f4f6] px-4 py-3">
        {/* سمت راست: مرتب‌سازی */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[13px] font-bold text-[#333]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            مرتب‌سازی:
          </span>
          <div className="flex items-center gap-5">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`text-[13px] transition-colors ${
                  sortBy === option.id
                    ? "font-bold text-[#2563eb]"
                    : "text-[#666] hover:text-[#333]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* سمت چپ: تعداد کالا و دکمه مقایسه */}
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-[#666]">{toFa(displayProducts.length)} کالا</span>
          <button className="rounded-lg bg-[#1e3a5f] px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#2563eb]">
            مقایسه
          </button>
        </div>
      </section>

      {/* بخش ۳ و ۴: گرید محصولات + پنل فیلتر */}
      <div className="flex gap-4">
        {/* پنل فیلتر */}
        <FilterSidebar />

        {/* گرید محصولات */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSpecs={onSpecs} onToggleCompare={onToggleCompare} compared={compareIds?.includes(product.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
