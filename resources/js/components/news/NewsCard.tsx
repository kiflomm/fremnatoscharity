import { MessageSquare, Heart, Calendar, Clock, Eye, Play } from 'lucide-react';

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
  enhanced?: boolean;
}

export default function NewsCard({ news, onSelect, enhanced = false }: NewsCardProps) {
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderFirstAttachment = () => {
    const imgs = news.attachments?.images ?? [];
    const vids = news.attachments?.videos ?? [];
    const items = [
      ...imgs.map(a => ({ type: 'image' as const, order: a.order, data: a })),
      ...vids.map(a => ({ type: 'video' as const, order: a.order, data: a })),
    ].sort((a, b) => a.order - b.order);
    
    if (items.length === 0) return null;
    
    const item = items[0];
    const totalAttachments = imgs.length + vids.length;
    
    return (
      <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
        {item.type === 'image' ? (
          <img 
            src={(item.data as { url: string }).url} 
            alt={news.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <p className="text-sm text-white/80 font-medium">Video Content</p>
            </div>
          </div>
        )}
        
        {/* Attachment Count Badge */}
        {totalAttachments > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {totalAttachments}
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  };

  const cardClasses = enhanced 
    ? "group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5 transition-all duration-300 max-w-full"
    : "group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all max-w-full";

  return (
    <article className={cardClasses}>
      <button onClick={() => onSelect(news.id)} className="block w-full text-left">
        {/* First attachment preview */}
        {renderFirstAttachment()}

        {/* Content */}
        <div className={enhanced ? "p-6 lg:p-8" : "p-6"}>
          {enhanced ? (
            <>
              {/* Enhanced Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {news.createdAt && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(news.createdAt)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    #{news.id.toString().padStart(4, '0')}
                  </div>
                </div>
                
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {news.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                  {news.description}
                </p>
              </div>

              {/* Enhanced Meta Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />
                    {news.commentsCount}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                    <Heart className="h-4 w-4" />
                    {news.likesCount}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Read more →
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Original Layout */}
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 capitalize">
                  {(news.attachments?.images?.length ?? 0) + (news.attachments?.videos?.length ?? 0)} attachments
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
            </>
          )}
        </div>
      </button>
    </article>
  );
}
