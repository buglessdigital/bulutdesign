import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/about": { tr: "/hakkimizda", en: "/about" },
    "/services": { tr: "/hizmetler", en: "/services" },
    "/projects": { tr: "/projeler", en: "/projects" },
    "/projects/[slug]": { tr: "/projeler/[slug]", en: "/projects/[slug]" },
    "/references": { tr: "/referanslar", en: "/references" },
    "/contact": { tr: "/iletisim", en: "/contact" },
    "/appointment": { tr: "/randevu", en: "/appointment" },
  },
});

export type Locale = (typeof routing.locales)[number];
