"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, ClipboardList, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home, isActive: (p: string) => p === "/" },
  {
    href: "/orders/new",
    label: "Crear orden",
    icon: PlusCircle,
    isActive: (p: string) => p === "/orders/new",
  },
  {
    href: "/orders",
    label: "Órdenes",
    icon: ClipboardList,
    isActive: (p: string) => p !== "/orders/new" && (p === "/orders" || p.startsWith("/orders/")),
  },
  {
    href: "/settings",
    label: "Configuración",
    icon: Settings,
    isActive: (p: string) => p.startsWith("/settings"),
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r bg-background">
      <div className="px-4 py-4">
        <span className="font-semibold">Dashboard</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, isActive }) => {
          const active = isActive(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <form action={logout}>
          <Button type="submit" variant="ghost" className="w-full justify-start gap-2.5 px-3">
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </aside>
  );
}
