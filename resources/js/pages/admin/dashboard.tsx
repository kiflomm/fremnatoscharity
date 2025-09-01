import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Heart, Newspaper, TrendingUp, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface DashboardStats {
    totalUsers: number;
    totalBeneficiaries: number;
    totalNewsPosts: number;
    totalComments: number;
}

interface AdminDashboardProps {
    stats: DashboardStats;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            description: 'Registered users',
            trend: '+12% from last month',
            color: 'text-blue-600',
        },
        {
            title: 'Beneficiary Stories',
            value: stats.totalBeneficiaries,
            icon: Heart,
            description: 'Impact stories',
            trend: '+8% from last month',
            color: 'text-red-600',
        },
        {
            title: 'News Posts',
            value: stats.totalNewsPosts,
            icon: Newspaper,
            description: 'Published articles',
            trend: '+15% from last month',
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
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Last 30 days
                        </Button>
                    </div>
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
                                <div className="flex items-center mt-2">
                                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                                    <span className="text-xs text-green-600">{card.trend}</span>
                                </div>
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
                        <Button variant="outline" className="justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Manage Users
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Heart className="mr-2 h-4 w-4" />
                            Review Stories
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Newspaper className="mr-2 h-4 w-4" />
                            Create Post
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
