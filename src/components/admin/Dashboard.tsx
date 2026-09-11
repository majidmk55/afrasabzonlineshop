import { useState } from 'react';
import { fmt, fmtShort, toFa, type Laptop } from '../../data/laptops';
import type { OrderRecord } from '../../lib/store';

type DateRange = 'today' | '7days' | '30days' | 'month';

interface DashboardProps {
  products?: Laptop[];
  orders?: OrderRecord[];
}

// داده‌های نمونه KPI
const mockKPIs = [
  { id: 'revenue', label: 'درآمد کل', value: 2450000000, change: 12.5, icon: '💰', weight: 25 },
  { id: 'conversion', label: 'نرخ تبدیل', value: 3.2, change: 5.2, icon: '📊', weight: 20 },
  { id: 'aov', label: 'میانگین سبد خرید', value: 185000000, change: 8.3, icon: '🛒', weight: 15 },
  { id: 'traffic', label: 'بازدیدکنندگان', value: 45230, change: 15.7, icon: '👥', weight: 10 },
  { id: 'inventory', label: 'موجودی انبار', value: 156, change: -8.2, icon: '📦', weight: 8 },
  { id: 'retention', label: 'نرخ بازگشت', value: 68, change: 3.5, icon: '🔄', weight: 7 },
];

// داده‌های نمونه فروش
const salesData = [
  { date: '1', value: 120000000 },
  { date: '2', value: 145000000 },
  { date: '3', value: 132000000 },
  { date: '4', value: 158000000 },
  { date: '5', value: 175000000 },
  { date: '6', value: 168000000 },
  { date: '7', value: 189000000 },
  { date: '8', value: 195000000 },
  { date: '9', value: 210000000 },
  { date: '10', value: 225000000 },
];

// داده‌های نمونه برندها
const brandData = [
  { name: 'اپل', value: 450000000 },
  { name: 'ایسوس', value: 380000000 },
  { name: 'لنوو', value: 320000000 },
  { name: 'دل', value: 280000000 },
  { name: 'اچ‌پی', value: 240000000 },
];

// داده‌های نمونه دسته‌بندی
const categoryData = [
  { name: 'گیمینگ', value: 35, color: '#3b82f6' },
  { name: 'خلاقیت', value: 25, color: '#10b981' },
  { name: 'بیزنس', value: 20, color: '#f59e0b' },
  { name: 'اولترابوک', value: 20, color: '#ef4444' },
];

// داده‌های نمونه قیف فروش
const funnelData = [
  { stage: 'بازدید', value: 100 },
  { stage: 'مشاهده محصول', value: 65 },
  { stage: 'افزودن به سبد', value: 35 },
  { stage: 'شروع پرداخت', value: 20 },
  { stage: 'خرید موفق', value: 15 },
];

// داده‌های نمونه محصولات برتر
const topProducts = [
  { name: 'MacBook Pro 14', sales: 45, revenue: 8325000000 },
  { name: 'ASUS ROG G14', sales: 38, revenue: 5510000000 },
  { name: 'ThinkPad X1', sales: 32, revenue: 5056000000 },
  { name: 'Dell XPS 13', sales: 28, revenue: 3584000000 },
  { name: 'HP Spectre', sales: 24, revenue: 2928000000 },
];

