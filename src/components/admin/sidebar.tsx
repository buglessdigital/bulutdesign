"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarClock,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Quote,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/projeler", label: "Projeler", icon: FolderKanban },
  { href: "/admin/hizmetler", label: "Hizmetler", icon: Wrench },
  { href: "/admin/referanslar", label: "Referanslar", icon: Quote },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: Mail },
  { href: "/admin/randevular", label: "Randevular", icon: CalendarClock },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <NextLink
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/75 hover:bg-secondary hover:text-foreground"
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </NextLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobil üst bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <NextLink href="/admin">
          <Logo className="text-lg" />
        </NextLink>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Menü"
          onClick={() => setOpen(!open)}
        >
          <Menu className="size-5" />
        </Button>
      </div>
      {open ? (
        <div className="border-b border-border bg-card p-4 lg:hidden">
          {nav}
          <Button variant="ghost" className="mt-2 w-full justify-start gap-3" onClick={logout}>
            <LogOut className="size-4" /> Çıkış Yap
          </Button>
        </div>
      ) : null}

      {/* Masaüstü sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-card p-5 lg:flex">
        <NextLink href="/admin" className="mb-8 block">
          <Logo className="text-lg" />
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Yönetim Paneli
          </p>
        </NextLink>
        {nav}
        <Button variant="ghost" className="justify-start gap-3" onClick={logout}>
          <LogOut className="size-4" /> Çıkış Yap
        </Button>
      </aside>
    </>
  );
}
