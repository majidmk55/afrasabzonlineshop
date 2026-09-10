import { type ReactNode } from "react";

interface BrushedMetalLogoProps {
  children: ReactNode;
  className?: string;
}

export default function BrushedMetalLogo({ children, className = "" }: BrushedMetalLogoProps) {
  return (
    <div className={`brushed-metal-container ${className}`}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {/* فیلتر بافت فلز برس‌خورده */}
          <filter id="brushed-metal-filter" x="-20%" y="-20%" width="140%" height="140%">
            {/* ایجاد بافت خطوط افقی */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9 0.02"
              numOctaves="5"
              result="noise"
              seed="2"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.15 0"
              in="noise"
              result="coloredNoise"
            />

            {/* گرادیان فلزی */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="3"
              specularConstant="0.8"
              specularExponent="25"
              result="spec"
            >
              <fePointLight x="-100" y="-100" z="200" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />

            {/* سایه برجستگی */}
            <feOffset dx="2" dy="4" in="SourceAlpha" result="offsetBlur" />
            <feGaussianBlur in="offsetBlur" stdDeviation="3" result="shadowBlur" />
            <feFlood floodColor="#000000" floodOpacity="0.35" result="shadowColor" />
            <feComposite in="shadowColor" in2="shadowBlur" operator="in" result="shadow" />

            {/* Highlight لبه بالا */}
            <feOffset dx="0" dy="-1" in="SourceAlpha" result="topHighlight" />
            <feGaussianBlur in="topHighlight" stdDeviation="1" result="highlightBlur" />
            <feFlood floodColor="#FFFFFF" floodOpacity="0.6" result="highlightColor" />
            <feComposite in="highlightColor" in2="highlightBlur" operator="in" result="highlight" />

            {/* Shadow لبه پایین */}
            <feOffset dx="0" dy="2" in="SourceAlpha" result="bottomShadow" />
            <feGaussianBlur in="bottomShadow" stdDeviation="1" result="bottomShadowBlur" />
            <feFlood floodColor="#000000" floodOpacity="0.4" result="bottomShadowColor" />
            <feComposite in="bottomShadowColor" in2="bottomShadowBlur" operator="in" result="bottomShadow" />

            {/* ترکیب نهایی */}
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="specOut" />
              <feMergeNode in="highlight" />
              <feMergeNode in="bottomShadow" />
            </feMerge>
          </filter>

          {/* گرادیان فلزی */}
          <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#E0E0E0", stopOpacity: 1 }} />
            <stop offset="25%" style={{ stopColor: "#C8C8C8", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#A8A8A8", stopOpacity: 1 }} />
            <stop offset="75%" style={{ stopColor: "#909090", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#787878", stopOpacity: 1 }} />
          </linearGradient>

          {/* گرادیان افقی برای عمق */}
          <linearGradient id="metal-gradient-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#FFFFFF", stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: "#000000", stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
      </svg>
      <div className="brushed-metal-text" style={{ filter: "url(#brushed-metal-filter)" }}>
        {children}
      </div>
    </div>
  );
}
