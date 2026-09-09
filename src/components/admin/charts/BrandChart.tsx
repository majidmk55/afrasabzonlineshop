import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockBrandData } from '../../../lib/analytics/mockData';

const formatCurrency = (value: number) => {
  return `${(value / 1000000000).toFixed(1)}B`;
};

export default function BrandChart() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h3 className="mb-4 font-display text-lg font-bold">فروش بر اساس برند</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockBrandData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="brand" 
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            label={{ value: 'تعداد فروش', angle: -90, position: 'insideLeft', style: { fontSize: '11px' } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={formatCurrency}
            label={{ value: 'درآمد (میلیارد ریال)', angle: 90, position: 'insideRight', style: { fontSize: '11px' } }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="sales" fill="#0477b3" name="تعداد فروش" radius={[8, 8, 0, 0]} />
          <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="درآمد" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
