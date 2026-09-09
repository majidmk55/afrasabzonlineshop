import { mockConversionFunnel } from '../../../lib/analytics/mockData';

export default function SalesFunnel() {
  const maxCount = mockConversionFunnel[0].count;

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h3 className="mb-6 font-display text-lg font-bold">قیف تبدیل فروش</h3>
      <div className="space-y-4">
        {mockConversionFunnel.map((stage, index) => {
          const widthPercent = (stage.count / maxCount) * 100;
          const colors = ['#0477b3', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];
          
          return (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-ink">{stage.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-mist">{stage.count.toLocaleString('fa-IR')} نفر</span>
                  <span className="rounded-full bg-sea/10 px-2 py-0.5 text-xs font-bold text-sea">
                    {stage.percentage.toLocaleString('fa-IR')}%
                  </span>
                </div>
              </div>
              <div className="relative h-12 overflow-hidden rounded-lg bg-foam">
                <div
                  className="absolute inset-y-0 right-0 flex items-center justify-center rounded-lg transition-all duration-500"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: colors[index],
                  }}
                >
                  {index < mockConversionFunnel.length - 1 && (
                    <span className="text-xs font-bold text-white">
                      تبدیل: {mockConversionFunnel[index + 1].conversionRate.toLocaleString('fa-IR')}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
