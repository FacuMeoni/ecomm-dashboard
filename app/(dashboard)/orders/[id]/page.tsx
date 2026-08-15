import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusSelect } from "@/components/orders/status-select";
import { PaymentList } from "@/components/orders/payment-list";
import { PaymentFormDialog } from "@/components/orders/payment-form-dialog";
import { DeleteOrderButton } from "@/components/orders/delete-order-button";
import { normalizeOrderResumen } from "@/lib/orders";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export default async function OrderDetailPage(props: PageProps<"/orders/[id]">) {
  await requireUser();
  const { id } = await props.params;

  const supabase = await createClient();

  const [{ data: orderRow }, { data: pagos }] = await Promise.all([
    supabase.from("orders_resumen").select("*").eq("id", id).single(),
    supabase.from("pagos").select("*").eq("order_id", id).order("fecha_pago", { ascending: false }),
  ]);

  if (!orderRow) {
    notFound();
  }

  const order = normalizeOrderResumen(orderRow);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{order.nombre_producto}</h1>
          <p className="text-sm text-muted-foreground">{order.nombre_comprador}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/orders/${order.id}/edit`} />}>
            Editar
          </Button>
          <DeleteOrderButton orderId={order.id} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Precio de venta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{currency.format(order.precio_venta)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Ganancia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{currency.format(order.total_ganancia)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Precio costo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{currency.format(order.costo)}</p>
          </CardContent>
        </Card>
        {(pagos ?? []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo restante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{currency.format(order.monto_restante)}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Estado</span>
        <div className="w-fit">
          <StatusSelect orderId={order.id} estado={order.estado} />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Pagos</h2>
          <PaymentFormDialog orderId={order.id} montoRestante={order.monto_restante} />
        </div>
        <PaymentList pagos={pagos ?? []} orderId={order.id} />
      </div>
    </div>
  );
}
