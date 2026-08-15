import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { EstadoCounts } from "@/components/dashboard/estado-counts";
import { StaleOrders } from "@/components/dashboard/stale-orders";
import { PaymentBreakdown } from "@/components/dashboard/payment-breakdown";
import { TopBuyers } from "@/components/dashboard/top-buyers";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersFilterBar } from "@/components/orders/orders-filter-bar";
import { normalizeOrderResumen, sanitizeSearchTerm, STALE_ORDER_DAYS } from "@/lib/orders";
import { currency } from "@/lib/format";
import { ORDER_ESTADOS } from "@/lib/validations/order";
import type { OrderEstado, MetodoPago } from "@/lib/types/database.types";

const RECENT_ORDERS_LIMIT = 8;

export default async function HomePage(props: PageProps<"/">) {
  await requireUser();
  const searchParams = await props.searchParams;
  const estadoFilter = searchParams.estado as OrderEstado | undefined;
  const q = typeof searchParams.q === "string" ? sanitizeSearchTerm(searchParams.q) : "";

  const supabase = await createClient();

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const staleCutoff = new Date(now.getTime() - STALE_ORDER_DAYS * 24 * 60 * 60 * 1000);

  let recentQuery = supabase
    .from("orders_resumen")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(RECENT_ORDERS_LIMIT);

  if (estadoFilter && (ORDER_ESTADOS as readonly string[]).includes(estadoFilter)) {
    recentQuery = recentQuery.eq("estado", estadoFilter);
  }
  if (q) {
    recentQuery = recentQuery.or(`nombre_comprador.ilike.%${q}%,nombre_producto.ilike.%${q}%`);
  }

  const [
    { data: activeRows },
    { data: allEstados },
    { data: staleRows },
    { data: pagos },
    { data: monthlyRows },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("orders_resumen").select("total_ganancia, monto_restante, precio_venta").neq("estado", "cancelado"),
    supabase.from("orders").select("estado"),
    supabase
      .from("orders_resumen")
      .select("*")
      .in("estado", ["encargado", "pendiente"])
      .lt("updated_at", staleCutoff.toISOString())
      .order("updated_at", { ascending: true })
      .limit(10),
    supabase.from("pagos").select("monto, metodo_pago"),
    supabase
      .from("orders_resumen")
      .select("total_ganancia, created_at")
      .neq("estado", "cancelado")
      .gte("created_at", startOfLastMonth.toISOString()),
    recentQuery,
  ]);

  const totalOrdenes = activeRows?.length ?? 0;
  const totalVentas = (activeRows ?? []).reduce((sum, row) => sum + (row.precio_venta ?? 0), 0);
  const gananciaAcumulada = (activeRows ?? []).reduce((sum, row) => sum + (row.total_ganancia ?? 0), 0);
  const pendienteDeCobro = (activeRows ?? []).reduce((sum, row) => sum + (row.monto_restante ?? 0), 0);

  const estadoCounts = (allEstados ?? []).reduce(
    (acc, row) => {
      if (row.estado) acc[row.estado] = (acc[row.estado] ?? 0) + 1;
      return acc;
    },
    {} as Record<OrderEstado, number>
  );

  const paymentTotals = (pagos ?? []).reduce(
    (acc, pago) => {
      acc[pago.metodo_pago] = (acc[pago.metodo_pago] ?? 0) + pago.monto;
      return acc;
    },
    { efectivo: 0, transferencia: 0 } as Record<MetodoPago, number>
  );

  const gananciaEsteMes = (monthlyRows ?? [])
    .filter((row) => row.created_at && new Date(row.created_at) >= startOfThisMonth)
    .reduce((sum, row) => sum + (row.total_ganancia ?? 0), 0);
  const gananciaMesPasado = (monthlyRows ?? [])
    .filter((row) => row.created_at && new Date(row.created_at) < startOfThisMonth)
    .reduce((sum, row) => sum + (row.total_ganancia ?? 0), 0);

  const buyerCounts = new Map<string, number>();
  const { data: buyerRows } = await supabase
    .from("orders")
    .select("nombre_comprador")
    .neq("estado", "cancelado");
  for (const row of buyerRows ?? []) {
    buyerCounts.set(row.nombre_comprador, (buyerCounts.get(row.nombre_comprador) ?? 0) + 1);
  }
  const topBuyers = [...buyerCounts.entries()]
    .map(([nombre, pedidos]) => ({ nombre, pedidos }))
    .sort((a, b) => b.pedidos - a.pedidos)
    .slice(0, 5);

  const verTodasParams = new URLSearchParams();
  if (estadoFilter) verTodasParams.set("estado", estadoFilter);
  if (q) verTodasParams.set("q", q);
  const verTodasHref = verTodasParams.size > 0 ? `/orders?${verTodasParams.toString()}` : "/orders";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <Button nativeButton={false} render={<Link href="/orders/new" />}>
          Nueva orden
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de órdenes" value={String(totalOrdenes)} />
        <StatCard label="Total ventas" value={currency.format(totalVentas)} />
        <StatCard label="Ganancia acumulada" value={currency.format(gananciaAcumulada)} />
        <StatCard label="Pendiente de cobro" value={currency.format(pendienteDeCobro)} />
      </div>

      <GananciaMensualCard actual={gananciaEsteMes} anterior={gananciaMesPasado} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-medium">Últimas órdenes</h2>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={verTodasHref} />}
          >
            Ver todas las órdenes
          </Button>
        </div>

        <Suspense>
          <OrdersFilterBar basePath="/" />
        </Suspense>

        <OrdersTable orders={(recentOrders ?? []).map(normalizeOrderResumen)} />
      </div>
    </div>
  );
}

function GananciaMensualCard({ actual, anterior }: { actual: number; anterior: number }) {
  let hint: string | undefined;
  let hintClassName: string | undefined;

  if (anterior === 0) {
    hint = actual > 0 ? "sin datos del mes pasado para comparar" : undefined;
  } else {
    const pct = Math.round(((actual - anterior) / anterior) * 100);
    const sign = pct > 0 ? "+" : "";
    hint = `${sign}${pct}% vs. mes pasado (${currency.format(anterior)})`;
    hintClassName = pct >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Ganancia este mes" value={currency.format(actual)} hint={hint} hintClassName={hintClassName} />
    </div>
  );
}
