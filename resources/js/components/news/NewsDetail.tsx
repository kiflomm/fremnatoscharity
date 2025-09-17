import { router } from '@inertiajs/react';
import { Calendar, MessageSquare, Heart, ArrowLeft } from 'lucide-react';
import { like } from '@/routes/public/news';
import AttachmentsCarousel from '@/components/news/AttachmentsCarousel';

type NewsItem = {
  id: number;
  title: string;
  description: string;
  attachments?: {
    images: { url: string; width?: number | null; height?: number | null; order: number }[];
    videos: { embedUrl: string; provider: string; order: number }[];
  };
  comments: any[];
  likesCount: number;
  isLiked: boolean;
  createdAt?: string | null;
};

interface NewsDetailProps {
  news: NewsItem;
  onBackToList?: () => void;
  showBackButton?: boolean;
}

export default function NewsDetail({ news, onBackToList, showBackButton = false }: NewsDetailProps) {
  const handleLike = () => {
    router.post(like({ news: news.id }).url);
  };

  return (
    <div className="w-full max-w-full">
      {/* Back Button - Mobile Only */}
      {showBackButton && onBackToList && (
        <div className="lg:hidden p-4">
          <button 
            onClick={onBackToList}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </button>
        </div>
      )}

      {/* Article */}
      <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mx-4 sm:mx-6 lg:mx-8 max-w-full">
        <AttachmentsCarousel
          title={news.title}
          images={news.attachments?.images}
          videos={news.attachments?.videos}
        />

        {/* Article Content */}
        <div className="p-6 lg:p-8">
          <header className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">{news.title}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              {news.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(news.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                {news.comments.length} comments
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                {news.likesCount} likes
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: news.description }} 
          />

          {/* Actions */}
          <div className="mt-6 lg:mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={handleLike}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                news.isLiked
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              <Heart className={`h-4 w-4 mr-2 ${news.isLiked ? 'fill-current' : ''}`} />
              {news.isLiked ? 'Unlike' : 'Like'} ({news.likesCount})
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
