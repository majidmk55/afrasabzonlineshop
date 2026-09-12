import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockRevenueData } from '../../../lib/analytics/mockData';

const formatCurrency = (value: number) => {
  return `${(value / 1000000).toFixed(0)}M ریال`;
};

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">روند درآمد ۳۰ روزه</h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs text-mist">
            <span className="h-3 w-3 rounded-full bg-sea" />
            دوره فعلی
          </span>
          <span className="flex items-center gap-1 text-xs text-mist">
            <span className="h-3 w-3 rounded-full bg-mist/50" />
            دوره قبل
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockRevenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M ریال`, '']}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#0477b3" 
            strokeWidth={2}
            name="درآمد فعلی"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="previousRevenue" 
            stroke="#94a3b8" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="دوره قبل"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
