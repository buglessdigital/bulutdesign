import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/site/icons";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/site/logo";
import { site } from "@/lib/site";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo className="text-xl" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              <InstagramIcon className="size-4 text-primary" />@
              {site.instagramHandle}
            </a>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-foreground/75 transition-colors hover:text-primary">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-foreground/75 transition-colors hover:text-primary">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-foreground/75 transition-colors hover:text-primary">
                  {t("nav.projects")}
                </Link>
              </li>
              <li>
                <Link href="/references" className="text-foreground/75 transition-colors hover:text-primary">
                  {t("nav.references")}
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="text-foreground/75 transition-colors hover:text-primary">
                  {t("nav.appointment")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              {t("footer.contactTitle")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-foreground/75">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {site.address}
              </li>
              <li>
                <a href={`tel:${site.phoneIntl}`} className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Phone className="size-4 shrink-0 text-primary" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Mail className="size-4 shrink-0 text-primary" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.name}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
