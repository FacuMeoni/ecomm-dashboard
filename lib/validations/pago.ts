import * as z from "zod";

export const METODOS_PAGO = ["efectivo", "transferencia"] as const;

export const PagoSchema = z.object({
  order_id: z.string().uuid(),
  monto: z.coerce.number().positive("El monto tiene que ser mayor a 0."),
  metodo_pago: z.enum(METODOS_PAGO),
  fecha_pago: z.string().min(1, "Ingresá la fecha del pago."),
  nota: z.string().trim().optional(),
});

export type PagoFormState =
  | {
      errors?: {
        monto?: string[];
        metodo_pago?: string[];
        fecha_pago?: string[];
        nota?: string[];
      };
      message?: string;
    }
  | undefined;
