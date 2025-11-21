
export enum Role {
  ADMIN = 'Admin',
  USER = 'User',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  isActive: boolean; // New field: Active or Inactive
  socials: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  permissions: {
    canManageUsers: boolean;
    canCreateTrails: boolean;
    canAccessArticles: boolean;
    canAccessPlanner: boolean;
    canAccessAICreator: boolean; // Nova permissão
  };
}

export interface SocialCopy {
  id: string;
  text: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export enum AutoPostStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    NONE = 'NONE'
}

export interface Article {
  id: string;
  title: string;
  createdAt: string;
  copies?: SocialCopy[];
  images?: GeneratedImage[];
  isGenerating: boolean;
  selectedCopyId?: string;
  selectedImageId?: string;
  isScheduled?: boolean;
  // Auto-Post Fields
  autoPostStatus?: AutoPostStatus;
  autoPostedAt?: Date;
  autoPostPlatform?: 'Facebook';
  originalLink?: string; 
}

export enum ModuleContentType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  TEXT = 'TEXT',
}

export interface ModuleContent {
  id: string;
  type: ModuleContentType;
  title: string;
  url?: string;
  content?: string; // For Rich Text
  fileName?: string;
}

export interface Module {
  id: string;
  title: string;
  content: ModuleContent[];
}

export interface LearningTrail {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  modules: Module[];
}

export interface SocialConfig {
    siteUrl?: string;     // For Wordpress
    username?: string;    // For Wordpress/Basic Auth
    apiKey?: string;      // For Wordpress Application Password
    appId?: string;       // For FB/Insta/TikTok/LinkedIn (Client ID)
    clientSecret?: string; // For OAuth (Client Secret)
    selectedPageId?: string; // For Facebook Page Selection
    selectedPageName?: string;
}

export interface SocialProfile {
    id: string;
    platform: 'Facebook' | 'Instagram' | 'TikTok' | 'LinkedIn' | 'Wordpress';
    username: string;
    isConnected: boolean;
    config?: SocialConfig; // Configuration fields
}

export interface ScheduledPost {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'LinkedIn';
  content: string;
  imageUrl?: string; // Acts as Media URL (Image or Video)
  mediaType?: 'image' | 'video'; // New field to distinguish content
  scheduledAt: Date;
  status: 'Scheduled' | 'Published' | 'Draft' | 'Error';
  errorMessage?: string;
  articleId: string;
}

// --- Saved Content Types ---

export enum SavedItemType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  COPY = 'COPY',
}

export interface SavedItem {
  id: string;
  userId: string; // To link to specific user
  type: SavedItemType;
  content: string; // URL for Image/Video, Text string for Copy
  prompt: string; // The prompt used to generate it
  description?: string; // Optional extra details
  createdAt: Date;
}
