import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Compass, PenTool, FileCheck, Key } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("aboutTitle"), description: t("aboutDescription") };
}

const processIcons = [Compass, PenTool, FileCheck, Key];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const steps = [1, 2, 3, 4].map((n, i) => ({
    icon: processIcons[i],
    title: t(`process${n}Title`),
    text: t(`process${n}Text`),
  }));

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {/* Hikaye */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">
              Bulut Design
            </span>
            <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
              {t("storyTitle")}
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed text-foreground/80">
              <p>{t("story1")}</p>
              <p>{t("story2")}</p>
              <p>{t("story3")}</p>
            </div>
            <div className="mt-8 border-l-2 border-primary pl-5">
              <p className="font-display text-lg">{site.owner}</p>
              <p className="text-sm text-muted-foreground">{t("ownerRole")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop"
              alt={t("storyTitle")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Vizyon & Misyon */}
      <section
        id="vizyon-misyon"
        className="scroll-mt-24 border-y border-border bg-card/40 py-20 sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-px bg-border px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal className="bg-card/0">
            <div className="h-full bg-background p-10 sm:p-14">
              <span className="font-display text-5xl text-primary/30">“</span>
              <h2 className="font-display text-2xl sm:text-3xl">
                {t("visionTitle")}
              </h2>
              <p className="mt-5 leading-relaxed text-foreground/80">
                {t("visionText")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full bg-background p-10 sm:p-14">
              <span className="font-display text-5xl text-primary/30">”</span>
              <h2 className="font-display text-2xl sm:text-3xl">
                {t("missionTitle")}
              </h2>
              <p className="mt-5 leading-relaxed text-foreground/80">
                {t("missionText")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Süreç */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-medium sm:text-4xl">
              {t("processTitle")}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} className="relative">
                <div className="flex size-14 items-center justify-center border border-primary/40 text-primary">
                  <step.icon className="size-6" />
                </div>
                <span className="font-display absolute right-0 top-0 text-4xl text-primary/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-5 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
