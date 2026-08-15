"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { METODOS_PAGO } from "@/lib/validations/pago";
import { addPago } from "@/lib/actions/pagos";

const METODO_LABELS: Record<(typeof METODOS_PAGO)[number], string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

export function PaymentFormDialog({
  orderId,
  montoRestante,
}: {
  orderId: string;
  montoRestante: number;
}) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await addPago(undefined, formData);
      if (result?.errors || result?.message) {
        setErrors(result.errors);
        if (result.message) toast.error(result.message);
        return;
      }
      setErrors(undefined);
      formRef.current?.reset();
      setOpen(false);
      toast.success("Pago registrado.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Cargar pago</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar seña o cuota</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="order_id" value={orderId} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monto">Monto</Label>
            <Input id="monto" name="monto" type="number" step="0.01" min="0.01" required />
            {montoRestante > 0 && (
              <p className="text-xs text-muted-foreground">
                Saldo restante actual: {montoRestante.toFixed(2)}
              </p>
            )}
            {errors?.monto && <p className="text-sm text-destructive">{errors.monto[0]}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="metodo_pago">Método de pago</Label>
            <Select name="metodo_pago" defaultValue="efectivo">
              <SelectTrigger id="metodo_pago" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METODOS_PAGO.map((value) => (
                  <SelectItem key={value} value={value}>
                    {METODO_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fecha_pago">Fecha</Label>
            <Input
              id="fecha_pago"
              name="fecha_pago"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nota">Nota (opcional)</Label>
            <Input id="nota" name="nota" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
