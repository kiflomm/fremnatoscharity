import NewsManager from '@/pages/_shared/news-manager';

export default function EditorNews({ posts, totalPosts }: { posts: any[]; totalPosts: number }) {
  return (
    <NewsManager
      mode="editor"
      breadcrumbs={[{ title: 'Editor', href: '/editor/dashboard' }, { title: 'News', href: '/editor/news' }]}
      headTitle="Editor - News"
      headerTitle="News"
      headerSubtitle="Review and manage news posts"
      listTitle="News"
      listDescription="Manage news and announcements"
      basePath="/editor"
      posts={posts as any}
      totalPosts={totalPosts}
      canCreate={true}
      canEdit={true}
      canArchive={true}
      canDelete={true}
    />
  );
}


