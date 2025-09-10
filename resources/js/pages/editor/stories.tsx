import StoryManager from '@/pages/_shared/story-manager';

export default function EditorStories({ stories, totalStories }: { stories: any[]; totalStories: number }) {
  return (
    <StoryManager
      mode="editor"
      breadcrumbs={[{ title: 'Editor', href: '/editor/dashboard' }, { title: 'Stories', href: '/editor/stories' }]}
      headTitle="Editor - Stories"
      headerTitle="Stories"
      headerSubtitle="Review and manage stories"
      listTitle="Stories"
      listDescription="Manage beneficiary impact stories"
      basePath="/editor"
      posts={stories as any}
      totalPosts={totalStories}
      canCreate={true}
      canEdit={true}
      canArchive={true}
      canDelete={true}
    />
  );
}


