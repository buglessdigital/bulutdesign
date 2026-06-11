import { Reveal } from "@/components/site/reveal";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border bg-card/50 pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <span className="gold-line mr-4" aria-hidden="true" />
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Bulut Design
          </span>
          <h1 className="font-display mt-4 text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
