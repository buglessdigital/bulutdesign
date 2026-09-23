import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontClasses } from "@/lib/fonts";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const ogImage = {
    url: locale === "tr" ? "/og/tr.jpg" : "/og/en.jpg",
    width: 1200,
    height: 630,
    alt: t("homeTitle"),
  };

  return {
    metadataBase: new URL(site.domain),
    title: {
      default: t("homeTitle"),
      template: `%s | ${site.name}`,
    },
    description: t("homeDescription"),
    applicationName: site.name,
    verification: {
      google: [
        "lH7KFCddpUq1gOJtS2fLDX1KumM_RCb5g_hYuoB4oVY",
        "FdrahSU6-TDJls360vIoWGtm0MJlY4vm5hRyxaO1WHc",
      ],
    },
    openGraph: {
      siteName: site.name,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description:
    "Mersin merkezli iç mimarlık ve mimari tasarım stüdyosu. Konut, ticari, kentsel tasarım ve iç mimari projeler.",
  url: site.domain,
  logo: `${site.domain}/bulut-design-logo.png`,
  image: `${site.domain}/og/tr.jpg`,
  telephone: site.phoneIntl,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Eğriçam Mah. 2279 Sk. Hendek Apt. Akabe İş Hanı",
    addressLocality: "Yenişehir",
    addressRegion: "Mersin",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.7833,
    longitude: 34.5567,
  },
  areaServed: [
    "Mersin",
    "Yenişehir",
    "Tarsus",
    "Erdemli",
    "Silifke",
    "Tece",
    "Ayvagediği",
  ],
  sameAs: [site.instagram],
  founder: { "@type": "Person", name: site.owner },
  priceRange: "$$",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className="dark">
      <body className={`${fontClasses} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
