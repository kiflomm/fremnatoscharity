import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Calendar, Heart, MessageSquare, Trash2, User } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Comment = {
    id: number;
    text: string;
    author: { id: number | null; name: string };
    createdAt?: string | null;
};

type News = {
    id: number;
    title: string;
    description: string;
    attachmentType: 'image' | 'video' | 'none';
    attachmentUrl?: string | null;
    likesCount: number;
    createdAt?: string | null;
    comments: Comment[];
};

type PageProps = { news: News };

export default function AdminNewsShow() {
    const { props } = usePage<PageProps>();
    const { news } = props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'News', href: '/admin/news' }, { title: news.title, href: `/admin/news/${news.id}` }]}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 max-w-5xl">
                <article className="rounded-2xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
                    {(news.attachmentType === 'image' && news.attachmentUrl) ? (
                        <div className="aspect-video bg-muted overflow-hidden">
                            <img src={news.attachmentUrl} alt={news.title} className="w-full h-full object-cover" />
                        </div>
                    ) : null}
                    {(news.attachmentType === 'video' && news.attachmentUrl) ? (
                        <div className="aspect-video bg-black">
                            <iframe
                                src={news.attachmentUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen={true}
                                referrerPolicy="strict-origin-when-cross-origin"
                                loading="lazy"
                                title="YouTube video player"
                            />
                        </div>
                    ) : null}

                    <div className="p-6 sm:p-8">
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">{news.title}</h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-6">
                            {news.createdAt ? (
                                <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                                </div>
                            ) : null}
                            <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                <span>{news.comments.length} comments</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-muted-foreground">
                                <Heart className="h-4 w-4" />
                                <span>{news.likesCount} likes</span>
                            </div>
                        </div>

                        <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: news.description }} />
                    </div>
                </article>

                <section>
                    <div className="rounded-2xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm p-6 sm:p-8">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center tracking-tight"><MessageSquare className="h-5 w-5 mr-2" /> Manage Comments</h2>
                        {news.comments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No comments yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {news.comments.map((c) => (
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
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-medium transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. The comment will be permanently removed.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => router.delete(`/admin/news/${news.id}/comments/${c.id}`)}>
                                                        Confirm Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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


