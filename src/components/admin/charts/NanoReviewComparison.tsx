import { useEffect, useState } from 'react';
import type { Laptop } from '../../../data/laptops';

interface Product {
  name: string;
  score: number;
}

interface CategoryData {
  category: string;
  subtitle: string;
  products: [Product, Product];
}

interface NanoReviewComparisonProps {
  products?: Laptop[];
}

function generateComparisonData(products: Laptop[]): CategoryData[] {
  if (products.length < 2) {
    // داده‌های پیش‌فرض در صورت نبود محصولات کافی
    return [
      { 
        category: "عملکرد", 
        subtitle: "عملکرد سیستم و برنامه‌ها", 
        products: [
          {name: "محصول ۱", score: 73}, 
          {name: "محصول ۲", score: 58}
        ] 
      },
      { 
        category: "گیمینگ", 
        subtitle: "عملکرد در بازی‌های سه‌بعدی محبوب", 
        products: [
          {name: "محصول ۱", score: 51}, 
          {name: "محصول ۲", score: 40}
        ] 
      },
      { 
        category: "نمایشگر", 
        subtitle: "زاویه دید، دقت رنگ، روشنایی", 
        products: [
          {name: "محصول ۱", score: 52}, 
          {name: "محصول ۲", score: 50}
        ] 
      },
      { 
        category: "عمر باتری", 
        subtitle: "عمر باتری در استفاده سبک و متوسط", 
        products: [
          {name: "محصول ۱", score: 55}, 
          {name: "محصول ۲", score: 55}
        ] 
      },
      { 
        category: "اتصالات", 
        subtitle: "پورت‌ها، وب‌کم و رابط‌های دیگر", 
        products: [
          {name: "محصول ۱", score: 62}, 
          {name: "محصول ۲", score: 61}
        ] 
      },
      { 
        category: "قابلیت حمل", 
        subtitle: "طراحی، مواد، دوام و کاربرد", 
        products: [
          {name: "محصول ۱", score: 56}, 
          {name: "محصول ۲", score: 43}
        ] 
      }
    ];
  }

  const p1 = products[0];
  const p2 = products[1];

  // محاسبه امتیازات بر اساس rating
  const baseScore1 = Math.round(p1.rating * 20);
  const baseScore2 = Math.round(p2.rating * 20);

  return [
    { 
      category: "عملکرد", 
      subtitle: "عملکرد سیستم و برنامه‌ها", 
      products: [
        {name: p1.shortName, score: Math.min(100, baseScore1 + 5)}, 
        {name: p2.shortName, score: Math.min(100, baseScore2 - 3)}
      ] 
    },
    { 
      category: "گیمینگ", 
      subtitle: "عملکرد در بازی‌های سه‌بعدی محبوب", 
      products: [
        {name: p1.shortName, score: Math.min(100, baseScore1 - 8)}, 
        {name: p2.shortName, score: Math.min(100, baseScore2 + 2)}
      ] 
    },
    { 
      category: "نمایشگر", 
      subtitle: "زاویه دید، دقت رنگ، روشنایی", 
      products: [
        {name: p1.shortName, score: Math.min(100, baseScore1 + 3)}, 
        {name: p2.shortName, score: Math.min(100, baseScore2 - 2)}
      ] 
    },
    { 
      category: "عمر باتری", 
      subtitle: "عمر باتری در استفاده سبک و متوسط", 
      products: [
        {name: p1.shortName, score: Math.min(100, baseScore1 - 5)}, 
        {name: p2.shortName, score: Math.min(100, baseScore2 + 5)}
      ] 
    },
    { 
      category: "اتصالات", 
      subtitle: "پورت‌ها، وب‌کم و رابط‌های دیگر", 
      products: [
        {name: p1.shortName, score: Math.min(100, baseScore1 + 2)}, 
        {name: p2.shortName, score: Math.min(100, baseScore2 + 1)}
      ] 
    },
    { 
      category: "قابلیت حمل", 
      subtitle: "طراحی، مواد، دوام و کاربرد", 
      products: [
        {name: p1.shortName, score: Math.min(100, baseScore1 - 4)}, 
        {name: p2.shortName, score: Math.min(100, baseScore2 - 7)}
      ] 
    }
  ];
}

function ComparisonCard({ category, subtitle, products, index }: CategoryData & { index: number }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className="rounded-xl bg-white p-6 transition-all duration-300 hover:shadow-lg"
      style={{
        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      {/* عنوان دسته */}
      <div className="mb-4">
        <h3 className="text-[18px] font-bold text-[#1a1a1a]">{category}</h3>
        <p className="mt-1 text-[13px] text-[#6b7280]">{subtitle}</p>
      </div>

      {/* محصولات */}
      <div className="space-y-4">
        {products.map((product, idx) => {
          const isWinner = product.score > products[1 - idx].score;
          
          return (
            <div key={idx} className="border-t border-[#f3f4f6] pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-[#111827]">
                  {product.name}
                  {isWinner && (
                    <span className="mr-2 inline-block rounded bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
                      برنده
                    </span>
                  )}
                </span>
                <div className="rounded-md bg-[#3b5bdb] px-3 py-1">
                  <span className="text-[16px] font-bold text-white">
                    {product.score.toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>
              
              {/* نوار پیشرفت */}
              <div className="h-2 w-full overflow-hidden rounded-md bg-[#e5e7eb]">
                <div 
                  className="h-full rounded-md bg-[#3b5bdb] transition-all duration-1000 ease-out"
                  style={{
                    width: animated ? `${product.score}%` : '0%'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NanoReviewComparison({ products = [] }: NanoReviewComparisonProps) {
  const data = generateComparisonData(products);

  return (
    <div className="rounded-2xl border border-line bg-white p-6" dir="rtl">
      <h2 className="mb-6 font-display text-xl font-bold">مقایسه گرافیکی</h2>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* گرید 2 ستونه */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.map((item, index) => (
          <ComparisonCard
            key={item.category}
            category={item.category}
            subtitle={item.subtitle}
            products={item.products}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
