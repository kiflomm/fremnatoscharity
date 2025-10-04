import { usePage, router } from '@inertiajs/react'; 
import NewsLayout from '@/layouts/NewsLayout';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import NewsDetail from '@/components/news/NewsDetail'; 
import NewsList from '@/components/news/NewsList';
import EmptyNewsState from '@/components/news/EmptyNewsState';
import type { NewsListData } from '@/lib/layout-utils';
import { index as newsIndex } from '@/routes/public/news';

// Helper function to get current query parameters
const getCurrentQueryParams = () => {
  const currentParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(currentParams.entries());
};

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
  recentNews?: NewsListData;
  popularNews?: NewsListData;
  selectedNews?: NewsItem & {
    comments: any[];
    isLiked: boolean;
  };
  filters?: {
    q?: string | null;
    recent_page?: number;
    popular_page?: number;
    selected?: string;
  };
};

export default function NewsIndex() {
  const { t } = useTranslation();
  const { i18n } = useTranslations();
  const { props } = usePage<PageProps>();
  const { auth, recentNews, popularNews, selectedNews } = props; 
  
  const [selectedNewsId, setSelectedNewsId] = useState<number | undefined>(
    selectedNews?.id || (props.filters?.selected ? parseInt(props.filters.selected || '0') : undefined)
  );
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Auto-select first news item (most recent) when available and no item is selected
  useEffect(() => {
    if (!selectedNewsId && recentNews?.data.length && recentNews.data.length > 0) {
      const firstNewsId = recentNews.data[0].id;
      setSelectedNewsId(firstNewsId);
      // On desktop, also switch to detail view
      if (window.innerWidth >= 1024) {
        setViewMode('detail');
      }
    }
  }, [recentNews?.data, selectedNewsId]);

  // Force English for public page regardless of stored preference
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  const handleNewsSelect = (newsId: number) => {
    setSelectedNewsId(newsId);
    setViewMode('detail');
    
    // Update URL with selected news using Wayfinder
    const queryParams = getCurrentQueryParams();
    
    router.visit(newsIndex.url({
      mergeQuery: {
        ...queryParams,
        selected: newsId.toString(),
      }
    }), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedNewsId(undefined);
    
    // Remove selected news from URL using Wayfinder
    const queryParams = getCurrentQueryParams();
    delete queryParams.selected;
    
    router.visit(newsIndex.url({
      query: queryParams
    }), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleFilterChange = (filters: { q?: string }) => {
    const queryParams = getCurrentQueryParams();
    
    // Clear page parameters when searching
    delete queryParams.recent_page;
    delete queryParams.popular_page;
    
    if (filters.q) {
      queryParams.q = filters.q;
    } else {
      delete queryParams.q;
    }

    router.visit(newsIndex.url({
      query: queryParams
    }));
  };

  const handlePageChange = (pageType: 'recent' | 'popular', page: number) => {
    const queryParams = getCurrentQueryParams();
    
    if (pageType === 'recent') {
      queryParams.recent_page = page.toString();
    } else {
      queryParams.popular_page = page.toString();
    }
    
    router.visit(newsIndex.url({
      query: queryParams
    }), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  // Use selectedNews from props if available, otherwise find from recent news
  const currentSelectedNews = selectedNews || (selectedNewsId ? 
    recentNews?.data.find(item => item.id === selectedNewsId) || 
    popularNews?.data.find(item => item.id === selectedNewsId) 
    : null);

  // Ensure selectedNews has all required properties with defaults
  const safeSelectedNews = currentSelectedNews ? {
    ...currentSelectedNews,
    comments: selectedNews?.comments || [],
    isLiked: selectedNews?.isLiked || false,
  } : null;

  return (
    <NewsLayout
      title={safeSelectedNews ? safeSelectedNews.title : "News"}
      recentNews={recentNews}
      popularNews={popularNews}
      selectedNewsId={selectedNewsId}
      onNewsSelect={handleNewsSelect}
      filters={props.filters}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
      showFilters={true}
      hideFooter={true}
    >
      {/* Detail View */}
      {viewMode === 'detail' && safeSelectedNews ? (
        <>
          <NewsDetail
            news={safeSelectedNews}
            onBackToList={handleBackToList}
            showBackButton={false}
            auth={auth}
          />
        </>
      ) : (
        <>
          {/* Desktop Empty State */}
          {(!recentNews?.data.length && !popularNews?.data.length) && <EmptyNewsState />}

          {/* Mobile View - Show recent news */}
          <div className="lg:hidden">
            <NewsList
              items={recentNews?.data || []}
              onNewsSelect={handleNewsSelect}
              paginationLinks={[]} // We'll handle pagination through the layout now
            />
          </div>
        </>
      )}
    </NewsLayout>
  );
}