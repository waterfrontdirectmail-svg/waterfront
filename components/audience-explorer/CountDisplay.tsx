'use client';

import { useEffect, useRef, useState } from 'react';

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function CountDisplay({ count, loading }: { count: number; loading?: boolean }) {
  const [displayed, setDisplayed] = useState(count);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const start = displayed;
    const end = count;
    if (start === end) return;

    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="text-center py-6">
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
        Your Selection
      </div>
      <div className="flex items-baseline justify-center gap-2">
        <span
          className="text-4xl md:text-5xl font-bold tabular-nums"
          style={{ color: '#1B2A4A' }}
        >
          {loading ? '—' : formatNumber(displayed)}
        </span>
        <span className="text-lg text-slate-600">waterfront homeowners</span>
      </div>
    </div>
  );
}
