"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PagoFormFields } from "@/components/orders/pago-form-fields";
import { updatePago } from "@/lib/actions/pagos";
import type { Database } from "@/lib/types/database.types";

type Pago = Database["public"]["Tables"]["pagos"]["Row"];

export function EditPagoDialog({ pago, orderId }: { pago: Pago; orderId: string }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updatePago(pago.id, undefined, formData);
      if (result?.errors || result?.message) {
        setErrors(result.errors);
        if (result.message) toast.error(result.message);
        return;
      }
      setErrors(undefined);
      setOpen(false);
      toast.success("Pago actualizado.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="ghost" size="icon-sm" />}>
        <Pencil className="text-muted-foreground" />
        <span className="sr-only">Editar pago</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar pago</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="order_id" value={orderId} />
          <PagoFormFields
            errors={errors}
            defaultValues={{
              monto: pago.monto,
              metodo_pago: pago.metodo_pago,
              fecha_pago: pago.fecha_pago,
              nota: pago.nota,
            }}
          />
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
