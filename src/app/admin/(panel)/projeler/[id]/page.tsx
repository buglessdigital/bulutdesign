import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: categories }, { data: media }] =
    await Promise.all([
      supabase.from("projects").select("*").eq("id", id).single(),
      supabase.from("categories").select("*").order("sort_order"),
      supabase
        .from("project_media")
        .select("*")
        .eq("project_id", id)
        .order("sort_order"),
    ]);

  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">Projeyi Düzenle</h1>
      <div className="mt-6">
        <ProjectForm
          categories={categories ?? []}
          project={project}
          media={media ?? []}
        />
      </div>
    </div>
  );
}
