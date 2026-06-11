"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { localized } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TestimonialSlider({
  testimonials,
  locale,
}: {
  testimonials: Testimonial[];
  locale: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[index];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <Quote className="mx-auto size-10 text-primary/60" />
      <div className="relative mt-6 min-h-36">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
              “{localized(current, "quote", locale)}”
            </p>
            <footer className="mt-6 text-sm">
              <span className="text-primary">{current.client_name}</span>
              {current.company ? (
                <span className="text-muted-foreground"> — {current.company}</span>
              ) : null}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      {testimonials.length > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-8 bg-primary" : "w-3 bg-border hover:bg-primary/40"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
