import { useForm, usePage, router, Link } from '@inertiajs/react'; 
import NewsLayout from '@/layouts/NewsLayout';
import { Calendar, MessageSquare, Heart, Newspaper } from 'lucide-react';
import AttachmentsCarousel from '@/components/news/AttachmentsCarousel';
import { useEffect, useState } from 'react';
import { comment, like } from '@/routes/public/stories';
import { login } from '@/routes';

type Item = {
  id: number;
  title: string;
  description: string;
  attachments?: {
    images: { url: string; width?: number | null; height?: number | null; order: number }[];
    videos: { embedUrl: string; provider: string; order: number }[];
  };
  comments?: { id: number; text: string; author: { id: number; name: string }; createdAt?: string | null }[];
  isLiked?: boolean;
  commentsCount: number;
  likesCount: number;
  createdAt?: string | null;
};

type PageProps = {
  category: 'elders' | 'childrens' | 'disabled';
  stories: {
    data: Item[];
    links: { url: string | null; label: string; active: boolean }[];
  };
};

export default function StoriesByCategory() {
  const { props } = usePage<PageProps & { auth?: { user?: { id: number } | null } }>();
  const isLoggedIn = Boolean(props.auth?.user);
  const items = props.stories?.data ?? [];
  const [selectedId, setSelectedId] =useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const { data, setData, reset, post, processing } = useForm({ comment: '' });

  useEffect(() => {
    if (items.length > 0 && !selectedId && window.innerWidth >= 1024) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selected = selectedId ? items.find(i => i.id === selectedId) : null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    post(comment({ story: selected.id }).url, {
      onSuccess: () => {
        reset('comment');
        router.reload();
      },
    });
  };

  return (
    <NewsLayout 
      title={selected ? selected.title : props.category}
      newsItems={items.map(i => {
        const images = i.attachments?.images ?? [];
        const videos = i.attachments?.videos ?? [];
        const ordered = [
          ...images.map(a => ({ kind: 'image' as const, order: a.order, url: a.url })),
          ...videos.map(a => ({ kind: 'video' as const, order: a.order, url: a.embedUrl })),
        ].sort((a, b) => a.order - b.order);
        const first = ordered[0];
        const attachmentType = first ? (first.kind === 'image' ? 'image' : 'video') : 'none';
        const attachmentUrl = first && first.kind === 'image' ? first.url : null;
        return {
          id: i.id,
          title: i.title,
          description: i.description,
          attachmentType,
          attachmentUrl,
          commentsCount: i.commentsCount,
          likesCount: i.likesCount,
          createdAt: i.createdAt,
        };
      })}
      selectedNewsId={selectedId}
      onNewsSelect={(id) => { setSelectedId(id); setViewMode('detail'); }}
      showFilters={false}
    >
      {viewMode === 'detail' && selected ? (
        <div className="w-full h-full overflow-y-auto">
          <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mx-4 sm:mx-6 lg:mx-8">
            <AttachmentsCarousel
              title={selected.title}
              images={selected.attachments?.images}
              videos={selected.attachments?.videos}
            />
            <div className="p-6 lg:p-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">{selected.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                {selected.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </div>
                )}
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {selected.commentsCount} comments
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  {selected.likesCount} likes
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: selected.description }} />

              <div className="mt-6 lg:mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => router.post(like({ story: selected.id }).url)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selected.isLiked
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${selected.isLiked ? 'fill-current' : ''}`} />
                  {selected.isLiked ? 'Unlike' : 'Like'} ({selected.likesCount})
                </button>
              </div>
            </div>
          </article>
        </div>
      ) : (
        <div className="hidden lg:flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <Newspaper className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a Story</h2>
            <p className="text-gray-600 dark:text-gray-400">Choose a story from the sidebar to read the full content here.</p>
          </div>
        </div>
      )}

      {viewMode === 'detail' && selected ? (
        <section className="mt-8 lg:mt-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-blue-600" />
              Comments ({selected.comments?.length ?? selected.commentsCount})
            </h2>

            {isLoggedIn ? (
              <form onSubmit={handleSubmitComment} className="mb-6 lg:mb-8">
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
                    disabled={processing}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Please <Link href={login().url} className="text-blue-600 dark:text-blue-400 hover:underline">login</Link> to comment.
              </p>
            )}

            <ul className="space-y-4">
              {(selected.comments ?? []).map((c) => (
                <li key={c.id} className="rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{c.author.name}</div>
                  <div className="mt-1 text-gray-900 dark:text-white">{c.text}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </NewsLayout>
  );
}


