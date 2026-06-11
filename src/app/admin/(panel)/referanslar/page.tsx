"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

const emptyForm = {
  client_name: "",
  company: "",
  quote_tr: "",
  quote_en: "",
  is_published: true,
  sort_order: 0,
};

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditing(item);
    setForm({
      client_name: item.client_name,
      company: item.company,
      quote_tr: item.quote_tr,
      quote_en: item.quote_en,
      is_published: item.is_published,
      sort_order: item.sort_order,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.client_name || !form.quote_tr) {
      toast.error("Müşteri adı ve yorum (TR) zorunlu");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      quote_en: form.quote_en || form.quote_tr,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } = editing
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Kaydedilemedi");
      return;
    }
    toast.success(editing ? "Referans güncellendi" : "Referans eklendi");
    setOpen(false);
    load();
  };

  const remove = async (item: Testimonial) => {
    if (!confirm(`"${item.client_name}" referansını silmek istiyor musunuz?`)) return;
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", item.id);
    if (error) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Referans silindi");
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">Referanslar</h1>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Yeni Referans
        </Button>
      </div>

      {loading ? (
        <Loader2 className="mt-10 size-6 animate-spin text-muted-foreground" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{item.client_name}</h2>
                  {item.company ? (
                    <p className="text-xs text-muted-foreground">{item.company}</p>
                  ) : null}
                </div>
                {!item.is_published ? (
                  <span className="bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    Gizli
                  </span>
                ) : null}
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                “{item.quote_tr}”
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                  <Pencil className="size-3.5" /> Düzenle
                </Button>
                <Button variant="destructive" size="sm" onClick={() => remove(item)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz referans yok.</p>
          ) : null}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto">
          <DialogTitle className="font-display">
            {editing ? "Referansı Düzenle" : "Yeni Referans"}
          </DialogTitle>
          <div className="mt-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Müşteri Adı *</Label>
                <Input
                  value={form.client_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client_name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Firma / Ünvan</Label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Yorum (TR) *</Label>
              <Textarea
                rows={3}
                value={form.quote_tr}
                onChange={(e) => setForm((f) => ({ ...f, quote_tr: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Yorum (EN)</Label>
              <Textarea
                rows={3}
                value={form.quote_en}
                onChange={(e) => setForm((f) => ({ ...f, quote_en: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-6">
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
