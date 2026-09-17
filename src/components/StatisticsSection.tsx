import React, { useEffect, useRef, useState } from 'react';
import type { StatisticItem } from '../types.ts';

interface StatisticsSectionProps {
  items: StatisticItem[] | { items?: StatisticItem[] };
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ items }) => {
  const statsList: StatisticItem[] = Array.isArray(items)
    ? items
    : (items?.items || []);

  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<{ [id: string]: number }>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsList.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate counters
          const duration = 1800; // ms
          const startTime = performance.now();

          const animateNumbers = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const newCounts: { [id: string]: number } = {};
            statsList.forEach((item) => {
              newCounts[item.id] = Math.floor(easeOut * item.numericValue);
            });
            setCounts(newCounts);

            if (progress < 1) {
              requestAnimationFrame(animateNumbers);
            } else {
              // Final exact values
              const finalCounts: { [id: string]: number } = {};
              statsList.forEach((item) => {
                finalCounts[item.id] = item.numericValue;
              });
              setCounts(finalCounts);
            }
          };

          requestAnimationFrame(animateNumbers);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, statsList]);

  if (!statsList || statsList.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[#241812] text-[#F7F3ED] border-y border-[#C5A46D]/20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-[#C5A46D]/15">
          {statsList.map((stat, index) => {
            const currentCount = counts[stat.id] ?? 0;
            const formatted =
              stat.numericValue >= 1000
                ? currentCount.toLocaleString() + stat.suffix
                : currentCount + stat.suffix;

            return (
              <div
                key={stat.id}
                className={`flex flex-col items-center text-center px-4 ${
                  index > 0 ? 'pt-6 md:pt-0' : ''
                }`}
              >
                <div className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#C5A46D] mb-2">
                  {hasAnimated ? formatted : stat.value}
                </div>
                <div className="text-sm sm:text-base font-medium tracking-wide text-[#F7F3ED]">
                  {stat.label}
                </div>
                {stat.description && (
                  <p className="text-xs text-[#E8D8C2]/60 mt-1 font-light max-w-[200px]">
                    {stat.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
