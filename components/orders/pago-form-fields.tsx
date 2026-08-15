import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { METODOS_PAGO } from "@/lib/validations/pago";
import type { MetodoPago } from "@/lib/types/database.types";

const METODO_LABELS: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

export function PagoFormFields({
  errors,
  montoRestante,
  defaultValues,
}: {
  errors?: Record<string, string[]>;
  montoRestante?: number;
  defaultValues?: {
    monto: number;
    metodo_pago: MetodoPago;
    fecha_pago: string;
    nota: string | null;
  };
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="monto">Monto</Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={defaultValues?.monto}
          required
        />
        {!!montoRestante && montoRestante > 0 && (
          <p className="text-xs text-muted-foreground">
            Saldo restante actual: {montoRestante.toFixed(2)}
          </p>
        )}
        {errors?.monto && <p className="text-sm text-destructive">{errors.monto[0]}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="metodo_pago">Método de pago</Label>
        <Select name="metodo_pago" defaultValue={defaultValues?.metodo_pago ?? "efectivo"}>
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
          defaultValue={defaultValues?.fecha_pago ?? new Date().toISOString().slice(0, 10)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nota">Nota (opcional)</Label>
        <Input id="nota" name="nota" defaultValue={defaultValues?.nota ?? undefined} />
      </div>
    </>
  );
}
