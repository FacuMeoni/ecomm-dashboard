import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersFilterBar } from "@/components/orders/orders-filter-bar";
import { ORDER_ESTADOS } from "@/lib/validations/order";
import { normalizeOrderResumen, sanitizeSearchTerm } from "@/lib/orders";
import type { OrderEstado } from "@/lib/types/database.types";

export default async function OrdersPage(props: PageProps<"/orders">) {
  await requireUser();
  const searchParams = await props.searchParams;
  const estadoFilter = searchParams.estado as OrderEstado | undefined;
  const q = typeof searchParams.q === "string" ? sanitizeSearchTerm(searchParams.q) : "";

  const supabase = await createClient();

  let query = supabase
    .from("orders_resumen")
    .select("*")
    .order("created_at", { ascending: false });

  if (estadoFilter && (ORDER_ESTADOS as readonly string[]).includes(estadoFilter)) {
    query = query.eq("estado", estadoFilter);
  }

  if (q) {
    query = query.or(`nombre_comprador.ilike.%${q}%,nombre_producto.ilike.%${q}%`);
  }

  const { data: orders } = await query;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Órdenes</h1>
        <Button nativeButton={false} render={<Link href="/orders/new" />}>
          Nueva orden
        </Button>
      </div>

      <Suspense>
        <OrdersFilterBar basePath="/orders" />
      </Suspense>

      <OrdersTable orders={(orders ?? []).map(normalizeOrderResumen)} />
    </div>
  );
}
