import { Link, usePage } from '@inertiajs/react';
import React from 'react';

type NewsItem = {
  id: number;
  title: string;
  description: string;
  attachmentType: 'image' | 'video' | 'none';
  attachmentUrl?: string | null;
  commentsCount: number;
  likesCount: number;
  createdAt?: string | null;
};

type PageProps = {
  news: {
    data: NewsItem[];
    links: { url: string | null; label: string; active: boolean }[];
  };
};

export default function NewsIndex() {
  const { props } = usePage<PageProps>();
  const items = props.news?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">News</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => (
          <li key={n.id} className="rounded border p-4 hover:shadow">
            <Link href={route('public.news.show', { news: n.id })} className="block">
              <h2 className="text-lg font-medium line-clamp-2">{n.title}</h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{n.description}</p>
              <div className="mt-3 text-xs text-gray-500 flex gap-3">
                <span>{n.commentsCount} comments</span>
                <span>{n.likesCount} likes</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


