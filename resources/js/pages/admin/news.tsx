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
import { Newspaper, Search, MoreHorizontal, Plus, Eye, Calendar, User, MessageSquare, Tag } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: dashboard().url,
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
    status: 'draft' | 'published' | 'archived';
    author: {
        name: string;
        email: string;
        avatar?: string;
    };
    category: {
        name: string;
        color: string;
    };
    created_at: string;
    updated_at: string;
    published_at?: string;
    views: number;
    comments_count: number;
    featured_image?: string;
}

interface AdminNewsProps {
    posts: NewsPost[];
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
}

export default function AdminNews({ posts, totalPosts, publishedPosts, draftPosts }: AdminNewsProps) {
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
            <Head title="Admin - News Posts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
                        <p className="text-muted-foreground">
                            Manage news posts and announcements
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPosts}</div>
                            <p className="text-xs text-muted-foreground">
                                All news posts
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                            <Eye className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{publishedPosts}</div>
                            <p className="text-xs text-muted-foreground">
                                Live on the platform
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                            <Newspaper className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{draftPosts}</div>
                            <p className="text-xs text-muted-foreground">
                                Pending publication
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Posts List */}
                <Card>
                    <CardHeader>
                        <CardTitle>News Posts</CardTitle>
                        <CardDescription>
                            Manage news posts and announcements
                        </CardDescription>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search posts..."
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start space-x-4 flex-1">
                                        {post.featured_image && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                <img 
                                                    src={post.featured_image} 
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-medium text-lg">{post.title}</h3>
                                                <Badge className={getStatusBadge(post.status)}>
                                                    {post.status}
                                                </Badge>
                                                <Badge 
                                                    className="text-xs"
                                                    style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                                                >
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {post.category.name}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {truncateText(post.excerpt || post.content, 150)}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    {post.views} views
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageSquare className="mr-1 h-3 w-3" />
                                                    {post.comments_count} comments
                                                </div>
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
                                            <DropdownMenuItem>View Post</DropdownMenuItem>
                                            <DropdownMenuItem>Edit Post</DropdownMenuItem>
                                            <DropdownMenuItem>Publish Post</DropdownMenuItem>
                                            <DropdownMenuItem>Archive Post</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                Delete Post
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
