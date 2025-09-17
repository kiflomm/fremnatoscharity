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
    return <EmptyNewsState isMobile={true} />;
  }

  return (
    <>
      <div className="p-4 space-y-4">
        {items.map((news) => (
          <NewsCard 
            key={news.id} 
            news={news} 
            onSelect={onNewsSelect} 
          />
        ))}
      </div>

      {/* Pagination */}
      {paginationLinks && (
        <NewsPagination links={paginationLinks} />
      )}
    </>
  );
}
