"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().default(""),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(10).max(4000),
});

export async function submitContactMessage(input: unknown) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .insert(parsed.data);

  return { success: !error };
}

const appointmentSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200).or(z.literal("")).default(""),
  phone: z.string().min(7).max(40),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferred_time: z.string().max(20).optional().default(""),
  service_id: z.string().uuid().nullable().optional().default(null),
  message: z.string().max(4000).optional().default(""),
});

export async function submitAppointment(input: unknown) {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert(parsed.data);

  return { success: !error };
}
