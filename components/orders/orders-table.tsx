import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/types/database.types";

type OrderResumenRow = Database["public"]["Views"]["orders_resumen"]["Row"];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function OrdersTable({ orders }: { orders: OrderResumenRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No hay órdenes para mostrar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Comprador</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer">
              <TableCell className="p-0">
                <Link href={`/orders/${order.id}`} className="block px-4 py-3">
                  {order.nombre_comprador}
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link href={`/orders/${order.id}`} className="block px-4 py-3">
                  {order.nombre_producto}
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link href={`/orders/${order.id}`} className="block px-4 py-3">
                  {currency.format(order.precio_venta)}
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link href={`/orders/${order.id}`} className="block px-4 py-3">
                  <OrderStatusBadge estado={order.estado} />
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link href={`/orders/${order.id}`} className="block px-4 py-3">
                  <Badge
                    className={cn(
                      order.monto_restante > 0
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    )}
                  >
                    {order.monto_restante > 0
                      ? `Faltan ${currency.format(order.monto_restante)}`
                      : "Saldado"}
                  </Badge>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
