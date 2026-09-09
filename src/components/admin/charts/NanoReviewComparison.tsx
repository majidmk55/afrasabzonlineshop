import { useEffect, useState } from 'react';

interface Product {
  name: string;
  score: number;
}

interface CategoryData {
  category: string;
  subtitle: string;
  products: [Product, Product];
}

const data: CategoryData[] = [
  { 
    category: "عملکرد", 
    subtitle: "عملکرد سیستم و برنامه‌ها", 
    products: [
      {name: "Katana 15 HX C14", score: 73}, 
      {name: "LOQ 17IRX10", score: 58}
    ] 
  },
  { 
    category: "گیمینگ", 
    subtitle: "عملکرد در بازی‌های سه‌بعدی محبوب", 
    products: [
      {name: "Katana 15 HX C14", score: 51}, 
      {name: "LOQ 17IRX10", score: 40}
    ] 
  },
  { 
    category: "نمایشگر", 
    subtitle: "زاویه دید، دقت رنگ، روشنایی", 
    products: [
      {name: "Katana 15 HX C14", score: 52}, 
      {name: "LOQ 17IRX10", score: 50}
    ] 
  },
  { 
    category: "عمر باتری", 
    subtitle: "عمر باتری در استفاده سبک و متوسط", 
    products: [
      {name: "Katana 15 HX C14", score: 55}, 
      {name: "LOQ 17IRX10", score: 55}
    ] 
  },
  { 
    category: "اتصالات", 
    subtitle: "پورت‌ها، وب‌کم و رابط‌های دیگر", 
    products: [
      {name: "Katana 15 HX C14", score: 62}, 
      {name: "LOQ 17IRX10", score: 61}
    ] 
  },
  { 
    category: "قابلیت حمل", 
    subtitle: "طراحی، مواد، دوام و کاربرد", 
    products: [
      {name: "Katana 15 HX C14", score: 56}, 
      {name: "LOQ 17IRX10", score: 43}
    ] 
  }
];

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

export default function NanoReviewComparison() {
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
