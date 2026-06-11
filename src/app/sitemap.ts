import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

const staticPages = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/references",
  "/contact",
  "/appointment",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of routing.locales) {
      entries.push({
        url: site.domain + getPathname({ locale, href: page }),
        changeFrequency: "weekly",
        priority: page === "/" ? 1 : 0.8,
      });
    }
  }

  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, created_at")
    .eq("is_published", true);

  for (const project of projects ?? []) {
    for (const locale of routing.locales) {
      entries.push({
        url:
          site.domain +
          getPathname({
            locale,
            href: {
              pathname: "/projects/[slug]",
              params: { slug: project.slug },
            },
          }),
        lastModified: project.created_at,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
