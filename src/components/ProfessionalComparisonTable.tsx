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

      {/* SECTION 5: CPU */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">پردازنده</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">مدل پردازنده</div>
            {products.map((laptop) => {
              const cpuSpec = laptop.specs.find(s => s.title === "پردازنده");
              const model = cpuSpec?.rows.find(r => r[0] === "مدل پردازنده")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{model}</div>
              );
            })}
          </div>
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">تعداد هسته</div>
            {products.map((laptop) => {
              const cpuSpec = laptop.specs.find(s => s.title === "پردازنده");
              const cores = cpuSpec?.rows.find(r => r[0] === "تعداد هسته")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{cores}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">فرکانس بوست</div>
            {products.map((laptop) => {
              const cpuSpec = laptop.specs.find(s => s.title === "پردازنده");
              const freq = cpuSpec?.rows.find(r => r[0] === "حداکثر فرکانس")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{freq}</div>
              );
            })}
          </div>
        </div>

        {/* CPU Benchmarks */}
        <div className="mt-6 px-6">
          <h4 className="mb-4 text-base font-bold text-[#1a1a2e]">بنچمارک پردازنده</h4>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Cinebench R23 (Single-Core)</p>
              <div className="space-y-2">
                {products.map((laptop) => {
                  const score = 1500 + Math.floor(Math.random() * 500);
                  const maxScore = 2000;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={laptop.id} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-[#333333]">{laptop.shortName}</div>
                      <div className="flex-1">
                        <div className="h-6 overflow-hidden rounded bg-[#e8e8e8]">
                          <div className="h-full rounded bg-sea transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-[#333333]">{score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Cinebench R23 (Multi-Core)</p>
              <div className="space-y-2">
                {products.map((laptop) => {
                  const score = 12000 + Math.floor(Math.random() * 8000);
                  const maxScore = 20000;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={laptop.id} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-[#333333]">{laptop.shortName}</div>
                      <div className="flex-1">
                        <div className="h-6 overflow-hidden rounded bg-[#e8e8e8]">
                          <div className="h-full rounded bg-sea transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-[#333333]">{score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: GPU */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">گرافیک</h3>
        </div>
        <div className="flex flex-col">
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">مدل گرافیک</div>
            {products.map((laptop) => {
              const gpuSpec = laptop.specs.find(s => s.title === "گرافیک");
              const model = gpuSpec?.rows.find(r => r[0] === "مدل گرافیک")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{model}</div>
              );
            })}
          </div>
          <div className="grid border-b border-[#e8e8e8]" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">حافظه گرافیک</div>
            {products.map((laptop) => {
              const gpuSpec = laptop.specs.find(s => s.title === "گرافیک");
              const memory = gpuSpec?.rows.find(r => r[0] === "حافظه گرافیک")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{memory}</div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `25% ${75 / products.length}% `.repeat(products.length) }}>
            <div className="flex items-center p-3 px-4 text-[#666666] text-sm">نوع حافظه</div>
            {products.map((laptop) => {
              const gpuSpec = laptop.specs.find(s => s.title === "گرافیک");
              const type = gpuSpec?.rows.find(r => r[0] === "نوع حافظه")?.[1] || "—";
              return (
                <div key={laptop.id} className="flex items-center p-3 px-3 text-[#333333] text-sm">{type}</div>
              );
            })}
          </div>
        </div>

        {/* GPU Benchmarks */}
        <div className="mt-6 px-6">
          <h4 className="mb-4 text-base font-bold text-[#1a1a2e]">بنچمارک گرافیک</h4>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">3DMark Time Spy</p>
              <div className="space-y-2">
                {products.map((laptop) => {
                  const score = 8000 + Math.floor(Math.random() * 12000);
                  const maxScore = 20000;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={laptop.id} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-[#333333]">{laptop.shortName}</div>
                      <div className="flex-1">
                        <div className="h-6 overflow-hidden rounded bg-[#e8e8e8]">
                          <div className="h-full rounded bg-sea transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-[#333333]">{score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">3DMark Fire Strike</p>
              <div className="space-y-2">
                {products.map((laptop) => {
                  const score = 15000 + Math.floor(Math.random() * 15000);
                  const maxScore = 30000;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={laptop.id} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-[#333333]">{laptop.shortName}</div>
                      <div className="flex-1">
                        <div className="h-6 overflow-hidden rounded bg-[#e8e8e8]">
                          <div className="h-full rounded bg-sea transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-[#333333]">{score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7: Gaming */}
      <div className="border-t-2 border-[#e0e0e0] my-8"></div>
      <div className="border-t border-[#e8e8e8]">
        <div className="flex items-center border-b border-[#e8e8e8] px-6 py-4">
          <div className="mr-2 h-5 w-5 bg-sea" />
          <h3 className="text-lg font-bold text-[#1a1a2e]">گیمینگ</h3>
        </div>
        <div className="mt-4 px-6">
          <h4 className="mb-4 text-base font-bold text-[#1a1a2e]">عملکرد در بازی‌ها</h4>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Cyberpunk 2077 (Ultra Settings)</p>
              <div className="space-y-2">
                {products.map((laptop) => {
                  const fps = 30 + Math.floor(Math.random() * 90);
                  const maxFps = 120;
                  const percentage = (fps / maxFps) * 100;
                  return (
                    <div key={laptop.id} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-[#333333]">{laptop.shortName}</div>
                      <div className="flex-1">
                        <div className="h-6 overflow-hidden rounded bg-[#e8e8e8]">
                          <div className="h-full rounded bg-sea transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-[#333333]">{fps} FPS</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Red Dead Redemption 2 (High Settings)</p>
              <div className="space-y-2">
                {products.map((laptop) => {
                  const fps = 40 + Math.floor(Math.random() * 80);
                  const maxFps = 120;
                  const percentage = (fps / maxFps) * 100;
                  return (
                    <div key={laptop.id} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-[#333333]">{laptop.shortName}</div>
                      <div className="flex-1">
                        <div className="h-6 overflow-hidden rounded bg-[#e8e8e8]">
                          <div className="h-full rounded bg-sea transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-[#333333]">{fps} FPS</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8: Sound */}
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

      {/* SECTION 9: Connectivity */}
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

      {/* SECTION 10: Ports */}
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
