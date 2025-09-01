import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Heart, Search, MoreHorizontal, Plus, Eye, Calendar, User, MessageSquare } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: dashboard().url,
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
    beneficiary_name: string;
    beneficiary_photo?: string;
    status: 'draft' | 'published' | 'archived';
    author: {
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
    views: number;
    comments_count: number;
}

interface AdminStoriesProps {
    stories: BeneficiaryStory[];
    totalStories: number;
    publishedStories: number;
    draftStories: number;
}

export default function AdminStories({ stories, totalStories, publishedStories, draftStories }: AdminStoriesProps) {
    const getStatusBadge = (status: string) => {
        const variants = {
            published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return variants[status as keyof typeof variants] || variants.draft;
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Beneficiary Stories" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Beneficiary Stories</h1>
                        <p className="text-muted-foreground">
                            Manage and review beneficiary impact stories
                        </p>
                    </div>
                    <Button>
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                            <Eye className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{publishedStories}</div>
                            <p className="text-xs text-muted-foreground">
                                Live on the platform
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                            <Heart className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{draftStories}</div>
                            <p className="text-xs text-muted-foreground">
                                Pending review
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
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search stories..."
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stories.map((story) => (
                                <div
                                    key={story.id}
                                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start space-x-4 flex-1">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={story.beneficiary_photo} alt={story.beneficiary_name} />
                                            <AvatarFallback>
                                                {story.beneficiary_name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-medium text-lg">{story.title}</h3>
                                                <Badge className={getStatusBadge(story.status)}>
                                                    {story.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {truncateText(story.content, 150)}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <User className="mr-1 h-3 w-3" />
                                                    {story.beneficiary_name}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {new Date(story.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    {story.views} views
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Story</DropdownMenuItem>
                                            <DropdownMenuItem>Edit Story</DropdownMenuItem>
                                            <DropdownMenuItem>Approve Story</DropdownMenuItem>
                                            <DropdownMenuItem>Archive Story</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                Delete Story
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
