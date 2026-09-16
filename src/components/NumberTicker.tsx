import React, { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(direction === 'down' ? value : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => {
            const duration = 1600; // ms
            const startTime = performance.now();
            const startVal = direction === 'down' ? value : 0;
            const endVal = direction === 'down' ? 0 : value;

            const step = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const easeProgress = 1 - (1 - progress) * (1 - progress);
              const current = Math.round(startVal + (endVal - startVal) * easeProgress);

              setDisplayValue(current);

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setDisplayValue(endVal);
              }
            };

            requestAnimationFrame(step);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value, direction, delay]);

  return (
    <span ref={ref} className={`font-mono inline-block tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export default NumberTicker;
