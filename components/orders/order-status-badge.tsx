import { Badge } from "@/components/ui/badge";
import type { OrderEstado } from "@/lib/types/database.types";
import { cn } from "@/lib/utils";

const ESTADO_LABELS: Record<OrderEstado, string> = {
  por_encargar: "Por encargar",
  encargado: "Encargado",
  pendiente: "Pendiente",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const ESTADO_CLASSES: Record<OrderEstado, string> = {
  por_encargar: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  encargado: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  pendiente: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  entregado: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  cancelado: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function OrderStatusBadge({ estado }: { estado: OrderEstado }) {
  return <Badge className={cn(ESTADO_CLASSES[estado])}>{ESTADO_LABELS[estado]}</Badge>;
}

export { ESTADO_LABELS };
