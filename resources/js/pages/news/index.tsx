import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import PublicLayout from '@/layouts/public-layout';
import { Calendar, MessageSquare, Heart, Newspaper } from 'lucide-react';
import { show } from '@/routes/public/news';

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
};

export default function NewsIndex() {
  const { props } = usePage<PageProps>();
  const items = props.news?.data ?? [];

  return (
    <PublicLayout title="News">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Newspaper className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Latest News</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news and announcements from Fremnatos Charity
          </p>
        </div>

        {/* News Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news yet</h3>
            <p className="text-gray-500">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((news) => (
              <article key={news.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <Link href={show({ news: news.id }).url} className="block">
                  {/* Featured Image */}
                  {news.attachmentType === 'image' && news.attachmentUrl && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={news.attachmentUrl}
                        alt={news.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
          <div className="mt-12 flex justify-center">
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
    </PublicLayout>
  );
}


