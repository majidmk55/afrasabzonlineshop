// داده‌های شبیه‌سازی شده برای داشبورد BI

export interface KPIData {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: number[];
  weight: number;
  icon: string;
  color: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  previousRevenue: number;
  orders: number;
}

export interface BrandData {
  brand: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  brand: string;
  sales: number;
  revenue: number;
  stock: number;
  rating: number;
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  conversion: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// تولید داده‌های تصادفی واقع‌گرایانه
const generateTrend = (base: number, variance: number, length: number = 12): number[] => {
  return Array.from({ length }, () => base + (Math.random() - 0.5) * variance);
};

// KPIهای اصلی
export const mockKPIs: KPIData[] = [
  {
    id: 'revenue',
    title: 'درآمد کل',
    value: 2450000000,
    previousValue: 2100000000,
    change: 350000000,
    changePercent: 16.7,
    trend: generateTrend(200000000, 50000000),
    weight: 25,
    icon: 'TrendingUp',
    color: '#10b981',
  },
  {
    id: 'conversion',
    title: 'نرخ تبدیل',
    value: 3.2,
    previousValue: 2.8,
    change: 0.4,
    changePercent: 14.3,
    trend: generateTrend(3, 0.5),
    weight: 20,
    icon: 'Target',
    color: '#3b82f6',
  },
  {
    id: 'aov',
    title: 'میانگین سبد خرید',
    value: 185000000,
    previousValue: 172000000,
    change: 13000000,
    changePercent: 7.6,
    trend: generateTrend(180000000, 20000000),
    weight: 15,
    icon: 'ShoppingCart',
    color: '#8b5cf6',
  },
  {
    id: 'traffic',
    title: 'بازدیدکنندگان',
    value: 45230,
    previousValue: 41500,
    change: 3730,
    changePercent: 9.0,
    trend: generateTrend(40000, 5000),
    weight: 10,
    icon: 'Users',
    color: '#f59e0b',
  },
  {
    id: 'inventory',
    title: 'موجودی انبار',
    value: 156,
    previousValue: 178,
    change: -22,
    changePercent: -12.4,
    trend: generateTrend(170, 20),
    weight: 8,
    icon: 'Package',
    color: '#ef4444',
  },
  {
    id: 'retention',
    title: 'نرخ بازگشت مشتری',
    value: 68,
    previousValue: 62,
    change: 6,
    changePercent: 9.7,
    trend: generateTrend(65, 8),
    weight: 7,
    icon: 'RefreshCw',
    color: '#06b6d4',
  },
  {
    id: 'cac',
    title: 'هزینه جذب مشتری',
    value: 2500000,
    previousValue: 2800000,
    change: -300000,
    changePercent: -10.7,
    trend: generateTrend(2700000, 300000),
    weight: 5,
    icon: 'DollarSign',
    color: '#ec4899',
  },
  {
    id: 'abandoned',
    title: 'سبد رها شده',
    value: 12.5,
    previousValue: 15.2,
    change: -2.7,
    changePercent: -17.8,
    trend: generateTrend(14, 3),
    weight: 4,
    icon: 'XCircle',
    color: '#f97316',
  },
  {
    id: 'nps',
    title: 'رضایت مشتری (NPS)',
    value: 72,
    previousValue: 68,
    change: 4,
    changePercent: 5.9,
    trend: generateTrend(70, 5),
    weight: 3,
    icon: 'Smile',
    color: '#84cc16',
  },
  {
    id: 'profit',
    title: 'سود ناخالص',
    value: 18.5,
    previousValue: 17.2,
    change: 1.3,
    changePercent: 7.6,
    trend: generateTrend(18, 2),
    weight: 3,
    icon: 'TrendingUp',
    color: '#14b8a6',
  },
];

// داده‌های درآمد ماهانه
export const mockRevenueData: RevenueData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseRevenue = 80000000 + Math.random() * 40000000;
  const previousRevenue = baseRevenue * (0.85 + Math.random() * 0.1);
  return {
    date: date.toLocaleDateString('fa-IR'),
    revenue: Math.round(baseRevenue),
    previousRevenue: Math.round(previousRevenue),
    orders: Math.round(15 + Math.random() * 20),
  };
});

// داده‌های برندها
export const mockBrandData: BrandData[] = [
  { brand: 'اپل', sales: 245, revenue: 4500000000, growth: 12.5 },
  { brand: 'ایسوس', sales: 189, revenue: 2800000000, growth: 8.3 },
  { brand: 'لنوو', sales: 167, revenue: 2400000000, growth: 15.2 },
  { brand: 'دل', sales: 145, revenue: 2100000000, growth: 6.7 },
  { brand: 'اچ‌پی', sales: 134, revenue: 1900000000, growth: 9.1 },
  { brand: 'مایکروسافت', sales: 98, revenue: 1500000000, growth: 18.4 },
  { brand: 'ایسر', sales: 87, revenue: 1200000000, growth: 11.2 },
  { brand: 'ام‌اس‌آی', sales: 76, revenue: 1100000000, growth: 7.8 },
];

