"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deletePago } from "@/lib/actions/pagos";
import type { Database } from "@/lib/types/database.types";

type Pago = Database["public"]["Tables"]["pagos"]["Row"];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const METODO_LABELS: Record<Pago["metodo_pago"], string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

export function PaymentList({ pagos, orderId }: { pagos: Pago[]; orderId: string }) {
  const [isPending, startTransition] = useTransition();

  if (pagos.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no se registraron pagos.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map((pago) => (
            <TableRow key={pago.id}>
              <TableCell>{pago.fecha_pago}</TableCell>
              <TableCell>{currency.format(pago.monto)}</TableCell>
              <TableCell>{METODO_LABELS[pago.metodo_pago]}</TableCell>
              <TableCell className="text-muted-foreground">{pago.nota || "—"}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await deletePago(pago.id, orderId);
                      toast.success("Pago eliminado.");
                    });
                  }}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
