interface SpecsSummaryProps {
  cpu: string;
  gpu: string;
  display: string;
  storage: string;
  ram: string;
  weight: string;
}

export default function SpecsSummary({ cpu, gpu, display, storage, ram, weight }: SpecsSummaryProps) {
  const specs = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="12" height="12" rx="1" stroke="white" strokeWidth="2" />
          <rect x="9" y="9" width="6" height="6" fill="white" />
          <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      text: cpu,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" />
          <path d="M8 8h8M8 12h8M8 16h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="7" cy="8" r="0.5" fill="white" />
          <circle cx="7" cy="12" r="0.5" fill="white" />
          <circle cx="7" cy="16" r="0.5" fill="white" />
        </svg>
      ),
      text: gpu,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="13" rx="1" stroke="white" strokeWidth="2" />
          <path d="M8 20h8M12 17v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      text: display,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="6" width="14" height="4" rx="1" stroke="white" strokeWidth="2" />
          <rect x="5" y="12" width="14" height="4" rx="1" stroke="white" strokeWidth="2" />
          <rect x="5" y="18" width="14" height="2" rx="1" stroke="white" strokeWidth="2" />
        </svg>
      ),
      text: storage,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="8" width="18" height="7" rx="1" stroke="white" strokeWidth="2" />
          <path d="M6 15v2M9 15v2M12 15v2M15 15v2M18 15v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      text: ram,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: weight,
    },
  ];

  return (
    <div className="w-[340px] bg-white">
      {specs.map((spec, index) => (
        <div
          key={index}
          className={`flex items-center px-4 py-3 ${
            index < specs.length - 1 ? "border-b border-[#e8e8e8]" : ""
          }`}
          style={{ minHeight: "56px" }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a73e8]"
            style={{ marginRight: "14px" }}
          >
            {spec.icon}
          </div>
          <div className="text-sm leading-[1.4] text-[#333333]">{spec.text}</div>
        </div>
      ))}
    </div>
  );
}
