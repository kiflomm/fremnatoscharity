export interface NewsItem {
  id: number;
  title: string;
  description: string;
  attachments?: {
    images: { url: string; width?: number | null; height?: number | null; order: number }[];
    videos: { embedUrl: string; provider: string; order: number }[];
  };
  comments?: any[];
  commentsCount: number;
  likesCount: number;
  isLiked?: boolean;
  createdAt?: string | null;
}

// Note: Client-side sorting functions removed since news is now fetched separately 
// from backend with proper database sorting for better performance.
