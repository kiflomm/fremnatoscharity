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

export interface PaginationData {
  current_page: number;
  last_page: number;
  has_prev: boolean;
  has_next: boolean;
  total: number;
}

export interface NewsListData {
  data: NewsItem[];
  pagination: PaginationData;
}

// Utility functions for pagination
export const generatePaginationUrl = (baseUrl: string, filters: Record<string, any>, pageType: 'recent' | 'popular', page: number): string => {
  const params = new URLSearchParams();
  
  // Add existing filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  
  // Set the specific page parameter
  if (pageType === 'recent') {
    params.set('recent_page', String(page));
  } else {
    params.set('popular_page', String(page));
  }
  
  const queryString = params.toString();
  return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
};
