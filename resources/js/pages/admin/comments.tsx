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
import { MessageSquare, Search, MoreHorizontal, Check, X, Flag, User, Calendar, ThumbsUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: dashboard().url,
    },
    {
        title: 'Comments',
        href: '/admin/comments',
    },
];

interface Comment {
    id: number;
    content: string;
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    author: {
        name: string;
        email: string;
        avatar?: string;
    };
    post: {
        title: string;
        type: 'story' | 'news';
        id: number;
    };
    created_at: string;
    updated_at: string;
    likes_count: number;
    flags_count: number;
    is_reply: boolean;
    parent_comment?: {
        id: number;
        content: string;
        author: string;
    };
}

interface AdminCommentsProps {
    comments: Comment[];
    totalComments: number;
    pendingComments: number;
    flaggedComments: number;
}

export default function AdminComments({ comments, totalComments, pendingComments, flaggedComments }: AdminCommentsProps) {
    const getStatusBadge = (status: string) => {
        const variants = {
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            flagged: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        };
        return variants[status as keyof typeof variants] || variants.pending;
    };

    const getPostTypeBadge = (type: string) => {
        const variants = {
            story: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            news: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
        return variants[type as keyof typeof variants] || variants.news;
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Comments" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Comment Moderation</h1>
                        <p className="text-muted-foreground">
                            Review and moderate user comments
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline">
                            <Check className="mr-2 h-4 w-4" />
                            Approve All
                        </Button>
                        <Button variant="outline">
                            <X className="mr-2 h-4 w-4" />
                            Reject All
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalComments}</div>
                            <p className="text-xs text-muted-foreground">
                                All user comments
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <MessageSquare className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingComments}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting approval
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
                            <Flag className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{flaggedComments}</div>
                            <p className="text-xs text-muted-foreground">
                                Reported by users
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Comments List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Comments</CardTitle>
                        <CardDescription>
                            Review and moderate user comments
                        </CardDescription>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search comments..."
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start space-x-4 flex-1">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                            <AvatarFallback>
                                                {comment.author.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <p className="font-medium">{comment.author.name}</p>
                                                <Badge className={getStatusBadge(comment.status)}>
                                                    {comment.status}
                                                </Badge>
                                                <Badge className={getPostTypeBadge(comment.post.type)}>
                                                    {comment.post.type}
                                                </Badge>
                                                {comment.is_reply && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Reply
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm mb-2">
                                                {truncateText(comment.content, 200)}
                                            </p>
                                            {comment.parent_comment && (
                                                <div className="bg-muted/50 p-2 rounded text-xs mb-2">
                                                    <p className="text-muted-foreground">
                                                        Replying to <span className="font-medium">{comment.parent_comment.author}</span>:
                                                    </p>
                                                    <p className="italic">"{truncateText(comment.parent_comment.content, 100)}"</p>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <ThumbsUp className="mr-1 h-3 w-3" />
                                                    {comment.likes_count} likes
                                                </div>
                                                {comment.flags_count > 0 && (
                                                    <div className="flex items-center text-orange-600">
                                                        <Flag className="mr-1 h-3 w-3" />
                                                        {comment.flags_count} flags
                                                    </div>
                                                )}
                                                <div className="text-xs">
                                                    On: {comment.post.title}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {comment.status === 'pending' && (
                                            <>
                                                <Button size="sm" variant="outline" className="h-8">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-8">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Context</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Comment</DropdownMenuItem>
                                                <DropdownMenuItem>Approve Comment</DropdownMenuItem>
                                                <DropdownMenuItem>Reject Comment</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Delete Comment
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
