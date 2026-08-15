import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/orders/orders-table";
import { TotalsSummary } from "@/components/dashboard/totals-summary";
import { ESTADO_LABELS } from "@/components/orders/order-status-badge";
import { ORDER_ESTADOS } from "@/lib/validations/order";
import { cn } from "@/lib/utils";
import type { OrderEstado } from "@/lib/types/database.types";

export default async function OrdersPage(props: PageProps<"/orders">) {
  await requireUser();
  const searchParams = await props.searchParams;
  const estadoFilter = searchParams.estado as OrderEstado | undefined;

  const supabase = await createClient();

  let query = supabase
    .from("orders_resumen")
    .select("*")
    .order("created_at", { ascending: false });

  if (estadoFilter && (ORDER_ESTADOS as readonly string[]).includes(estadoFilter)) {
    query = query.eq("estado", estadoFilter);
  }

  const [{ data: orders }, { data: totalsRows }] = await Promise.all([
    query,
    supabase.from("orders_resumen").select("total_ganancia, monto_restante, estado").neq("estado", "cancelado"),
  ]);

  const gananciaAcumulada = (totalsRows ?? []).reduce((sum, row) => sum + row.total_ganancia, 0);
  const pendienteDeCobro = (totalsRows ?? []).reduce((sum, row) => sum + row.monto_restante, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Órdenes</h1>
        <Button render={<Link href="/orders/new" />}>Nueva orden</Button>
      </div>

      <TotalsSummary gananciaAcumulada={gananciaAcumulada} pendienteDeCobro={pendienteDeCobro} />

      <div className="flex flex-wrap gap-2">
        <FilterLink estado={undefined} active={!estadoFilter}>
          Todas
        </FilterLink>
        {ORDER_ESTADOS.map((estado) => (
          <FilterLink key={estado} estado={estado} active={estadoFilter === estado}>
            {ESTADO_LABELS[estado]}
          </FilterLink>
        ))}
      </div>

      <OrdersTable orders={orders ?? []} />
    </div>
  );
}

function FilterLink({
  estado,
  active,
  children,
}: {
  estado?: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={estado ? `/orders?estado=${estado}` : "/orders"}
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
