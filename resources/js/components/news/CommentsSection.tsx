import { Link, router, useForm } from '@inertiajs/react';
import { MessageSquare, User, Send, Heart, Reply, MoreHorizontal, Clock } from 'lucide-react';
import { comment } from '@/routes/public/news';
import { login } from '@/routes';

type Comment = {
  id: number;
  text: string;
  author: { id: number; name: string };
  createdAt?: string | null;
};

interface CommentsSectionProps {
  newsId: number;
  comments: Comment[];
  isLoggedIn: boolean;
  onCommentSubmitted?: () => void;
}

export default function CommentsSection({ newsId, comments, isLoggedIn, onCommentSubmitted }: CommentsSectionProps) {
  const { data, setData, post, processing, reset } = useForm({ comment: '' });

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    post(comment({ news: newsId }).url, {
      onSuccess: () => {
        reset('comment');
        if (onCommentSubmitted) {
          onCommentSubmitted();
        } else {
          // Refresh the page to show the new comment
          router.reload();
        }
      },
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <section className="mt-4 lg:mt-6 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
        
        <div className="p-6 lg:p-12">
          {/* Comment Form */}
          {isLoggedIn ? (
            <div className="mb-8 lg:mb-12">
              <form onSubmit={submitComment} className="space-y-4">
                <div className="relative">
                  <textarea
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 px-6 py-4 text-base bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80"
                    rows={4}
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    placeholder="Share your thoughts on this article..."
                    required
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    {data.comment.length}/500
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className={`group inline-flex items-center px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      processing || !data.comment.trim()
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
                    }`}
                    disabled={processing || !data.comment.trim()}
                  >
                    <Send className="h-4 w-4 mr-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    {processing ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-8 lg:mb-12">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-center">
                  <User className="h-12 w-12 text-blue-500 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Join the conversation</h3>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">
                    Please log in to share your thoughts and engage with other readers.
                  </p>
                  <Link 
                    href={login().url} 
                    className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                  >
                    Sign In to Comment
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="max-w-sm mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Start the conversation</h3>
                <p className="text-gray-600 dark:text-gray-400">Be the first to share your thoughts on this article. Your perspective matters!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 lg:space-y-8">
              {comments.map((comment, index) => (
                <div key={comment.id} className="group">
                  <div className="bg-gradient-to-r from-slate-50/50 via-white/50 to-slate-50/50 dark:from-slate-800/30 dark:via-slate-700/30 dark:to-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-600/30 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/20 transition-all duration-300">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        {/* Comment Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {comment.author.name}
                            </h4>
                            {comment.createdAt && (
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{formatRelativeTime(comment.createdAt)}</span>
                              </div>
                            )}
                          </div>
                          
                          <button className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200">
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>

                        {/* Comment Text */}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {comment.text}
                        </p>

                        {/* Comment Actions */}
                        <div className="flex items-center gap-4">
                          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200">
                            <Heart className="h-4 w-4" />
                            <span>Like</span>
                          </button>
                          
                          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                            <Reply className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Separator line except for last comment */}
                  {index < comments.length - 1 && (
                    <div className="mt-6 lg:mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
