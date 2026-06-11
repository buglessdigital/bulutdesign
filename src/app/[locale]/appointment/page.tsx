import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CalendarCheck, PhoneCall, MessagesSquare } from "lucide-react";
import { AppointmentForm } from "@/components/site/appointment-form";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getServices } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("appointmentTitle"),
    description: t("appointmentDescription"),
  };
}

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, services] = await Promise.all([
    getTranslations("appointment"),
    getServices(),
  ]);

  const steps = [
    { icon: CalendarCheck, text: t("info1") },
    { icon: PhoneCall, text: t("info2") },
    { icon: MessagesSquare, text: t("info3") },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl">{t("infoTitle")}</h2>
            <ol className="mt-8 space-y-7">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center border border-primary/40 text-primary">
                    <step.icon className="size-5" />
                  </div>
                  <p className="pt-2 text-sm leading-relaxed text-foreground/80">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-border bg-card p-6 sm:p-10">
              <AppointmentForm services={services} locale={locale} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
