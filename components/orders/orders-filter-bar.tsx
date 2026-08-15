"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ESTADO_LABELS } from "@/components/orders/order-status-badge";
import { ORDER_ESTADOS } from "@/lib/validations/order";
import { cn } from "@/lib/utils";

export function OrdersFilterBar({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const estadoFilter = searchParams.get("estado") ?? undefined;
  const urlQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);

  // Si la URL cambió por fuera de este componente (navegación, atrás/adelante),
  // se resetea el estado local durante el render en vez de un efecto.
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setQuery(urlQuery);
  }

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (query === current) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.replace(`${basePath}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function estadoHref(estado?: string) {
    const params = new URLSearchParams(searchParams);
    if (estado) {
      params.set("estado", estado);
    } else {
      params.delete("estado");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-64">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por comprador o producto..."
          className="pl-8"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterLink href={estadoHref(undefined)} active={!estadoFilter}>
          Todas
        </FilterLink>
        {ORDER_ESTADOS.map((estado) => (
          <FilterLink key={estado} href={estadoHref(estado)} active={estadoFilter === estado}>
            {ESTADO_LABELS[estado]}
          </FilterLink>
        ))}
      </div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  );
}
