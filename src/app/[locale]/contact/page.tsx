import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/site/icons";
import { ContactForm } from "@/components/site/contact-form";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contactTitle"), description: t("contactDescription") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const infoItems = [
    { icon: MapPin, label: t("address"), value: site.address, href: null },
    {
      icon: Phone,
      label: t("phone"),
      value: site.phone,
      href: `tel:${site.phoneIntl}`,
    },
    {
      icon: Mail,
      label: t("email"),
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: InstagramIcon,
      label: t("instagram"),
      value: `@${site.instagramHandle}`,
      href: site.instagram,
    },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl">{t("infoTitle")}</h2>
            <ul className="mt-8 space-y-6">
              {infoItems.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center border border-primary/40 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="mt-1 block text-sm transition-colors hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <Button
              render={
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              variant="outline"
              className="mt-8"
            >
              {t("whatsappCta")}
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl">{t("formTitle")}</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Harita */}
      <section className="border-t border-border">
        <iframe
          src={site.mapsEmbed}
          title="Bulut Design - Google Maps"
          className="h-[420px] w-full border-0 grayscale invert-[0.9] contrast-[0.9]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
