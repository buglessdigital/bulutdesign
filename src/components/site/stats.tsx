"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

function CountUp({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function Stats({
  items,
}: {
  items: { value: number; suffix?: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-background px-6 py-10 text-center">
          <div className="font-display text-4xl text-primary sm:text-5xl">
            <CountUp target={item.value} suffix={item.suffix} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
