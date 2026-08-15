// Hand-written to match supabase/migrations/0001_init.sql.
// Once the Supabase project exists, regenerate with:
//   supabase gen types typescript --project-id <ref> > lib/types/database.types.ts

export type MetodoPago = "efectivo" | "transferencia";

export type OrderEstado =
  | "por_encargar"
  | "encargado"
  | "pendiente"
  | "entregado"
  | "cancelado";

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          nombre_comprador: string;
          nombre_producto: string;
          costo: number;
          precio_venta: number;
          total_ganancia: number;
          estado: OrderEstado;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre_comprador: string;
          nombre_producto: string;
          costo: number;
          precio_venta: number;
          estado?: OrderEstado;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nombre_comprador?: string;
          nombre_producto?: string;
          costo?: number;
          precio_venta?: number;
          estado?: OrderEstado;
          updated_at?: string;
        };
        Relationships: [];
      };
      pagos: {
        Row: {
          id: string;
          order_id: string;
          monto: number;
          metodo_pago: MetodoPago;
          fecha_pago: string;
          nota: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          monto: number;
          metodo_pago: MetodoPago;
          fecha_pago?: string;
          nota?: string | null;
          created_at?: string;
        };
        Update: {
          monto?: number;
          metodo_pago?: MetodoPago;
          fecha_pago?: string;
          nota?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pagos_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pagos_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders_resumen";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      orders_resumen: {
        Row: {
          id: string;
          nombre_comprador: string;
          nombre_producto: string;
          costo: number;
          precio_venta: number;
          total_ganancia: number;
          estado: OrderEstado;
          created_at: string;
          updated_at: string;
          monto_pagado: number;
          monto_restante: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      metodo_pago_enum: MetodoPago;
      order_estado_enum: OrderEstado;
    };
  };
}
