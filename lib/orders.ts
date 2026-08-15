import type { Database } from "@/lib/types/database.types";

export const STALE_ORDER_DAYS = 15;

type OrderResumenRow = Database["public"]["Views"]["orders_resumen"]["Row"];

export type OrderResumen = {
  id: string;
  nombre_comprador: string;
  nombre_producto: string;
  costo: number;
  precio_venta: number;
  total_ganancia: number;
  estado: Database["public"]["Enums"]["order_estado_enum"];
  created_at: string;
  updated_at: string;
  monto_pagado: number;
  monto_restante: number;
};

// La vista orders_resumen reporta todas las columnas como nullable (limitación
// de la introspección de Postgres para vistas), pero en la práctica ninguna lo es:
// surgen de columnas NOT NULL de `orders` o de un COALESCE. Esto normaliza el tipo.
export function normalizeOrderResumen(row: OrderResumenRow): OrderResumen {
  return {
    id: row.id!,
    nombre_comprador: row.nombre_comprador!,
    nombre_producto: row.nombre_producto!,
    costo: row.costo ?? 0,
    precio_venta: row.precio_venta ?? 0,
    total_ganancia: row.total_ganancia ?? 0,
    estado: row.estado!,
    created_at: row.created_at!,
    updated_at: row.updated_at!,
    monto_pagado: row.monto_pagado ?? 0,
    monto_restante: row.monto_restante ?? 0,
  };
}

// Los filtros `.or()` de PostgREST usan "," para separar condiciones y "()" para
// agrupar, así que se sacan de lo que escribe el usuario antes de armar el filtro.
export function sanitizeSearchTerm(input: string): string {
  return input.replace(/[,()]/g, "").trim();
}
