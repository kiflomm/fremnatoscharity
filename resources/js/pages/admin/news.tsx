import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Newspaper, Search, MoreHorizontal, Plus, Calendar, User, MessageSquare, Heart } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'News',
        href: '/admin/news',
    },
];

interface NewsPost {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    author: {
        name: string;
        email: string;
        avatar?: string;
    };
    created_at: string;
    updated_at: string;
    published_at?: string;
    comments_count: number;
    likes_count?: number;
    featured_image?: string;
    archived: boolean;
    status: string;
}

interface AdminNewsProps {
    posts: NewsPost[];
    totalPosts: number;
}

export default function AdminNews({ posts, totalPosts }: AdminNewsProps) {
    const [openCreate, setOpenCreate] = useState(false);
    const [editNewsId, setEditNewsId] = useState<number | null>(null);
    const [deleteNewsId, setDeleteNewsId] = useState<number | null>(null);
    const [archiveNewsId, setArchiveNewsId] = useState<number | null>(null);
    const [unarchiveNewsId, setUnarchiveNewsId] = useState<number | null>(null);
    const [query, setQuery] = useState('');
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        news_title: '',
        news_description: '',
        attachment_type: 'none' as 'image' | 'video' | 'none',
        attachment_url: '',
    });

    const canSubmit = useMemo(() => {
        const baseValid = data.news_title.trim().length > 0 && data.news_description.trim().length > 0;
        const needsUrl = data.attachment_type === 'image' || data.attachment_type === 'video';
        return needsUrl ? baseValid && data.attachment_url.trim().length > 0 : baseValid;
    }, [data]);

    const filteredPosts = useMemo(() => {
        if (!query.trim()) return posts;
        const q = query.toLowerCase();
        return posts.filter(post => 
            post.title.toLowerCase().includes(q) || 
            post.content.toLowerCase().includes(q) || 
            post.author.name.toLowerCase().includes(q)
        );
    }, [posts, query]);

    const closeCreate = () => {
        setOpenCreate(false);
        clearErrors();
        reset('news_title', 'news_description', 'attachment_type', 'attachment_url');
    };
    

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - News" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
                        <p className="text-muted-foreground">
                            Manage news and announcements
                        </p>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => setOpenCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add news
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total News</CardTitle>
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPosts}</div>
                            <p className="text-xs text-muted-foreground">
                                All news
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Posts List */}
                <Card>
                    <CardHeader>
                        <CardTitle>News</CardTitle>
                        <CardDescription>
                            Manage news and announcements
                        </CardDescription>
                        <div className="flex items-center gap-2 max-sm:flex-col sm:justify-between">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title, content, author..."
                                    className="pl-8 w-full sm:w-[300px]"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredPosts.length === 0 ? (
                                <div className="text-sm text-muted-foreground p-4 border rounded-md">No news match your search.</div>
                            ) : null}
                            {filteredPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-medium text-lg">{post.title}</h3>
                                                {post.archived && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        Archived
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {truncateText(post.excerpt || post.content, 150)}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <User className="mr-1 h-3 w-3" />
                                                    {post.author.name}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {post.published_at 
                                                        ? new Date(post.published_at).toLocaleDateString()
                                                        : new Date(post.created_at).toLocaleDateString()
                                                    }
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageSquare className="mr-1 h-3 w-3" />
                                                    {post.comments_count} comments
                                                </div>
                                                <div className="flex items-center">
                                                    <Heart className="mr-1 h-3 w-3" />
                                                    {post.likes_count ?? 0} likes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mobile actions */}
                                    <div className="flex sm:hidden w-full justify-around">
                                        <Button variant="outline" size="sm" onClick={() => router.get(`/admin/news/${post.id}`)}>View</Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditNewsId(post.id);
                                                setData({
                                                    ...data,
                                                    news_title: post.title,
                                                    news_description: post.content,
                                                    attachment_type: (post.featured_image ? 'image' : 'none') as 'image' | 'video' | 'none',
                                                    attachment_url: post.featured_image ?? '',
                                                });
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        {post.archived ? (
                                            <Button variant="outline" size="sm" onClick={() => setUnarchiveNewsId(post.id)}>Unarchive</Button>
                                        ) : (
                                            <Button variant="outline" size="sm" onClick={() => setArchiveNewsId(post.id)}>Archive</Button>
                                        )}
                                        <Button variant="destructive" size="sm" onClick={() => setDeleteNewsId(post.id)}>Delete</Button>
                                    </div>
                                    {/* Desktop actions */}
                                    <div className="hidden sm:block">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.get(`/admin/news/${post.id}`)}>View News</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditNewsId(post.id);
                                                        setData({
                                                            ...data,
                                                            news_title: post.title,
                                                            news_description: post.content,
                                                            attachment_type: (post.featured_image ? 'image' : 'none') as 'image' | 'video' | 'none',
                                                            attachment_url: post.featured_image ?? '',
                                                        });
                                                    }}
                                                >
                                                    Edit News
                                                </DropdownMenuItem>
                                                {post.archived ? (
                                                    <DropdownMenuItem onClick={() => setUnarchiveNewsId(post.id)}>Unarchive News</DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => setArchiveNewsId(post.id)}>Archive News</DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteNewsId(post.id)}>Delete News</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Create News Dialog */}
                <Dialog open={openCreate} onOpenChange={(open) => { if (!open) closeCreate(); else setOpenCreate(true); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add news</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!canSubmit) return;
                                post('/admin/news', {
                                    onSuccess: () => {
                                        closeCreate();
                                        router.reload({ only: ['posts', 'totalPosts'] });
                                    },
                                });
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="news-title">Title</Label>
                                <Input
                                    id="news-title"
                                    value={data.news_title}
                                    onChange={(e) => setData('news_title', e.target.value)}
                                    placeholder="Enter a concise title"
                                    required
                                />
                                {errors.news_title ? (
                                    <p className="text-xs text-red-600">{errors.news_title}</p>
                                ) : null}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="news-content">Content</Label>
                                <Textarea
                                    id="news-content"
                                    value={data.news_description}
                                    onChange={(e) => setData('news_description', e.target.value)}
                                    placeholder="Write the news content..."
                                    rows={6}
                                    required
                                />
                                {errors.news_description ? (
                                    <p className="text-xs text-red-600">{errors.news_description}</p>
                                ) : null}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="attachment-type">Attachment</Label>
                                    <select
                                        id="attachment-type"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.attachment_type}
                                        onChange={(e) => setData('attachment_type', e.target.value as 'image' | 'video' | 'none')}
                                    >
                                        <option value="none">None</option>
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                    {errors.attachment_type ? (
                                        <p className="text-xs text-red-600">{errors.attachment_type}</p>
                                    ) : null}
                                </div>
                                {data.attachment_type !== 'none' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="attachment-url">Attachment URL (required)</Label>
                                        <Input
                                            id="attachment-url"
                                            value={data.attachment_url}
                                            onChange={(e) => setData('attachment_url', e.target.value)}
                                            placeholder="https://..."
                                            type="url"
                                            required
                                        />
                                        {errors.attachment_url ? (
                                            <p className="text-xs text-red-600">{errors.attachment_url}</p>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={closeCreate} disabled={processing}>Cancel</Button>
                                <Button type="submit" disabled={!canSubmit || processing}>
                                    {processing ? 'Creating...' : 'Create news'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                {/* Edit News Dialog */}
                <Dialog open={editNewsId !== null} onOpenChange={(open) => { if (!open) setEditNewsId(null); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit news</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (editNewsId === null) return;
                                const needsUrl = data.attachment_type === 'image' || data.attachment_type === 'video';
                                if (!data.news_title.trim() || !data.news_description.trim()) return;
                                if (needsUrl && !data.attachment_url.trim()) return;
                                router.put(`/admin/news/${editNewsId}`, {
                                    news_title: data.news_title,
                                    news_description: data.news_description,
                                    attachment_type: data.attachment_type,
                                    attachment_url: data.attachment_url || null,
                                }, {
                                    onSuccess: () => {
                                        setEditNewsId(null);
                                        router.reload({ only: ['posts'] });
                                    },
                                });
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="news-title-edit">Title</Label>
                                <Input
                                    id="news-title-edit"
                                    value={data.news_title}
                                    onChange={(e) => setData('news_title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="news-content-edit">Content</Label>
                                <Textarea
                                    id="news-content-edit"
                                    value={data.news_description}
                                    onChange={(e) => setData('news_description', e.target.value)}
                                    rows={6}
                                    required
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="attachment-type-edit">Attachment</Label>
                                    <select
                                        id="attachment-type-edit"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.attachment_type}
                                        onChange={(e) => setData('attachment_type', e.target.value as 'image' | 'video' | 'none')}
                                    >
                                        <option value="none">None</option>
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>
                                {data.attachment_type !== 'none' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="attachment-url-edit">Attachment URL (required)</Label>
                                        <Input
                                            id="attachment-url-edit"
                                            value={data.attachment_url}
                                            onChange={(e) => setData('attachment_url', e.target.value)}
                                            placeholder="https://..."
                                            type="url"
                                            required
                                        />
                                    </div>
                                ) : null}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setEditNewsId(null)}>Cancel</Button>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete News AlertDialog */}
                <AlertDialog open={deleteNewsId !== null} onOpenChange={(open) => { if (!open) setDeleteNewsId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this news?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the news and its related data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteNewsId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (deleteNewsId === null) return;
                                    router.delete(`/admin/news/${deleteNewsId}`, {
                                        onSuccess: () => {
                                            setDeleteNewsId(null);
                                            router.reload({ only: ['posts', 'totalPosts'] });
                                        },
                                    });
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Archive News AlertDialog */}
                <AlertDialog open={archiveNewsId !== null} onOpenChange={(open) => { if (!open) setArchiveNewsId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Archive this news?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This news will be hidden from the public news page but will remain visible in the admin dashboard with an archived label.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setArchiveNewsId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (archiveNewsId === null) return;
                                    router.post(`/admin/news/${archiveNewsId}/archive`, {}, {
                                        onSuccess: () => {
                                            setArchiveNewsId(null);
                                            router.reload({ only: ['posts', 'totalPosts'] });
                                        },
                                    });
                                }}
                            >
                                Archive
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Unarchive News AlertDialog */}
                <AlertDialog open={unarchiveNewsId !== null} onOpenChange={(open) => { if (!open) setUnarchiveNewsId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Unarchive this news?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This news will be made visible on the public news page again.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUnarchiveNewsId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (unarchiveNewsId === null) return;
                                    router.post(`/admin/news/${unarchiveNewsId}/unarchive`, {}, {
                                        onSuccess: () => {
                                            setUnarchiveNewsId(null);
                                            router.reload({ only: ['posts', 'totalPosts'] });
                                        },
                                    });
                                }}
                            >
                                Unarchive
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
