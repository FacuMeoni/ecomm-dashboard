import { Card, CardContent } from "@/components/ui/card";
import { ESTADO_LABELS } from "@/components/orders/order-status-badge";
import { ORDER_ESTADOS } from "@/lib/validations/order";
import type { OrderEstado } from "@/lib/types/database.types";

export function EstadoCounts({ counts }: { counts: Record<OrderEstado, number> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ORDER_ESTADOS.map((estado) => (
        <Card key={estado}>
          <CardContent className="flex flex-col gap-1 py-4">
            <p className="text-2xl font-semibold">{counts[estado] ?? 0}</p>
            <p className="text-xs text-muted-foreground">{ESTADO_LABELS[estado]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
