import { type Laptop } from "../data/laptops";

interface ProfessionalComparisonTableProps {
  products: Laptop[];
}

export default function ProfessionalComparisonTable({ products }: ProfessionalComparisonTableProps) {
  if (products.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white">
      {/* SECTION 1: Display */}
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">نمایشگر</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">اندازه</div>
            {products.map((laptop) => {
              const displaySpec = laptop.specs.find(s => s.title === "صفحه نمایش");
              const size = displaySpec?.rows.find(r => r[0] === "اندازه صفحه نمایش")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{size}</div>
              );
            })}
          </div>
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">نوع</div>
            {products.map((laptop) => {
              const displaySpec = laptop.specs.find(s => s.title === "صفحه نمایش");
              const type = displaySpec?.rows.find(r => r[0] === "نوع پنل")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{type}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">نرخ نوسازی</div>
            {products.map((laptop) => {
              const displaySpec = laptop.specs.find(s => s.title === "صفحه نمایش");
              const refresh = displaySpec?.rows.find(r => r[0] === "نرخ نوسازی")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{refresh}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Battery */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">باتری</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">ظرفیت باتری</div>
            {products.map((laptop) => {
              const batterySpec = laptop.specs.find(s => s.title === "باتری و شارژ");
              const capacity = batterySpec?.rows.find(r => r[0] === "ظرفیت باتری")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{capacity}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">نوع باتری</div>
            {products.map((laptop) => {
              const batterySpec = laptop.specs.find(s => s.title === "باتری و شارژ");
              const type = batterySpec?.rows.find(r => r[0] === "نوع باتری")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{type}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: RAM */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">RAM</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">حجم RAM</div>
            {products.map((laptop) => {
              const ramSpec = laptop.specs.find(s => s.title === "حافظه رم");
              const size = ramSpec?.rows.find(r => r[0] === "حافظه داخلی رم")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{size}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">نوع</div>
            {products.map((laptop) => {
              const ramSpec = laptop.specs.find(s => s.title === "حافظه رم");
              const type = ramSpec?.rows.find(r => r[0] === "نوع حافظه")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{type}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: Storage */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">ذخیره‌سازی</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">حجم ذخیره‌سازی</div>
            {products.map((laptop) => {
              const storageSpec = laptop.specs.find(s => s.title === "ذخیره‌سازی");
              const size = storageSpec?.rows.find(r => r[0] === "ظرفیت کلی")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{size}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">نوع</div>
            {products.map((laptop) => {
              const storageSpec = laptop.specs.find(s => s.title === "ذخیره‌سازی");
              const type = storageSpec?.rows.find(r => r[0] === "نوع")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{type}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 5: Sound */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">صدا</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">بلندگوها</div>
            {products.map((laptop) => {
              const soundSpec = laptop.specs.find(s => s.title === "صدا");
              const speakers = soundSpec?.rows.find(r => r[0] === "بلندگوها")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{speakers}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">Dolby Atmos</div>
            {products.map((laptop) => {
              const soundSpec = laptop.specs.find(s => s.title === "صدا");
              const dolby = soundSpec?.rows.find(r => r[0] === "Dolby Atmos")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{dolby}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 6: Connectivity */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">اتصالات</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">استاندارد Wi-Fi</div>
            {products.map((laptop) => {
              const connSpec = laptop.specs.find(s => s.title === "اتصالات");
              const wifi = connSpec?.rows.find(r => r[0] === "استاندارد Wi-Fi")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{wifi}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">بلوتوث</div>
            {products.map((laptop) => {
              const connSpec = laptop.specs.find(s => s.title === "اتصالات");
              const bluetooth = connSpec?.rows.find(r => r[0] === "بلوتوث")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{bluetooth}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 7: Ports */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">پورت‌ها</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">USB-A</div>
            {products.map((laptop) => {
              const portSpec = laptop.specs.find(s => s.title === "پورت‌ها");
              const usbA = portSpec?.rows.find(r => r[0] === "USB-A")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{usbA}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">USB Type-C</div>
            {products.map((laptop) => {
              const portSpec = laptop.specs.find(s => s.title === "پورت‌ها");
              const usbC = portSpec?.rows.find(r => r[0] === "USB Type-C")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{usbC}</div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
