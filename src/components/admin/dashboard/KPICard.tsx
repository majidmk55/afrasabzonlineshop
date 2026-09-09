import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { KPIData } from '../../../lib/analytics/mockData';

interface KPICardProps {
  data: KPIData;
  formatValue: (value: number) => string;
}

export default function KPICard({ data, formatValue }: KPICardProps) {
  const isPositive = data.change >= 0;
  const trendData = data.trend.map((value, index) => ({ value, index }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white p-5 transition-all hover:shadow-lg">
      {/* Progress bar بر اساس weight */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-foam">
        <div 
          className="h-full transition-all duration-500" 
          style={{ 
            width: `${data.weight}%`,
            backgroundColor: data.color 
          }}
        />
      </div>

      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-mist">{data.title}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{formatValue(data.value)}</p>
        </div>
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${data.color}15` }}
        >
          <span style={{ color: data.color, fontSize: '20px' }}>
            {data.icon === 'TrendingUp' && '📈'}
            {data.icon === 'Target' && '🎯'}
            {data.icon === 'ShoppingCart' && '🛒'}
            {data.icon === 'Users' && '👥'}
            {data.icon === 'Package' && '📦'}
            {data.icon === 'RefreshCw' && '🔄'}
            {data.icon === 'DollarSign' && '💰'}
            {data.icon === 'XCircle' && '❌'}
            {data.icon === 'Smile' && '😊'}
          </span>
        </div>
      </div>

      {/* Change */}
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
          isPositive ? 'bg-moss/10 text-moss' : 'bg-coral/10 text-coral'
        }`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{data.changePercent.toLocaleString('fa-IR')}%
        </div>
        <span className="text-xs text-mist">
          {isPositive ? '+' : ''}{formatValue(data.change)}
        </span>
      </div>

      {/* Sparkline */}
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={data.color} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weight indicator */}
      <div className="mt-2 flex items-center justify-between text-xs text-mist">
        <span>وزن: {data.weight}%</span>
        <span>نسبت به دوره قبل</span>
      </div>
    </div>
  );
}
