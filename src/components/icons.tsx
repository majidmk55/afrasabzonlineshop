import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (p: P) => {
  const { size = 20, ...rest } = p;
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, ...rest };
};

/* Brand mark: hex core with bolt */
export const LogoMark = ({ size = 26, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...rest}>
    <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25L16 2.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M17.6 8.5 12 16.6h3.6l-1.4 6.9 6.8-9.4h-3.9l0.5-5.6Z" fill="var(--color-ember)" stroke="none" />
  </svg>
);

export const ISearch = (p: P) => (
  <svg {...base(p)}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.6 15.6 5 5" /></svg>
);
export const ICart = (p: P) => (
  <svg {...base(p)}><path d="M3 4h2.2l2.3 12.2A2 2 0 0 0 9.5 18h9.2a2 2 0 0 0 2-1.6L22 8H6" /><circle cx="9.8" cy="21" r="1.2" fill="currentColor" /><circle cx="18" cy="21" r="1.2" fill="currentColor" /></svg>
);
export const IStar = ({ size = 16, filled = true, ...rest }: P & { filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" {...rest}>
    <path d="M12 2.8l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.7l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95L12 2.8Z" />
  </svg>
);
export const ICompare = (p: P) => (
  <svg {...base(p)}><path d="M4 7h13l-3-3M20 17H7l3 3" /></svg>
);
export const IClose = (p: P) => <svg {...base(p)}><path d="m6 6 12 12M18 6 6 18" /></svg>;
export const IPlus = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>;
export const IMinus = (p: P) => <svg {...base(p)}><path d="M5 12h14" /></svg>;
export const IChevron = (p: P) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>;
export const IFilter = (p: P) => <svg {...base(p)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
export const ICheck = (p: P) => <svg {...base(p)}><path d="m4.5 12.5 5 5L19.5 7" /></svg>;
export const IBolt = (p: P) => <svg {...base(p)}><path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" fill="currentColor" stroke="none" /></svg>;
export const ILock = (p: P) => <svg {...base(p)}><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>;
export const ITrash = (p: P) => <svg {...base(p)}><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" /></svg>;
export const IEye = (p: P) => <svg {...base(p)}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
export const ITruck = (p: P) => <svg {...base(p)}><path d="M2.5 6h12v11h-12zM14.5 10h4l3 3.5V17h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg>;
export const IShield = (p: P) => <svg {...base(p)}><path d="M12 2.5 20 6v6.2c0 5-3.4 8-8 9.3-4.6-1.3-8-4.3-8-9.3V6l8-3.5Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>;
export const IReturn = (p: P) => <svg {...base(p)}><path d="M4 9h11a5 5 0 0 1 0 10H8" /><path d="M8 5 4 9l4 4" /></svg>;
export const ICpu = (p: P) => <svg {...base(p)}><rect x="6" y="6" width="12" height="12" rx="1" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" /></svg>;
export const IGpu = (p: P) => <svg {...base(p)}><rect x="2.5" y="7" width="19" height="11" rx="1" /><circle cx="11" cy="12.5" r="3" /><path d="M5.5 7V4.5h9V7M20 18v2" /></svg>;
export const IRam = (p: P) => <svg {...base(p)}><rect x="3" y="7" width="18" height="9" rx="1" /><path d="M6 16v2.5M10 16v2.5M14 16v2.5M18 16v2.5M6.5 10.5v2M10 10.5v2M13.5 10.5v2M17 10.5v2" /></svg>;
export const IDisplay = (p: P) => <svg {...base(p)}><rect x="2.5" y="4.5" width="19" height="12.5" rx="1" /><path d="M9 21h6M12 17v4" /></svg>;
export const IBattery = (p: P) => <svg {...base(p)}><rect x="2.5" y="8" width="17" height="8" rx="1" /><path d="M22 11v2M6 11v2M9.5 11v2" /></svg>;
export const IWifi = (p: P) => <svg {...base(p)}><path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10.5 10.5 0 0 1 13 0M8.5 16a6 6 0 0 1 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></svg>;
export const IScale = (p: P) => <svg {...base(p)}><path d="M12 3v18M7 21h10M12 6.5 5.5 8 3 14a3.5 3.5 0 0 0 5 0L5.5 8M12 6.5 18.5 8 16 14a3.5 3.5 0 0 0 5 0L18.5 8" /></svg>;
export const IMenu = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const IArrowR = (p: P) => <svg {...base(p)}><path d="M4 12h16m-6-6 6 6-6 6" /></svg>;
export const IInfo = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.6v.2" /></svg>;
export const IPin = (p: P) => <svg {...base(p)}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
export const IMail = (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>;
export const IGear = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" /></svg>;
export const IPencil = (p: P) => <svg {...base(p)}><path d="m14.5 5 4.5 4.5L8.5 20H4v-4.5L14.5 5Z" /><path d="m12.5 7 4.5 4.5" /></svg>;
export const IChart = (p: P) => <svg {...base(p)}><path d="M4 4v16h16" /><path d="M8 16v-5M12 16V7M16 16v-8M20 16v-3" /></svg>;
export const IBox = (p: P) => <svg {...base(p)}><path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" /><path d="M4 7l8 4 8-4M12 11v10" /></svg>;
export const IUpload = (p: P) => <svg {...base(p)}><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M4 15v4a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-4" /></svg>;
export const IGamepad = (p: P) => <svg {...base(p)}><rect x="2.5" y="7" width="19" height="10.5" rx="5" /><path d="M8 10.4v4M6 12.4h4" /><circle cx="15.3" cy="11" r="0.4" fill="currentColor" strokeWidth="1.1" /><circle cx="17.8" cy="13.6" r="0.4" fill="currentColor" strokeWidth="1.1" /></svg>;
export const IPenNib = (p: P) => <svg {...base(p)}><path d="m12 2.5 5 6.5-3.2 12.5H10.2L7 9l5-6.5Z" /><circle cx="12" cy="10" r="1.3" /><path d="M12 11.3v5.2" /></svg>;
export const ICap = (p: P) => <svg {...base(p)}><path d="m12 4.5 9.5 4.5L12 13.5 2.5 9 12 4.5Z" /><path d="M6.5 11.3v4.2c0 1.4 2.5 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-4.2" /><path d="M21.5 9v5.5" /></svg>;
export const IBriefGear = (p: P) => <svg {...base(p)}><rect x="2.5" y="7.5" width="19" height="12.5" rx="1.5" /><path d="M9 7.5V5h6v2.5" /><circle cx="17.3" cy="16.2" r="2.3" /><path d="M17.3 12.9v-1.2M17.3 20.7v-1.2M14 16.2h-1.2M21.8 16.2h-1.2" /></svg>;
export const ICode = (p: P) => <svg {...base(p)}><path d="m8 8.5-4.5 3.5L8 15.5M16 8.5l4.5 3.5L16 15.5M13.4 5.5l-2.8 13" /></svg>;
export const ISpeaker = (p: P) => <svg {...base(p)}><rect x="7" y="3" width="10" height="18" rx="2" /><circle cx="12" cy="14" r="3.2" /><circle cx="12" cy="7.5" r="1.2" /></svg>;
export const ICamera = (p: P) => <svg {...base(p)}><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8.5 7 10 4.5h4L15.5 7" /></svg>;
export const IPlug = (p: P) => <svg {...base(p)}><path d="M9 3v5M15 3v5" /><path d="M7 8h10v3a5 5 0 0 1-10 0V8Z" /><path d="M12 16v5" /></svg>;
export const IKeyboard = (p: P) => <svg {...base(p)}><rect x="2.5" y="7" width="19" height="11" rx="1.5" /><path d="M5.5 10.2h.1M8.6 10.2h.1M11.7 10.2h.1M14.8 10.2h.1M17.9 10.2h.1M5.5 12.9h.1M17.9 12.9h.1M8 15.3h8" /></svg>;
export const IPower = (p: P) => <svg {...base(p)}><path d="M12 3v8" /><path d="M6.2 6.5a8 8 0 1 0 11.6 0" /></svg>;
export const IDrive = (p: P) => <svg {...base(p)}><rect x="3" y="9" width="18" height="7" rx="1.5" /><path d="M6 12.5h7" /><circle cx="17.5" cy="12.5" r="0.5" fill="currentColor" strokeWidth="1.2" /></svg>;
export const ITag = (p: P) => <svg {...base(p)}><path d="M3 3h8.5L21 12.5 12.5 21 3 11.5V3Z" /><circle cx="8" cy="8" r="1.4" /></svg>;
export const IShare = (p: P) => <svg {...base(p)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
export const IPrint = (p: P) => <svg {...base(p)}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;

export const SPEC_ICONS: Record<string, (p: P) => JSX.Element> = {
  cpu: ICpu, gpu: IGpu, ram: IRam, display: IDisplay, wifi: IWifi, battery: IBattery, scale: IScale, shield: IShield,
  speaker: ISpeaker, camera: ICamera, plug: IPlug, keyboard: IKeyboard, power: IPower, drive: IDrive, tag: ITag, info: IInfo,
};

/* --- payment marks (drawn, not images) --- */
export const VisaMark = (p: P) => (
  <svg width={38} height={24} viewBox="0 0 38 24" {...p}><rect width="38" height="24" rx="3" fill="#12224D" /><path d="M16.2 15.5h-2.4l1.5-7h2.4l-1.5 7Zm10.3-6.8c-.5-.2-1.2-.4-2.1-.4-2.3 0-3.9 1.2-3.9 2.9 0 1.2 1.1 1.9 2 2.3.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.9 0-1.4-.1-2.2-.5l-.3-.1-.3 1.9c.6.2 1.6.5 2.7.5 2.4 0 4-1.2 4-3 0-1-.6-1.8-1.9-2.4-.8-.4-1.3-.7-1.3-1.1s.5-.9 1.5-.9c.8 0 1.5.2 2 .4l.2.1.3-1.8Zm5.6-1.7h-1.9c-.6 0-1 .2-1.3.8l-3.6 6.7h2.6l.5-1.4h3.1l.3 1.4h2.3l-2-7.5Zm-2.9 4.3c.2-.6 1-2.7 1-2.7l.4 2h-1.4ZM13 8.5 10.7 15h-2.5L7 9.4c-.1-.4-.2-.6-.5-.7-.5-.3-1.4-.6-2.1-.8l.1-.4h4c.5 0 1 .4 1.1.9l1 5.2 2.4-5.1H13Z" fill="#F4F6F8" /></svg>
);
export const McMark = (p: P) => (
  <svg width={38} height={24} viewBox="0 0 38 24" {...p}><rect width="38" height="24" rx="3" fill="#1B1F27" /><circle cx="15.5" cy="12" r="6" fill="#EB001B" /><circle cx="22.5" cy="12" r="6" fill="#F79E1B" /><path d="M19 7.3a6 6 0 0 1 0 9.4 6 6 0 0 1 0-9.4Z" fill="#FF5F00" /></svg>
);
export const AmexMark = (p: P) => (
  <svg width={38} height={24} viewBox="0 0 38 24" {...p}><rect width="38" height="24" rx="3" fill="#2E77BC" /><path d="M6 12.6h2.2l.6-1.4.6 1.4H11l-1.9-4H7.9l-1.9 4Zm2-1h-1.2l.6-1.5.6 1.5Zm4.3 1h1.6V9.4l1.2 3.2h1.1l1.2-3.2v3.2h3l.5-1.2h1.7l.5 1.2h1.7l-2.3-4h-1.4l-2.2 3.7-1.5-3.7h-1.5l-2.6 4Zm6.9-2h1l-.5-1.2-.5 1.2Zm4 2h1.6v-3l2.4 3h1.6V8.6h-1.6v2.9l-2.3-2.9h-1.7v4Z" fill="#F4F6F8" /></svg>
);
export const PaypalMark = (p: P) => (
  <svg width={38} height={24} viewBox="0 0 38 24" {...p}><rect width="38" height="24" rx="3" fill="#F4F6F8" stroke="#D9DBD2" /><path d="M14 5.5h4.2c2.2 0 3.6 1.2 3.3 3.3-.3 2.4-1.9 3.6-4.2 3.6h-1.2l-.7 4.1h-2.5l1.1-11Zm2.1 5h1c1 0 1.7-.5 1.9-1.6.2-1-.5-1.5-1.5-1.5h-.9l-.5 3.1Z" fill="#003087" /><path d="M21.5 7.5h4.2c2.2 0 3.6 1.2 3.3 3.3-.3 2.4-1.9 3.6-4.2 3.6h-1.2l-.7 4.1h-2.5l1.1-11Zm2.1 5h1c1 0 1.7-.5 1.9-1.6.2-1-.5-1.5-1.5-1.5h-.9l-.5 3.1Z" fill="#009CDE" opacity="0.85" /></svg>
);
export const BankMark = (p: P) => (
  <svg width={38} height={24} viewBox="0 0 38 24" {...p}><rect width="38" height="24" rx="3" fill="#F4F6F8" stroke="#D9DBD2" /><path d="M19 5 9 10v1.5h20V10L19 5Zm-7.5 8v6h3v-6h-3Zm6 0v6h3v-6h-3Zm6 0v6h3v-6h-3ZM9 19.5v1.5h20v-1.5h-20Z" fill="#5C6270" /></svg>
);

export const SocialX = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.2h1.7L7.5 4.7H5.7l11 14.5Z" /></svg>
);
export const SocialIg = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>
);
export const SocialYt = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15.2V8.8l5.5 3.2L10 15.2Z" /></svg>
);
