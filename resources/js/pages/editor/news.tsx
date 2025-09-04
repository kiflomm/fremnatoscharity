import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Newspaper } from 'lucide-react';

type Post = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  author: { name: string; email: string };
  created_at?: string;
  updated_at?: string;
  comments_count: number;
};

type Props = { posts: Post[]; totalPosts: number };

export default function EditorNews({ posts, totalPosts }: Props) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Editor', href: '/editor/dashboard' }, { title: 'News', href: '/editor/news' }]}> 
      <Head title="Editor - News" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">News</h1>
            <p className="text-muted-foreground">Review and manage news posts</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">All posts</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Latest news posts</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.id} className="rounded border p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-muted-foreground">By {p.author.name}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


