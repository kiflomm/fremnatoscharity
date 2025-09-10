import { usePage } from '@inertiajs/react'; 
import NewsLayout from '@/layouts/NewsLayout';
import { Calendar, MessageSquare, Heart, Newspaper } from 'lucide-react';
import AttachmentsCarousel from '@/components/news/AttachmentsCarousel';
import { useEffect, useState } from 'react';

type Item = {
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

type PageProps = {
  category: 'elders' | 'childrens' | 'disabled';
  stories: {
    data: Item[];
    links: { url: string | null; label: string; active: boolean }[];
  };
};

export default function StoriesByCategory() {
  const { props } = usePage<PageProps>();
  const items = props.stories?.data ?? [];
  const [selectedId, setSelectedId] =useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    if (items.length > 0 && !selectedId && window.innerWidth >= 1024) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selected = selectedId ? items.find(i => i.id === selectedId) : null;

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
    </NewsLayout>
  );
}


