import { Link, useForm, usePage, router } from '@inertiajs/react';
import React from 'react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import { index, comment, like } from '@/routes/public/stories';
import { login } from '@/routes';

type Comment = {
  id: number;
  text: string;
  author: { id: number; name: string };
  createdAt?: string | null;
};

type Story = {
  id: number;
  title: string;
  description: string;
  attachmentType: 'image' | 'video' | 'none';
  attachmentUrl?: string | null;
  beneficiary: { name: string; ageGroup: string; gender: string };
  comments: Comment[];
  likesCount: number;
  isLiked: boolean;
};

type PageProps = {
  auth?: { user?: { id: number } | null };
  story: Story;
};

export default function StoryShow() {
  const { props } = usePage<PageProps>();
  const { story, auth } = props;
  const { data, setData, post, processing, reset } = useForm({ comment: '' });
  const isLoggedIn = Boolean(auth?.user);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(comment({ story: story.id }).url, {
      onSuccess: () => reset('comment'),
    });
  };

  return (
    <FixedHeaderLayout title={story.title}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href={index().url} className="text-sm text-blue-600">← Back</Link>
          <h1 className="text-2xl font-semibold mt-2">{story.title}</h1>
          <div className="text-sm text-gray-600 mt-1">
            Beneficiary: {story.beneficiary.name} ({story.beneficiary.ageGroup}, {story.beneficiary.gender})
          </div>
          <article className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: story.description }} />

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => router.post(like({ story: story.id }).url)}
              className="rounded border px-3 py-1 text-sm"
            >
              {story.isLiked ? 'Unlike' : 'Like'} ({story.likesCount})
            </button>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-medium">Comments</h2>
            {isLoggedIn ? (
              <form onSubmit={submit} className="mt-3 flex gap-2">
                <input
                  className="flex-1 rounded border px-3 py-2"
                  value={data.comment}
                  onChange={(e) => setData('comment', e.target.value)}
                  placeholder="Write a comment"
                />
                <button className="rounded bg-blue-600 text-white px-4" disabled={processing}>
                  Post
                </button>
              </form>
            ) : (
              <p className="mt-3 text-sm text-gray-600">Please <Link href={login().url} className="text-blue-600">login</Link> to comment.</p>
            )}

            <ul className="mt-4 space-y-3">
              {story.comments.map((c) => (
                <li key={c.id} className="rounded border p-3">
                  <div className="text-sm text-gray-500">{c.author.name}</div>
                  <div className="mt-1">{c.text}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </FixedHeaderLayout>
  );
}


