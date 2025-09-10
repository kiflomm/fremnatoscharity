import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Mail } from 'lucide-react';

type Message = {
    id: number;
    name: string | null;
    email: string | null;
    message: string;
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
        router.delete(`/admin/messages/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Manage Messages" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Mail className="h-6 w-6" /> Manage Messages
                    </h1>
                    <p className="text-muted-foreground">View and delete contact messages.</p>
                </div>

                <div className="grid gap-4">
                    {messages.data.map(msg => (
                        <Card key={msg.id}>
                            <CardContent className="p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        From: {msg.name ?? 'Anonymous'} {msg.email ? `<${msg.email}>` : ''}
                                    </div>
                                    <Button size="sm" variant="destructive" onClick={() => remove(msg.id)}>
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                </div>
                                <div className="whitespace-pre-wrap text-sm leading-6">
                                    {msg.message}
                                </div>
                                {msg.created_at && (
                                    <div className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}


