import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Calendar, Heart, MessageSquare, Trash2, User } from 'lucide-react';

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
                <Link href="/admin/news" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
                </Link>

                <article className="bg-background border rounded-lg overflow-hidden">
                    {(news.attachmentType === 'image' && news.attachmentUrl) ? (
                        <div className="aspect-video bg-muted overflow-hidden">
                            <img src={news.attachmentUrl} alt={news.title} className="w-full h-full object-cover" />
                        </div>
                    ) : null}
                    {(news.attachmentType === 'video' && news.attachmentUrl) ? (
                        <div className="aspect-video bg-black">
                            <video src={news.attachmentUrl} controls className="w-full h-full object-contain" />
                        </div>
                    ) : null}

                    <div className="p-6 sm:p-8">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-4">{news.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                            {news.createdAt ? (
                                <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />{new Date(news.createdAt).toLocaleDateString()}</div>
                            ) : null}
                            <div className="flex items-center"><MessageSquare className="h-4 w-4 mr-2" />{news.comments.length} comments</div>
                            <div className="flex items-center"><Heart className="h-4 w-4 mr-2" />{news.likesCount} likes</div>
                        </div>

                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.description }} />
                    </div>
                </article>

                <section>
                    <div className="bg-background border rounded-lg p-6 sm:p-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><MessageSquare className="h-5 w-5 mr-2" /> Manage Comments</h2>
                        {news.comments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No comments yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {news.comments.map((c) => (
                                    <div key={c.id} className="flex items-start gap-3 p-3 border rounded-md">
                                        <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">{c.author.name}</span>
                                                {c.createdAt ? <span>{new Date(c.createdAt).toLocaleDateString()}</span> : null}
                                            </div>
                                            <p className="text-sm mt-1 break-words">{c.text}</p>
                                        </div>
                                        <button
                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                                            onClick={() => router.delete(`/admin/news/${news.id}/comments/${c.id}`)}
                                        >
                                            <Trash2 className="h-4 w-4" /> Delete
                                        </button>
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


