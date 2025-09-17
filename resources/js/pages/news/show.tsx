import { Link, usePage, useForm, router } from '@inertiajs/react';
import NewsLayout from '@/layouts/NewsLayout';
import { Calendar, MessageSquare, Heart, ArrowLeft, User, Send } from 'lucide-react';
import { comment, like } from '@/routes/public/news';
import { login } from '@/routes';
import { useTranslation } from 'react-i18next';
import { useTranslations } from '@/hooks/useTranslations';
import AttachmentsCarousel from '@/components/news/AttachmentsCarousel';

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
  isLiked?: boolean;
  createdAt?: string | null;
};

type PageProps = {
  auth?: { user?: { id: number } | null };
  news: NewsItem;
};

export default function NewsShow() {
  const { t } = useTranslation();
  const { i18n } = useTranslations();
  const { props } = usePage<PageProps>();
  const { news, auth } = props;

  const { data: commentData, setData: setCommentData, post: postComment, processing: commentProcessing, reset: resetComment } = useForm({
    comment: '',
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.user) {
      router.visit(login());
      return;
    }
    postComment(comment(news.id).url, {
      onSuccess: () => resetComment(),
    });
  };

  const handleLike = () => {
    if (!auth?.user) {
      router.visit(login());
      return;
    }
    useForm().post(like(news.id).url);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <NewsLayout title={news.title} hideFooter={true}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Link href="/news" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          {t('common.back_to_news')}
        </Link>

        {/* News Article */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {formatDate(news.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                {news.comments.length} {t('common.comments')}
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} />
                {news.likesCount} {t('common.likes')}
              </div>
            </div>
          </div>

          {/* Attachments */}
          {news.attachments && (news.attachments.images?.length > 0 || news.attachments.videos?.length > 0) && (
            <div className="px-6 pt-6">
              <AttachmentsCarousel
                title={news.title}
                images={news.attachments?.images}
                videos={news.attachments?.videos}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: news.description }} />
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                news.isLiked 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart size={18} fill={news.isLiked ? 'currentColor' : 'none'} />
              {news.likesCount}
            </button>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6">{t('common.comments')} ({news.comments.length})</h2>
          
          {/* Comment Form */}
          {auth?.user ? (
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                </div>
                <div className="flex-grow">
                  <textarea
                    value={commentData.comment}
                    onChange={e => setCommentData('comment', e.target.value)}
                    placeholder={t('common.write_comment')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    disabled={commentProcessing}
                  />
                  <button
                    type="submit"
                    disabled={!commentData.comment.trim() || commentProcessing}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {t('common.post_comment')}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">{t('common.login_to_comment')}</p>
              <Link href={login().url} className="text-blue-600 hover:underline">
                {t('common.login')}
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {news.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('common.no_comments')}</p>
            ) : (
              news.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </NewsLayout>
  );
}
