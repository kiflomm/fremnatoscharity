import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Calendar, Heart, MessageSquare, User } from 'lucide-react';
import AttachmentsCarousel from '@/components/news/AttachmentsCarousel';

type Comment = {
    id: number;
    text: string;
    author: { id: number | null; name: string };
    createdAt?: string | null;
};

type Story = {
    id: number;
    title: string;
    description: string;
    attachments: {
        images: Array<{ url: string; width?: number | null; height?: number | null; order: number }>;
        videos: Array<{ embedUrl: string; provider: string; order: number }>;
    };
    likesCount: number;
    createdAt?: string | null;
    comments: Comment[];
};

type PageProps = { story: Story };

export default function AdminStoryShow() {
    const { props } = usePage<PageProps>();
    const { story } = props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Stories', href: '/admin/stories' }, { title: story.title, href: `/admin/stories/${story.id}` }]}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 max-w-5xl">
                <article className="rounded-2xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
                    <AttachmentsCarousel
                        title={story.title}
                        images={story.attachments.images}
                        videos={story.attachments.videos}
                    />

                    <div className="p-6 sm:p-8">
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">{story.title}</h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-6">
                            {story.createdAt ? (
                                <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                </div>
                            ) : null}
                            <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                <span>{story.comments.length} comments</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-muted-foreground">
                                <Heart className="h-4 w-4" />
                                <span>{story.likesCount} likes</span>
                            </div>
                        </div>

                        <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: story.description }} />
                    </div>
                </article>

                <section>
                    <div className="rounded-2xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm p-6 sm:p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center tracking-tight"><MessageSquare className="h-5 w-5 mr-2" /> Comments</h2>
                        {story.comments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No comments yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {story.comments.map((c) => (
                                    <div key={c.id} className="group flex items-start gap-3 p-3 border rounded-xl bg-background/40 hover:bg-background/70 transition-colors">
                                        <div className="w-9 h-9 bg-gradient-to-b from-muted to-muted/70 rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-border">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">{c.author.name}</span>
                                                {c.createdAt ? <span className="text-xs">{new Date(c.createdAt).toLocaleDateString()}</span> : null}
                                            </div>
                                            <p className="text-sm mt-1 break-words leading-relaxed">{c.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}


