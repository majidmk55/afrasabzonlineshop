interface LaptopSpecsSummaryProps {
  cpu: string;
  gpu: string;
  display: string;
  storage: string;
  ram: string;
  weight: string;
}

export default function LaptopSpecsSummary({ cpu, gpu, display, storage, ram, weight }: LaptopSpecsSummaryProps) {
  const specs = [
    { icon: "cpu", text: cpu },
    { icon: "gpu", text: gpu },
    { icon: "display", text: display },
    { icon: "storage", text: storage },
    { icon: "ram", text: ram },
    { icon: "weight", text: weight },
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
          <div className="mr-3.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a73e8]">
            <SpecIcon type={spec.icon} />
          </div>
          <div className="text-sm leading-[1.4] text-[#333333]">{spec.text}</div>
        </div>
      ))}
    </div>
  );
}

function SpecIcon({ type }: { type: string }) {
  const iconSize = 22;
  
  switch (type) {
    case "cpu":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M9 2v2H7v2H5v2H3v2h2v2H3v2h2v2h2v2h2v2h2v-2h2v2h2v-2h2v-2h2v-2h2v-2h-2v-2h2v-2h-2V8h-2V6h-2V4h-2V2h-2v2h-2V2H9zm0 4h6v6H9V6zm-2 0v6H5V8h2zm10 0v6h2V8h-2zM7 14h2v2H7v-2zm8 0h2v2h-2v-2zm-4 2h2v2h-2v-2z"/>
        </svg>
      );
    case "gpu":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M2 6h20v12H2V6zm2 2v8h16V8H4zm3 1h2v6H7V9zm4 0h2v6h-2V9zm4 0h2v6h-2V9z"/>
        </svg>
      );
    case "display":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M2 4h20v12H2V4zm2 2v8h16V6H4zm7 11h2v2h-2v-2zm-3 0h2v2H8v-2zm6 0h2v2h-2v-2z"/>
        </svg>
      );
    case "storage":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M2 4h20v4H2V4zm0 6h20v4H2v-4zm0 6h20v4H2v-4zm2-10h2v2H4V6zm0 6h2v2H4v-2zm0 6h2v2H4v-2z"/>
        </svg>
      );
    case "ram":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M2 8h20v8H2V8zm2 2v4h16v-4H4zm2 1h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/>
        </svg>
      );
    case "weight":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M12 2C9.24 2 7 4.24 7 7c0 .69.14 1.35.4 1.96L3 18h18l-4.4-9.04c.26-.61.4-1.27.4-1.96 0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zM5.5 20l3.5-7h6l3.5 7h-13z"/>
        </svg>
      );
    default:
      return null;
  }
}
