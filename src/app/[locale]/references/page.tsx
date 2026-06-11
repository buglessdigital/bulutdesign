import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Quote } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getTestimonials } from "@/lib/data";
import { localized } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("referencesTitle"),
    description: t("referencesDescription"),
  };
}

export default async function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, testimonials] = await Promise.all([
    getTranslations("references"),
    getTestimonials(),
  ]);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {testimonials.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("empty")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 0.08}>
                  <figure className="flex h-full flex-col border border-border bg-card p-8 transition-colors hover:border-primary/40">
                    <Quote className="size-7 text-primary/50" />
                    <blockquote className="mt-4 flex-1 leading-relaxed text-foreground/85">
                      “{localized(item, "quote", locale)}”
                    </blockquote>
                    <figcaption className="mt-6 border-t border-border pt-4">
                      <p className="font-display text-primary">
                        {item.client_name}
                      </p>
                      {item.company ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.company}
                        </p>
                      ) : null}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
