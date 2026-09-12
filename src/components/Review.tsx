import { useEffect, useRef, useState } from 'react';
import './Review.css';

interface LaptopScore {
  name: string;
  scores: {
    performance: number;
    gaming: number;
    display: number;
    battery: number;
    connectivity: number;
    portability: number;
  };
}

interface ReviewProps {
  laptopA: LaptopScore;
  laptopB: LaptopScore;
}

const categories = [
  {
    key: 'performance',
    title: 'Performance',
    description: 'System and application performance',
  },
  {
    key: 'gaming',
    title: 'Gaming',
    description: 'Performance in popular 3D games',
  },
  {
    key: 'display',
    title: 'Display',
    description: 'Viewing angle, color accuracy, brightness',
  },
  {
    key: 'battery',
    title: 'Battery Life',
    description: 'Potential battery life in light and average use',
  },
  {
    key: 'connectivity',
    title: 'Connectivity',
    description: 'Ports, webcam and other interfaces',
  },
  {
    key: 'portability',
    title: 'Portability',
    description: 'Design, materials, durability and usability',
  },
];

export default function Review({ laptopA, laptopB }: ReviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="review-container" ref={containerRef}>
      <div className="review-header">
        <div className="header-content">
          <svg className="chart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor"/>
            <rect x="10" y="8" width="4" height="13" rx="1" fill="currentColor"/>
            <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor"/>
          </svg>
          <div className="title-wrapper">
            <h2 className="review-title">Review</h2>
            <p className="review-subtitle">
              Evaluation of {laptopA.name} and {laptopB.name} important characteristics
            </p>
          </div>
        </div>
      </div>

      <div className="review-grid">
        {categories.map((category, index) => (
          <div 
            key={category.key} 
            className="category-card"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            <h3 className="category-title">{category.title}</h3>
            <p className="category-description">{category.description}</p>

            <div className="laptop-comparison">
              {/* Laptop A */}
              <div className="laptop-row">
                <span className="laptop-name">{laptopA.name}</span>
                <div className="progress-container">
                  <div className="progress-track">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: isVisible ? `${laptopA.scores[category.key as keyof typeof laptopA.scores]}%` : '0%'
                      }}
                    />
                  </div>
                </div>
                <div className="score-badge">
                  <span className="score-value">
                    {laptopA.scores[category.key as keyof typeof laptopA.scores]}
                  </span>
                </div>
              </div>

              {/* Laptop B */}
              <div className="laptop-row">
                <span className="laptop-name">{laptopB.name}</span>
                <div className="progress-container">
                  <div className="progress-track">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: isVisible ? `${laptopB.scores[category.key as keyof typeof laptopB.scores]}%` : '0%'
                      }}
                    />
                  </div>
                </div>
                <div className="score-badge">
                  <span className="score-value">
                    {laptopB.scores[category.key as keyof typeof laptopB.scores]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
