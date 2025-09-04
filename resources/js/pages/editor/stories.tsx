import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Heart } from 'lucide-react';

type Story = {
  id: number;
  title: string;
  content: string;
  beneficiary_name: string;
  status: string;
  author: { name: string; email: string };
  created_at?: string;
  updated_at?: string;
  comments_count: number;
};

type Props = { stories: Story[]; totalStories: number };

export default function EditorStories({ stories, totalStories }: Props) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Editor', href: '/editor/dashboard' }, { title: 'Stories', href: '/editor/stories' }]}> 
      <Head title="Editor - Stories" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stories</h1>
            <p className="text-muted-foreground">Review and manage stories</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStories}</div>
              <p className="text-xs text-muted-foreground">All stories</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stories</CardTitle>
            <CardDescription>Latest beneficiary stories</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {stories.map((s) => (
                <li key={s.id} className="rounded border p-4">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-muted-foreground">By {s.author.name}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


