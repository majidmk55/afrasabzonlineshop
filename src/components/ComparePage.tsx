import { useState, useEffect, useMemo } from "react";
import { fmt, toFa, type Laptop } from "../data/laptops";
import { IClose, ICart, ICheck } from "./icons";
import { compareLaptops, type ComparisonResult, type CategoryScore } from "../lib/comparison/engine";

interface ComparePageProps {
  products: Laptop[];
  ids: string[];
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

export default function ComparePage({ products, ids, onClose, onAddToCart }: ComparePageProps) {
  const comparisonProducts = ids.map(id => products.find(p => p.id === id)).filter((p): p is Laptop => !!p);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // اجرای موتور مقایسه
  const result = useMemo<ComparisonResult | null>(() => {
    if (comparisonProducts.length < 2) return null;
    try {
      return compareLaptops(comparisonProducts);
    } catch {
      return null;
    }
  }, [comparisonProducts]);

  if (comparisonProducts.length === 0 || !result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-600">محصولی برای مقایسه انتخاب نشده است</p>
          <button onClick={onClose} className="mt-4 rounded-lg bg-[#2563eb] px-6 py-3 text-white font-bold">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const { laptops, scores, overallScores, winner, recommendations, insights } = result;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f5f7]" dir="rtl">
      {/* هدر */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-[#1a1a1a]">مقایسه هوشمند لپ‌تاپ‌ها</h1>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] transition-colors hover:bg-[#f9fafb]">
            <IClose size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Smart Verdict - نتیجه هوشمند */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 text-white shadow-xl">
          <div className="mb-4 text-center">
            <span className="text-5xl">🏆</span>
          </div>
          <h2 className="mb-2 text-center text-3xl font-bold">نتیجه هوشمند ما</h2>
          <p className="mb-6 text-center text-lg opacity-90">
            {laptops[winner].name}
          </p>
          <div className="mx-auto max-w-2xl rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-center text-lg">
              <span className="font-bold">انتخاب بهتر برای:</span> {recommendations[0]?.description}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-sm opacity-80">اطمینان:</span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-white/20">
                <div 
                  className="h-full rounded-full bg-white transition-all duration-1000"
                  style={{ width: animated ? '85%' : '0%' }}
                />
              </div>
              <span className="font-bold">85%</span>
            </div>
          </div>
        </div>

        {/* Recommendations - توصیه‌ها */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx}
              className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
              style={{
                animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`
              }}
            >
              <div className="mb-3 text-4xl">{rec.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-[#1a1a1a]">{rec.title}</h3>
              <p className="mb-3 text-sm text-[#6b7280]">{laptops[rec.laptop].shortName}</p>
              <p className="text-sm text-[#4b5563]">{rec.description}</p>
            </div>
          ))}
        </div>

        {/* Category Scores - امتیازات دسته‌بندی */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">کارت امتیاز فنی</h2>
          <div className="space-y-6">
            {scores.map((score, idx) => (
              <CategoryScoreCard 
                key={idx} 
                score={score} 
                laptops={laptops}
                animated={animated}
                delay={idx * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Smart Insights - بینش‌های هوشمند */}
        {insights.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">بینش‌های هوشمند</h2>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-4 rounded-xl p-4 ${
                    insight.type === 'advantage' ? 'bg-green-50' :
                    insight.type === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
                  }`}
                >
                  <div className="text-3xl">
                    {insight.type === 'advantage' ? '✅' :
                     insight.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1a1a1a]">
                      {laptops[insight.laptop].shortName}
                    </p>
                    <p className="text-sm text-[#4b5563]">{insight.message}</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-bold ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {insight.impact === 'high' ? 'تأثیر بالا' :
                     insight.impact === 'medium' ? 'تأثیر متوسط' : 'تأثیر کم'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall Scores - امتیازات کلی */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">امتیاز کلی</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {laptops.map((laptop, idx) => (
              <div 
                key={laptop.id}
                className={`rounded-xl border-2 p-6 transition-all ${
                  idx === winner ? 'border-[#2563eb] bg-blue-50' : 'border-[#e5e7eb]'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1a1a1a]">{laptop.shortName}</h3>
                  {idx === winner && (
                    <span className="rounded-full bg-[#2563eb] px-3 py-1 text-xs font-bold text-white">
                      🏆 برنده
                    </span>
                  )}
                </div>
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke={idx === winner ? '#2563eb' : '#6b7280'} 
                        strokeWidth="8"
                        strokeDasharray={`${(overallScores[idx] / 100) * 283} 283`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#1a1a1a]">
                        {toFa(overallScores[idx])}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#6b7280]">از ۱۰۰</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* دکمه‌های اکشن */}
        <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white p-6 shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex gap-3">
              {laptops.map((laptop) => (
                <button
                  key={laptop.id}
                  onClick={() => onAddToCart(laptop.id)}
                  className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
                >
                  <ICart size={16} />
                  افزودن {laptop.shortName} به سبد
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}

// کامپوننت کارت امتیاز دسته‌بندی
function CategoryScoreCard({ 
  score, 
  laptops, 
  animated,
  delay 
}: { 
  score: CategoryScore; 
  laptops: Laptop[];
  animated: boolean;
  delay: number;
}) {
  return (
    <div 
      className="rounded-xl border border-[#e5e7eb] p-6 transition-all hover:shadow-md"
      style={{
        animation: `fadeIn 0.5s ease-out ${delay}s both`
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{score.icon}</span>
          <h3 className="text-lg font-bold text-[#1a1a1a]">{score.category}</h3>
        </div>
        {score.difference > 0 && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            اختلاف: {toFa(score.difference)}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {laptops.map((laptop, idx) => {
          const isWinner = idx === score.winner;
          return (
            <div key={laptop.id} className="flex items-center gap-4">
              <span className="w-32 text-sm font-medium text-[#555]">{laptop.shortName}</span>
              <div className="flex-1">
                <div className="relative h-8 overflow-hidden rounded-lg bg-[#f0f0f0]">
                  <div 
                    className={`absolute inset-y-0 right-0 rounded-lg transition-all duration-1000 ${
                      isWinner 
                        ? 'bg-gradient-to-l from-[#2563eb] to-[#3b82f6]' 
                        : 'bg-gradient-to-l from-[#6b7280] to-[#9ca3af]'
                    }`}
                    style={{ width: animated ? `${score.scores[idx]}%` : '0%' }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                    {toFa(score.scores[idx])}
                  </span>
                </div>
              </div>
              {isWinner && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  ✓ برنده
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
