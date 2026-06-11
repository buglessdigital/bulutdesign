import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh">
      <AdminSidebar />
      <main className="p-5 sm:p-8 lg:ml-60">{children}</main>
    </div>
  );
}
