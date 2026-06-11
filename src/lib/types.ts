export type Category = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string;
  sort_order: number;
};

export type MediaType = "photo" | "render" | "plan" | "video";

export type ProjectMedia = {
  id: string;
  project_id: string;
  type: MediaType;
  url: string;
  sort_order: number;
};

export type Project = {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  category_id: string | null;
  location: string;
  year: number | null;
  area_m2: number | null;
  cover_image_url: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  categories?: Category | null;
  project_media?: ProjectMedia[];
};

export type Service = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string;
  description_tr: string;
  description_en: string;
  image_url: string;
  sort_order: number;
  is_published: boolean;
};

export type Testimonial = {
  id: string;
  client_name: string;
  company: string;
  quote_tr: string;
  quote_en: string;
  avatar_url: string;
  is_published: boolean;
  sort_order: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  service_id: string | null;
  message: string;
  status: AppointmentStatus;
  created_at: string;
  services?: Service | null;
};

export function localized<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: string
): string {
  return (row[`${field}_${locale}`] as string) || (row[`${field}_tr`] as string) || "";
}
