import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Ruler,
  Tag,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProjectGallery } from "@/components/site/project-gallery";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { getAdjacentProjects, getProjectBySlug } from "@/lib/data";
import { localized } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: localized(project, "title", locale),
    description: localized(project, "description", locale).slice(0, 160),
    openGraph: project.cover_image_url
      ? { images: [{ url: project.cover_image_url }] }
      : undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [t, { prev, next }] = await Promise.all([
    getTranslations("projects"),
    getAdjacentProjects(project),
  ]);

  const title = localized(project, "title", locale);
  const description = localized(project, "description", locale);
  const category = project.categories
    ? localized(project.categories, "name", locale)
    : null;

  const facts = [
    project.location
      ? { icon: MapPin, label: t("location"), value: project.location }
      : null,
    project.year
      ? { icon: Calendar, label: t("year"), value: String(project.year) }
      : null,
    project.area_m2
      ? { icon: Ruler, label: t("area"), value: `${project.area_m2} m²` }
      : null,
    category ? { icon: Tag, label: t("category"), value: category } : null,
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <>
      {/* Kapak */}
      <section className="relative flex min-h-[60svh] items-end overflow-hidden pt-28">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:text-gold-soft"
          >
            <ArrowLeft className="size-4" />
            {t("backToProjects")}
          </Link>
          <h1 className="font-display mt-4 max-w-3xl text-3xl font-medium text-balance sm:text-5xl">
            {title}
          </h1>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <Reveal>
              <p className="whitespace-pre-line leading-relaxed text-foreground/85">
                {description}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="divide-y divide-border border border-border">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-center gap-4 p-5">
                    <fact.icon className="size-5 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm">{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {project.project_media && project.project_media.length > 0 ? (
            <div className="mt-16">
              <ProjectGallery media={project.project_media} title={title} />
            </div>
          ) : null}

          {/* Önceki / Sonraki */}
          <nav className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2">
            {prev ? (
              <Link
                href={{ pathname: "/projects/[slug]", params: { slug: prev.slug } }}
                className="group flex items-center gap-4 bg-background p-6 transition-colors hover:bg-card"
              >
                <ArrowLeft className="size-5 text-primary transition-transform group-hover:-translate-x-1" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {t("prevProject")}
                  </p>
                  <p className="font-display mt-1">
                    {localized(prev, "title", locale)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="bg-background p-6" />
            )}
            {next ? (
              <Link
                href={{ pathname: "/projects/[slug]", params: { slug: next.slug } }}
                className="group flex items-center justify-end gap-4 bg-background p-6 text-right transition-colors hover:bg-card"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {t("nextProject")}
                  </p>
                  <p className="font-display mt-1">
                    {localized(next, "title", locale)}
                  </p>
                </div>
                <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div className="bg-background p-6" />
            )}
          </nav>

          <div className="mt-16 border border-primary/30 bg-card/60 p-10 text-center">
            <h2 className="font-display text-2xl">{t("similarCta")}</h2>
            <Button render={<Link href="/contact" />} size="lg" className="mt-6">
              {t("similarCtaButton")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
