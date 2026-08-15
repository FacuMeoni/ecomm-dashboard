"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ESTADO_LABELS } from "@/components/orders/order-status-badge";
import { ORDER_ESTADOS } from "@/lib/validations/order";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderEstado } from "@/lib/types/database.types";

export function StatusSelect({ orderId, estado }: { orderId: string; estado: OrderEstado }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={estado}
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(async () => {
          await updateOrderStatus(orderId, value as string);
          toast.success("Estado actualizado.");
        });
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_ESTADOS.map((value) => (
          <SelectItem key={value} value={value}>
            {ESTADO_LABELS[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
