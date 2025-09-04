import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Users, Search, MoreHorizontal, Plus, Shield, User, Mail, Calendar, Loader2 } from 'lucide-react';

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

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'guest';
    created_at: string;
    avatar?: string;
}

interface AdminUsersProps {
    users: AdminUser[];
    totalUsers: number;
    editorUsers: number;
    guestUsers: number;
}

export default function AdminUsers({ users, totalUsers, editorUsers, guestUsers }: AdminUsersProps) {
    const getRoleBadge = (role: string) => {
        const variants = {
            admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            guest: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return variants[role as keyof typeof variants] || variants.guest;
    };

    const getRoleIcon = (role: string) => {
        const icons = {
            admin: Shield,
            editor: Shield,
            guest: User,
        };
        return icons[role as keyof typeof icons] || User;
    };

    const { data, setData, post, processing, reset, errors, delete: destroy } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'editor' as 'editor',
    });

    const [action, setAction] = useState<{
        type: 'edit' | 'role' | 'delete' | null;
        userId: number | null;
    }>({ type: null, userId: null });

    const activeUser = useMemo(() => users.find(u => u.id === action.userId) || null, [users, action.userId]);

    const closeDialog = () => setAction({ type: null, userId: null });

    const submitNewEditor = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => {
                reset('name', 'email', 'password', 'password_confirmation');
                router.reload({ only: ['users', 'totalUsers'] });
            },
        });
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Editor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a new editor</DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={submitNewEditor}>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full name</Label>
                                    <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors?.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                    {errors?.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" name="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                                        {errors?.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm password</Label>
                                        <Input id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Editor'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
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
                            <CardTitle className="text-sm font-medium">Editors</CardTitle>
                            <Shield className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{editorUsers}</div>
                            <p className="text-xs text-muted-foreground">Users with editor privileges</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Guests</CardTitle>
                            <User className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{guestUsers}</div>
                            <p className="text-xs text-muted-foreground">Users without elevated access</p>
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
                                        {user.role !== 'admin' && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setData('name', user.name); setData('email', user.email); setData('password', ''); setData('password_confirmation', ''); setAction({ type: 'edit', userId: user.id }); }}>Edit User</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setData('role', user.role as any); setAction({ type: 'role', userId: user.id }); }}>Change Role</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onSelect={(e) => { e.preventDefault(); setAction({ type: 'delete', userId: user.id }); }}>Delete User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Edit User Dialog (controlled) */}
                <Dialog open={action.type === 'edit'} onOpenChange={(open) => { if (!open) closeDialog(); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit user</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            if (!activeUser) return;
                            router.put(`/admin/users/${activeUser.id}`, {
                                name: data.name || activeUser.name,
                                email: data.email || activeUser.email,
                                password: data.password,
                                password_confirmation: data.password_confirmation,
                            }, {
                                onSuccess: () => {
                                    reset('name', 'email', 'password', 'password_confirmation');
                                    router.reload({ only: ['users'] });
                                    closeDialog();
                                },
                            });
                        }}>
                            <div className="space-y-2">
                                <Label htmlFor={`name-edit`}>Full name</Label>
                                <Input id={`name-edit`} defaultValue={activeUser?.name} onChange={(e) => setData('name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`email-edit`}>Email</Label>
                                <Input id={`email-edit`} type="email" defaultValue={activeUser?.email} onChange={(e) => setData('email', e.target.value)} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`password-edit`}>New password (optional)</Label>
                                    <Input id={`password-edit`} type="password" onChange={(e) => setData('password', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`password2-edit`}>Confirm password</Label>
                                    <Input id={`password2-edit`} type="password" onChange={(e) => setData('password_confirmation', e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Change Role Dialog (controlled) */}
                <Dialog open={action.type === 'role'} onOpenChange={(open) => { if (!open) closeDialog(); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change role</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select defaultValue={activeUser?.role === 'admin' ? 'editor' : activeUser?.role} onValueChange={(v) => setData('role', v as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="guest">Guest</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => {
                                    if (!activeUser) return;
                                    router.put(`/admin/users/${activeUser.id}/role`, {
                                        role: (data.role || activeUser.role) as any,
                                    }, {
                                        onSuccess: () => {
                                            reset('role');
                                            router.reload({ only: ['users'] });
                                            closeDialog();
                                        },
                                    });
                                }}>Update role</Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete User Dialog (controlled) */}
                <Dialog open={action.type === 'delete'} onOpenChange={(open) => { if (!open) closeDialog(); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete user</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground">This action is irreversible. Are you sure you want to delete {activeUser?.name}?</p>
                        <DialogFooter>
                            <Button variant="destructive" onClick={() => {
                                if (!activeUser) return;
                                destroy(`/admin/users/${activeUser.id}`, {
                                    onSuccess: () => { router.reload({ only: ['users', 'totalUsers'] }); closeDialog(); },
                                });
                            }}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
