import { mockTopProducts } from '../../../lib/analytics/mockData';
import { fmt } from '../../../data/laptops';

export default function TopProductsTable() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h3 className="mb-4 font-display text-lg font-bold">محصولات پرفروش</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-foam">
              <th className="px-4 py-3 text-right text-xs font-bold text-mist">محصول</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-mist">برند</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-mist">فروش</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-mist">درآمد</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-mist">موجودی</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-mist">امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {mockTopProducts.map((product) => (
              <tr key={product.id} className="border-b border-line transition-colors hover:bg-foam">
                <td className="px-4 py-3 text-sm font-medium text-ink">{product.name}</td>
                <td className="px-4 py-3 text-sm text-mist">{product.brand}</td>
                <td className="px-4 py-3 text-sm font-bold text-sea">{product.sales.toLocaleString('fa-IR')}</td>
                <td className="px-4 py-3 text-sm font-bold text-ink">{fmt(product.revenue)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    product.stock < 10 ? 'bg-coral/10 text-coral' : 'bg-moss/10 text-moss'
                  }`}>
                    {product.stock.toLocaleString('fa-IR')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-bold text-ink">{product.rating.toLocaleString('fa-IR')}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
