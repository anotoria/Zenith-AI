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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      article_copies: {
        Row: {
          article_id: string
          created_at: string
          id: string
          text: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          text: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_copies_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_images: {
        Row: {
          article_id: string
          created_at: string
          id: string
          prompt: string
          url: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          prompt: string
          url: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          prompt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          auto_post_platform:
            | Database["public"]["Enums"]["platform_type"]
            | null
          auto_post_status: Database["public"]["Enums"]["auto_post_status"]
          auto_posted_at: string | null
          created_at: string
          id: string
          is_scheduled: boolean
          original_link: string | null
          selected_copy_id: string | null
          selected_image_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_post_platform?:
            | Database["public"]["Enums"]["platform_type"]
            | null
          auto_post_status?: Database["public"]["Enums"]["auto_post_status"]
          auto_posted_at?: string | null
          created_at?: string
          id?: string
          is_scheduled?: boolean
          original_link?: string | null
          selected_copy_id?: string | null
          selected_image_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_post_platform?:
            | Database["public"]["Enums"]["platform_type"]
            | null
          auto_post_status?: Database["public"]["Enums"]["auto_post_status"]
          auto_posted_at?: string | null
          created_at?: string
          id?: string
          is_scheduled?: boolean
          original_link?: string | null
          selected_copy_id?: string | null
          selected_image_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_trails: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          image_url: string
          is_public: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          image_url: string
          is_public?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          image_url?: string
          is_public?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_trails_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_content: {
        Row: {
          content: string | null
          created_at: string
          file_name: string | null
          id: string
          module_id: string
          order_index: number
          title: string
          type: Database["public"]["Enums"]["module_content_type"]
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          id?: string
          module_id: string
          order_index: number
          title: string
          type: Database["public"]["Enums"]["module_content_type"]
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          id?: string
          module_id?: string
          order_index?: number
          title?: string
          type?: Database["public"]["Enums"]["module_content_type"]
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_content_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "trail_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string
          facebook: string | null
          id: string
          instagram: string | null
          is_active: boolean
          linkedin: string | null
          name: string
          twitter: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          facebook?: string | null
          id: string
          instagram?: string | null
          is_active?: boolean
          linkedin?: string | null
          name: string
          twitter?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          linkedin?: string | null
          name?: string
          twitter?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          prompt: string
          type: Database["public"]["Enums"]["saved_item_type"]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          prompt: string
          type: Database["public"]["Enums"]["saved_item_type"]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          prompt?: string
          type?: Database["public"]["Enums"]["saved_item_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_posts: {
        Row: {
          article_id: string | null
          content: string
          created_at: string
          error_message: string | null
          id: string
          image_url: string | null
          media_type: Database["public"]["Enums"]["media_type"] | null
          platform: Database["public"]["Enums"]["platform_type"]
          scheduled_at: string
          status: Database["public"]["Enums"]["post_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id?: string | null
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          platform: Database["public"]["Enums"]["platform_type"]
          scheduled_at: string
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string | null
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          platform?: Database["public"]["Enums"]["platform_type"]
          scheduled_at?: string
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_integrations: {
        Row: {
          api_key: string | null
          api_username: string | null
          app_id: string | null
          client_secret: string | null
          created_at: string
          id: string
          is_connected: boolean
          platform: Database["public"]["Enums"]["platform_type"]
          selected_page_id: string | null
          selected_page_name: string | null
          site_url: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          api_key?: string | null
          api_username?: string | null
          app_id?: string | null
          client_secret?: string | null
          created_at?: string
          id?: string
          is_connected?: boolean
          platform: Database["public"]["Enums"]["platform_type"]
          selected_page_id?: string | null
          selected_page_name?: string | null
          site_url?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          api_key?: string | null
          api_username?: string | null
          app_id?: string | null
          client_secret?: string | null
          created_at?: string
          id?: string
          is_connected?: boolean
          platform?: Database["public"]["Enums"]["platform_type"]
          selected_page_id?: string | null
          selected_page_name?: string | null
          site_url?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_modules: {
        Row: {
          created_at: string
          id: string
          order_index: number
          title: string
          trail_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          title: string
          trail_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          trail_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_modules_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "learning_trails"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          can_access_ai_creator: boolean
          can_access_articles: boolean
          can_access_planner: boolean
          can_create_trails: boolean
          can_manage_users: boolean
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_access_ai_creator?: boolean
          can_access_articles?: boolean
          can_access_planner?: boolean
          can_create_trails?: boolean
          can_manage_users?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_access_ai_creator?: boolean
          can_access_articles?: boolean
          can_access_planner?: boolean
          can_create_trails?: boolean
          can_manage_users?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
      auto_post_status: "PENDING" | "SUCCESS" | "ERROR" | "NONE"
      media_type: "image" | "video"
      module_content_type: "VIDEO" | "IMAGE" | "DOCUMENT" | "TEXT"
      platform_type:
        | "Facebook"
        | "Instagram"
        | "TikTok"
        | "LinkedIn"
        | "WordPress"
      post_status: "Scheduled" | "Published" | "Draft" | "Error"
      saved_item_type: "IMAGE" | "VIDEO" | "COPY"
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
      app_role: ["admin", "user", "moderator"],
      auto_post_status: ["PENDING", "SUCCESS", "ERROR", "NONE"],
      media_type: ["image", "video"],
      module_content_type: ["VIDEO", "IMAGE", "DOCUMENT", "TEXT"],
      platform_type: [
        "Facebook",
        "Instagram",
        "TikTok",
        "LinkedIn",
        "WordPress",
      ],
      post_status: ["Scheduled", "Published", "Draft", "Error"],
      saved_item_type: ["IMAGE", "VIDEO", "COPY"],
    },
  },
} as const
