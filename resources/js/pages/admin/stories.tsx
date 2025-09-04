import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Heart, Search, MoreHorizontal, Plus, Calendar, User, MessageSquare } from 'lucide-react';
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

interface BeneficiaryStory {
    id: number;
    title: string;
    content: string;
    attachment_type?: 'image' | 'video' | 'none';
    attachment_url?: string | null;
    beneficiary_name: string;
    beneficiary_age_group?: 'child' | 'youth' | 'elder';
    beneficiary_gender?: 'male' | 'female';
    beneficiary_photo?: string;
    status: 'draft' | 'published' | 'archived';
    author: {
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
    comments_count: number;
    likes_count?: number;
}

interface AdminStoriesProps {
    stories: BeneficiaryStory[];
    totalStories: number;
}

export default function AdminStories({ stories, totalStories }: AdminStoriesProps) {
    const [openCreate, setOpenCreate] = useState(false);
    const [editStoryId, setEditStoryId] = useState<number | null>(null);
    const [deleteStoryId, setDeleteStoryId] = useState<number | null>(null);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        story_title: '',
        story_description: '',
        attachment_type: 'none' as 'image' | 'video' | 'none',
        attachment_url: '',
        beneficiary_name: '',
        beneficiary_age_group: '' as '' | 'child' | 'youth' | 'elder',
        beneficiary_gender: '' as '' | 'male' | 'female',
    });

    const canSubmit = useMemo(() => {
        const baseValid =
            data.story_title.trim().length > 0 &&
            data.story_description.trim().length > 0 &&
            (data.beneficiary_age_group === 'child' || data.beneficiary_age_group === 'youth' || data.beneficiary_age_group === 'elder') &&
            (data.beneficiary_gender === 'male' || data.beneficiary_gender === 'female');
        const needsUrl = data.attachment_type === 'image' || data.attachment_type === 'video';
        if (needsUrl) {
            return baseValid && data.attachment_url.trim().length > 0;
        }
        return baseValid;
    }, [data]);

    const closeCreate = () => {
        setOpenCreate(false);
        clearErrors();
        reset('story_title', 'story_description', 'attachment_type', 'attachment_url', 'beneficiary_name', 'beneficiary_age_group', 'beneficiary_gender');
    };

    // Client-side search
    const [query, setQuery] = useState('');
    const filteredStories = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return stories;
        return stories.filter((s) => {
            const inTitle = s.title?.toLowerCase().includes(q);
            const inContent = s.content?.toLowerCase().includes(q);
            const inBeneficiary = s.beneficiary_name?.toLowerCase().includes(q);
            const inAuthor = `${s.author?.name ?? ''} ${s.author?.email ?? ''}`.toLowerCase().includes(q);
            return inTitle || inContent || inBeneficiary || inAuthor;
        });
    }, [stories, query]);
    

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Beneficiary Stories" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Beneficiary Stories</h1>
                        <p className="text-muted-foreground">
                            Manage and review beneficiary impact stories
                        </p>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => setOpenCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Story
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStories}</div>
                            <p className="text-xs text-muted-foreground">
                                All beneficiary stories
                            </p>
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
                                    placeholder="Search by title, content, author, beneficiary..."
                                    className="pl-8 w-full sm:w-[300px]"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredStories.length === 0 ? (
                                <div className="text-sm text-muted-foreground p-4 border rounded-md">No stories match your search.</div>
                            ) : null}
                            {filteredStories.map((story) => (
                                <div
                                    key={story.id}
                                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={story.beneficiary_photo} alt={story.beneficiary_name} />
                                            <AvatarFallback>
                                                {story.beneficiary_name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-medium text-lg">{story.title}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {truncateText(story.content, 150)}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <User className="mr-1 h-3 w-3" />
                                                    {story.beneficiary_name}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {new Date(story.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <Heart className="mr-1 h-3 w-3" />
                                                    {story.likes_count ?? 0} likes
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageSquare className="mr-1 h-3 w-3" />
                                                    {story.comments_count} comments
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                By {story.author.name} ({story.author.email})
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mobile actions */}
                                    <div className="flex sm:hidden w-full justify-around">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/stories/${story.id}`)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditStoryId(story.id);
                                                setData({
                                                    ...data,
                                                    story_title: story.title,
                                                    story_description: story.content,
                                                    beneficiary_name: story.beneficiary_name ?? '',
                                                    attachment_type: (story.attachment_type ?? 'none') as 'image' | 'video' | 'none',
                                                    attachment_url: story.attachment_url ?? '',
                                                    beneficiary_age_group: (story.beneficiary_age_group ?? '') as '' | 'child' | 'youth' | 'elder',
                                                    beneficiary_gender: (story.beneficiary_gender ?? '') as '' | 'male' | 'female',
                                                });
                                                setOpenCreate(false);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setDeleteStoryId(story.id)}
                                        >
                                            Delete
                                        </Button>
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
                                                <DropdownMenuItem onClick={() => router.get(`/stories/${story.id}`)}>
                                                    View Story
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditStoryId(story.id);
                                                        setData({
                                                            ...data,
                                                            story_title: story.title,
                                                            story_description: story.content,
                                                            beneficiary_name: story.beneficiary_name ?? '',
                                                            attachment_type: (story.attachment_type ?? 'none') as 'image' | 'video' | 'none',
                                                            attachment_url: story.attachment_url ?? '',
                                                            beneficiary_age_group: (story.beneficiary_age_group ?? '') as '' | 'child' | 'youth' | 'elder',
                                                            beneficiary_gender: (story.beneficiary_gender ?? '') as '' | 'male' | 'female',
                                                        });
                                                        setOpenCreate(false);
                                                    }}
                                                >
                                                    Edit Story
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteStoryId(story.id)}>
                                                    Delete Story
                                                </DropdownMenuItem>
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
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Story</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!canSubmit) return;
                                post('/admin/stories', {
                                    onSuccess: () => {
                                        closeCreate();
                                        router.reload({ only: ['stories', 'totalStories'] });
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
                                    placeholder="Enter a concise, descriptive title"
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
                                    placeholder="Write the beneficiary story..."
                                    rows={6}
                                    required
                                />
                                {errors.story_description ? (
                                    <p className="text-xs text-red-600">{errors.story_description}</p>
                                ) : null}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiary-name">Beneficiary name</Label>
                                    <Input
                                        id="beneficiary-name"
                                        value={data.beneficiary_name}
                                        onChange={(e) => setData('beneficiary_name', e.target.value)}
                                        placeholder="e.g., Jane Doe"
                                    />
                                    {errors.beneficiary_name ? (
                                        <p className="text-xs text-red-600">{errors.beneficiary_name}</p>
                                    ) : null}
                                </div>
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
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="attachment-url">Attachment URL {data.attachment_type !== 'none' ? '(required)' : '(optional)'}</Label>
                                    <Input
                                        id="attachment-url"
                                        value={data.attachment_url}
                                        onChange={(e) => setData('attachment_url', e.target.value)}
                                        placeholder="https://..."
                                        type="url"
                                        required={data.attachment_type !== 'none'}
                                    />
                                    {errors.attachment_url ? (
                                        <p className="text-xs text-red-600">{errors.attachment_url}</p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiary-age-group">Beneficiary age group</Label>
                                    <select
                                        id="beneficiary-age-group"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.beneficiary_age_group}
                                        onChange={(e) => setData('beneficiary_age_group', e.target.value as 'child' | 'youth' | 'elder')}
                                        required
                                    >
                                        <option value="" disabled>Select age group</option>
                                        <option value="child">Child</option>
                                        <option value="youth">Youth</option>
                                        <option value="elder">Elder</option>
                                    </select>
                                    {errors.beneficiary_age_group ? (
                                        <p className="text-xs text-red-600">{errors.beneficiary_age_group}</p>
                                    ) : null}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="beneficiary-gender">Beneficiary gender</Label>
                                <select
                                    id="beneficiary-gender"
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.beneficiary_gender}
                                    onChange={(e) => setData('beneficiary_gender', e.target.value as 'male' | 'female')}
                                    required
                                >
                                    <option value="" disabled>Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.beneficiary_gender ? (
                                    <p className="text-xs text-red-600">{errors.beneficiary_gender}</p>
                                ) : null}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={closeCreate} disabled={processing}>Cancel</Button>
                                <Button type="submit" disabled={!canSubmit || processing}>
                                    {processing ? 'Creating...' : 'Create Story'}
                                </Button>
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
                                            router.reload({ only: ['stories', 'totalStories'] });
                                        },
                                    });
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Edit Story Dialog (schema-aligned) */}
                <Dialog open={editStoryId !== null} onOpenChange={(open) => { if (!open) setEditStoryId(null); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Story</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!editStoryId) return;
                                const needsUrl = data.attachment_type === 'image' || data.attachment_type === 'video';
                                if (!data.story_title.trim() || !data.story_description.trim()) return;
                                if (needsUrl && !data.attachment_url.trim()) return;
                                router.put(`/admin/stories/${editStoryId}`, {
                                    story_title: data.story_title,
                                    story_description: data.story_description,
                                    attachment_type: data.attachment_type,
                                    attachment_url: data.attachment_url || null,
                                    beneficiary_name: data.beneficiary_name,
                                    beneficiary_age_group: data.beneficiary_age_group,
                                    beneficiary_gender: data.beneficiary_gender,
                                }, {
                                    onSuccess: () => {
                                        setEditStoryId(null);
                                        router.reload({ only: ['stories'] });
                                    },
                                });
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="story-title-edit">Title</Label>
                                <Input
                                    id="story-title-edit"
                                    value={data.story_title}
                                    onChange={(e) => setData('story_title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-content-edit">Content</Label>
                                <Textarea
                                    id="story-content-edit"
                                    value={data.story_description}
                                    onChange={(e) => setData('story_description', e.target.value)}
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
                                <div className="space-y-2">
                                    <Label htmlFor="attachment-url-edit">Attachment URL {data.attachment_type !== 'none' ? '(required)' : '(optional)'}</Label>
                                    <Input
                                        id="attachment-url-edit"
                                        value={data.attachment_url}
                                        onChange={(e) => setData('attachment_url', e.target.value)}
                                        placeholder="https://..."
                                        type="url"
                                        required={data.attachment_type !== 'none'}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiary-age-group-edit">Beneficiary age group</Label>
                                    <select
                                        id="beneficiary-age-group-edit"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.beneficiary_age_group}
                                        onChange={(e) => setData('beneficiary_age_group', e.target.value as 'child' | 'youth' | 'elder')}
                                        required
                                    >
                                        <option value="" disabled>Select age group</option>
                                        <option value="child">Child</option>
                                        <option value="youth">Youth</option>
                                        <option value="elder">Elder</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiary-gender-edit">Beneficiary gender</Label>
                                    <select
                                        id="beneficiary-gender-edit"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.beneficiary_gender}
                                        onChange={(e) => setData('beneficiary_gender', e.target.value as 'male' | 'female')}
                                        required
                                    >
                                        <option value="" disabled>Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="beneficiary-name-edit">Beneficiary name</Label>
                                <Input
                                    id="beneficiary-name-edit"
                                    value={data.beneficiary_name}
                                    onChange={(e) => setData('beneficiary_name', e.target.value)}
                                />
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
