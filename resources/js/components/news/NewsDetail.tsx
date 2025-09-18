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
                  
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {news.comments.length} {news.comments.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>
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

              {/* Read More/Show Less Buttons */}
              {(() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = news.description;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                const words = textContent.split(' ');
                const wordsPerLine = 15;
                const maxWords = 4 * wordsPerLine;

                if (words.length > maxWords) {
                  return (
                    <div className="mt-8 flex justify-center">
                      {!showFullDescription ? (
                        <button
                          onClick={handleReadMoreClick}
                          className="group inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold text-base hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 border border-blue-400/20"
                        >
                          <span className="mr-3 font-medium">Read More</span>
                          <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
                        </button>
                      ) : (
                        <button
                          onClick={handleShowLessClick}
                          className="group inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 text-white font-semibold text-base hover:from-slate-600 hover:via-slate-700 hover:to-slate-800 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-500/30 hover:shadow-2xl hover:shadow-slate-500/40 border border-slate-400/20"
                        >
                          <span className="mr-3 font-medium">Show Less</span>
                          <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Enhanced Actions Section */}
            <div className="px-6 lg:px-12 pb-8 lg:pb-12">
              <div className="bg-gradient-to-r from-slate-50/80 via-white/90 to-slate-50/80 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 dark:border-slate-600/60 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`group relative inline-flex items-center px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
                      news.isLiked
                        ? 'bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white shadow-2xl shadow-red-500/40 hover:shadow-red-500/60'
                        : 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500 text-slate-700 dark:text-slate-200 hover:from-slate-200 hover:via-slate-300 hover:to-slate-400 dark:hover:from-slate-600 dark:hover:via-slate-500 dark:hover:to-slate-400 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Heart className={`h-6 w-6 mr-3 transition-all duration-300 group-hover:scale-125 ${news.isLiked ? 'fill-current animate-pulse' : 'group-hover:text-red-500'}`} />
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">{news.likesCount}</span>
                      <span className="text-xs opacity-80">{news.likesCount === 1 ? 'Like' : 'Likes'}</span>
                    </div>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={handleCommentClick}
                    className={`group relative inline-flex items-center px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
                      showDiscussion
                        ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60'
                        : 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500 text-slate-700 dark:text-slate-200 hover:from-slate-200 hover:via-slate-300 hover:to-slate-400 dark:hover:from-slate-600 dark:hover:via-slate-500 dark:hover:to-slate-400 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <MessageSquare className="h-6 w-6 mr-3 transition-all duration-300 group-hover:scale-125 group-hover:text-emerald-500" />
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">{news.comments.length}</span>
                      <span className="text-xs opacity-80">{showDiscussion ? 'Hide' : 'Comments'}</span>
                    </div>
                  </button>

                  {/* Share Button */}
                  <button className="group relative inline-flex items-center px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Share2 className="h-6 w-6 mr-3 transition-all duration-300 group-hover:scale-125" />
                    <span className="text-sm font-bold">Share</span>
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
