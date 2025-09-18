import { router } from '@inertiajs/react';
import { useState } from 'react';
import { MessageSquare, Heart, ArrowLeft, Clock, Share2, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { like } from '@/routes/public/news';
import { login } from '@/routes';
import AttachmentsCarousel from '@/components/news/AttachmentsCarousel';
import CommentsSection from '@/components/news/CommentsSection';

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
  attachments?: {
    images: { url: string; width?: number | null; height?: number | null; order: number }[];
    videos: { embedUrl: string; provider: string; order: number }[];
  };
  comments: Comment[];
  likesCount: number;
  isLiked: boolean;
  createdAt?: string | null;
};

interface NewsDetailProps {
  news: NewsItem;
  onBackToList?: () => void;
  showBackButton?: boolean;
  auth?: { user?: { id: number } | null };
}

export default function NewsDetail({ news, onBackToList, showBackButton = false, auth }: NewsDetailProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const isLoggedIn = Boolean(auth?.user);

  const handleLike = () => {
    router.post(like({ news: news.id }).url);
  };

  const handleCommentClick = () => {
    setShowDiscussion(!showDiscussion);
  };

  const handleReadMoreClick = () => {
    setShowFullDescription(true);
    setShowDiscussion(true);
  };

  const handleShowLessClick = () => {
    setShowFullDescription(false);
    setShowDiscussion(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTruncatedDescription = (htmlContent: string, maxLines: number = 4) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Get all text content and split into lines
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const words = textContent.split(' ');

    // Estimate line height and approximate truncation
    // This is a rough approximation - in a real app you might want to use a more sophisticated approach
    const wordsPerLine = 15; // Rough estimate
    const maxWords = maxLines * wordsPerLine;

    if (words.length <= maxWords) {
      return htmlContent;
    }

    // Truncate to maxWords and add ellipsis
    const truncatedText = words.slice(0, maxWords).join(' ') + '...';
    return `<p>${truncatedText}</p>`;
  };

  return (
    <div className="w-full max-w-full min-h-full bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Back Button - Mobile Only */}
      {showBackButton && onBackToList && (
        <div className="lg:hidden p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
          <button 
            onClick={onBackToList}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="font-medium">Back to News</span>
          </button>
        </div>
      )}

      {/* Article */}
      <article className="mx-auto max-w-4xl">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden mx-4 sm:mx-6 lg:mx-8 rounded-2xl lg:rounded-3xl">
          {/* Hero Section with Attachments */}
          <div className="relative">
            <AttachmentsCarousel
              title={news.title}
              images={news.attachments?.images}
              videos={news.attachments?.videos}
            />
            
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Article Content */}
          <div className="relative">
            {/* Header with modern styling */}
            <header className="px-6 lg:px-12 pt-8 lg:pt-12 pb-6">
              <div className="space-y-6">
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight">
                  {news.title}
                </h1>
                
                {/* Enhanced Meta Information */}
                <div className="flex flex-wrap items-center gap-6">
                  {news.createdAt && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatDate(news.createdAt)}</span>
                    </div>
                  )}
                  
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
              </div>
            </header>

            {/* Article Body with enhanced typography */}
            <div className="px-6 lg:px-12 pb-8">
              <div
                className="prose prose-lg lg:prose-xl max-w-none
                         text-gray-700 dark:text-gray-300
                         prose-headings:text-gray-900 dark:prose-headings:text-white
                         prose-headings:font-bold prose-headings:tracking-tight
                         prose-a:text-blue-600 dark:prose-a:text-blue-400
                         prose-a:no-underline hover:prose-a:underline
                         prose-p:leading-relaxed prose-p:mb-6
                         prose-strong:text-gray-900 dark:prose-strong:text-white
                         prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                         prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10
                         prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{
                  __html: showFullDescription ? news.description : getTruncatedDescription(news.description)
                }}
              />

              {/* Facebook-style Read More/Show Less Links */}
              {(() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = news.description;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                const words = textContent.split(' ');
                const wordsPerLine = 15;
                const maxWords = 4 * wordsPerLine;

                if (words.length > maxWords) {
                  return (
                    <div className="mt-4">
                      {!showFullDescription ? (
                        <button
                          onClick={handleReadMoreClick}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200 hover:underline"
                        >
                          See more
                        </button>
                      ) : (
                        <button
                          onClick={handleShowLessClick}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200 hover:underline"
                        >
                          See less
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Compact Actions Section */}
            <div className="px-6 lg:px-12 pb-6">
              <div className="bg-gradient-to-r from-slate-50/60 via-white/70 to-slate-50/60 dark:from-slate-800/40 dark:via-slate-700/40 dark:to-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/40 dark:border-slate-600/40">
                <div className="flex items-center justify-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      news.isLiked
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-2 transition-all duration-200 ${news.isLiked ? 'fill-current' : 'group-hover:fill-current'}`} />
                    <span className="font-semibold">{news.likesCount}</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={handleCommentClick}
                    className={`group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      showDiscussion
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 transition-all duration-200" />
                    <span className="font-semibold">{news.comments.length}</span>
                  </button>

                  {/* Share Button */}
                  <button className="group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400">
                    <Share2 className="h-4 w-4 mr-2 transition-all duration-200" />
                    <span className="font-semibold">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Embedded Comments Section */}
      {showDiscussion && (
        <CommentsSection
          newsId={news.id}
          comments={news.comments}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}
