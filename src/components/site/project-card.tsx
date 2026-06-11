import Image from "next/image";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/types";
import { localized } from "@/lib/types";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: string;
}) {
  const title = localized(project, "title", locale);
  const category = project.categories
    ? localized(project.categories, "name", locale)
    : null;

  return (
    <Link
      href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }}
      className="group block overflow-hidden bg-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
        {category ? (
          <span className="absolute left-4 top-4 border border-primary/50 bg-background/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
            {category}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-lg leading-snug text-white sm:text-xl">
            {title}
          </h3>
          {project.location ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
              <MapPin className="size-3.5 text-primary" />
              {project.location}
              {project.year ? ` · ${project.year}` : ""}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
