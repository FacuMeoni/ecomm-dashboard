import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function TotalsSummary({
  gananciaAcumulada,
  pendienteDeCobro,
}: {
  gananciaAcumulada: number;
  pendienteDeCobro: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ganancia acumulada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{currency.format(gananciaAcumulada)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total pendiente de cobro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{currency.format(pendienteDeCobro)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
