import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockCategoryData } from '../../../lib/analytics/mockData';

const COLORS = ['#0477b3', '#10b981', '#f59e0b', '#8b5cf6'];

export default function CategoryPieChart() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h3 className="mb-4 font-display text-lg font-bold">سهم دسته‌بندی‌ها</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockCategoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {mockCategoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string, props: any) => [
              `${value} دستگاه (${props.payload.percentage}%)`,
              props.payload.category
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
