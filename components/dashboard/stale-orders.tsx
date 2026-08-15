import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { daysSince } from "@/lib/format";
import type { OrderResumen } from "@/lib/orders";

export function StaleOrders({
  orders,
  thresholdDays,
}: {
  orders: OrderResumen[];
  thresholdDays: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Pedidos estancados (+{thresholdDays} días sin novedades)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay pedidos estancados. 🎉</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{order.nombre_producto}</p>
                    <p className="truncate text-xs text-muted-foreground">{order.nombre_comprador}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      hace {daysSince(order.updated_at)} días
                    </span>
                    <OrderStatusBadge estado={order.estado} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
