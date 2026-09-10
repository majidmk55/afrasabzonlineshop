import { useEffect, useRef, useState } from "react";

interface ReviewProps {
  laptopA: string;
  laptopB: string;
  scoresA: {
    performance: number;
    gaming: number;
    display: number;
    battery: number;
    connectivity: number;
    portability: number;
  };
  scoresB: {
    performance: number;
    gaming: number;
    display: number;
    battery: number;
    connectivity: number;
    portability: number;
  };
}

export default function Review({ laptopA, laptopB, scoresA, scoresB }: ReviewProps) {
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { key: "performance", category: "عملکرد", description: "عملکرد سیستم و برنامه‌ها", scoreA: scoresA.performance, scoreB: scoresB.performance },
    { key: "gaming", category: "گیمینگ", description: "عملکرد در بازی‌های سه‌بعدی محبوب", scoreA: scoresA.gaming, scoreB: scoresB.gaming },
    { key: "display", category: "نمایشگر", description: "زاویه دید، دقت رنگ، روشنایی", scoreA: scoresA.display, scoreB: scoresB.display },
    { key: "battery", category: "عمر باتری", description: "عمر باتری در استفاده سبک و متوسط", scoreA: scoresA.battery, scoreB: scoresB.battery },
    { key: "connectivity", category: "اتصالات", description: "پورت‌ها، وب‌کم و سایر رابط‌ها", scoreA: scoresA.connectivity, scoreB: scoresB.connectivity },
    { key: "portability", category: "قابلیت حمل", description: "طراحی، مواد، دوام و کاربرد", scoreA: scoresA.portability, scoreB: scoresB.portability },
  ];

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

  return (
    <div
      ref={containerRef}
      className="mx-auto max-w-[1200px] rounded-xl bg-[#fafafa] p-8 font-sans antialiased shadow-sm"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        textRendering: "optimizeLegibility",
      }}
    >
      {/* Header */}
      <div className="mb-6 border-b border-[#e5e7eb] pb-5">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-7 w-7 shrink-0 text-[#3B5998]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" />
            <rect x="10" y="8" width="4" height="13" rx="1" fill="currentColor" />
            <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
          </svg>
          <div className="flex-1">
            <h2
              className="mb-1.5 text-2xl font-bold tracking-tight text-[#111827]"
              style={{ letterSpacing: "-0.5px", lineHeight: "1.2" }}
            >
              بررسی
            </h2>
            <p
              className="max-w-full text-[13px] font-normal leading-relaxed text-[#6b7280]"
              style={{ lineHeight: "1.5" }}
            >
              ارزیابی ویژگی‌های مهم {laptopA} و {laptopB}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 px-1 md:gap-12 lg:grid-cols-2 lg:gap-14">
        {categories.map((item, index) => (
          <div
            key={item.key}
            className="opacity-0"
            style={{
              animation: animated ? `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 * (index + 1)}s forwards` : "none",
            }}
          >
            <h3
              className="mb-1 text-base font-bold text-[#1f2937]"
              style={{ letterSpacing: "-0.3px" }}
            >
              {item.category}
            </h3>
            <p
              className="mb-5 text-xs font-normal leading-snug text-[#9ca3af]"
              style={{ lineHeight: "1.4" }}
            >
              {item.description}
            </p>

            <div className="flex flex-col gap-3.5">
              {/* Laptop A */}
              <div className="flex items-center gap-2.5">
                <span
                  className="w-[120px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium text-[#4b5563] sm:w-[140px] sm:text-[12px] md:w-[180px] md:text-[13px]"
                  title={laptopA}
                >
                  {laptopA}
                </span>
                <div className="flex flex-1 items-center">
                  <div
                    className="relative h-[7px] w-full overflow-hidden rounded-md bg-[#e5e7eb] sm:h-2"
                    style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full rounded-md"
                      style={{
                        width: animated ? `${item.scoreA}%` : "0%",
                        background: "linear-gradient(90deg, #3B5998 0%, #4a69a8 100%)",
                        transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 0 0 1px rgba(59, 89, 152, 0.1)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="flex h-[30px] w-[38px] items-center justify-center rounded-md border-2 border-[#3B5998] bg-white transition-all hover:-translate-y-0.5 sm:h-8 sm:w-[42px]"
                  style={{ boxShadow: "0 2px 4px rgba(59, 89, 152, 0.1)" }}
                >
                  <span className="text-[14px] font-bold leading-none text-[#3B5998] sm:text-[15px]">
                    {item.scoreA}
                  </span>
                </div>
              </div>

              {/* Laptop B */}
              <div className="flex items-center gap-2.5">
                <span
                  className="w-[120px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium text-[#4b5563] sm:w-[140px] sm:text-[12px] md:w-[180px] md:text-[13px]"
                  title={laptopB}
                >
                  {laptopB}
                </span>
                <div className="flex flex-1 items-center">
                  <div
                    className="relative h-[7px] w-full overflow-hidden rounded-md bg-[#e5e7eb] sm:h-2"
                    style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full rounded-md"
                      style={{
                        width: animated ? `${item.scoreB}%` : "0%",
                        background: "linear-gradient(90deg, #3B5998 0%, #4a69a8 100%)",
                        transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 0 0 1px rgba(59, 89, 152, 0.1)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="flex h-[30px] w-[38px] items-center justify-center rounded-md border-2 border-[#3B5998] bg-white transition-all hover:-translate-y-0.5 sm:h-8 sm:w-[42px]"
                  style={{ boxShadow: "0 2px 4px rgba(59, 89, 152, 0.1)" }}
                >
                  <span className="text-[14px] font-bold leading-none text-[#3B5998] sm:text-[15px]">
                    {item.scoreB}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
