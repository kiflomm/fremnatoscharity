import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Search, MoreHorizontal, Plus, Shield, User, Mail, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'moderator' | 'user';
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    avatar?: string;
}

interface AdminUsersProps {
    users: User[];
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
}

export default function AdminUsers({ users, totalUsers, activeUsers, inactiveUsers }: AdminUsersProps) {
    const getRoleBadge = (role: string) => {
        const variants = {
            admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            user: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return variants[role as keyof typeof variants] || variants.user;
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return variants[status as keyof typeof variants] || variants.inactive;
    };

    const getRoleIcon = (role: string) => {
        const icons = {
            admin: Shield,
            moderator: Shield,
            user: User,
        };
        return icons[role as keyof typeof icons] || User;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                All registered users
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <User className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active accounts
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                            <User className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{inactiveUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                Suspended or inactive accounts
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            A list of all users in the system
                        </CardDescription>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map((user) => {
                                const RoleIcon = getRoleIcon(user.role);
                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-medium">{user.name}</p>
                                                    <Badge className={getRoleBadge(user.role)}>
                                                        <RoleIcon className="mr-1 h-3 w-3" />
                                                        {user.role}
                                                    </Badge>
                                                    <Badge className={getStatusBadge(user.status)}>
                                                        {user.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center">
                                                        <Mail className="mr-1 h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        Joined {new Date(user.created_at).toLocaleDateString()}
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
                                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                <DropdownMenuItem>Change Role</DropdownMenuItem>
                                                <DropdownMenuItem>Suspend User</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
