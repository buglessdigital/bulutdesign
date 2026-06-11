import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/data";
import { localized } from "@/lib/types";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("servicesTitle"), description: t("servicesDescription") };
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, services] = await Promise.all([
    getTranslations("services"),
    getServices(),
  ]);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
          {services.map((service, i) => (
            <Reveal key={service.id}>
              <div
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2",
                  i % 2 === 1 && "lg:[&>*:first-child]:order-2"
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.image_url || fallbackImages[i % fallbackImages.length]}
                    alt={localized(service, "name", locale)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div>
                  <span className="font-display text-5xl text-primary/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display mt-3 text-2xl sm:text-3xl">
                    {localized(service, "name", locale)}
                  </h2>
                  <p className="mt-5 leading-relaxed text-foreground/80">
                    {localized(service, "description", locale)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/40 py-20 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-medium">{t("ctaTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("ctaText")}</p>
            <Button render={<Link href="/contact" />} size="lg" className="mt-8">
              {t("ctaButton")}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
