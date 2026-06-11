"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { uploadMedia } from "@/lib/upload";
import type { Service } from "@/lib/types";

const emptyForm = {
  name_tr: "",
  name_en: "",
  description_tr: "",
  description_en: "",
  image_url: "",
  sort_order: 0,
  is_published: true,
};

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: services.length + 1 });
    setOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      name_tr: service.name_tr,
      name_en: service.name_en,
      description_tr: service.description_tr,
      description_en: service.description_en,
      image_url: service.image_url,
      sort_order: service.sort_order,
      is_published: service.is_published,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name_tr) {
      toast.error("Hizmet adı (TR) zorunlu");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      name_en: form.name_en || form.name_tr,
      description_en: form.description_en || form.description_tr,
      sort_order: Number(form.sort_order) || 0,
      slug: editing?.slug ?? slugify(form.name_tr),
    };
    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
      return;
    }
    toast.success(editing ? "Hizmet güncellendi" : "Hizmet eklendi");
    setOpen(false);
    load();
  };

  const remove = async (service: Service) => {
    if (!confirm(`"${service.name_tr}" hizmetini silmek istiyor musunuz?`)) return;
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id);
    if (error) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Hizmet silindi");
    load();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadMedia(file, "services");
      setForm((f) => ({ ...f, image_url: url }));
    } catch {
      toast.error("Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">Hizmetler</h1>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Yeni Hizmet
        </Button>
      </div>

      {loading ? (
        <Loader2 className="mt-10 size-6 animate-spin text-muted-foreground" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg">{service.name_tr}</h2>
                {!service.is_published ? (
                  <span className="bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    Gizli
                  </span>
                ) : null}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {service.description_tr}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                  <Pencil className="size-3.5" /> Düzenle
                </Button>
                <Button variant="destructive" size="sm" onClick={() => remove(service)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto">
          <DialogTitle className="font-display">
            {editing ? "Hizmeti Düzenle" : "Yeni Hizmet"}
          </DialogTitle>
          <div className="mt-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ad (TR) *</Label>
                <Input
                  value={form.name_tr}
                  onChange={(e) => setForm((f) => ({ ...f, name_tr: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Ad (EN)</Label>
                <Input
                  value={form.name_en}
                  onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Açıklama (TR)</Label>
              <Textarea
                rows={3}
                value={form.description_tr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description_tr: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Açıklama (EN)</Label>
              <Textarea
                rows={3}
                value={form.description_en}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description_en: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-6">
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
                    if (file) uploadImage(file);
                    e.target.value = "";
                  }}
                />
              </label>
              {form.image_url ? (
                <span className="relative block size-14 overflow-hidden border border-border">
                  <Image src={form.image_url} alt="" fill sizes="56px" className="object-cover" />
                </span>
              ) : null}
              <label className="flex items-center gap-3 text-sm">
                <Switch
                  checked={form.is_published}
                  onCheckedChange={(value) =>
                    setForm((f) => ({ ...f, is_published: value }))
                  }
                />
                Yayında
              </label>
              <div className="flex items-center gap-2 text-sm">
                Sıra:
                <Input
                  type="number"
                  className="w-20"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
