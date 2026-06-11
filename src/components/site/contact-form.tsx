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
import { submitContactMessage } from "@/lib/actions";

export function ContactForm() {
  const t = useTranslations("contact");
  const v = useTranslations("validation");

  const schema = z.object({
    name: z.string().min(2, v("nameRequired")),
    email: z.string().email(v("emailInvalid")),
    phone: z.string(),
    subject: z.string().min(2, v("subjectRequired")),
    message: z.string().min(10, v("messageRequired")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await submitContactMessage(values);
    if (result.success) {
      toast.success(t("success"));
      reset();
    } else {
      toast.error(t("error"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")} *</Label>
          <Input id="name" placeholder={t("namePlaceholder")} {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")} *</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{t("subject")} *</Label>
          <Input
            id="subject"
            placeholder={t("subjectPlaceholder")}
            {...register("subject")}
          />
          {errors.subject ? (
            <p className="text-xs text-destructive">{errors.subject.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("message")} *</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder={t("messagePlaceholder")}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
