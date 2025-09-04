import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Users, Heart, Newspaper } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface DashboardStats {
    totalUsers: number;
    totalStories: number;
    totalNewsPosts: number;
}

interface AdminDashboardProps {
    stats: DashboardStats;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers ?? 0,
            icon: Users,
            description: 'Registered users',
            color: 'text-blue-600',
        },
        {
            title: 'Total Stories',
            value: stats.totalStories ?? 0,
            icon: Heart,
            description: 'Impact stories',
            color: 'text-red-600',
        },
        {
            title: 'Total News',
            value: stats.totalNewsPosts ?? 0,
            icon: Newspaper,
            description: 'Published articles',
            color: 'text-green-600',
        },

    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage your charity platform and monitor key metrics
                        </p>
                    </div>
                    <div className="flex items-center gap-2"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {statCards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => router.get('/admin/users')}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Manage Users
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => router.get('/admin/stories')}
                        >
                            <Heart className="mr-2 h-4 w-4" />
                            Review Stories
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => router.get('/admin/news')}
                        >
                            <Newspaper className="mr-2 h-4 w-4" />
                            Manage News
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
