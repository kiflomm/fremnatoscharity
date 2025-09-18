import NewsCard from './NewsCard';
import EmptyNewsState from './EmptyNewsState';
import NewsPagination from './NewsPagination';

type NewsItem = {
  id: number;
  title: string;
  description: string;
  attachments?: {
    images: { url: string; width?: number | null; height?: number | null; order: number }[];
    videos: { embedUrl: string; provider: string; order: number }[];
  };
  commentsCount: number;
  likesCount: number;
  createdAt?: string | null;
};

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface NewsListProps {
  items: NewsItem[];
  onNewsSelect: (newsId: number) => void;
  paginationLinks?: PaginationLink[];
}

export default function NewsList({ items, onNewsSelect, paginationLinks }: NewsListProps) {
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <EmptyNewsState isMobile={true} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* News Grid */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 sm:gap-8">
          {items.map((news, index) => (
            <div
              key={news.id}
              className="transform transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <NewsCard 
                news={news} 
                onSelect={onNewsSelect}
                enhanced={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Pagination */}
      {paginationLinks && (
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-4">
            <NewsPagination links={paginationLinks} />
          </div>
        </div>
      )}
    </div>
  );
}
