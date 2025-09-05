import { Link, useForm, usePage, router } from '@inertiajs/react';
import React from 'react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import { ArrowLeft, Heart, MessageSquare, Calendar, User, Send } from 'lucide-react';
import { index, comment, like } from '@/routes/public/news';
import { login } from '@/routes';

type Comment = {
  id: number;
  text: string;
  author: { id: number; name: string };
  createdAt?: string | null;
};

type News = {
  id: number;
  title: string;
  description: string;
  attachmentType: 'image' | 'video' | 'none';
  attachmentUrl?: string | null;
  comments: Comment[];
  likesCount: number;
  isLiked: boolean;
  createdAt?: string | null;
};

type PageProps = {
  auth?: { user?: { id: number } | null };
  news: News;
};

export default function NewsShow() {
  const { props } = usePage<PageProps>();
  const { news, auth } = props;
  const { data, setData, post, processing, reset } = useForm({ comment: '' });
  const isLoggedIn = Boolean(auth?.user);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(comment({ news: news.id }).url, {
      onSuccess: () => reset('comment'),
    });
  };

  return (
    <FixedHeaderLayout title={news.title}>
      <div className="w-full">
        {/* Back Button */}
        <Link 
          href={index().url} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 px-4 sm:px-6 lg:px-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Link>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mx-4 sm:mx-6 lg:mx-8">
          {/* Featured Media */}
          {news.attachmentType === 'image' && news.attachmentUrl && (
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={news.attachmentUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {news.attachmentType === 'video' && news.attachmentUrl && (
            <div className="aspect-video bg-gray-900">
              <iframe
                src={news.attachmentUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={true}
                title="YouTube video player"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
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
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: news.description }} 
            />

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.post(like({ news: news.id }).url)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  news.isLiked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${news.isLiked ? 'fill-current' : ''}`} />
                {news.isLiked ? 'Unlike' : 'Like'} ({news.likesCount})
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
              Comments ({news.comments.length})
            </h2>

            {/* Comment Form */}
            {isLoggedIn ? (
              <form onSubmit={submit} className="mb-8">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      value={data.comment}
                      onChange={(e) => setData('comment', e.target.value)}
                      placeholder="Write a comment..."
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={processing || !data.comment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {processing ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  Please <Link href={login().url} className="font-medium underline hover:no-underline">login</Link> to comment.
                </p>
              </div>
            )}

            {/* Comments List */}
            {news.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {news.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.author.name}</span>
                        {comment.createdAt && (
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </FixedHeaderLayout>
  );
}


