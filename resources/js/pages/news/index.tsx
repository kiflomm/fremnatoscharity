import { usePage, router } from '@inertiajs/react';
import NewsLayout from '@/layouts/NewsLayout';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import NewsDetail from '@/components/news/NewsDetail';
import CommentsSection from '@/components/news/CommentsSection';
import NewsList from '@/components/news/NewsList';
import EmptyNewsState from '@/components/news/EmptyNewsState';

type NewsItem = {
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
};

type PageProps = {
  auth?: { user?: { id: number } | null };
  news: {
    data: NewsItem[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters?: {
    q?: string | null;
  };
};

export default function NewsIndex() {
  const { t } = useTranslation();
  const { i18n } = useTranslations();
  const { props } = usePage<PageProps>();
  const items = props.news?.data ?? [];
  const { auth } = props;
  const isLoggedIn = Boolean(auth?.user);
  const [selectedNewsId, setSelectedNewsId] = useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Auto-select first news item (most recent) when available
  useEffect(() => {
    if (items.length > 0 && !selectedNewsId) {
      setSelectedNewsId(items[0].id);
      // On desktop, also switch to detail view
      if (window.innerWidth >= 1024) {
        setViewMode('detail');
      }
    }
  }, [items, selectedNewsId]);

  // Force English for public page regardless of stored preference
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  const handleNewsSelect = (newsId: number) => {
    setSelectedNewsId(newsId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedNewsId(undefined);
  };

  const handleCommentSubmitted = () => {
    // Refresh the page to show the new comment
    router.reload();
  };

  const handleFilterChange = (filters: { q?: string }) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);

    const queryString = params.toString();
    router.visit(`/news${queryString ? `?${queryString}` : ''}`);
  };

  const selectedNews = selectedNewsId ? items.find(item => item.id === selectedNewsId) : null;

  // Ensure selectedNews has all required properties with defaults
  const safeSelectedNews = selectedNews ? {
    ...selectedNews,
    comments: selectedNews.comments || [],
    isLiked: selectedNews.isLiked || false,
  } : null;

  return (
    <NewsLayout
      title={safeSelectedNews ? safeSelectedNews.title : "News"}
      newsItems={items}
      selectedNewsId={selectedNewsId}
      onNewsSelect={handleNewsSelect}
      filters={props.filters}
      onFilterChange={handleFilterChange}
      showFilters={true}
      hideFooter={true}
    >
      {/* Detail View */}
      {viewMode === 'detail' && safeSelectedNews ? (
        <>
          <NewsDetail
            news={safeSelectedNews}
            onBackToList={handleBackToList}
            showBackButton={true}
          />
          <CommentsSection
            newsId={safeSelectedNews.id}
            comments={safeSelectedNews.comments}
            isLoggedIn={isLoggedIn}
            onCommentSubmitted={handleCommentSubmitted}
          />
        </>
      ) : (
        <>
          {/* Desktop Empty State */}
          {items.length === 0 && <EmptyNewsState />}

          {/* Mobile View - Show all news */}
          <div className="lg:hidden">
            <NewsList
              items={items}
              onNewsSelect={handleNewsSelect}
              paginationLinks={props.news?.links}
            />
          </div>
        </>
      )}
    </NewsLayout>
  );
}