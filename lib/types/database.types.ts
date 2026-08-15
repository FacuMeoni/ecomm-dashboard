// Generado con: supabase gen types typescript --project-id epdmeqjpijjhtcxhjjye
// Para regenerar después de cambiar el schema, correr ese mismo comando.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      orders: {
        Row: {
          costo: number
          created_at: string
          estado: Database["public"]["Enums"]["order_estado_enum"]
          id: string
          nombre_comprador: string
          nombre_producto: string
          precio_venta: number
          total_ganancia: number | null
          updated_at: string
        }
        Insert: {
          costo: number
          created_at?: string
          estado?: Database["public"]["Enums"]["order_estado_enum"]
          id?: string
          nombre_comprador: string
          nombre_producto: string
          precio_venta: number
          total_ganancia?: number | null
          updated_at?: string
        }
        Update: {
          costo?: number
          created_at?: string
          estado?: Database["public"]["Enums"]["order_estado_enum"]
          id?: string
          nombre_comprador?: string
          nombre_producto?: string
          precio_venta?: number
          total_ganancia?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pagos: {
        Row: {
          created_at: string
          fecha_pago: string
          id: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago_enum"]
          monto: number
          nota: string | null
          order_id: string
        }
        Insert: {
          created_at?: string
          fecha_pago?: string
          id?: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago_enum"]
          monto: number
          nota?: string | null
          order_id: string
        }
        Update: {
          created_at?: string
          fecha_pago?: string
          id?: string
          metodo_pago?: Database["public"]["Enums"]["metodo_pago_enum"]
          monto?: number
          nota?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagos_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_resumen"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      orders_resumen: {
        Row: {
          costo: number | null
          created_at: string | null
          estado: Database["public"]["Enums"]["order_estado_enum"] | null
          id: string | null
          monto_pagado: number | null
          monto_restante: number | null
          nombre_comprador: string | null
          nombre_producto: string | null
          precio_venta: number | null
          total_ganancia: number | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      metodo_pago_enum: "efectivo" | "transferencia"
      order_estado_enum:
        | "por_encargar"
        | "encargado"
        | "pendiente"
        | "entregado"
        | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      metodo_pago_enum: ["efectivo", "transferencia"],
      order_estado_enum: [
        "por_encargar",
        "encargado",
        "pendiente",
        "entregado",
        "cancelado",
      ],
    },
  },
} as const

export type OrderEstado = Database["public"]["Enums"]["order_estado_enum"]
export type MetodoPago = Database["public"]["Enums"]["metodo_pago_enum"]
