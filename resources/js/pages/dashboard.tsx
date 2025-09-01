import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Settings, Users, Heart, Newspaper, MessageSquare } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome to Fremnatos Charity</h1>
                        <p className="text-muted-foreground">
                            Manage your charity platform and make a difference
                        </p>
                    </div>
                </div>

                {/* Admin Quick Access */}
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Panel</CardTitle>
                        <CardDescription>
                            Quick access to administrative functions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Link href="/admin/dashboard">
                                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <Settings className="h-5 w-5" />
                                            <span className="font-medium">Admin Dashboard</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href="/admin/users">
                                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-5 w-5" />
                                            <span className="font-medium">User Management</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href="/admin/stories">
                                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <Heart className="h-5 w-5" />
                                            <span className="font-medium">Beneficiary Stories</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href="/admin/news">
                                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <Newspaper className="h-5 w-5" />
                                            <span className="font-medium">News Management</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Placeholder Content */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
