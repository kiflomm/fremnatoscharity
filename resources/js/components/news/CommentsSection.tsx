import { Link, router, useForm } from '@inertiajs/react';
import { MessageSquare, User, Send } from 'lucide-react';
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

  return (
    <section className="mt-8 lg:mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-blue-600" />
          Comments ({comments.length})
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
        {comments.length === 0 ? (
          <div className="text-center py-6 lg:py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {comments.map((comment) => (
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
  );
}
