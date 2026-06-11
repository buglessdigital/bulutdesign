import NextLink from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, categories(name_tr)")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">Projeler</h1>
        <Button render={<NextLink href="/admin/projeler/yeni" />}>
          <Plus className="size-4" /> Yeni Proje
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Proje</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Konum</th>
              <th className="p-4">Durum</th>
              <th className="p-4">Öne Çıkan</th>
              <th className="p-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(projects ?? []).map((project) => (
              <tr key={project.id} className="hover:bg-secondary/40">
                <td className="p-4">
                  <NextLink
                    href={`/admin/projeler/${project.id}`}
                    className="flex items-center gap-3 hover:text-primary"
                  >
                    <span className="relative block size-12 shrink-0 overflow-hidden bg-secondary">
                      {project.cover_image_url ? (
                        <Image
                          src={project.cover_image_url}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="font-medium">{project.title_tr}</span>
                  </NextLink>
                </td>
                <td className="p-4 text-muted-foreground">
                  {project.categories?.name_tr ?? "—"}
                </td>
                <td className="p-4 text-muted-foreground">
                  {project.location || "—"}
                </td>
                <td className="p-4">
                  {project.is_published ? (
                    <span className="bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400">
                      Yayında
                    </span>
                  ) : (
                    <span className="bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      Taslak
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {project.is_featured ? (
                    <span className="text-primary">★</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <NextLink href={`/admin/projeler/${project.id}`} />
                      }
                    >
                      Düzenle
                    </Button>
                    <DeleteProjectButton id={project.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(projects ?? []).length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  Henüz proje eklenmedi.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
