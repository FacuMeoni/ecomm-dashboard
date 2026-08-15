import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/lib/format";
import type { MetodoPago } from "@/lib/types/database.types";

const METODO_LABELS: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

export function PaymentBreakdown({ totals }: { totals: Record<MetodoPago, number> }) {
  const total = totals.efectivo + totals.transferencia;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Cobrado por método de pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no se registraron pagos.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {(Object.keys(METODO_LABELS) as MetodoPago[]).map((metodo) => {
              const monto = totals[metodo];
              const pct = total > 0 ? Math.round((monto / total) * 100) : 0;
              return (
                <div key={metodo} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{METODO_LABELS[metodo]}</span>
                    <span className="font-medium">{currency.format(monto)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