// داده‌های دسته‌بندی‌ها
export const mockCategoryData: CategoryData[] = [
  { category: 'گیمینگ', value: 425, percentage: 35.2 },
  { category: 'خلاقیت و رندر', value: 287, percentage: 23.8 },
  { category: 'بیزنس و اداری', value: 234, percentage: 19.4 },
  { category: 'اولترابوک', value: 261, percentage: 21.6 },
];

// محصولات پرفروش
export const mockTopProducts: TopProduct[] = [
  {
    id: '1',
    name: 'لپ‌تاپ ریزر Blade 16 (2025)',
    brand: 'ریزر',
    sales: 89,
    revenue: 22072000000,
    stock: 12,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'لپ‌تاپ اپل MacBook Pro 14 M4 Pro',
    brand: 'اپل',
    sales: 156,
    revenue: 28860000000,
    stock: 24,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'لپ‌تاپ ایسوس ROG Zephyrus G14 (2025)',
    brand: 'ایسوس',
    sales: 134,
    revenue: 19430000000,
    stock: 18,
    rating: 4.8,
  },
  {
    id: '4',
    name: 'لپ‌تاپ لنوو ThinkPad X1 Carbon Gen 13',
    brand: 'لنوو',
    sales: 98,
    revenue: 15484000000,
    stock: 15,
    rating: 4.7,
  },
  {
    id: '5',
    name: 'لپ‌تاپ دل XPS 13 (9345)',
    brand: 'دل',
    sales: 87,
    revenue: 11136000000,
    stock: 20,
    rating: 4.5,
  },
];

// قیف تبدیل
export const mockConversionFunnel: ConversionFunnel[] = [
  { stage: 'بازدید', count: 45230, percentage: 100, conversionRate: 100 },
  { stage: 'مشاهده محصول', count: 28450, percentage: 62.9, conversionRate: 62.9 },
  { stage: 'افزودن به سبد', count: 8920, percentage: 19.7, conversionRate: 31.4 },
  { stage: 'شروع پرداخت', count: 4560, percentage: 10.1, conversionRate: 51.1 },
  { stage: 'خرید موفق', count: 1447, percentage: 3.2, conversionRate: 31.7 },
];

// منابع ترافیک
export const mockTrafficSources: TrafficSource[] = [
  { source: 'جستجوی ارگانیک', visits: 18092, percentage: 40, conversion: 3.8 },
  { source: 'مستقیم', visits: 11308, percentage: 25, conversion: 4.2 },
  { source: 'تبلیغات پولی', visits: 9046, percentage: 20, conversion: 2.9 },
  { source: 'شبکه‌های اجتماعی', visits: 4523, percentage: 10, conversion: 1.8 },
  { source: 'ارجاعی', visits: 2261, percentage: 5, conversion: 5.1 },
];

// هشدارها
export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'موجودی کم',
    message: 'موجودی لپ‌تاپ ریزر Blade 16 به 3 عدد رسیده است',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'افزایش سبد رها شده',
    message: 'نرخ سبد رها شده 15% افزایش یافته است',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'رشد فروش',
    message: 'فروش امروز 25% نسبت به دیروز افزایش یافته است',
    timestamp: new Date(Date.now() - 10800000),
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'کاهش نرخ تبدیل',
    message: 'نرخ تبدیل در 24 ساعت گذشته 8% کاهش یافته است',
    timestamp: new Date(Date.now() - 14400000),
    read: false,
  },
  {
    id: '5',
    type: 'info',
    title: 'محصول جدید',
    message: 'لپ‌تاپ MSI Prestige 16 AI Evo به انبار اضافه شد',
    timestamp: new Date(Date.now() - 18000000),
    read: true,
  },
];

// سفارشات اخیر
export const mockRecentOrders = [
  { id: 'ORD-1234', customer: 'علی محمدی', product: 'MacBook Pro 14', amount: 185000000, status: 'تکمیل شده', date: '2 ساعت پیش' },
  { id: 'ORD-1235', customer: 'مریم احمدی', product: 'ASUS ROG G14', amount: 145000000, status: 'در حال ارسال', date: '4 ساعت پیش' },
  { id: 'ORD-1236', customer: 'رضا کریمی', product: 'ThinkPad X1', amount: 158000000, status: 'تکمیل شده', date: '6 ساعت پیش' },
  { id: 'ORD-1237', customer: 'سارا رضایی', product: 'Dell XPS 13', amount: 128000000, status: 'در انتظار پرداخت', date: '8 ساعت پیش' },
  { id: 'ORD-1238', customer: 'حسن نوری', product: 'Razer Blade 16', amount: 248000000, status: 'تکمیل شده', date: '10 ساعت پیش' },
];
