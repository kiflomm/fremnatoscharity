import { Link, usePage, router, useForm } from '@inertiajs/react'; 
import NewsLayout from '@/layouts/NewsLayout';
import { Calendar, MessageSquare, Heart, Newspaper, Search, Filter as FilterIcon, X, ArrowLeft, User, Send } from 'lucide-react';
import { comment, like } from '@/routes/public/news';
import { login } from '@/routes';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

type Comment = {
  id: number;
  text: string;
  author: { id: number; name: string };
  createdAt?: string | null;
};

type NewsItem = {
  id: number;
  title: string;
  description: string;
  attachmentType: 'image' | 'video' | 'none';
  attachmentUrl?: string | null;
  comments?: Comment[];
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
    type?: 'image' | 'video' | 'none' | null;
    from?: string | null; // YYYY-MM-DD
    to?: string | null;   // YYYY-MM-DD
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
  const { data, setData, post, processing, reset } = useForm({ comment: '' });

  // Auto-select first news item on desktop
  useEffect(() => {
    if (items.length > 0 && !selectedNewsId && window.innerWidth >= 1024) {
      setSelectedNewsId(items[0].id);
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

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNewsId) {
      post(comment({ news: selectedNewsId }).url, {
        onSuccess: () => {
          reset('comment');
          // Refresh the page to show the new comment
          router.reload();
        },
      });
    }
  };

  const handleFilterChange = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.type) params.set('type', filters.type);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    
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
      showFilters={viewMode === 'list'}
    >
      {/* Detail View */}
      {viewMode === 'detail' && safeSelectedNews ? (
        <div className="w-full h-full overflow-y-auto">
          {/* Back Button - Mobile Only */}
          <div className="lg:hidden p-4">
            <button 
              onClick={handleBackToList}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </button>
          </div>

          {/* Article */}
          <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mx-4 sm:mx-6 lg:mx-8">
            {/* Featured Media */}
            {safeSelectedNews.attachmentType === 'image' && safeSelectedNews.attachmentUrl && (
              <div className="aspect-video bg-gray-100 dark:bg-slate-700 overflow-hidden">
                <img
                  src={safeSelectedNews.attachmentUrl}
                  alt={safeSelectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {safeSelectedNews.attachmentType === 'video' && safeSelectedNews.attachmentUrl && (
              <div className="aspect-video bg-gray-900">
                <iframe
                  src={safeSelectedNews.attachmentUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen={true}
                  title="YouTube video player"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-6 lg:p-8">
              <header className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">{safeSelectedNews.title}</h1>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {safeSelectedNews.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(safeSelectedNews.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {safeSelectedNews.comments.length} comments
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    {safeSelectedNews.likesCount} likes
                  </div>
                </div>
              </header>

              {/* Article Body */}
              <div 
                className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400"
                dangerouslySetInnerHTML={{ __html: safeSelectedNews.description }} 
              />

              {/* Actions */}
              <div className="mt-6 lg:mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => router.post(like({ news: safeSelectedNews.id }).url)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    safeSelectedNews.isLiked
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${safeSelectedNews.isLiked ? 'fill-current' : ''}`} />
                  {safeSelectedNews.isLiked ? 'Unlike' : 'Like'} ({safeSelectedNews.likesCount})
                </button>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <section className="mt-8 lg:mt-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-blue-600" />
                Comments ({safeSelectedNews.comments.length})
              </h2>

              {/* Comment Form */}
              {isLoggedIn ? (
                <form onSubmit={submitComment} className="mb-6 lg:mb-8">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <textarea
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-3 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                        placeholder="Write a comment..."
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:justify-start"
                      disabled={processing || !data.comment.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {processing ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 lg:mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300">
                    Please <Link href={login().url} className="font-medium underline hover:no-underline">login</Link> to comment.
                  </p>
                </div>
              )}

              {/* Comments List */}
              {safeSelectedNews.comments.length === 0 ? (
                <div className="text-center py-6 lg:py-8 text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4 lg:space-y-6">
                  {safeSelectedNews.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 lg:gap-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{comment.author.name}</span>
                          {comment.createdAt && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* Welcome Message for Desktop */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <Newspaper className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a News Article</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a news article from the sidebar to read the full content here.
              </p>
            </div>
          </div>

          {/* Mobile View - Show all news */}
          <div className="lg:hidden">
            {items.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Newspaper className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No news yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Check back later for updates.</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((news) => (
                  <article key={news.id} className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
                    <button onClick={() => handleNewsSelect(news.id)} className="block w-full text-left">
                  {/* Featured Image */}
                  {news.attachmentType === 'image' && news.attachmentUrl && (
                    <div className="aspect-video bg-gray-100 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={news.attachmentUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Video Thumbnail */}
                  {news.attachmentType === 'video' && news.attachmentUrl && (
                    <div className="aspect-video bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Video Content</p>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 capitalize">
                        {news.attachmentType}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {news.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {news.description}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {news.commentsCount}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {news.likesCount}
                        </div>
                      </div>
                      {news.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(news.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </article>
              ))}
            </div>
          )}

          {/* Pagination for Mobile */}
          {props.news?.links && props.news.links.length > 3 && (
            <div className="mt-8 flex justify-center px-4">
              <nav className="flex space-x-2">
                {props.news.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>
        </>
      )}
    </NewsLayout>
  );
}