export default function Dashboard({ products, orders }: DashboardProps = {}) {
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`خروجی ${format.toUpperCase()} در حال آماده‌سازی است...`);
  };

  const sortedKPIs = [...mockKPIs].sort((a, b) => b.weight - a.weight);
  const maxSales = Math.max(...salesData.map(d => d.value));
  const maxBrand = Math.max(...brandData.map(d => d.value));

  return (
    <div className="font-nazanin min-h-screen bg-foam p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-ink">
            <span className="text-sea">📊</span>
            داشبورد تحلیلی
          </h1>
          <p className="mt-1 text-sm text-mist">
            آخرین به‌روزرسانی: {lastUpdated.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
            <span className="text-mist">📅</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="bg-transparent text-sm font-medium text-ink outline-none"
            >
              <option value="today">امروز</option>
              <option value="7days">۷ روز گذشته</option>
              <option value="30days">۳۰ روز گذشته</option>
              <option value="month">این ماه</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-foam disabled:opacity-50"
          >
            <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
            به‌روزرسانی
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-foam">
              <span>📥</span>
              خروجی
            </button>
            <div className="absolute right-0 top-full z-10 mt-1 hidden w-32 rounded-xl border border-line bg-white p-2 shadow-lg group-hover:block">
              <button onClick={() => handleExport('pdf')} className="w-full rounded-lg px-3 py-2 text-right text-sm hover:bg-foam">PDF</button>
              <button onClick={() => handleExport('excel')} className="w-full rounded-lg px-3 py-2 text-right text-sm hover:bg-foam">Excel</button>
              <button onClick={() => handleExport('csv')} className="w-full rounded-lg px-3 py-2 text-right text-sm hover:bg-foam">CSV</button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {sortedKPIs.map((kpi) => (
          <div key={kpi.id} className="rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-xs font-bold ${kpi.change >= 0 ? 'text-moss' : 'text-red-500'}`}>
                {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change).toLocaleString('fa-IR')}%
              </span>
            </div>
            <p className="text-sm text-mist">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-ink">
              {kpi.id === 'revenue' || kpi.id === 'aov' || kpi.id === 'cac'
                ? fmtShort(kpi.value)
                : kpi.id === 'conversion' || kpi.id === 'retention' || kpi.id === 'nps' || kpi.id === 'profit' || kpi.id === 'abandoned'
                ? `${toFa(kpi.value)}%`
                : toFa(kpi.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-xl border border-line bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">روند فروش</h2>
          <div className="h-64">
            <div className="flex h-full items-end gap-2">
              {salesData.map((item, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-sea transition-all hover:bg-seadeep"
                    style={{ height: `${(item.value / maxSales) * 100}%` }}
                  />
                  <span className="text-xs text-mist">{toFa(item.date)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Chart */}
        <div className="rounded-xl border border-line bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">فروش بر اساس برند</h2>
          <div className="space-y-3">
            {brandData.map((brand, idx) => (
              <div key={idx}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{brand.name}</span>
                  <span className="text-sm text-mist">{fmtShort(brand.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-foam">
                  <div
                    className="h-full rounded-full bg-sea"
                    style={{ width: `${(brand.value / maxBrand) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Pie Chart */}
        <div className="rounded-xl border border-line bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">سهم دسته‌بندی‌ها</h2>
          <div className="flex items-center gap-6">
            <div className="relative h-48 w-48">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                {categoryData.reduce((acc: any[], category, idx) => {
                  const prevSum = acc.reduce((sum, c) => sum + c.value, 0);
                  const circumference = 2 * Math.PI * 40;
                  const strokeDasharray = (category.value / 100) * circumference;
                  const strokeDashoffset = -(prevSum / 100) * circumference;
                  acc.push({
                    ...category,
                    strokeDasharray,
                    strokeDashoffset,
                  });
                  return acc;
                }, []).map((category, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={category.color}
                    strokeWidth="20"
                    strokeDasharray={category.strokeDasharray}
                    strokeDashoffset={category.strokeDashoffset}
                  />
                ))}
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              {categoryData.map((category, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded" style={{ backgroundColor: category.color }} />
                  <span className="text-sm text-ink">{category.name}</span>
                  <span className="mr-auto text-sm font-bold text-ink">{toFa(category.value)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="rounded-xl border border-line bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">قیف فروش</h2>
          <div className="space-y-2">
            {funnelData.map((stage, idx) => (
              <div key={idx}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{stage.stage}</span>
                  <span className="text-sm text-mist">{toFa(stage.value)}%</span>
                </div>
                <div className="h-8 overflow-hidden rounded-lg bg-foam">
                  <div
                    className="flex h-full items-center justify-center rounded-lg bg-gradient-to-l from-sea to-seadeep text-sm font-bold text-white"
                    style={{ width: `${stage.value}%` }}
                  >
                    {toFa(stage.value)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="rounded-xl border border-line bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">محصولات برتر</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-foam">
                <th className="px-4 py-3 text-right text-sm font-bold text-ink">محصول</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-ink">تعداد فروش</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-ink">درآمد</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => (
                <tr key={idx} className="border-b border-line transition-colors hover:bg-foam">
                  <td className="px-4 py-3 text-sm text-ink">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-ink">{toFa(product.sales)}</td>
                  <td className="px-4 py-3 text-sm text-ink">{fmtShort(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Panel */}
      <div className="mt-6 rounded-xl border border-line bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">هشدارها و اعلان‌ها</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-moss/30 bg-moss/10 p-4">
            <p className="text-sm font-bold text-moss">✓ موجودی انبار کافی است</p>
            <p className="mt-1 text-xs text-mist">۱۵۶ دستگاه موجود در انبار</p>
          </div>
          <div className="rounded-lg border border-sea/30 bg-sea/10 p-4">
            <p className="text-sm font-bold text-sea">📈 رشد فروش ۱۲.۵٪ نسبت به ماه قبل</p>
            <p className="mt-1 text-xs text-mist">ادامه دهید!</p>
          </div>
          <div className="rounded-lg border border-amber-300/30 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-600">⚠ موجودی MacBook Pro کم است</p>
            <p className="mt-1 text-xs text-mist">فقط ۴ دستگاه باقی مانده</p>
          </div>
        </div>
      </div>
    </div>
  );
}
