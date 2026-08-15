"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ESTADO_LABELS } from "@/components/orders/order-status-badge";
import { ORDER_ESTADOS } from "@/lib/validations/order";
import type { OrderFormState } from "@/lib/validations/order";
import type { OrderEstado } from "@/lib/types/database.types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

type OrderFormAction = (state: OrderFormState, formData: FormData) => Promise<OrderFormState>;

export function OrderForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: OrderFormAction;
  defaultValues?: {
    nombre_comprador: string;
    nombre_producto: string;
    costo: number;
    precio_venta: number;
    estado: OrderEstado;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [costo, setCosto] = useState(defaultValues?.costo?.toString() ?? "");
  const [precioVenta, setPrecioVenta] = useState(defaultValues?.precio_venta?.toString() ?? "");

  const ganancia = (Number(precioVenta) || 0) - (Number(costo) || 0);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nombre_comprador">Comprador</Label>
        <Input
          id="nombre_comprador"
          name="nombre_comprador"
          defaultValue={defaultValues?.nombre_comprador}
          required
        />
        {state?.errors?.nombre_comprador && (
          <p className="text-sm text-destructive">{state.errors.nombre_comprador[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nombre_producto">Producto</Label>
        <Input
          id="nombre_producto"
          name="nombre_producto"
          defaultValue={defaultValues?.nombre_producto}
          required
        />
        {state?.errors?.nombre_producto && (
          <p className="text-sm text-destructive">{state.errors.nombre_producto[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="costo">Costo</Label>
          <Input
            id="costo"
            name="costo"
            type="number"
            step="0.01"
            min="0"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            required
          />
          {state?.errors?.costo && (
            <p className="text-sm text-destructive">{state.errors.costo[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="precio_venta">Precio de venta</Label>
          <Input
            id="precio_venta"
            name="precio_venta"
            type="number"
            step="0.01"
            min="0"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            required
          />
          {state?.errors?.precio_venta && (
            <p className="text-sm text-destructive">{state.errors.precio_venta[0]}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Ganancia estimada: <span className="font-medium text-foreground">{currency.format(ganancia)}</span>
      </p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" defaultValue={defaultValues?.estado ?? "por_encargar"}>
          <SelectTrigger id="estado" className="w-full">
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
      </div>

      {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
