"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitAppointment } from "@/lib/actions";
import type { Service } from "@/lib/types";
import { localized } from "@/lib/types";

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function AppointmentForm({
  services,
  locale,
}: {
  services: Service[];
  locale: string;
}) {
  const t = useTranslations("appointment");
  const tc = useTranslations("contact");
  const v = useTranslations("validation");

  const schema = z.object({
    name: z.string().min(2, v("nameRequired")),
    email: z.string().email(v("emailInvalid")).or(z.literal("")),
    phone: z.string().min(7, v("phoneRequired")),
    preferred_date: z.string().min(1, v("dateRequired")),
    preferred_time: z.string(),
    service_id: z.string(),
    message: z.string(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", preferred_time: "", service_id: "", message: "" },
  });

  const serviceId = watch("service_id");
  const preferredTime = watch("preferred_time");

  const onSubmit = async (values: FormValues) => {
    const result = await submitAppointment({
      ...values,
      service_id: values.service_id || null,
    });
    if (result.success) {
      toast.success(t("success"));
      reset();
    } else {
      toast.error(t("error"));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{tc("name")} *</Label>
          <Input id="name" placeholder={tc("namePlaceholder")} {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{tc("phone")} *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={tc("phonePlaceholder")}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">{tc("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={tc("emailPlaceholder")}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>{t("service")}</Label>
          <Select
            value={serviceId}
            onValueChange={(value) => setValue("service_id", value ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("servicePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {localized(service, "name", locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="preferred_date">{t("date")} *</Label>
          <Input
            id="preferred_date"
            type="date"
            min={today}
            {...register("preferred_date")}
          />
          {errors.preferred_date ? (
            <p className="text-xs text-destructive">
              {errors.preferred_date.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>{t("time")}</Label>
          <Select
            value={preferredTime}
            onValueChange={(value) => setValue("preferred_time", value ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("timePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("note")}</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder={t("notePlaceholder")}
          {...register("message")}
        />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
