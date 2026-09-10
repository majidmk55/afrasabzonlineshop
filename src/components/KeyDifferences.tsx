import { useEffect, useRef, useState } from "react";

interface KeyDifferencesProps {
  laptops: {
    name: string;
    advantages: string[];
  }[];
}

export default function KeyDifferences({ laptops }: KeyDifferencesProps) {
  const [animated, setAnimated] = useState(false);
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

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[800px] bg-white p-8 sm:p-10"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
        color: "#374151",
      }}
    >
      {/* هدر */}
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2.5">
          <svg
            className="h-[22px] w-[22px] shrink-0 text-[#3B82F6]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 5 10 5 14.5C5 18.0899 8.13401 21 12 21C15.866 21 19 18.0899 19 14.5C19 10 12 2 12 2Z"
              fill="currentColor"
            />
            <path
              d="M12 11v4M12 17h.01"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <h2
            className="text-[22px] font-bold text-[#111827] sm:text-[22px]"
            style={{ letterSpacing: "-0.4px", lineHeight: "1.2" }}
          >
            تفاوت‌های کلیدی
          </h2>
        </div>
        <p
          className="mb-4 pl-8 text-[13px] font-normal leading-[1.5] text-[#6b7280]"
          style={{ lineHeight: "1.5" }}
        >
          تفاوت‌های کلیدی بین لپ‌تاپ‌ها چیست
        </p>
        <div className="mt-4 h-px w-full bg-[#e5e7eb]" />
      </div>

      {/* بخش‌های مزایا - پشتیبانی از تا 4 لپ‌تاپ */}
      <div className={laptops.length > 2 ? "grid grid-cols-1 gap-8 md:grid-cols-2" : "space-y-8"}>
        {laptops.map((laptop, laptopIndex) => (
          <div key={laptopIndex}>
            <h3
              className="mb-4 text-[17px] font-bold text-[#111827]"
              style={{ letterSpacing: "-0.3px", lineHeight: "1.3" }}
            >
              مزایای {laptop.name}
            </h3>
            {laptop.advantages.length > 0 ? (
              <ul className="list-none p-0">
                {laptop.advantages.map((advantage, index) => (
                  <li
                    key={index}
                    className="mb-3.5 flex items-start opacity-0"
                    style={{
                      lineHeight: "1.6",
                      animation: animated
                        ? `slideInLeft 0.4s ease-out ${0.1 + index * 0.05}s forwards`
                        : "none",
                    }}
                  >
                    <svg
                      className="mr-3 mt-0.5 h-5 w-5 shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        filter: "drop-shadow(0 1px 2px rgba(16, 185, 129, 0.2))",
                      }}
                    >
                      <circle cx="10" cy="10" r="10" fill="#10b981" />
                      <path
                        d="M10 6v8M6 10h8"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className="flex-1 pt-0.5 text-[14px] font-normal text-[#374151]"
                      style={{ lineHeight: "1.6" }}
                    >
                      {advantage}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-[#6b7280] italic">
                مزیت خاصی نسبت به سایر لپ‌تاپ‌ها ندارد
              </p>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
