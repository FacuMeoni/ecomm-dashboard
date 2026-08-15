import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TopBuyers({ buyers }: { buyers: { nombre: string; pedidos: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Compradores recurrentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {buyers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay suficientes datos.</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {buyers.map((buyer) => (
              <li key={buyer.nombre} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                <span className="truncate text-sm">{buyer.nombre}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {buyer.pedidos} {buyer.pedidos === 1 ? "pedido" : "pedidos"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
