import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/site/hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { Stats } from "@/components/site/stats";
import { TestimonialSlider } from "@/components/site/testimonial-slider";
import { Button } from "@/components/ui/button";
import {
  getFeaturedProjects,
  getProjectCount,
  getServices,
  getTestimonials,
} from "@/lib/data";
import { localized } from "@/lib/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, featured, services, testimonials, projectCount] =
    await Promise.all([
      getTranslations(),
      getFeaturedProjects(6),
      getServices(),
      getTestimonials(),
      getProjectCount(),
    ]);

  return (
    <>
      <Hero />

      {/* Öne çıkan projeler */}
      {featured.length > 0 ? (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-primary">
                  Portfolio
                </span>
                <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
                  {t("home.featuredTitle")}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {t("home.featuredSubtitle")}
                </p>
              </div>
              <Button
                render={<Link href="/projects" />}
                variant="outline"
                className="group"
              >
                {t("home.allProjects")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.08}>
                  <ProjectCard project={project} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Hizmetler */}
      <section className="border-y border-border bg-card/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">
              Services
            </span>
            <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
              {t("home.servicesTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {t("home.servicesSubtitle")}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.06}>
                <Link
                  href="/services"
                  className="group flex h-full flex-col bg-background p-8 transition-colors hover:bg-card"
                >
                  <span className="font-display text-3xl text-primary/40 transition-colors group-hover:text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-4 text-xl">
                    {localized(service, "name", locale)}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {localized(service, "description", locale)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Stats
              items={[
                {
                  value: Math.max(projectCount, 60),
                  suffix: "+",
                  label: t("home.statsProjects"),
                },
                { value: 10, suffix: "+", label: t("home.statsYears") },
                { value: 120, suffix: "+", label: t("home.statsClients") },
                { value: 7, label: t("home.statsCities") },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* Referanslar */}
      {testimonials.length > 0 ? (
        <section className="border-y border-border bg-card/40 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center">
              <h2 className="font-display text-3xl font-medium sm:text-4xl">
                {t("home.testimonialsTitle")}
              </h2>
            </Reveal>
            <Reveal className="mt-12">
              <TestimonialSlider testimonials={testimonials} locale={locale} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Image
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance sm:text-5xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              {t("home.ctaText")}
            </p>
            <Button render={<Link href="/appointment" />} size="lg" className="mt-9">
              {t("home.ctaButton")}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
