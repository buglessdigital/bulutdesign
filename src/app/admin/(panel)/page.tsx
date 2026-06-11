import NextLink from "next/link";
import {
  CalendarClock,
  FolderKanban,
  Mail,
  Quote,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [projects, messages, unread, appointments, pending, testimonials] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true }),
    ]);

  const cards = [
    {
      href: "/admin/projeler",
      icon: FolderKanban,
      label: "Toplam Proje",
      value: projects.count ?? 0,
      note: null,
    },
    {
      href: "/admin/mesajlar",
      icon: Mail,
      label: "Mesajlar",
      value: messages.count ?? 0,
      note: unread.count ? `${unread.count} okunmamış` : null,
    },
    {
      href: "/admin/randevular",
      icon: CalendarClock,
      label: "Randevular",
      value: appointments.count ?? 0,
      note: pending.count ? `${pending.count} bekliyor` : null,
    },
    {
      href: "/admin/referanslar",
      icon: Quote,
      label: "Referanslar",
      value: testimonials.count ?? 0,
      note: null,
    },
  ];

  const { data: recentMessages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentAppointments } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="font-display text-2xl">Genel Bakış</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <NextLink
            key={card.label}
            href={card.href}
            className="border border-border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <card.icon className="size-5 text-primary" />
            <p className="mt-4 text-3xl font-semibold">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
            {card.note ? (
              <p className="mt-2 inline-block bg-primary/15 px-2 py-0.5 text-xs text-primary">
                {card.note}
              </p>
            ) : null}
          </NextLink>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="border border-border bg-card p-6">
          <h2 className="font-display text-lg">Son Mesajlar</h2>
          <ul className="mt-4 divide-y divide-border">
            {(recentMessages ?? []).map((m) => (
              <li key={m.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    {m.name}
                    {!m.is_read ? (
                      <span className="ml-2 inline-block size-2 rounded-full bg-primary" />
                    ) : null}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                  {m.subject || m.message}
                </p>
              </li>
            ))}
            {(recentMessages ?? []).length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">
                Henüz mesaj yok.
              </li>
            ) : null}
          </ul>
        </section>

        <section className="border border-border bg-card p-6">
          <h2 className="font-display text-lg">Son Randevu Talepleri</h2>
          <ul className="mt-4 divide-y divide-border">
            {(recentAppointments ?? []).map((a) => (
              <li key={a.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{a.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.preferred_date).toLocaleDateString("tr-TR")}{" "}
                    {a.preferred_time}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.phone} ·{" "}
                  {a.status === "pending"
                    ? "Bekliyor"
                    : a.status === "confirmed"
                      ? "Onaylandı"
                      : "İptal"}
                </p>
              </li>
            ))}
            {(recentAppointments ?? []).length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">
                Henüz randevu talebi yok.
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
