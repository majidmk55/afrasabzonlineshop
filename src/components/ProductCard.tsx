import { type Laptop } from "../data/laptops";
import { ICpu, IDisplay, IGpu, IRam, IStar } from "./icons";

/* ---------- استخراج مقادیر کوتاه از داده‌های کالا (به سبک کارت‌های فروشگاهی) ---------- */

const brief = (p: Laptop, key: string) => p.brief.find((b) => b[0] === key)?.[1] ?? "";

function shortCpu(p: Laptop): string {
  return brief(p, "پردازنده")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/^(Intel|AMD|Apple|Qualcomm)\s+(Core\s+)?/i, "")
    .replace(/\s+X1E-\d+-\d+/, "")
    .replace(/Zen\s+\d+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim() || "—";
}

function shortRam(p: Laptop): string {
  return brief(p, "رم / حافظه").match(/(\d+\s?GB)/)?.[1]?.replace(/\s/, "") ?? "—";
}

function shortStorage(p: Laptop): string {
  const m = brief(p, "رم / حافظه").match(/\d+\s?(?:GB|TB)/g);
  return m && m.length > 1 ? m[1].replace(/\s/, "") : (m?.[0]?.replace(/\s/, "") ?? "—");
}

function shortGpu(p: Laptop): string {
  const v = brief(p, "گرافیک");
  const m = v.match(/RTX \d{4}|Radeon \w+|Arc \w+|Adreno \w+/);
  if (m) return m[0];
  if (p.brand === "اپل") return `${shortCpu(p)} GPU`;
  return v.split("·")[0].trim() || "—";
}

function shortDisplay(p: Laptop): string {
  const m = brief(p, "نمایشگر").match(/^(\d+(?:\.\d+)?)/);
  return m ? `${m[1]} inch` : "—";
}

/* ---------- کامپوننت کارت محصول (سبک فروشگاه‌های آنلاین ایرانی) ---------- */

interface ProductCardProps {
  laptop: Laptop;
  onOpen: (id: string) => void;
  className?: string;
}

export default function ProductCard({ laptop, onOpen, className = "" }: ProductCardProps) {
  const specs = [
    { Icon: ICpu, value: shortCpu(laptop), label: "پردازنده" },
    { Icon: IRam, value: shortRam(laptop), label: "رم" },
    { Icon: IDisplay, value: shortDisplay(laptop), label: "صفحه نمایش" },
    { Icon: IGpu, value: shortGpu(laptop), label: "گرافیک" },
  ];

  /* نام کامل به فرمت رایج فروشگاه‌های ایرانی */
  const fullName = `لپ‌تاپ ${laptop.brand} ${shortDisplay(laptop).replace(" inch", " اینچی")} مدل ${laptop.series} ${shortCpu(laptop)} ${shortRam(laptop)} ${shortStorage(laptop)} ${shortGpu(laptop)}`;

  const toman = (laptop.price / 10).toLocaleString("fa-IR");
  const rating = laptop.rating.toLocaleString("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <article
      className={`group flex flex-col rounded-[16px] border border-line bg-white p-[20px] shadow-[0_1px_3px_rgba(10,42,67,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(10,42,67,0.16)] ${className}`}
    >
      {/* تصویر محصول + نشانگر اسلایدر */}
      <div className="relative">
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c9ced4]" aria-hidden="true" />
        <button onClick={() => onOpen(laptop.id)} aria-label={`مشاهده ${laptop.name}`} className="block w-full">
          <img
            src={laptop.image}
            alt={laptop.name}
            loading="lazy"
            decoding="async"
            className="mx-auto h-44 w-full rounded-lg bg-white object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </button>
      </div>

      {/* چهار مشخصه اصلی با آیکون */}
      <ul className="mt-4 flex flex-row items-start justify-around gap-2">
        {specs.map((s) => (
          <li key={s.label} className="flex min-w-0 flex-col items-center gap-2">
            <s.Icon size={28} className="shrink-0 text-[#4a4a4a]" />
            <span
              dir="ltr"
              title={`${s.label}: ${s.value}`}
              className="max-w-[70px] truncate text-center text-[13px] leading-none text-[#333]"
            >
              {s.value}
            </span>
          </li>
        ))}
      </ul>

      {/* نام محصول */}
      <button onClick={() => onOpen(laptop.id)} className="mt-4 text-right">
        <h3 className="line-clamp-2 text-[14px] leading-[1.8] text-[#2c2c2c] transition-colors group-hover:text-sea">
          {fullName}
        </h3>
      </button>

      {/* امتیاز و قیمت */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="flex items-center gap-1" title={`امتیاز ${rating} از ۵`}>
          <IStar size={16} filled className="text-[#f9bc00]" />
          <span className="text-[13px] font-medium text-[#2c2c2c]">{rating}</span>
        </span>
        <p className="flex items-baseline gap-1.5">
          <span className="text-[18px] font-bold text-[#2c2c2c]">{toman}</span>
          <span className="text-[12px] text-[#666]">تومان</span>
        </p>
      </div>
    </article>
  );
}
