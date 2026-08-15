import * as z from "zod";

export const ORDER_ESTADOS = [
  "por_encargar",
  "encargado",
  "pendiente",
  "entregado",
  "cancelado",
] as const;

export const OrderSchema = z.object({
  nombre_comprador: z.string().trim().min(1, "Ingresá el nombre del comprador."),
  nombre_producto: z.string().trim().min(1, "Ingresá el nombre del producto."),
  costo: z.coerce.number().min(0, "El costo no puede ser negativo."),
  precio_venta: z.coerce.number().min(0, "El precio de venta no puede ser negativo."),
  estado: z.enum(ORDER_ESTADOS),
});

export type OrderFormState =
  | {
      errors?: {
        nombre_comprador?: string[];
        nombre_producto?: string[];
        costo?: string[];
        precio_venta?: string[];
        estado?: string[];
      };
      message?: string;
    }
  | undefined;
