export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  
  // AI Generated
  ai_summary: string;
  ai_key_points: string[];
  ai_category: string;
  
  // Metadata
  og_image?: string;
  favicon?: string;
  
  // Status
  is_public: boolean;
  is_archived: boolean;
  is_favorite: boolean;
  created_at: string; // ISO Date string
}

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}

export interface BookmarkFormData {
  url: string;
  title: string;
  description: string;
  ai_summary: string;
  ai_key_points: string[];
  ai_category: string;
  is_public: boolean;
}