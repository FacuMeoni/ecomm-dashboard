"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { PagoSchema, type PagoFormState } from "@/lib/validations/pago";

export async function addPago(_prevState: PagoFormState, formData: FormData): Promise<PagoFormState> {
  await requireUser();

  const validated = PagoSchema.safeParse({
    order_id: formData.get("order_id"),
    monto: formData.get("monto"),
    metodo_pago: formData.get("metodo_pago"),
    fecha_pago: formData.get("fecha_pago"),
    nota: formData.get("nota") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("pagos").insert(validated.data);

  if (error) {
    return { message: "No se pudo registrar el pago. Probá de nuevo." };
  }

  revalidatePath(`/orders/${validated.data.order_id}`);
  revalidatePath("/orders");
}

export async function deletePago(pagoId: string, orderId: string) {
  await requireUser();

  const supabase = await createClient();
  await supabase.from("pagos").delete().eq("id", pagoId);

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}
