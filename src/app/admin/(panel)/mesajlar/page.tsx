"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminMessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async (message: ContactMessage) => {
    const next = expanded === message.id ? null : message.id;
    setExpanded(next);
    if (next && !message.is_read) {
      await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", message.id);
      setMessages((list) =>
        list.map((m) => (m.id === message.id ? { ...m, is_read: true } : m))
      );
    }
  };

  const remove = async (message: ContactMessage) => {
    if (!confirm("Bu mesajı silmek istiyor musunuz?")) return;
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", message.id);
    if (error) {
      toast.error("Silinemedi");
      return;
    }
    setMessages((list) => list.filter((m) => m.id !== message.id));
    toast.success("Mesaj silindi");
  };

  return (
    <div>
      <h1 className="font-display text-2xl">Mesajlar</h1>

      {loading ? (
        <Loader2 className="mt-10 size-6 animate-spin text-muted-foreground" />
      ) : (
        <div className="mt-6 divide-y divide-border border border-border bg-card">
          {messages.map((message) => (
            <div key={message.id}>
              <button
                onClick={() => toggle(message)}
                className={cn(
                  "flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-secondary/40",
                  !message.is_read && "bg-primary/5"
                )}
              >
                {message.is_read ? (
                  <MailOpen className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <Mail className="size-4 shrink-0 text-primary" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm",
                      !message.is_read && "font-semibold"
                    )}
                  >
                    {message.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {message.email}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {message.subject || message.message}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleString("tr-TR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </button>
              {expanded === message.id ? (
                <div className="border-t border-border bg-secondary/20 p-5">
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {message.message}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {message.phone ? <span>Tel: {message.phone}</span> : null}
                    <a
                      href={`mailto:${message.email}`}
                      className="text-primary hover:underline"
                    >
                      E-posta ile yanıtla
                    </a>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-auto"
                      onClick={() => remove(message)}
                    >
                      <Trash2 className="size-3.5" /> Sil
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          {messages.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Henüz mesaj yok.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
