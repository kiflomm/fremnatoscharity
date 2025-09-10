import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Newspaper, Search, MoreHorizontal, Plus, Calendar, User, MessageSquare, Heart, Image as ImageIcon, Upload, Trash2, ArrowUp, ArrowDown, Video, PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

type Mode = 'admin' | 'editor';

export interface BreadcrumbItem { title: string; href: string }

export interface NewsManagerProps {
    mode: Mode;
    breadcrumbs: BreadcrumbItem[];
    headTitle: string;
    headerTitle: string;
    headerSubtitle: string;
    listTitle: string;
    listDescription: string;
    basePath: '/admin' | '/editor';
    posts: Array<{
        id: number;
        title: string;
        content: string;
        excerpt: string;
        author: { name: string; email: string; avatar?: string };
        created_at: string;
        updated_at: string;
        published_at?: string;
        comments_count: number;
        likes_count?: number;
        featured_image?: string;
        archived: boolean;
        status: string;
        attachments?: {
            images: { id: number; url: string; order: number }[];
            videos: { id: number; embedUrl: string; provider: string; order: number }[];
        };
    }>;
    totalPosts: number;
    canCreate?: boolean;
    canEdit?: boolean;
    canArchive?: boolean;
    canDelete?: boolean;
}

export default function NewsManager({ mode, breadcrumbs, headTitle, headerTitle, headerSubtitle, listTitle, listDescription, basePath, posts, totalPosts, canCreate = true, canEdit = true, canArchive = true, canDelete = true }: NewsManagerProps) {
    const [openCreate, setOpenCreate] = useState(false);
    const [editNewsId, setEditNewsId] = useState<number | null>(null);
    const [deleteNewsId, setDeleteNewsId] = useState<number | null>(null);
    const [archiveNewsId, setArchiveNewsId] = useState<number | null>(null);
    const [unarchiveNewsId, setUnarchiveNewsId] = useState<number | null>(null);
    const [query, setQuery] = useState('');
    const { data, setData, processing, reset, errors, clearErrors } = useForm<{ news_title: string; news_description: string } & Record<string, any>>({
        news_title: '',
        news_description: '',
    });
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImageIds, setExistingImageIds] = useState<number[]>([]);
    const [existingImagePreviews, setExistingImagePreviews] = useState<string[]>([]);
    const [videos, setVideos] = useState<string[]>([]);

    const canSubmit = useMemo(() => {
        const baseValid = data.news_title?.trim()?.length > 0 && data.news_description?.trim()?.length > 0;
        return Boolean(baseValid);
    }, [data]);

    const filteredPosts = useMemo(() => {
        if (!query.trim()) return posts;
        const q = query.toLowerCase();
        return posts.filter(post => post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q) || post.author.name.toLowerCase().includes(q));
    }, [posts, query]);

    const closeCreate = () => {
        setOpenCreate(false);
        clearErrors();
        reset('news_title', 'news_description');
        setImages([]);
        setImagePreviews([]);
        setVideos([]);
    };

    const listItemViewHref = (postId: number) => `${basePath}/news/${postId}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs as any}>
            <Head title={headTitle} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{headerTitle}</h1>
                        <p className="text-muted-foreground">{headerSubtitle}</p>
                    </div>
                    {canCreate ? (
                        <Button className="w-full sm:w-auto" onClick={() => setOpenCreate(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add news
                        </Button>
                    ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total News</CardTitle>
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPosts}</div>
                            <p className="text-xs text-muted-foreground">All news</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{listTitle}</CardTitle>
                        <CardDescription>{listDescription}</CardDescription>
                        <div className="flex items-center gap-2 max-sm:flex-col sm:justify-between">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by title, content, author..." className="pl-8 w-full sm:w-[300px]" value={query} onChange={(e) => setQuery(e.target.value)} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredPosts.length === 0 ? (
                                <div className="text-sm text-muted-foreground p-4 border rounded-md">No news match your search.</div>
                            ) : null}
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-medium text-lg">{post.title}</h3>
                                                {post.archived ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Archived</span>
                                                ) : null}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{(post.excerpt || post.content).slice(0, 150)}{(post.excerpt || post.content).length > 150 ? '...' : ''}</p>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <User className="mr-1 h-3 w-3" />
                                                    {post.author.name}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}
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
                                    <div className="flex sm:hidden w-full justify-around">
                                        <Button variant="outline" size="sm" onClick={() => router.get(listItemViewHref(post.id))}>View</Button>
                                        {canEdit ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditNewsId(post.id);
                                                    (setData as any)({ ...(data as any), news_title: post.title, news_description: post.content });
                                                    const sortedImages = (post.attachments?.images ?? []).slice().sort((a,b)=>a.order-b.order);
                                                    setExistingImageIds(sortedImages.map(i => i.id));
                                                    setExistingImagePreviews(sortedImages.map(i => i.url));
                                                    setImagePreviews([]);
                                                    setImages([]);
                                                    setVideos((post.attachments?.videos ?? []).slice().sort((a,b)=>a.order-b.order).map(v => v.embedUrl));
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        ) : null}
                                        {canArchive ? (
                                            post.archived ? (
                                                <Button variant="outline" size="sm" onClick={() => setUnarchiveNewsId(post.id)}>Unarchive</Button>
                                            ) : (
                                                <Button variant="outline" size="sm" onClick={() => setArchiveNewsId(post.id)}>Archive</Button>
                                            )
                                        ) : null}
                                        {canDelete ? (<Button variant="destructive" size="sm" onClick={() => setDeleteNewsId(post.id)}>Delete</Button>) : null}
                                    </div>
                                    <div className="hidden sm:block">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.get(listItemViewHref(post.id))}>View News</DropdownMenuItem>
                                                {canEdit ? (
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditNewsId(post.id);
                                                        (setData as any)({ ...(data as any), news_title: post.title, news_description: post.content });
                                                        const sortedImages = (post.attachments?.images ?? []).slice().sort((a,b)=>a.order-b.order);
                                                        setExistingImageIds(sortedImages.map(i => i.id));
                                                        setExistingImagePreviews(sortedImages.map(i => i.url));
                                                        setImagePreviews([]);
                                                        setImages([]);
                                                        setVideos((post.attachments?.videos ?? []).slice().sort((a,b)=>a.order-b.order).map(v => v.embedUrl));
                                                    }}>Edit News</DropdownMenuItem>
                                                ) : null}
                                                {canArchive ? (post.archived ? (
                                                    <DropdownMenuItem onClick={() => setUnarchiveNewsId(post.id)}>Unarchive News</DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => setArchiveNewsId(post.id)}>Archive News</DropdownMenuItem>
                                                )) : null}
                                                {canDelete ? (<DropdownMenuItem className="text-red-600" onClick={() => setDeleteNewsId(post.id)}>Delete News</DropdownMenuItem>) : null}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {canCreate ? (
                    <Dialog open={openCreate} onOpenChange={(open) => { if (!open) closeCreate(); else setOpenCreate(true); }}>
                        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add news</DialogTitle>
                            </DialogHeader>
                            <form
                                className="space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!canSubmit) return;
                                    const form = new FormData();
                                    form.append('news_title', (data as any).news_title);
                                    form.append('news_description', (data as any).news_description);
                                    images.forEach((file) => { form.append('images[]', file); });
                                    images.forEach((_, idx) => { form.append('images_order[]', String(idx)); });
                                    videos.forEach((url) => { form.append('videos[]', url); });
                                    videos.forEach((_, idx) => { form.append('videos_order[]', String(idx)); });
                                    router.post(`${basePath}/news`, form, {
                                        onSuccess: () => {
                                            closeCreate();
                                            router.reload({ only: ['posts', 'totalPosts'] });
                                        },
                                    });
                                }}
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="news-title">Title</Label>
                                    <Input id="news-title" value={data.news_title} onChange={(e) => (setData as any)('news_title', e.target.value)} placeholder="Enter a concise title" required />
                                    {errors.news_title ? (<p className="text-xs text-red-600">{errors.news_title as any}</p>) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="news-content">Content</Label>
                                    <Textarea id="news-content" value={data.news_description} onChange={(e) => (setData as any)('news_description', e.target.value)} placeholder="Write the news content..." rows={6} required />
                                    {errors.news_description ? (<p className="text-xs text-red-600">{errors.news_description as any}</p>) : null}
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                            <Label className="m-0">Images</Label>
                                            <span className="text-xs text-muted-foreground">Upload one or more images</span>
                                        </div>
                                        <div className="rounded-lg border border-dashed p-4 text-center hover:bg-muted/30 transition cursor-pointer" onClick={() => { (document.getElementById('news-images-input') as HTMLInputElement | null)?.click(); }}>
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Upload className="h-4 w-4" />
                                                <span className="text-sm">Click to choose files</span>
                                            </div>
                                            <input id="news-images-input" type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (files.length === 0) return;
                                                setImages(prev => [...prev, ...files]);
                                                const newPreviews = files.map(f => URL.createObjectURL(f));
                                                setImagePreviews(prev => [...prev, ...newPreviews]);
                                            }} />
                                        </div>
                                        {imagePreviews.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {imagePreviews.map((src, idx) => (
                                                    <div key={idx} className="relative group border rounded-lg overflow-hidden">
                                                        <img src={src} alt={`preview-${idx}`} className="w-full h-32 object-cover" />
                                                        <div className="absolute left-2 top-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white">{idx + 1}</div>
                                                        <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                                                            <div className="flex gap-1">
                                                                <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                    if (idx <= 0) return;
                                                                    setImages(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; });
                                                                    setImagePreviews(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; });
                                                                }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                                <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                    if (idx >= images.length - 1) return;
                                                                    setImages(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; });
                                                                    setImagePreviews(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; });
                                                                }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                            </div>
                                                            <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => { setImages(prev => prev.filter((_, i) => i !== idx)); setImagePreviews(prev => prev.filter((_, i) => i !== idx)); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                        {errors.images ? (<p className="text-xs text-red-600">{String(errors.images)}</p>) : null}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Video className="h-4 w-4 text-muted-foreground" />
                                            <Label className="m-0">YouTube videos</Label>
                                            <span className="text-xs text-muted-foreground">Paste one or more URLs</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input placeholder="https://youtube.com/watch?v=..." onKeyDown={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                if ((e as any).key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = target.value.trim();
                                                    if (val) { setVideos(prev => [...prev, val]); target.value = ''; }
                                                }
                                            }} />
                                            <Button type="button" variant="secondary" onClick={(e) => {
                                                const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                                if (input && 'value' in input) {
                                                    const val = (input as HTMLInputElement).value.trim();
                                                    if (val) { setVideos(prev => [...prev, val]); (input as HTMLInputElement).value = ''; }
                                                }
                                            }}>
                                                <PlusCircle className="h-4 w-4 mr-1" /> Add
                                            </Button>
                                        </div>
                                        {videos.length > 0 ? (
                                            <div className="space-y-2 mt-1">
                                                {videos.map((url, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 border rounded-md p-2">
                                                        <div className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted">{idx + 1}</div>
                                                        <div className="flex-1 truncate text-sm" title={url}>{url}</div>
                                                        <div className="flex gap-1">
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => { if (idx <= 0) return; setVideos(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; }); }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => { if (idx >= videos.length - 1) return; setVideos(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; }); }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                            <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => setVideos(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={closeCreate} disabled={processing}>Cancel</Button>
                                    <Button type="submit" disabled={!canSubmit || processing}>{processing ? 'Creating...' : 'Create news'}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                ) : null}

                <Dialog open={editNewsId !== null} onOpenChange={(open) => { if (!open) setEditNewsId(null); }}>
                    <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit news</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (editNewsId === null) return;
                                if (!data.news_title.trim() || !data.news_description.trim()) return;
                                const form = new FormData();
                                form.append('_method', 'put');
                                form.append('news_title', data.news_title);
                                form.append('news_description', data.news_description);
                                form.append('existing_images_provided', '1');
                                existingImageIds.forEach((id) => form.append('existing_image_ids[]', String(id)));
                                existingImageIds.forEach((_, idx) => form.append('existing_images_order[]', String(idx)));
                                images.forEach((file, idx) => { form.append('images[]', file); form.append('images_order[]', String(idx)); });
                                form.append('replace_videos', '1');
                                videos.forEach((url, idx) => { form.append('videos[]', url); form.append('videos_order[]', String(idx)); });
                                router.post(`${basePath}/news/${editNewsId}`, form, {
                                    onSuccess: () => { setEditNewsId(null); router.reload({ only: ['posts'] }); },
                                });
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="news-title-edit">Title</Label>
                                <Input id="news-title-edit" value={data.news_title} onChange={(e) => (setData as any)('news_title', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="news-content-edit">Content</Label>
                                <Textarea id="news-content-edit" value={data.news_description} onChange={(e) => (setData as any)('news_description', e.target.value)} rows={6} required />
                            </div>
                            <div className="space-y-8">
                                <div className="text-xs text-muted-foreground">Add images or videos to replace existing attachments. Leave empty to keep current attachments.</div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        <Label className="m-0">Images</Label>
                                        <span className="text-xs text-muted-foreground">Upload one or more images</span>
                                    </div>
                                    <div className="rounded-lg border border-dashed p-4 text-center hover:bg-muted/30 transition cursor-pointer" onClick={() => { (document.getElementById('news-images-input-edit') as HTMLInputElement | null)?.click(); }}>
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <Upload className="h-4 w-4" />
                                            <span className="text-sm">Click to choose files</span>
                                        </div>
                                        <input id="news-images-input-edit" type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            if (files.length === 0) return;
                                            setImages(prev => [...prev, ...files]);
                                            const newPreviews = files.map(f => URL.createObjectURL(f));
                                            setImagePreviews(prev => [...prev, ...newPreviews]);
                                        }} />
                                    </div>
                                    {existingImagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {existingImagePreviews.map((src, idx) => (
                                                <div key={`edit-${idx}`} className="relative group border rounded-lg overflow-hidden">
                                                    <img src={src} alt={`preview-${idx}`} className="w-full h-32 object-cover" />
                                                    <div className="absolute left-2 top-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white">{idx + 1}</div>
                                                    <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                                                        <div className="flex gap-1">
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx <= 0) return;
                                                                setExistingImagePreviews(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; });
                                                                setExistingImageIds(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; });
                                                            }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx >= existingImagePreviews.length - 1) return;
                                                                setExistingImagePreviews(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; });
                                                                setExistingImageIds(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; });
                                                            }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => { setExistingImagePreviews(prev => prev.filter((_, i) => i !== idx)); setExistingImageIds(prev => prev.filter((_, i) => i !== idx)); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                    {imagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {imagePreviews.map((src, idx) => (
                                                <div key={`new-${idx}`} className="relative group border rounded-lg overflow-hidden">
                                                    <img src={src} alt={`new-preview-${idx}`} className="w-full h-32 object-cover" />
                                                    <div className="absolute left-2 top-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white">{idx + 1 + existingImagePreviews.length}</div>
                                                    <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                                                        <div className="flex gap-1">
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx <= 0) return;
                                                                setImages(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; });
                                                                setImagePreviews(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; });
                                                            }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx >= images.length - 1) return;
                                                                setImages(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; });
                                                                setImagePreviews(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; });
                                                            }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => { setImages(prev => prev.filter((_, i) => i !== idx)); setImagePreviews(prev => prev.filter((_, i) => i !== idx)); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                    {errors.images ? (<p className="text-xs text-red-600">{String(errors.images)}</p>) : null}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4 text-muted-foreground" />
                                        <Label className="m-0">YouTube videos</Label>
                                        <span className="text-xs text-muted-foreground">Paste one or more URLs</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input placeholder="https://youtube.com/watch?v=..." onKeyDown={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            if ((e as any).key === 'Enter') {
                                                e.preventDefault();
                                                const val = target.value.trim();
                                                if (val) { setVideos(prev => [...prev, val]); target.value = ''; }
                                            }
                                        }} />
                                        <Button type="button" variant="secondary" onClick={(e) => {
                                            const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                            if (input && 'value' in input) {
                                                const val = (input as HTMLInputElement).value.trim();
                                                if (val) { setVideos(prev => [...prev, val]); (input as HTMLInputElement).value = ''; }
                                            }
                                        }}>
                                            <PlusCircle className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                    {videos.length > 0 ? (
                                        <div className="space-y-2 mt-1">
                                            {videos.map((url, idx) => (
                                                <div key={`edit-${idx}`} className="flex items-center gap-2 border rounded-md p-2">
                                                    <div className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted">{idx + 1}</div>
                                                    <div className="flex-1 truncate text-sm" title={url}>{url}</div>
                                                    <div className="flex gap-1">
                                                        <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => { if (idx <= 0) return; setVideos(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx - 1, 0, it); return copy; }); }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                        <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => { if (idx >= videos.length - 1) return; setVideos(prev => { const copy = [...prev]; const [it] = copy.splice(idx, 1); copy.splice(idx + 1, 0, it); return copy; }); }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => setVideos(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setEditNewsId(null)}>Cancel</Button>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <AlertDialog open={deleteNewsId !== null} onOpenChange={(open) => { if (!open) setDeleteNewsId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this news?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the news and its related data.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteNewsId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { if (deleteNewsId === null) return; router.delete(`${basePath}/news/${deleteNewsId}`, { onSuccess: () => { setDeleteNewsId(null); router.reload({ only: ['posts', 'totalPosts'] }); } }); }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={archiveNewsId !== null} onOpenChange={(open) => { if (!open) setArchiveNewsId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Archive this news?</AlertDialogTitle>
                            <AlertDialogDescription>This news will be hidden from the public news page but will remain visible in the dashboard with an archived label.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setArchiveNewsId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { if (archiveNewsId === null) return; router.post(`${basePath}/news/${archiveNewsId}/archive`, {}, { onSuccess: () => { setArchiveNewsId(null); router.reload({ only: ['posts', 'totalPosts'] }); }, }); }}>Archive</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={unarchiveNewsId !== null} onOpenChange={(open) => { if (!open) setUnarchiveNewsId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Unarchive this news?</AlertDialogTitle>
                            <AlertDialogDescription>This news will be made visible on the public news page again.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUnarchiveNewsId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { if (unarchiveNewsId === null) return; router.post(`${basePath}/news/${unarchiveNewsId}/unarchive`, {}, { onSuccess: () => { setUnarchiveNewsId(null); router.reload({ only: ['posts', 'totalPosts'] }); }, }); }}>Unarchive</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}


