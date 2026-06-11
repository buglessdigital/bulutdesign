"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!confirm("Bu projeyi ve tüm medyalarını silmek istediğinize emin misiniz?")) {
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setLoading(false);
    if (error) {
      toast.error("Silinemedi");
      return;
    }
    toast.success("Proje silindi");
    router.refresh();
  };

  return (
    <Button variant="destructive" size="sm" onClick={onDelete} disabled={loading}>
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
    </Button>
  );
}
