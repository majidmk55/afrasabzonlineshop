import { useState } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { ICpu, IDisplay, IGpu, IRam, IFilter, IChevron } from "./icons";

interface DigiShopProps {
  products: Laptop[];
  onSpecs: (id: string) => void;
  onBrand: (brand: string) => void;
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
];

function ProductCard({ product, onSpecs }: { product: Laptop; onSpecs: (id: string) => void }) {
  const cpu = product.brief.find((b) => b[0] === "پردازنده")?.[1] ?? "—";
  const gpu = product.brief.find((b) => b[0] === "گرافیک")?.[1] ?? "—";
  const ram = product.brief.find((b) => b[0] === "رم / حافظه")?.[1] ?? "—";
  const display = product.brief.find((b) => b[0] === "نمایشگر")?.[1] ?? "—";

  const cpuShort = cpu.split(" ").slice(0, 3).join(" ");
  const gpuShort = gpu.split(" ").slice(0, 2).join(" ");
  const ramShort = ram.split(" ")[0];
  const displayShort = display.split(" ")[0];

  return (
    <button
      onClick={() => onSpecs(product.id)}
      className="group flex h-full w-full flex-col rounded-xl border border-[#e5e7eb] bg-white p-4 text-right transition-all duration-200 hover:border-[#3b82f6] hover:shadow-lg"
    >
      {/* تصویر */}
      <div className="relative mb-3 flex h-[180px] items-center justify-center overflow-hidden rounded-lg bg-white">
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
      </div>

      {/* آیکون‌های مشخصات */}
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#f0f0f0] pb-3">
        <div className="flex flex-col items-center gap-1">
          <IRam size={20} className="text-[#666]" />
          <span className="text-[11px] text-[#666]">{ramShort}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ICpu size={20} className="text-[#666]" />
          <span className="text-[11px] text-[#666]">{cpuShort}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <IDisplay size={20} className="text-[#666]" />
          <span className="text-[11px] text-[#666]">{displayShort}</span>
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
      <div className="mt-auto flex items-baseline justify-end gap-1">
        <span className="text-[16px] font-bold text-[#2c2c2c]">{fmt(product.price)}</span>
        <span className="text-[11px] text-[#666]">ریال</span>
      </div>
    </button>
  );
}

function FilterSidebar() {
  const [openFilters, setOpenFilters] = useState<number[]>([]);

  const toggleFilter = (index: number) => {
    setOpenFilters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <aside className="sticky top-5 w-[300px] rounded-xl border border-[#e5e7eb] bg-white" style={{ maxHeight: "calc(100vh - 40px)" }}>
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
                {index === 0 ? (
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-[13px] text-[#333]">فقط کالاهای موجود</span>
                    <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                  </label>
                ) : index === 1 ? (
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
                      <span>۴۰۰ میلیون</span>
                    </div>
                  </div>
                ) : index === 2 ? (
                  <div className="space-y-2">
                    {BRANDS.slice(0, 5).map((b) => (
                      <label key={b.en} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-[#2563eb]" />
                        <span className="text-[13px] text-[#333]">{b.fa}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-[#999]">فیلترهای بیشتر به‌زودی...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function DigiShop({ products, onSpecs, onBrand }: DigiShopProps) {
  const [sortBy, setSortBy] = useState("bestseller");
  const displayProducts = products.slice(0, 10); // فقط ۱۰ محصول

  return (
    <div className="mx-auto max-w-[80%] px-2 py-6 sm:px-4">
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
              style={{
                filter: "brightness(0) saturate(100%) invert(75%) sepia(10%) saturate(500%) hue-rotate(180deg) brightness(60%) contrast(90%)"
              }}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSpecs={onSpecs} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
