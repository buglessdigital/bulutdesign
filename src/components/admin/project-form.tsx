"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { uploadMedia } from "@/lib/upload";
import type {
  Category,
  MediaType,
  Project,
  ProjectMedia,
} from "@/lib/types";

const mediaTypeLabels: Record<MediaType, string> = {
  photo: "Fotoğraf",
  render: "3D Render",
  plan: "Çizim / Plan",
  video: "Video",
};

export function ProjectForm({
  categories,
  project,
  media,
}: {
  categories: Category[];
  project?: Project;
  media?: ProjectMedia[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title_tr: project?.title_tr ?? "",
    title_en: project?.title_en ?? "",
    slug: project?.slug ?? "",
    description_tr: project?.description_tr ?? "",
    description_en: project?.description_en ?? "",
    category_id: project?.category_id ?? "",
    location: project?.location ?? "",
    year: project?.year ? String(project.year) : "",
    area_m2: project?.area_m2 ? String(project.area_m2) : "",
    cover_image_url: project?.cover_image_url ?? "",
    is_featured: project?.is_featured ?? false,
    is_published: project?.is_published ?? true,
    sort_order: project?.sort_order ?? 0,
  });
  const [mediaList, setMediaList] = useState<ProjectMedia[]>(media ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<MediaType>("photo");
  const [videoUrl, setVideoUrl] = useState("");

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onTitleChange = (value: string) => {
    setForm((f) => ({
      ...f,
      title_tr: value,
      slug: project ? f.slug : slugify(value),
    }));
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadMedia(file, "covers");
      set("cover_image_url", url);
      toast.success("Kapak görseli yüklendi");
    } catch {
      toast.error("Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title_tr || !form.slug) {
      toast.error("Başlık (TR) ve slug zorunludur");
      return;
    }
    setSaving(true);

    const payload = {
      title_tr: form.title_tr,
      title_en: form.title_en || form.title_tr,
      slug: form.slug,
      description_tr: form.description_tr,
      description_en: form.description_en || form.description_tr,
      category_id: form.category_id || null,
      location: form.location,
      year: form.year ? Number(form.year) : null,
      area_m2: form.area_m2 ? Number(form.area_m2) : null,
      cover_image_url: form.cover_image_url,
      is_featured: form.is_featured,
      is_published: form.is_published,
      sort_order: Number(form.sort_order) || 0,
    };

    if (project) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id);
      setSaving(false);
      if (error) {
        toast.error("Kaydedilemedi: " + error.message);
        return;
      }
      toast.success("Proje güncellendi");
      router.refresh();
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert(payload)
        .select("id")
        .single();
      setSaving(false);
      if (error || !data) {
        toast.error("Kaydedilemedi: " + (error?.message ?? ""));
        return;
      }
      toast.success("Proje oluşturuldu");
      router.push(`/admin/projeler/${data.id}`);
    }
  };

  const addMediaFiles = async (files: FileList) => {
    if (!project) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadMedia(file, `projects/${project.id}`);
        const { data, error } = await supabase
          .from("project_media")
          .insert({
            project_id: project.id,
            type: uploadType,
            url,
            sort_order: mediaList.length,
          })
          .select("*")
          .single();
        if (error) throw error;
        setMediaList((list) => [...list, data]);
      }
      toast.success("Medya yüklendi");
    } catch {
      toast.error("Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  const addVideoUrl = async () => {
    if (!project || !videoUrl) return;
    const { data, error } = await supabase
      .from("project_media")
      .insert({
        project_id: project.id,
        type: "video",
        url: videoUrl,
        sort_order: mediaList.length,
      })
      .select("*")
      .single();
    if (error) {
      toast.error("Eklenemedi");
      return;
    }
    setMediaList((list) => [...list, data]);
    setVideoUrl("");
    toast.success("Video eklendi");
  };

  const removeMedia = async (item: ProjectMedia) => {
    const { error } = await supabase
      .from("project_media")
      .delete()
      .eq("id", item.id);
    if (error) {
      toast.error("Silinemedi");
      return;
    }
    setMediaList((list) => list.filter((m) => m.id !== item.id));
  };

  return (
    <div className="space-y-8">
      <section className="border border-border bg-card p-6">
        <h2 className="font-display text-lg">Proje Bilgileri</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Başlık (TR) *</Label>
            <Input
              value={form.title_tr}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Başlık (EN)</Label>
            <Input
              value={form.title_en}
              onChange={(e) => set("title_en", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug (URL) *</Label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={form.category_id}
              onValueChange={(value) => set("category_id", value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name_tr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Konum</Label>
            <Input
              value={form.location}
              placeholder="örn. Yenişehir, Mersin"
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Yıl</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Alan (m²)</Label>
              <Input
                type="number"
                value={form.area_m2}
                onChange={(e) => set("area_m2", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Açıklama (TR)</Label>
            <Textarea
              rows={5}
              value={form.description_tr}
              onChange={(e) => set("description_tr", e.target.value)}
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Açıklama (EN)</Label>
            <Textarea
              rows={5}
              value={form.description_en}
              onChange={(e) => set("description_en", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-3 text-sm">
            <Switch
              checked={form.is_published}
              onCheckedChange={(value) => set("is_published", value)}
            />
            Yayında
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Switch
              checked={form.is_featured}
              onCheckedChange={(value) => set("is_featured", value)}
            />
            Ana sayfada öne çıkar
          </label>
          <div className="flex items-center gap-2 text-sm">
            Sıra:
            <Input
              type="number"
              className="w-20"
              value={form.sort_order}
              onChange={(e) => set("sort_order", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="border border-border bg-card p-6">
        <h2 className="font-display text-lg">Kapak Görseli</h2>
        <div className="mt-5 flex flex-wrap items-start gap-6">
          {form.cover_image_url ? (
            <div className="relative aspect-[4/3] w-64 overflow-hidden border border-border">
              <Image
                src={form.cover_image_url}
                alt="Kapak"
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-64 items-center justify-center border border-dashed border-border text-sm text-muted-foreground">
              Kapak görseli yok
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:border-primary">
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Görsel Yükle
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadCover(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </section>

      {project ? (
        <section className="border border-border bg-card p-6">
          <h2 className="font-display text-lg">Galeri Medyaları</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fotoğraf, 3D render, çizim/plan görselleri veya video yükleyin.
            Video için YouTube/Vimeo linki de ekleyebilirsiniz.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Select
              value={uploadType}
              onValueChange={(value) =>
                setUploadType((value as MediaType) ?? "photo")
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(mediaTypeLabels) as MediaType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {mediaTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:border-primary">
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Dosya Yükle
              <input
                type="file"
                multiple
                accept={uploadType === "video" ? "video/*" : "image/*"}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) addMediaFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="mt-4 flex max-w-md gap-2">
            <Input
              value={videoUrl}
              placeholder="YouTube / Vimeo video linki"
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button variant="outline" onClick={addVideoUrl}>
              <Plus className="size-4" /> Ekle
            </Button>
          </div>

          {mediaList.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] overflow-hidden border border-border bg-secondary"
                >
                  {item.type === "video" ? (
                    <div className="flex h-full items-center justify-center p-3 text-center text-xs text-muted-foreground break-all">
                      🎬 {item.url.slice(0, 60)}
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  )}
                  <span className="absolute left-1.5 top-1.5 bg-background/80 px-1.5 py-0.5 text-[10px] text-primary">
                    {mediaTypeLabels[item.type]}
                  </span>
                  <button
                    onClick={() => removeMedia(item)}
                    className="absolute right-1.5 top-1.5 rounded bg-destructive/90 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Sil"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">
          Galeri medyalarını eklemek için önce projeyi kaydedin.
        </p>
      )}

      <div className="flex gap-3">
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {project ? "Değişiklikleri Kaydet" : "Projeyi Oluştur"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/projeler")}
        >
          Listeye Dön
        </Button>
      </div>
    </div>
  );
}
