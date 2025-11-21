import { Database } from '@/integrations/supabase/types';

// Database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type UserPermission = Database['public']['Tables']['user_permissions']['Row'];
export type SocialIntegration = Database['public']['Tables']['social_integrations']['Row'];
export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleCopy = Database['public']['Tables']['article_copies']['Row'];
export type ArticleImage = Database['public']['Tables']['article_images']['Row'];
export type ScheduledPost = Database['public']['Tables']['scheduled_posts']['Row'];
export type LearningTrail = Database['public']['Tables']['learning_trails']['Row'];
export type TrailModule = Database['public']['Tables']['trail_modules']['Row'];
export type ModuleContent = Database['public']['Tables']['module_content']['Row'];
export type SavedItem = Database['public']['Tables']['saved_items']['Row'];

// Enum types
export type AppRole = Database['public']['Enums']['app_role'];
export type PlatformType = Database['public']['Enums']['platform_type'];
export type PostStatus = Database['public']['Enums']['post_status'];
export type AutoPostStatus = Database['public']['Enums']['auto_post_status'];
export type MediaType = Database['public']['Enums']['media_type'];
export type SavedItemType = Database['public']['Enums']['saved_item_type'];
export type ModuleContentType = Database['public']['Enums']['module_content_type'];

// Extended types with relations
export interface ArticleWithRelations extends Article {
  copies?: ArticleCopy[];
  images?: ArticleImage[];
}

export interface TrailWithModules extends LearningTrail {
  modules?: TrailModuleWithContent[];
}

export interface TrailModuleWithContent extends TrailModule {
  content?: ModuleContent[];
}

export interface ProfileWithPermissions extends Profile {
  permissions?: UserPermission | null;
  roles?: UserRole[];
}

// Custom types for UI components
export interface ScheduledPostUI {
  id: string;
  articleId?: string;
  platform: PlatformType;
  content: string;
  scheduledAt: Date;
  status: PostStatus;
  imageUrl?: string;
  mediaType?: MediaType;
  errorMessage?: string;
}

// View types
export type View = 
  | 'dashboard' 
  | 'articles' 
  | 'planner' 
  | 'ai-creator' 
  | 'saved-content' 
  | 'learning' 
  | 'users' 
  | 'settings' 
  | 'profile' 
  | 'auto-posts';
