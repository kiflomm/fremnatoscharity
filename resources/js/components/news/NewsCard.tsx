import { MessageSquare, Heart, Calendar } from 'lucide-react';

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

interface NewsCardProps {
  news: NewsItem;
  onSelect: (newsId: number) => void;
}

export default function NewsCard({ news, onSelect }: NewsCardProps) {
  const renderFirstAttachment = () => {
    const imgs = news.attachments?.images ?? [];
    const vids = news.attachments?.videos ?? [];
    const items = [
      ...imgs.map(a => ({ type: 'image' as const, order: a.order, data: a })),
      ...vids.map(a => ({ type: 'video' as const, order: a.order, data: a })),
    ].sort((a, b) => a.order - b.order);
    
    if (items.length === 0) return null;
    
    const item = items[0];
    return item.type === 'image' ? (
      <div className="aspect-video bg-gray-100 dark:bg-slate-700 overflow-hidden">
        <img 
          src={(item.data as any).url} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
    ) : (
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
    );
  };

  const totalAttachments = (news.attachments?.images?.length ?? 0) + (news.attachments?.videos?.length ?? 0);

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
      <button onClick={() => onSelect(news.id)} className="block w-full text-left">
        {/* First attachment preview */}
        {renderFirstAttachment()}

        {/* Content */}
        <div className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 capitalize">
              {totalAttachments} attachments
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
  );
}
