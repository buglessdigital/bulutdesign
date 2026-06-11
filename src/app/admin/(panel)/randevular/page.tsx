"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: { label: "Bekliyor", className: "bg-amber-500/15 text-amber-400" },
  confirmed: {
    label: "Onaylandı",
    className: "bg-emerald-500/15 text-emerald-400",
  },
  cancelled: { label: "İptal", className: "bg-secondary text-muted-foreground" },
};

export default function AdminAppointmentsPage() {
  const supabase = createClient();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*, services(name_tr)")
      .order("created_at", { ascending: false });
    setAppointments((data as Appointment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (
    appointment: Appointment,
    status: AppointmentStatus
  ) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointment.id);
    if (error) {
      toast.error("Güncellenemedi");
      return;
    }
    setAppointments((list) =>
      list.map((a) => (a.id === appointment.id ? { ...a, status } : a))
    );
    toast.success(
      status === "confirmed" ? "Randevu onaylandı" : "Randevu iptal edildi"
    );
  };

  const remove = async (appointment: Appointment) => {
    if (!confirm("Bu randevu talebini silmek istiyor musunuz?")) return;
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointment.id);
    if (error) {
      toast.error("Silinemedi");
      return;
    }
    setAppointments((list) => list.filter((a) => a.id !== appointment.id));
    toast.success("Randevu silindi");
  };

  return (
    <div>
      <h1 className="font-display text-2xl">Randevular</h1>

      {loading ? (
        <Loader2 className="mt-10 size-6 animate-spin text-muted-foreground" />
      ) : (
        <div className="mt-6 overflow-x-auto border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Müşteri</th>
                <th className="p-4">Tarih / Saat</th>
                <th className="p-4">Hizmet</th>
                <th className="p-4">Not</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-secondary/40">
                  <td className="p-4">
                    <p className="font-medium">{appointment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.phone}
                      {appointment.email ? ` · ${appointment.email}` : ""}
                    </p>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {new Date(appointment.preferred_date).toLocaleDateString(
                      "tr-TR"
                    )}
                    {appointment.preferred_time
                      ? ` · ${appointment.preferred_time}`
                      : ""}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {appointment.services?.name_tr ?? "—"}
                  </td>
                  <td className="max-w-56 p-4">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {appointment.message || "—"}
                    </p>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "whitespace-nowrap px-2 py-0.5 text-xs",
                        statusConfig[appointment.status].className
                      )}
                    >
                      {statusConfig[appointment.status].label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {appointment.status !== "confirmed" ? (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          title="Onayla"
                          onClick={() => setStatus(appointment, "confirmed")}
                        >
                          <Check className="size-3.5 text-emerald-400" />
                        </Button>
                      ) : null}
                      {appointment.status !== "cancelled" ? (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          title="İptal et"
                          onClick={() => setStatus(appointment, "cancelled")}
                        >
                          <X className="size-3.5 text-amber-400" />
                        </Button>
                      ) : null}
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        title="Sil"
                        onClick={() => remove(appointment)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Henüz randevu talebi yok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
