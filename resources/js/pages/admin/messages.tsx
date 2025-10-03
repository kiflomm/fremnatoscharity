import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, MailOpen, MailCheck, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

type Message = {
    id: number;
    name: string | null;
    email: string | null;
    message: string;
    is_read: boolean;
    read_at: string | null;
    created_at?: string;
};

type PageProps = {
    messages: {
        data: Message[];
        links?: any;
        meta?: any;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manage Messages', href: '/admin/messages' },
];

export default function AdminMessages({ messages }: PageProps) {
    const remove = (id: number) => {
        router.delete(`/admin/messages/${id}`, {
            onSuccess: () => {
                toast.success('Message deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete message');
            }
        });
    };

    const markAsRead = (id: number) => {
        router.patch(`/admin/messages/${id}/read`, {}, {
            onSuccess: () => {
                toast.success('Message marked as read');
            },
            onError: () => {
                toast.error('Failed to mark message as read');
            }
        });
    };

    const markAsUnread = (id: number) => {
        router.patch(`/admin/messages/${id}/unread`, {}, {
            onSuccess: () => {
                toast.success('Message marked as unread');
            },
            onError: () => {
                toast.error('Failed to mark message as unread');
            }
        });
    };

    const markAllAsRead = () => {
        router.patch('/admin/messages/mark-all-read', {}, {
            onSuccess: () => {
                toast.success('All messages marked as read');
            },
            onError: () => {
                toast.error('Failed to mark all messages as read');
            }
        });
    };

    const unreadCount = messages.data.filter(msg => !msg.is_read).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Manage Messages" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Mail className="h-6 w-6" /> Manage Messages
                        </h1>
                        <p className="text-muted-foreground">View and manage contact messages.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-sm">
                                {unreadCount} unread
                            </Badge>
                        )}
                        {unreadCount > 0 && (
                            <Button onClick={markAllAsRead} variant="outline" size="sm">
                                <MailCheck className="h-4 w-4 mr-1" />
                                Mark All Read
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4">
                    {messages.data.map(msg => (
                        <Card key={msg.id} className={`${!msg.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                            <CardContent className="p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm text-muted-foreground">
                                            From: {msg.name ?? 'Anonymous'} {msg.email ? `<${msg.email}>` : ''}
                                        </div>
                                        <Badge variant={msg.is_read ? "secondary" : "default"} className="text-xs">
                                            {msg.is_read ? (
                                                <>
                                                    <MailOpen className="h-3 w-3 mr-1" />
                                                    Read
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    Unread
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {msg.is_read ? (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => markAsUnread(msg.id)}
                                                className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 dark:hover:bg-orange-900/20 dark:hover:border-orange-700 dark:hover:text-orange-300"
                                            >
                                                <EyeOff className="h-4 w-4 mr-1" />
                                                Mark Unread
                                            </Button>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => markAsRead(msg.id)}
                                                className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:border-green-700 dark:hover:text-green-300"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Mark Read
                                            </Button>
                                        )}
                                        <Button size="sm" variant="destructive" onClick={() => remove(msg.id)}>
                                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                                        </Button>
                                    </div>
                                </div>
                                <div className="whitespace-pre-wrap text-sm leading-6">
                                    {msg.message}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div>
                                        {msg.created_at && (
                                            <span>Sent: {new Date(msg.created_at).toLocaleString()}</span>
                                        )}
                                    </div>
                                    <div>
                                        {msg.read_at && (
                                            <span>Read: {new Date(msg.read_at).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}


