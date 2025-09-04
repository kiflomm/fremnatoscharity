import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Newspaper, Heart } from 'lucide-react';

type Props = {
  stats: { totalStories: number; totalNewsPosts: number };
};

export default function EditorDashboard({ stats }: Props) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Editor', href: '/editor/dashboard' }]}> 
      <Head title="Editor Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Editor Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stories</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStories}</div>
              <p className="text-xs text-muted-foreground">Total stories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">News Posts</CardTitle>
              <Newspaper className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNewsPosts}</div>
              <p className="text-xs text-muted-foreground">Total news posts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}


