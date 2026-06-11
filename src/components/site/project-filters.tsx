"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import type { Category } from "@/lib/types";
import { localized } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectFilters({
  categories,
  locale,
  activeCategory,
  query,
}: {
  categories: Category[];
  locale: string;
  activeCategory?: string;
  query?: string;
}) {
  const t = useTranslations("projects");
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(query ?? "");
  const [, startTransition] = useTransition();

  const navigate = (category?: string, q?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("kategori", category);
    if (q) params.set("q", q);
    const qs = params.toString();
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ""}` as never, {
        scroll: false,
      });
    });
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if ((query ?? "") !== search) navigate(activeCategory, search);
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate(undefined, search)}
          className={cn(
            "border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
            !activeCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground/70 hover:border-primary/60 hover:text-primary"
          )}
        >
          {t("all")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(category.slug, search)}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
              activeCategory === category.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground/70 hover:border-primary/60 hover:text-primary"
            )}
          >
            {localized(category, "name", locale)}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="pl-9"
        />
      </div>
    </div>
  );
}
