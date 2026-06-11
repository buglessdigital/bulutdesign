import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/site/page-header";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectFilters } from "@/components/site/project-filters";
import { Reveal } from "@/components/site/reveal";
import { getCategories, getProjects, PROJECTS_PER_PAGE } from "@/lib/data";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("projectsTitle"), description: t("projectsDescription") };
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategori?: string; q?: string; sayfa?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { kategori, q, sayfa } = await searchParams;
  const page = Math.max(1, Number(sayfa) || 1);

  const [t, categories, { projects, count }] = await Promise.all([
    getTranslations("projects"),
    getCategories(),
    getProjects({ category: kategori, q, page }),
  ]);

  const totalPages = Math.max(1, Math.ceil(count / PROJECTS_PER_PAGE));

  const pageHref = (target: number) => {
    const sp = new URLSearchParams();
    if (kategori) sp.set("kategori", kategori);
    if (q) sp.set("q", q);
    if (target > 1) sp.set("sayfa", String(target));
    const qs = sp.toString();
    return { pathname: "/projects" as const, query: Object.fromEntries(sp) };
  };

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectFilters
            categories={categories}
            locale={locale}
            activeCategory={kategori}
            query={q}
          />

          <p className="mt-6 text-sm text-muted-foreground">
            {t("resultCount", { count })}
          </p>

          {projects.length === 0 ? (
            <p className="mt-16 text-center text-muted-foreground">
              {t("empty")}
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={(i % 3) * 0.07}>
                  <ProjectCard project={project} locale={locale} />
                </Reveal>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="mt-14 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (n) => (
                  <Link
                    key={n}
                    href={pageHref(n)}
                    className={cn(
                      "flex size-10 items-center justify-center border text-sm transition-colors",
                      n === page
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground/70 hover:border-primary/60 hover:text-primary"
                    )}
                  >
                    {n}
                  </Link>
                )
              )}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
