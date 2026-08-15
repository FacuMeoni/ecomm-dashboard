"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { OrderSchema, type OrderFormState, ORDER_ESTADOS } from "@/lib/validations/order";

export async function createOrder(_prevState: OrderFormState, formData: FormData): Promise<OrderFormState> {
  await requireUser();

  const validated = OrderSchema.safeParse({
    nombre_comprador: formData.get("nombre_comprador"),
    nombre_producto: formData.get("nombre_producto"),
    costo: formData.get("costo"),
    precio_venta: formData.get("precio_venta"),
    estado: formData.get("estado") || "por_encargar",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert(validated.data)
    .select("id")
    .single();

  if (error || !data) {
    return { message: "No se pudo crear la orden. Probá de nuevo." };
  }

  revalidatePath("/orders");
  redirect(`/orders/${data.id}`);
}

export async function updateOrder(
  orderId: string,
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  await requireUser();

  const validated = OrderSchema.safeParse({
    nombre_comprador: formData.get("nombre_comprador"),
    nombre_producto: formData.get("nombre_producto"),
    costo: formData.get("costo"),
    precio_venta: formData.get("precio_venta"),
    estado: formData.get("estado"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update(validated.data).eq("id", orderId);

  if (error) {
    return { message: "No se pudo guardar la orden. Probá de nuevo." };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}

export async function updateOrderStatus(orderId: string, estado: string) {
  await requireUser();

  const parsed = parseEstado(estado);
  if (!parsed) return;

  const supabase = await createClient();
  await supabase.from("orders").update({ estado: parsed }).eq("id", orderId);

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function deleteOrder(orderId: string) {
  await requireUser();

  const supabase = await createClient();
  await supabase.from("orders").delete().eq("id", orderId);

  revalidatePath("/orders");
  redirect("/orders");
}

function parseEstado(value: string) {
  return (ORDER_ESTADOS as readonly string[]).includes(value)
    ? (value as (typeof ORDER_ESTADOS)[number])
    : null;
}
