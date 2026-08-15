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
import { EditPagoDialog } from "@/components/orders/edit-pago-dialog";
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
            <TableHead className="w-20" />
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
                <div className="flex items-center gap-1">
                  <EditPagoDialog pago={pago} orderId={orderId} />
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
                    <span className="sr-only">Eliminar pago</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
