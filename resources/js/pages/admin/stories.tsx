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
import { Newspaper, Search, MoreHorizontal, Plus, Calendar, User, MessageSquare, Heart, Image as ImageIcon, Upload, Trash2, ArrowUp, ArrowDown, Video, PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Stories',
        href: '/admin/stories',
    },
];

interface StoryPost {
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
    category: 'elders' | 'childrens' | 'disabled';
    attachments?: {
        images: { id: number; url: string; order: number }[];
        videos: { id: number; embedUrl: string; provider: string; order: number }[];
    };
}

interface AdminStoriesProps {
    posts: StoryPost[];
    totalPosts: number;
}

export default function AdminStories({ posts, totalPosts }: AdminStoriesProps) {
    const safePosts = Array.isArray(posts) ? posts : [];
    const safeTotalPosts = typeof totalPosts === 'number' ? totalPosts : safePosts.length;
    const [openCreate, setOpenCreate] = useState(false);
    const [editStoryId, setEditStoryId] = useState<number | null>(null);
    const [deleteStoryId, setDeleteStoryId] = useState<number | null>(null);
    const [archiveStoryId, setArchiveStoryId] = useState<number | null>(null);
    const [unarchiveStoryId, setUnarchiveStoryId] = useState<number | null>(null);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<{
        story_title: string;
        story_description: string;
        category: 'elders' | 'childrens' | 'disabled' | '';
        images?: string;
    }>({
        story_title: '',
        story_description: '',
        category: '' as any,
    });
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImageIds, setExistingImageIds] = useState<number[]>([]);
    const [existingImagePreviews, setExistingImagePreviews] = useState<string[]>([]);
    const [videos, setVideos] = useState<string[]>([]);

    const canSubmit = useMemo(() => {
        const baseValid = data.story_title?.trim()?.length > 0 && data.story_description?.trim()?.length > 0 && !!data.category;
        return Boolean(baseValid);
    }, [data]);

    const closeCreate = () => {
        setOpenCreate(false);
        clearErrors();
        reset('story_title', 'story_description', 'category');
        setImages([]);
        setImagePreviews([]);
        setVideos([]);
    };

    // Client-side search
    const [query, setQuery] = useState('');
    const filteredPosts = useMemo(() => {
        if (!query.trim()) return safePosts;
        const q = query.toLowerCase();
        return safePosts.filter(post => 
            post.title.toLowerCase().includes(q) || 
            post.content.toLowerCase().includes(q) || 
            (post.author?.name || '').toLowerCase().includes(q) ||
            post.category.toLowerCase().includes(q)
        );
    }, [safePosts, query]);
    

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Stories" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Stories Management</h1>
                        <p className="text-muted-foreground">Manage stories</p>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => setOpenCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add story
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeTotalPosts}</div>
                            <p className="text-xs text-muted-foreground">All stories</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Stories List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stories</CardTitle>
                        <CardDescription>
                            Manage beneficiary impact stories
                        </CardDescription>
                        <div className="flex items-center gap-2 max-sm:flex-col sm:justify-between">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title, content, author, category..."
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
                                <div className="text-sm text-muted-foreground p-4 border rounded-md">No stories match your search.</div>
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
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {post.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {truncateText(post.excerpt || post.content, 150)}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <User className="mr-1 h-3 w-3" />
                                                    {post.author?.name || 'Unknown'}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {post.published_at 
                                                        ? new Date(post.published_at).toLocaleDateString()
                                                        : new Date(post.created_at).toLocaleDateString()
                                                    }
                                                </div>
                                                <div className="flex items-center">
                                                    <Heart className="mr-1 h-3 w-3" />
                                                    {post.likes_count ?? 0} likes
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageSquare className="mr-1 h-3 w-3" />
                                                    {post.comments_count} comments
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mobile actions */}
                                    <div className="flex sm:hidden w-full justify-around">
                                        <Button variant="outline" size="sm" onClick={() => router.get(`/admin/stories/${post.id}`)}>View</Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditStoryId(post.id);
                                                setData({
                                                    ...data,
                                                    story_title: post.title,
                                                    story_description: post.content,
                                                    category: post.category,
                                                });
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
                                        {post.archived ? (
                                            <Button variant="outline" size="sm" onClick={() => setUnarchiveStoryId(post.id)}>Unarchive</Button>
                                        ) : (
                                            <Button variant="outline" size="sm" onClick={() => setArchiveStoryId(post.id)}>Archive</Button>
                                        )}
                                        <Button variant="destructive" size="sm" onClick={() => setDeleteStoryId(post.id)}>Delete</Button>
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
                                                <DropdownMenuItem onClick={() => router.get(`/admin/stories/${post.id}`)}>View Story</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditStoryId(post.id);
                                                        setData({
                                                            ...data,
                                                            story_title: post.title,
                                                            story_description: post.content,
                                                            category: post.category,
                                                        });
                                                        const sortedImages = (post.attachments?.images ?? []).slice().sort((a,b)=>a.order-b.order);
                                                        setExistingImageIds(sortedImages.map(i => i.id));
                                                        setExistingImagePreviews(sortedImages.map(i => i.url));
                                                        setImagePreviews([]);
                                                        setImages([]);
                                                        setVideos((post.attachments?.videos ?? []).slice().sort((a,b)=>a.order-b.order).map(v => v.embedUrl));
                                                    }}
                                                >
                                                    Edit Story
                                                </DropdownMenuItem>
                                                {post.archived ? (
                                                    <DropdownMenuItem onClick={() => setUnarchiveStoryId(post.id)}>Unarchive Story</DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => setArchiveStoryId(post.id)}>Archive Story</DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteStoryId(post.id)}>Delete Story</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Create Story Dialog */}
                <Dialog open={openCreate} onOpenChange={(open) => { if (!open) closeCreate(); else setOpenCreate(true); }}>
                    <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add story</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!canSubmit) return;
                                const form = new FormData();
                                form.append('story_title', (data as any).story_title);
                                form.append('story_description', (data as any).story_description);
                                form.append('category', (data as any).category);
                                images.forEach((file, idx) => {
                                    form.append('images[]', file);
                                });
                                images.forEach((_, idx) => {
                                    form.append('images_order[]', String(idx));
                                });
                                videos.forEach((url, idx) => {
                                    form.append('videos[]', url);
                                });
                                videos.forEach((_, idx) => {
                                    form.append('videos_order[]', String(idx));
                                });
                                router.post('/admin/stories', form, {
                                    onSuccess: () => {
                                        closeCreate();
                                        router.reload({ only: ['posts', 'totalPosts'] });
                                    },
                                });
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="story-title">Title</Label>
                                <Input
                                    id="story-title"
                                    value={data.story_title}
                                    onChange={(e) => setData('story_title', e.target.value)}
                                    placeholder="Enter a concise title"
                                    required
                                />
                                {errors.story_title ? (
                                    <p className="text-xs text-red-600">{errors.story_title}</p>
                                ) : null}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-content">Content</Label>
                                <Textarea
                                    id="story-content"
                                    value={data.story_description}
                                    onChange={(e) => setData('story_description', e.target.value)}
                                    placeholder="Write the story content..."
                                    rows={6}
                                    required
                                />
                                {errors.story_description ? (
                                    <p className="text-xs text-red-600">{errors.story_description}</p>
                                ) : null}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-category">Category</Label>
                                <select
                                    id="story-category"
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value as any)}
                                    required
                                >
                                    <option value="" disabled>Select category</option>
                                    <option value="elders">elders</option>
                                    <option value="childrens">childrens</option>
                                    <option value="disabled">disabled</option>
                                </select>
                                {errors.category ? (
                                    <p className="text-xs text-red-600">{String(errors.category)}</p>
                                ) : null}
                            </div>
                            {/* Attachments */}
                            <div className="space-y-8">
                                {/* Images */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        <Label className="m-0">Images</Label>
                                        <span className="text-xs text-muted-foreground">Upload one or more images</span>
                                    </div>
                                    <div
                                        className="rounded-lg border border-dashed p-4 text-center hover:bg-muted/30 transition cursor-pointer"
                                        onClick={() => {
                                            const el = document.getElementById('story-images-input') as HTMLInputElement | null;
                                            el?.click();
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <Upload className="h-4 w-4" />
                                            <span className="text-sm">Click to choose files</span>
                                        </div>
                                        <input
                                            id="story-images-input"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (files.length === 0) return;
                                                setImages(prev => [...prev, ...files]);
                                                const newPreviews = files.map(f => URL.createObjectURL(f));
                                                setImagePreviews(prev => [...prev, ...newPreviews]);
                                            }}
                                        />
                                    </div>
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {imagePreviews.map((src, idx) => (
                                                <div key={idx} className="relative group border rounded-lg overflow-hidden">
                                                    <img src={src} alt={`preview-${idx}`} className="w-full h-32 object-cover" />
                                                    <div className="absolute left-2 top-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white">{idx + 1}</div>
                                                    <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                                                        <div className="flex gap-1">
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx <= 0) return;
                                                                setImages(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx - 1, 0, it);
                                                                    return copy;
                                                                });
                                                                setImagePreviews(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx - 1, 0, it);
                                                                    return copy;
                                                                });
                                                            }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx >= images.length - 1) return;
                                                                setImages(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx + 1, 0, it);
                                                                    return copy;
                                                                });
                                                                setImagePreviews(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx + 1, 0, it);
                                                                    return copy;
                                                                });
                                                            }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => {
                                                            setImages(prev => prev.filter((_, i) => i !== idx));
                                                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                                                        }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.images && (
                                        <p className="text-xs text-red-600">{String(errors.images)}</p>
                                    )}
                                </div>

                                {/* Videos */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4 text-muted-foreground" />
                                        <Label className="m-0">YouTube videos</Label>
                                        <span className="text-xs text-muted-foreground">Paste one or more URLs</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://youtube.com/watch?v=..."
                                            onKeyDown={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = target.value.trim();
                                                    if (val) {
                                                        setVideos(prev => [...prev, val]);
                                                        target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="secondary" onClick={(e) => {
                                            const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                            if (input && 'value' in input) {
                                                const val = (input as HTMLInputElement).value.trim();
                                                if (val) {
                                                    setVideos(prev => [...prev, val]);
                                                    (input as HTMLInputElement).value = '';
                                                }
                                            }
                                        }}>
                                            <PlusCircle className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                    {videos.length > 0 && (
                                        <div className="space-y-2 mt-1">
                                            {videos.map((url, idx) => (
                                                <div key={idx} className="flex items-center gap-2 border rounded-md p-2">
                                                    <div className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted">{idx + 1}</div>
                                                    <div className="flex-1 truncate text-sm" title={url}>{url}</div>
                                                    <div className="flex gap-1">
                                                        <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                            if (idx <= 0) return;
                                                            setVideos(prev => {
                                                                const copy = [...prev];
                                                                const [it] = copy.splice(idx, 1);
                                                                copy.splice(idx - 1, 0, it);
                                                                return copy;
                                                            });
                                                        }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                        <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                            if (idx >= videos.length - 1) return;
                                                            setVideos(prev => {
                                                                const copy = [...prev];
                                                                const [it] = copy.splice(idx, 1);
                                                                copy.splice(idx + 1, 0, it);
                                                                return copy;
                                                            });
                                                        }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => setVideos(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={closeCreate} disabled={processing}>Cancel</Button>
                                <Button type="submit" disabled={!canSubmit || processing}>{processing ? 'Creating...' : 'Create story'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Story AlertDialog */}
                <AlertDialog open={deleteStoryId !== null} onOpenChange={(open) => { if (!open) setDeleteStoryId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this story?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the story and its related data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteStoryId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (deleteStoryId === null) return;
                                    router.delete(`/admin/stories/${deleteStoryId}`, {
                                        onSuccess: () => {
                                            setDeleteStoryId(null);
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
                {/* Edit Story Dialog */}
                <Dialog open={editStoryId !== null} onOpenChange={(open) => { if (!open) setEditStoryId(null); }}>
                    <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit story</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (editStoryId === null) return;
                                if (!data.story_title.trim() || !data.story_description.trim() || !data.category) return;
                                const form = new FormData();
                                form.append('_method', 'put');
                                form.append('story_title', data.story_title);
                                form.append('story_description', data.story_description);
                                form.append('category', data.category);
                                form.append('existing_images_provided', '1');
                                existingImageIds.forEach((id) => form.append('existing_image_ids[]', String(id)));
                                existingImageIds.forEach((_, idx) => form.append('existing_images_order[]', String(idx)));
                                images.forEach((file, idx) => {
                                    form.append('images[]', file);
                                    form.append('images_order[]', String(idx));
                                });
                                form.append('replace_videos', '1');
                                videos.forEach((url, idx) => {
                                    form.append('videos[]', url);
                                    form.append('videos_order[]', String(idx));
                                });
                                router.post(`/admin/stories/${editStoryId}`, form, {
                                    onSuccess: () => {
                                        setEditStoryId(null);
                                        router.reload({ only: ['posts'] });
                                    },
                                });
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="story-title-edit">Title</Label>
                                <Input id="story-title-edit" value={data.story_title} onChange={(e) => setData('story_title', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-content-edit">Content</Label>
                                <Textarea id="story-content-edit" value={data.story_description} onChange={(e) => setData('story_description', e.target.value)} rows={6} required />
                            </div>
                                <div className="space-y-2">
                                <Label htmlFor="story-category-edit">Category</Label>
                                    <select
                                    id="story-category-edit"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value as any)}
                                        required
                                    >
                                    <option value="" disabled>Select category</option>
                                    <option value="elders">elders</option>
                                    <option value="childrens">childrens</option>
                                    <option value="disabled">disabled</option>
                                    </select>
                            </div>
                            {/* Attachments (optional replace) */}
                            <div className="space-y-8">
                                <div className="text-xs text-muted-foreground">Add images or videos to replace existing attachments. Leave empty to keep current attachments.</div>
                                {/* Images */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        <Label className="m-0">Images</Label>
                                        <span className="text-xs text-muted-foreground">Upload one or more images</span>
                                    </div>
                                    <div
                                        className="rounded-lg border border-dashed p-4 text-center hover:bg-muted/30 transition cursor-pointer"
                                        onClick={() => {
                                            const el = document.getElementById('story-images-input-edit') as HTMLInputElement | null;
                                            el?.click();
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <Upload className="h-4 w-4" />
                                            <span className="text-sm">Click to choose files</span>
                                        </div>
                                        <input
                                            id="story-images-input-edit"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (files.length === 0) return;
                                                setImages(prev => [...prev, ...files]);
                                                const newPreviews = files.map(f => URL.createObjectURL(f));
                                                setImagePreviews(prev => [...prev, ...newPreviews]);
                                            }}
                                        />
                                    </div>
                                    {existingImagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {existingImagePreviews.map((src, idx) => (
                                                <div key={`edit-${idx}`} className="relative group border rounded-lg overflow-hidden">
                                                    <img src={src} alt={`preview-${idx}`} className="w-full h-32 object-cover" />
                                                    <div className="absolute left-2 top-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white">{idx + 1}</div>
                                                    <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                                                        <div className="flex gap-1">
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx <= 0) return;
                                                                setExistingImagePreviews(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx - 1, 0, it);
                                                                    return copy;
                                                                });
                                                                setExistingImageIds(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx - 1, 0, it);
                                                                    return copy;
                                                                });
                                                            }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx >= existingImagePreviews.length - 1) return;
                                                                setExistingImagePreviews(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx + 1, 0, it);
                                                                    return copy;
                                                                });
                                                                setExistingImageIds(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx + 1, 0, it);
                                                                    return copy;
                                                                });
                                                            }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => {
                                                            setExistingImagePreviews(prev => prev.filter((_, i) => i !== idx));
                                                            setExistingImageIds(prev => prev.filter((_, i) => i !== idx));
                                                        }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {imagePreviews.map((src, idx) => (
                                                <div key={`new-${idx}`} className="relative group border rounded-lg overflow-hidden">
                                                    <img src={src} alt={`new-preview-${idx}`} className="w-full h-32 object-cover" />
                                                    <div className="absolute left-2 top-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white">{idx + 1 + existingImagePreviews.length}</div>
                                                    <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                                                        <div className="flex gap-1">
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx <= 0) return;
                                                                setImages(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx - 1, 0, it);
                                                                    return copy;
                                                                });
                                                                setImagePreviews(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx - 1, 0, it);
                                                                    return copy;
                                                                });
                                                            }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                            <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                                if (idx >= images.length - 1) return;
                                                                setImages(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx + 1, 0, it);
                                                                    return copy;
                                                                });
                                                                setImagePreviews(prev => {
                                                                    const copy = [...prev];
                                                                    const [it] = copy.splice(idx, 1);
                                                                    copy.splice(idx + 1, 0, it);
                                                                    return copy;
                                                                });
                                                            }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => {
                                                            setImages(prev => prev.filter((_, i) => i !== idx));
                                                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                                                        }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.images && (
                                        <p className="text-xs text-red-600">{String(errors.images)}</p>
                                    )}
                                </div>

                                {/* Videos */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4 text-muted-foreground" />
                                        <Label className="m-0">YouTube videos</Label>
                                        <span className="text-xs text-muted-foreground">Paste one or more URLs</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://youtube.com/watch?v=..."
                                            onKeyDown={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = target.value.trim();
                                                    if (val) {
                                                        setVideos(prev => [...prev, val]);
                                                        target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="secondary" onClick={(e) => {
                                            const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                            if (input && 'value' in input) {
                                                const val = (input as HTMLInputElement).value.trim();
                                                if (val) {
                                                    setVideos(prev => [...prev, val]);
                                                    (input as HTMLInputElement).value = '';
                                                }
                                            }
                                        }}>
                                            <PlusCircle className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                    {videos.length > 0 && (
                                        <div className="space-y-2 mt-1">
                                            {videos.map((url, idx) => (
                                                <div key={`edit-${idx}`} className="flex items-center gap-2 border rounded-md p-2">
                                                    <div className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted">{idx + 1}</div>
                                                    <div className="flex-1 truncate text-sm" title={url}>{url}</div>
                                                    <div className="flex gap-1">
                                                        <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                            if (idx <= 0) return;
                                                            setVideos(prev => {
                                                                const copy = [...prev];
                                                                const [it] = copy.splice(idx, 1);
                                                                copy.splice(idx - 1, 0, it);
                                                                return copy;
                                                            });
                                                        }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                                        <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => {
                                                            if (idx >= videos.length - 1) return;
                                                            setVideos(prev => {
                                                                const copy = [...prev];
                                                                const [it] = copy.splice(idx, 1);
                                                                copy.splice(idx + 1, 0, it);
                                                                return copy;
                                                            });
                                                        }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => setVideos(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setEditStoryId(null)}>Cancel</Button>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
