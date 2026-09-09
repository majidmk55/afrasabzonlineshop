// Smart Laptop Comparison Engine
// موتور مقایسه هوشمند لپ‌تاپ

import type { Laptop } from '../../data/laptops';

export interface ComparisonResult {
  laptops: Laptop[];
  scores: CategoryScore[];
  overallScores: number[];
  winner: number;
  recommendations: Recommendation[];
  insights: Insight[];
}

export interface CategoryScore {
  category: string;
  icon: string;
  scores: number[];
  winner: number;
  difference: number;
  weight: number;
}

export interface Recommendation {
  type: string;
  laptop: number;
  title: string;
  description: string;
  icon: string;
}

export interface Insight {
  type: 'advantage' | 'warning' | 'info';
  laptop: number;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

// استخراج مقدار عددی از متن
function extractNumber(text: string): number {
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

// محاسبه امتیاز CPU
function calculateCPUScore(laptop: Laptop): number {
  const cpuSpec = laptop.specs.find(s => s.title === 'پردازنده');
  if (!cpuSpec) return 50;

  const coresRow = cpuSpec.rows.find(r => r[0].includes('تعداد هسته'));
  const cores = coresRow ? extractNumber(coresRow[1]) : 8;

  const freqRow = cpuSpec.rows.find(r => r[0].includes('فرکانس'));
  const freq = freqRow ? extractNumber(freqRow[1]) : 3;

  const coreScore = Math.min(100, cores * 5);
  const freqScore = Math.min(100, freq * 18);

  return Math.round((coreScore + freqScore) / 2);
}

// محاسبه امتیاز GPU
function calculateGPUScore(laptop: Laptop): number {
  const gpuSpec = laptop.specs.find(s => s.title === 'گرافیک');
  if (!gpuSpec) return 50;

  const modelRow = gpuSpec.rows.find(r => r[0].includes('مدل'));
  const model = modelRow ? modelRow[1].toLowerCase() : '';

  let score = 50;
  if (model.includes('rtx 5090')) score = 98;
  else if (model.includes('rtx 5080')) score = 95;
  else if (model.includes('rtx 5070')) score = 90;
  else if (model.includes('rtx 4090')) score = 95;
  else if (model.includes('rtx 4080')) score = 90;
  else if (model.includes('rtx 4070')) score = 85;
  else if (model.includes('rtx 4060')) score = 75;
  else if (model.includes('rtx 4050')) score = 70;
  else if (model.includes('arc')) score = 65;
  else if (model.includes('iris')) score = 60;
  else if (model.includes('radeon')) score = 65;

  return score;
}

// محاسبه امتیاز نمایشگر
function calculateDisplayScore(laptop: Laptop): number {
  const displaySpec = laptop.specs.find(s => s.title === 'صفحه نمایش');
  if (!displaySpec) return 50;

  const resRow = displaySpec.rows.find(r => r[0].includes('رزولوشن'));
  const res = resRow ? resRow[1] : '';

  const refreshRow = displaySpec.rows.find(r => r[0].includes('نرخ نوسازی'));
  const refresh = refreshRow ? extractNumber(refreshRow[1]) : 60;

  let score = 60;
  if (res.includes('3840') || res.includes('4K')) score = 95;
  else if (res.includes('2560') || res.includes('QHD')) score = 85;
  else if (res.includes('1920') || res.includes('FHD')) score = 70;

  const refreshBonus = Math.min(15, (refresh - 60) * 0.3);

  return Math.min(100, Math.round(score + refreshBonus));
}

// محاسبه امتیاز باتری
function calculateBatteryScore(laptop: Laptop): number {
  const batterySpec = laptop.specs.find(s => s.title === 'باتری و شارژ');
  if (!batterySpec) return 50;

  const capacityRow = batterySpec.rows.find(r => r[0].includes('ظرفیت'));
  const capacity = capacityRow ? extractNumber(capacityRow[1]) : 50;

  return Math.min(100, Math.round(capacity * 1.1));
}

// محاسبه امتیاز قابلیت حمل
function calculatePortabilityScore(laptop: Laptop): number {
  const weightSpec = laptop.specs.find(s => s.title === 'وزن و ابعاد');
  if (!weightSpec) return 50;

  const weightRow = weightSpec.rows.find(r => r[0] === 'وزن');
  const weight = weightRow ? extractNumber(weightRow[1]) : 2.5;

  return Math.max(0, Math.min(100, Math.round((3 - weight) * 50 + 50)));
}

// محاسبه امتیاز ارزش خرید
function calculateValueScore(laptop: Laptop): number {
  const rating = laptop.rating;
  const price = laptop.price;

  const valueIndex = (rating * 20) / (price / 100000000);
  return Math.min(100, Math.round(valueIndex * 10));
}

// موتور اصلی مقایسه
export function compareLaptops(laptops: Laptop[]): ComparisonResult {
  if (laptops.length < 2) {
    throw new Error('حداقل ۲ لپ‌تاپ برای مقایسه نیاز است');
  }

  // محاسبه امتیازات هر دسته
  const scores: CategoryScore[] = [
    {
      category: 'عملکرد پردازنده',
      icon: '🔲',
      scores: laptops.map(l => calculateCPUScore(l)),
      winner: 0,
      difference: 0,
      weight: 8,
    },
    {
      category: 'عملکرد گرافیک',
      icon: '🎮',
      scores: laptops.map(l => calculateGPUScore(l)),
      winner: 0,
      difference: 0,
      weight: 9,
    },
    {
      category: 'نمایشگر',
      icon: '🖥️',
      scores: laptops.map(l => calculateDisplayScore(l)),
      winner: 0,
      difference: 0,
      weight: 7,
    },
    {
      category: 'عمر باتری',
      icon: '🔋',
      scores: laptops.map(l => calculateBatteryScore(l)),
      winner: 0,
      difference: 0,
      weight: 6,
    },
    {
      category: 'قابلیت حمل',
      icon: '🎒',
      scores: laptops.map(l => calculatePortabilityScore(l)),
      winner: 0,
      difference: 0,
      weight: 5,
    },
    {
      category: 'ارزش خرید',
      icon: '💰',
      scores: laptops.map(l => calculateValueScore(l)),
      winner: 0,
      difference: 0,
      weight: 8,
    },
  ];

  // محاسبه برنده و اختلاف هر دسته
  scores.forEach(score => {
    const maxScore = Math.max(...score.scores);
    score.winner = score.scores.indexOf(maxScore);
    score.difference = maxScore - Math.min(...score.scores);
  });

  // محاسبه امتیاز کلی
  const overallScores = laptops.map((_, idx) => {
    const weightedSum = scores.reduce((sum, score) => {
      return sum + (score.scores[idx] * score.weight);
    }, 0);
    const totalWeight = scores.reduce((sum, score) => sum + score.weight, 0);
    return Math.round(weightedSum / totalWeight);
  });

  const winner = overallScores.indexOf(Math.max(...overallScores));

  // تولید توصیه‌ها
  const recommendations: Recommendation[] = [
    {
      type: 'best_overall',
      laptop: winner,
      title: 'بهترین انتخاب کلی',
      description: `${laptops[winner].name} با امتیاز کلی بالاتر، انتخاب بهتری برای اکثر کاربران است.`,
      icon: '🏆',
    },
    {
      type: 'best_gaming',
      laptop: scores.find(s => s.category === 'عملکرد گرافیک')?.winner || 0,
      title: 'بهترین برای گیمینگ',
      description: 'گرافیک قوی‌تر و عملکرد بهتر در بازی‌های سنگین',
      icon: '🎮',
    },
    {
      type: 'best_portability',
      laptop: scores.find(s => s.category === 'قابلیت حمل')?.winner || 0,
      title: 'بهترین برای حمل‌ونقل',
      description: 'سبک‌تر و قابل‌حمل‌تر برای استفاده روزانه',
      icon: '🎒',
    },
    {
      type: 'best_value',
      laptop: scores.find(s => s.category === 'ارزش خرید')?.winner || 0,
      title: 'بهترین ارزش خرید',
      description: 'قیمت مناسب نسبت به عملکرد و ویژگی‌ها',
      icon: '💰',
    },
  ];

  // تولید بینش‌های هوشمند
  const insights: Insight[] = generateInsights(laptops, scores);

  return {
    laptops,
    scores,
    overallScores,
    winner,
    recommendations,
    insights,
  };
}

// تولید بینش‌های هوشمند
function generateInsights(laptops: Laptop[], scores: CategoryScore[]): Insight[] {
  const insights: Insight[] = [];

  // مقایسه وزن
  const weights = laptops.map(l => {
    const weightSpec = l.specs.find(s => s.title === 'وزن و ابعاد');
    const weightRow = weightSpec?.rows.find(r => r[0] === 'وزن');
    return weightRow ? extractNumber(weightRow[1]) : 2.5;
  });

  if (Math.abs(weights[0] - weights[1]) > 0.3) {
    const lighter = weights[0] < weights[1] ? 0 : 1;
    const diff = Math.abs(weights[0] - weights[1]);
    insights.push({
      type: 'advantage',
      laptop: lighter,
      message: `${diff.toFixed(1)} کیلوگرم سبک‌تر`,
      impact: 'medium',
    });
  }

  // مقایسه اندازه نمایشگر
  const displays = laptops.map(l => {
    const displaySpec = l.specs.find(s => s.title === 'صفحه نمایش');
    const sizeRow = displaySpec?.rows.find(r => r[0].includes('اندازه'));
    return sizeRow ? extractNumber(sizeRow[1]) : 15;
  });

  if (Math.abs(displays[0] - displays[1]) > 1) {
    const larger = displays[0] > displays[1] ? 0 : 1;
    const diff = Math.abs(displays[0] - displays[1]);
    insights.push({
      type: 'info',
      laptop: larger,
      message: `نمایشگر ${diff.toFixed(1)} اینچ بزرگ‌تر`,
      impact: 'medium',
    });
  }

  // مقایسه قیمت
  const priceDiff = Math.abs(laptops[0].price - laptops[1].price);
  if (priceDiff > 10000000) {
    const cheaper = laptops[0].price < laptops[1].price ? 0 : 1;
    insights.push({
      type: 'advantage',
      laptop: cheaper,
      message: `${(priceDiff / 1000000).toFixed(0)} میلیون ریال ارزان‌تر`,
      impact: 'high',
    });
  }

  return insights;
}
