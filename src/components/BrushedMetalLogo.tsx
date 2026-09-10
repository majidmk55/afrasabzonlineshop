import { type ReactNode } from "react";

interface BrushedMetalLogoProps {
  children: ReactNode;
  className?: string;
}

export default function BrushedMetalLogo({ children, className = "" }: BrushedMetalLogoProps) {
  // تبدیل children به string برای data-text attribute
  const textContent = typeof children === 'string' ? children : '';
  
  return (
    <div className={`brushed-metal-container ${className}`}>
      <div 
        className="brushed-metal-text" 
        data-text={textContent}
        style={{ filter: "url(#metal-emboss)" }}
      >
        {children}
      </div>
    </div>
  );
}
