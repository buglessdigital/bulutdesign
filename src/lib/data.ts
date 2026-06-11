import { createClient } from "@/lib/supabase/server";
import type { Category, Project, Service, Testimonial } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return data ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return data ?? [];
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, categories(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(limit);
  return data ?? [];
}

export const PROJECTS_PER_PAGE = 12;

export async function getProjects(params: {
  category?: string;
  q?: string;
  page?: number;
}): Promise<{ projects: Project[]; count: number }> {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * PROJECTS_PER_PAGE;

  let query = supabase
    .from("projects")
    .select("*, categories!inner(*)", { count: "exact" })
    .eq("is_published", true);

  if (params.category) {
    query = query.eq("categories.slug", params.category);
  }
  if (params.q) {
    const q = params.q.replaceAll("%", "").replaceAll(",", " ");
    query = query.or(
      `title_tr.ilike.%${q}%,title_en.ilike.%${q}%,location.ilike.%${q}%`
    );
  }

  const { data, count } = await query
    .order("sort_order")
    .order("created_at", { ascending: false })
    .range(from, from + PROJECTS_PER_PAGE - 1);

  return { projects: data ?? [], count: count ?? 0 };
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, categories(*), project_media(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getAdjacentProjects(project: Project): Promise<{
  prev: Project | null;
  next: Project | null;
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, slug, title_tr, title_en, cover_image_url")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  const list = (data ?? []) as Project[];
  const idx = list.findIndex((p) => p.id === project.id);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}

export async function getProjectCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);
  return count ?? 0;
}
