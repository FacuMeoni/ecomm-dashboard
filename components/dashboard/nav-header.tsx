import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export function NavHeader() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
      <Link href="/orders" className="font-semibold">
        Órdenes
      </Link>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm">
          Cerrar sesión
        </Button>
      </form>
    </header>
  );
}
