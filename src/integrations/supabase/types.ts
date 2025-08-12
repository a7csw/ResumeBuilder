export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      billing_events: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          event_type: string
          id: string
          metadata: Json | null
          processed_at: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_event_id: string | null
          stripe_subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      export_logs: {
        Row: {
          created_at: string
          export_type: string
          file_hash: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          plan_type: string
          template_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          export_type: string
          file_hash?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          plan_type: string
          template_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          export_type?: string
          file_hash?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          plan_type?: string
          template_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          has_paid_plan: boolean | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          has_paid_plan?: boolean | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          has_paid_plan?: boolean | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      resume_downloads: {
        Row: {
          created_at: string
          id: string
          template_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          template_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          template_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          data: Json
          id: string
          pdf_url: string | null
          template_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          pdf_url?: string | null
          template_id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          pdf_url?: string | null
          template_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Resumes: {
        Row: {
          created_at: string
          export_count: number | null
          id: string
          is_exported: boolean | null
          template_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          export_count?: number | null
          id?: string
          is_exported?: boolean | null
          template_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          export_count?: number | null
          id?: string
          is_exported?: boolean | null
          template_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Sections: {
        Row: {
          content: Json | null
          id: string
          order: number | null
          resume_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          id?: string
          order?: number | null
          resume_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          id?: string
          order?: number | null
          resume_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Sections_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "Resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          risk_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          ai_calls_limit: number | null
          ai_calls_used: number | null
          can_refund: boolean | null
          created_at: string
          created_ip: unknown | null
          currency: string | null
          expires_at: string | null
          failed_payment_attempts: number | null
          first_export_at: string | null
          id: string
          is_active: boolean | null
          last_login_ip: unknown | null
          plan_type: string
          price_id: string | null
          price_paid: number | null
          security_alerts_enabled: boolean | null
          started_filling_at: string | null
          starts_at: string | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_calls_limit?: number | null
          ai_calls_used?: number | null
          can_refund?: boolean | null
          created_at?: string
          created_ip?: unknown | null
          currency?: string | null
          expires_at?: string | null
          failed_payment_attempts?: number | null
          first_export_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_ip?: unknown | null
          plan_type: string
          price_id?: string | null
          price_paid?: number | null
          security_alerts_enabled?: boolean | null
          started_filling_at?: string | null
          starts_at?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_calls_limit?: number | null
          ai_calls_used?: number | null
          can_refund?: boolean | null
          created_at?: string
          created_ip?: unknown | null
          currency?: string | null
          expires_at?: string | null
          failed_payment_attempts?: number | null
          first_export_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_ip?: unknown | null
          plan_type?: string
          price_id?: string | null
          price_paid?: number | null
          security_alerts_enabled?: boolean | null
          started_filling_at?: string | null
          starts_at?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_action_type: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      encrypt_sensitive_data: {
        Args: { data_text: string; encryption_key?: string }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_resource_type: string
          p_resource_id?: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
          p_risk_score?: number
        }
        Returns: string
      }
      sanitize_user_input: {
        Args: { input_text: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
