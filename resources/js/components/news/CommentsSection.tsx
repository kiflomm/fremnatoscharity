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
    <section className="mt-3 mx-auto max-w-3xl px-3 sm:px-4">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 dark:border-slate-700/60 overflow-hidden">
        
        <div className="p-4 sm:p-6">
          {/* Comment Form */}
          {isLoggedIn ? (
            <div className="mb-6">
              <form onSubmit={submitComment} className="space-y-3">
                <div className="relative">
                  <textarea
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80"
                    rows={3}
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    placeholder="Share your thoughts..."
                    required
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {data.comment.length}/500
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className={`group inline-flex items-center px-5 py-2 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      processing || !data.comment.trim()
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30'
                    }`}
                    disabled={processing || !data.comment.trim()}
                  >
                    <Send className="h-3 w-3 mr-2 transition-transform duration-300 group-hover:translate-x-0.5" />
                    {processing ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-center">
                  <User className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Join the conversation</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                    Please log in to share your thoughts.
                  </p>
                  <Link 
                    href={login().url} 
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                  >
                    Sign In to Comment
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="max-w-xs mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Start the conversation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Be the first to share your thoughts!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id} className="group">
                  <div className="bg-gradient-to-r from-slate-50/60 via-white/60 to-slate-50/60 dark:from-slate-800/40 dark:via-slate-700/40 dark:to-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-600/40 hover:shadow-md hover:shadow-slate-200/40 dark:hover:shadow-slate-900/20 transition-all duration-300">
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        {/* Comment Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {comment.author.name}
                            </h4>
                            {comment.createdAt && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{formatRelativeTime(comment.createdAt)}</span>
                              </div>
                            )}
                          </div>
                          
                          <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200">
                            <MoreHorizontal className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>

                        {/* Comment Text */}
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                          {comment.text}
                        </p>

                        {/* Comment Actions */}
                        <div className="flex items-center gap-3">
                          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200">
                            <Heart className="h-3 w-3" />
                            <span>Like</span>
                          </button>
                          
                          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                            <Reply className="h-3 w-3" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Separator line except for last comment */}
                  {index < comments.length - 1 && (
                    <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
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
