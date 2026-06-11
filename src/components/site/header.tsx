"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/references", key: "references" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = (next: "tr" | "en") => {
    if (next !== locale) {
      router.replace(
        // @ts-expect-error -- mevcut route'un pathname'i ve params'ı her zaman eşleşir
        { pathname, params },
        { locale: next }
      );
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border py-3"
          : "bg-gradient-to-b from-background/80 to-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl sm:text-2xl text-foreground">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "text-sm tracking-wide transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-foreground/80"
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs tracking-widest">
            <button
              onClick={() => switchLocale("tr")}
              className={cn(
                "px-1.5 py-1 transition-colors",
                locale === "tr"
                  ? "text-primary"
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              TR
            </button>
            <span className="text-foreground/30">/</span>
            <button
              onClick={() => switchLocale("en")}
              className={cn(
                "px-1.5 py-1 transition-colors",
                locale === "en"
                  ? "text-primary"
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              EN
            </button>
          </div>

          <Button
            render={<Link href="/appointment" />}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {t("appointment")}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72 border-border bg-background">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-10 flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-3 text-base transition-colors hover:bg-secondary",
                      pathname === item.href
                        ? "text-primary"
                        : "text-foreground/85"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <Button
                  render={
                    <Link href="/appointment" onClick={() => setOpen(false)} />
                  }
                  className="mt-4"
                >
                  {t("appointment")}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
