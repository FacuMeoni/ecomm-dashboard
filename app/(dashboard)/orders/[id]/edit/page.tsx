import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { OrderForm } from "@/components/orders/order-form";
import { updateOrder } from "@/lib/actions/orders";

export default async function EditOrderPage(props: PageProps<"/orders/[id]/edit">) {
  await requireUser();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();

  if (!order) {
    notFound();
  }

  const boundUpdateOrder = updateOrder.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Editar orden</h1>
      <OrderForm
        action={boundUpdateOrder}
        submitLabel="Guardar cambios"
        defaultValues={{
          nombre_comprador: order.nombre_comprador,
          nombre_producto: order.nombre_producto,
          costo: order.costo,
          precio_venta: order.precio_venta,
          estado: order.estado,
        }}
      />
    </div>
  );
}
