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

// Utility functions for sorting news items
export const sortByPopularity = (newsItems: NewsItem[]): NewsItem[] => {
  return [...newsItems].sort((a, b) => {
    // Sort by total engagement (likes + comments)
    const aEngagement = a.likesCount + a.commentsCount;
    const bEngagement = b.likesCount + b.commentsCount;

    if (aEngagement !== bEngagement) {
      return bEngagement - aEngagement;
    }

    // If engagement is equal, sort by likes
    if (a.likesCount !== b.likesCount) {
      return b.likesCount - a.likesCount;
    }

    // If likes are equal, sort by comments
    return b.commentsCount - a.commentsCount;
  });
};

export const sortByRecency = (newsItems: NewsItem[]): NewsItem[] => {
  return [...newsItems].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
