import { useState, useEffect, useRef } from "react";

interface NanoReviewScoreProps {
  laptops: {
    name: string;
    score: number;
  }[];
  onScenarioChange?: (scenario: string) => void;
}

export default function NanoReviewScore({ laptops, onScenarioChange }: NanoReviewScoreProps) {
  const [animated, setAnimated] = useState(false);
  const [scenario, setScenario] = useState("balanced");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newScenario = e.target.value;
    setScenario(newScenario);
    if (onScenarioChange) {
      onScenarioChange(newScenario);
    }
  };

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[600px] rounded-[10px] bg-[#f0f0f0] p-6 sm:p-7"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      }}
    >
      {/* عنوان بخش */}
      <h3
        className="mb-5 text-[18px] font-bold text-[#1a1a2e] sm:text-[18px]"
        style={{ letterSpacing: "-0.3px", lineHeight: "1.3" }}
      >
        NanoReview Score
      </h3>

      {/* آیتم‌های لپ‌تاپ */}
      {laptops.map((laptop, index) => (
        <div key={index} className="mb-4">
          {/* هدر لپ‌تاپ */}
          <div className="relative mb-2 flex items-center justify-between">
            <span
              className="text-[13.5px] font-normal leading-[1.4] text-[#4b5563] sm:text-[13.5px]"
              style={{ lineHeight: "1.4" }}
            >
              {laptop.name}
            </span>
            <div
              className={`flex h-[28px] w-[36px] items-center justify-center rounded-[4px] ${
                index === 0
                  ? "bg-[#3B5998] shadow-[0_1px_3px_rgba(59,89,152,0.3)]"
                  : "border-[1.5px] border-[#3B5998] bg-white"
              }`}
            >
              <span
                className={`text-[14px] font-bold leading-none ${
                  index === 0 ? "text-white" : "text-[#3B5998]"
                }`}
              >
                {laptop.score}
              </span>
            </div>
          </div>

          {/* نوار پیشرفت */}
          <div className="relative mb-4 h-[6px] w-full overflow-hidden rounded-[4px] bg-[#d1d5db]">
            <div
              className="absolute left-0 top-0 h-full rounded-[4px] bg-[#3B5998]"
              style={{
                width: animated ? `${laptop.score}%` : "0%",
                transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      ))}

      {/* بخش اطلاعات */}
      <div className="mt-3">
        {/* ردیف اطلاعات */}
        <div className="mb-3.5 flex items-center">
          <svg
            className="mr-2 h-[18px] w-[18px] shrink-0 text-[#10b981]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 16v-4M12 8h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[13px] font-normal leading-[1.4] text-[#4b5563]">
            Pick the usage scenario that best matches your needs
          </span>
        </div>

        {/* ردیف استفاده */}
        <div className="flex items-center sm:flex-row">
          <label className="mr-3 text-[13.5px] font-medium text-[#374151]">
            Primary usage:
          </label>
          <select
            value={scenario}
            onChange={handleScenarioChange}
            className="min-w-[140px] cursor-pointer rounded-[6px] border border-[#d1d5db] bg-white px-3 py-2 pr-8 text-[13px] font-normal text-[#3B5998] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none transition-all hover:border-[#3B5998] hover:shadow-[0_2px_4px_rgba(59,89,152,0.1)] focus:border-[#3B5998] focus:shadow-[0_0_0_3px_rgba(59,89,152,0.1)]"
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%233B5998' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundPosition: "right 10px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "12px",
              fontFamily: "inherit",
            }}
          >
            <option value="balanced">Balanced</option>
            <option value="gaming">Gaming</option>
            <option value="work">Work</option>
            <option value="multimedia">Multimedia</option>
            <option value="battery">Battery Life</option>
          </select>
        </div>
      </div>
    </div>
  );
}
