import React, { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  /** Une année n'est pas une quantité : `toLocaleString()` affichait « 2 027 ». */
  brut?: boolean;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  brut = false,
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

          // La règle CSS `prefers-reduced-motion` du projet neutralise les
          // transitions et les animations, mais pas un compteur piloté par
          // requestAnimationFrame : il faut l'interroger ici aussi. Sans ça,
          // cinq nombres défilent pendant 1,6 s chez quelqu'un qui a
          // précisément demandé que rien ne bouge.
          const mouvementReduit =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          if (mouvementReduit) {
            setDisplayValue(direction === 'down' ? 0 : value);
            return;
          }

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
      {brut ? displayValue : displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export default NumberTicker;
