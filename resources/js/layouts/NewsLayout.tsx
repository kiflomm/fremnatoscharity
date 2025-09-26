import { type ReactNode, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Header, NavigationSection } from '@/components/welcome';
import Footer from '@/components/Footer';
import { ArrowLeft, Search, X, Calendar, MessageSquare, Heart, Newspaper, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type NewsItem, type NewsListData, generatePaginationUrl } from '@/lib/layout-utils';


interface NewsLayoutProps {
  children: ReactNode;
  title?: string;
  hideFooter?: boolean;
  recentNews?: NewsListData;
  popularNews?: NewsListData;
  selectedNewsId?: number;
  onNewsSelect?: (newsId: number) => void;
  filters?: {
    q?: string | null;
    recent_page?: number;
    popular_page?: number;
  };
  onFilterChange?: (filters: { q?: string }) => void;
  onPageChange?: (pageType: 'recent' | 'popular', page: number) => void;
  showFilters?: boolean;
}

// Pagination Component
interface PaginationProps {
  pagination: NewsListData['pagination'];
  pageType: 'recent' | 'popular';
  onPageChange: (pageType: 'recent' | 'popular', page: number) => void;
}

const PaginationControls = ({ pagination, pageType, onPageChange }: PaginationProps) => {
  if (!pagination.has_prev && !pagination.has_next) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      <button
        onClick={() => onPageChange(pageType, pagination.current_page - 1)}
        disabled={!pagination.has_prev}
        className={`
          flex items-center px-2 py-1 text-xs rounded
          ${pagination.has_prev 
            ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }
        `}
      >
        <ChevronLeft className="h-3 w-3 mr-1" />
        Prev
      </button>
      
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {pagination.current_page} of {pagination.last_page}
      </span>
      
      <button
        onClick={() => onPageChange(pageType, pagination.current_page + 1)}
        disabled={!pagination.has_next}
        className={`
          flex items-center px-2 py-1 text-xs rounded
          ${pagination.has_next 
            ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }
        `}
      >
        Next
        <ChevronRight className="h-3 w-3 ml-1" />
      </button>
    </div>
  );
};

// News Item Card Component
interface NewsItemCardProps {
  news: NewsItem;
  selectedNewsId?: number;
  onNewsSelect?: (newsId: number) => void;
}

const NewsItemCard = ({ news, selectedNewsId, onNewsSelect }: NewsItemCardProps) => (
  <button
    onClick={() => onNewsSelect?.(news.id)}
    className={`
      w-full text-left p-3 rounded-lg transition-all duration-200
      ${selectedNewsId === news.id
        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
      }
    `}
  >
    <div className="flex gap-3">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-600">
        {(() => {
          const firstImage = news.attachments?.images?.[0];
          const hasVideo = news.attachments?.videos && news.attachments.videos.length > 0;

          if (firstImage) {
            return (
              <img
                src={firstImage.url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            );
          } else if (hasVideo) {
            return (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-gray-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5" />
                </div>
              </div>
            );
          } else {
            return (
              <div className="w-full h-full flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-gray-400" />
              </div>
            );
          }
        })()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
          {news.title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {news.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            {news.commentsCount}
          </div>
          <div className="flex items-center">
            <Heart className="h-3 w-3 mr-1" />
            {news.likesCount}
          </div>
          {news.createdAt && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(news.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  </button>
);

export default function NewsLayout({
  children,
  title,
  hideFooter = false,
  recentNews = { data: [], pagination: { current_page: 1, last_page: 1, has_prev: false, has_next: false, total: 0 } },
  popularNews = { data: [], pagination: { current_page: 1, last_page: 1, has_prev: false, has_next: false, total: 0 } },
  selectedNewsId,
  onNewsSelect,
  filters,
  onFilterChange,
  onPageChange = () => {},
}: NewsLayoutProps) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters || {});

  // Close sidebar on mobile when news is selected
  useEffect(() => {
    if (selectedNewsId && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [selectedNewsId]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ q: localFilters.q || undefined });
    }
  };

  const clearFilters = () => {
    const clearedFilters = { q: undefined };
    setLocalFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title={title} />

      {/* Header and Navigation */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <Header />
        <NavigationSection />
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Mobile Sidebar - News List */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
          fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
          transition-transform duration-300 ease-in-out
          overflow-hidden flex flex-col
        `}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Newspaper className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("common.navigation.news")}</h2>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

             
              <form onSubmit={handleFilterSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={localFilters.q || ''}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, q: e.target.value }))}
                      placeholder="Title or description..."
                      className="w-full rounded-md border border-gray-300 dark:border-slate-600 pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </button>
                </div>
              </form> 
          </div>

          {/* News List */}
          <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
            {recentNews.data.length === 0 ? (
              <div className="p-6 text-center">
                <Newspaper className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No news available</p>
              </div>
            ) : (
              <>
                <div className="p-2 space-y-2">
                  {recentNews.data.map((news) => (
                    <NewsItemCard
                      key={news.id}
                      news={news}
                      selectedNewsId={selectedNewsId}
                      onNewsSelect={onNewsSelect}
                    />
                  ))}
                </div>
                <PaginationControls 
                  pagination={recentNews.pagination} 
                  pageType="recent" 
                  onPageChange={onPageChange} 
                />
              </>
            )}
          </div>
        </div>

        {/* Desktop Three-Column Layout */}
        <div className="hidden lg:flex flex-1">
          {/* Left Column - Recent News */}
          <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent</h2>
              </div>

              
                <form onSubmit={handleFilterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={localFilters.q || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, q: e.target.value }))}
                        placeholder="Title or description..."
                        className="w-full rounded-md border border-gray-300 dark:border-slate-600 pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </button>
                  </div>
                </form> 
            </div>
            <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
              {recentNews.data.length === 0 ? (
                <div className="p-6 text-center">
                  <Newspaper className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No news available</p>
                </div>
              ) : (
                <>
                  <div className="p-2 space-y-2">
                    {recentNews.data.map((news) => (
                      <NewsItemCard
                        key={news.id}
                        news={news}
                        selectedNewsId={selectedNewsId}
                        onNewsSelect={onNewsSelect}
                      />
                    ))}
                  </div>
                  <PaginationControls 
                    pagination={recentNews.pagination} 
                    pageType="recent" 
                    onPageChange={onPageChange} 
                  />
                </>
              )}
            </div>
          </div>

          {/* Middle Column - Selected News Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>

          {/* Right Column - Popular News */}
          <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Most Popular</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
              {popularNews.data.length === 0 ? (
                <div className="p-6 text-center">
                  <Newspaper className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No news available</p>
                </div>
              ) : (
                <>
                  <div className="p-2 space-y-2">
                    {popularNews.data.map((news) => (
                      <NewsItemCard
                        key={news.id}
                        news={news}
                        selectedNewsId={selectedNewsId}
                        onNewsSelect={onNewsSelect}
                      />
                    ))}
                  </div>
                  <PaginationControls 
                    pagination={popularNews.pagination} 
                    pageType="popular" 
                    onPageChange={onPageChange} 
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Content Panel */}
        <div className="lg:hidden flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse News
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}
