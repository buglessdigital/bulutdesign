import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl">Yeni Proje</h1>
      <div className="mt-6">
        <ProjectForm categories={categories ?? []} />
      </div>
    </div>
  );
}
