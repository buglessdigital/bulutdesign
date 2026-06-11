import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display tracking-[0.18em] uppercase", className)}>
      Bulut<span className="text-primary"> Design</span>
    </span>
  );
}
