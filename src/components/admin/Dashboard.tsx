import { useState } from 'react';
import { BarChart3, Calendar, Download, RefreshCw } from 'lucide-react';
import KPICard from '../../components/admin/dashboard/KPICard';
import RevenueChart from '../../components/admin/charts/RevenueChart';
import BrandChart from '../../components/admin/charts/BrandChart';
import CategoryPieChart from '../../components/admin/charts/CategoryPieChart';
import SalesFunnel from '../../components/admin/charts/SalesFunnel';
import NanoReviewComparison from '../../components/admin/charts/NanoReviewComparison';
import TopProductsTable from '../../components/admin/tables/TopProductsTable';
import AlertPanel from '../../components/admin/alerts/AlertPanel';
import { mockKPIs } from '../../lib/analytics/mockData';
import { fmt, fmtShort } from '../../data/laptops';

type DateRange = 'today' | '7days' | '30days' | 'month' | 'custom';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatKPIValue = (kpiId: string, value: number): string => {
    switch (kpiId) {
      case 'revenue':
        return fmtShort(value);
      case 'conversion':
      case 'aov':
        return fmt(value);
      case 'traffic':
      case 'inventory':
        return value.toLocaleString('fa-IR');
      case 'retention':
      case 'nps':
      case 'profit':
      case 'abandoned':
        return `${value.toLocaleString('fa-IR')}%`;
      case 'cac':
        return fmt(value);
      default:
        return value.toString();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting as ${format}...`);
    alert(`خروجی ${format.toUpperCase()} در حال آماده‌سازی است...`);
  };

  // مرتب‌سازی KPIها بر اساس weight
  const sortedKPIs = [...mockKPIs].sort((a, b) => b.weight - a.weight);

  return (
    <div className="min-h-screen bg-foam p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-ink">
            <BarChart3 size={32} className="text-sea" />
            داشبورد تحلیلی
          </h1>
          <p className="mt-1 text-sm text-mist">
            آخرین به‌روزرسانی: {lastUpdated.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
            <Calendar size={16} className="text-mist" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="bg-transparent text-sm font-medium text-ink outline-none"
            >
              <option value="today">امروز</option>
              <option value="7days">۷ روز گذشته</option>
              <option value="30days">۳۰ روز گذشته</option>
              <option value="month">این ماه</option>
              <option value="custom">بازه دلخواه</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-foam disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            به‌روزرسانی
          </button>

          {/* Export Button */}
          <div className="relative group">
            <button className="flex items-center gap-2 rounded-xl bg-sea px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-seadeep">
              <Download size={16} />
              خروجی
            </button>
            <div className="absolute right-0 top-full mt-2 hidden w-32 rounded-xl border border-line bg-white shadow-lg group-hover:block">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-right text-sm text-ink hover:bg-foam"
              >
                PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-right text-sm text-ink hover:bg-foam"
              >
                Excel
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-right text-sm text-ink hover:bg-foam"
              >
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {sortedKPIs.map((kpi) => (
          <KPICard
            key={kpi.id}
            data={kpi}
            formatValue={(value) => formatKPIValue(kpi.id, value)}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <BrandChart />
      </div>

      {/* Charts Row 2 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryPieChart />
        <SalesFunnel />
      </div>

      {/* NanoReview Comparison */}
      <div className="mb-6">
        <NanoReviewComparison />
      </div>

      {/* Tables and Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopProductsTable />
        </div>
        <div>
          <AlertPanel />
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-mist">
        <RefreshCw size={12} className="animate-spin" />
        به‌روزرسانی خودکار هر ۵ دقیقه
      </div>
    </div>
  );
}
