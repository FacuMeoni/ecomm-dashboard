import { requireUser } from "@/lib/supabase/dal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Configuración</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{user.email}</p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Próximamente: métodos de pago, datos de la tienda y otras preferencias.
      </p>
    </div>
  );
}
