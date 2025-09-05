import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import PublicLayout from '@/layouts/public-layout';
import { Calendar, MessageSquare, Heart, Newspaper, Search, Filter as FilterIcon, X } from 'lucide-react';
import { show } from '@/routes/public/news';
import Header from '@/components/welcome/Header';
import NavigationSection from '@/components/welcome/NavigationSection';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/Footer';

type NewsItem = {
  id: number;
  title: string;
  description: string;
  attachmentType: 'image' | 'video' | 'none';
  attachmentUrl?: string | null;
  commentsCount: number;
  likesCount: number;
  createdAt?: string | null;
};

type PageProps = {
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
  const { props } = usePage<PageProps>();
  const items = props.news?.data ?? [];

  return (
    <PublicLayout title="News" hideHeader hideFooter fullBleed>
      <Header />
      <NavigationSection />
      <div id="top" className="w-full">
        {/* Header */}
        <div className="text-center mb-6 px-0 mx-0">
          <div className="flex items-center justify-center mb-4">
            <Newspaper className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">{t("latest_news")}</h1>
          </div>
          
        </div>

        {/* Filters */}
        <div id="news" className="px-4 sm:px-6 lg:px-8 mb-8">
          <form method="get" className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={props.filters?.q ?? ''}
                    placeholder="Title or description..."
                    className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search news"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="relative">
                  <select
                    name="type"
                    defaultValue={props.filters?.type ?? ''}
                    className="w-full appearance-none rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Filter by type"
                  >
                    <option value="">All</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="none">None</option>
                  </select>
                  <svg aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="md:col-span-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    name="from"
                    defaultValue={props.filters?.from ?? ''}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="From date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    name="to"
                    defaultValue={props.filters?.to ?? ''}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="To date"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 justify-between">
              <div className="hidden md:flex items-center text-xs text-gray-500">
                <FilterIcon className="h-4 w-4 mr-1" />
                Tips: combine search + type + date for precise results
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <a
                  href="/news#filters"
                  className="inline-flex items-center px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" /> Clear
                </a>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <FilterIcon className="h-4 w-4 mr-2" /> Apply
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* News Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news yet</h3>
            <p className="text-gray-500">Check back later for updates.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {items.map((news) => (
              <article key={news.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all w-full max-w-2xl">
                <Link href={show({ news: news.id }).url} className="block">
                  {/* Featured Image */}
                  {news.attachmentType === 'image' && news.attachmentUrl && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={news.attachmentUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Video Thumbnail */}
                  {news.attachmentType === 'video' && news.attachmentUrl && (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">Video Content</p>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {news.attachmentType}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {news.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {news.description}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
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
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {props.news?.links && props.news.links.length > 3 && (
          <div id="pagination" className="mt-12 flex justify-center px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-2">
              {props.news.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          </div>
        )}
      </div>
      <Footer />
    </PublicLayout>
  );
}


