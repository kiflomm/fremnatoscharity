import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Users, Heart, Newspaper, Settings } from 'lucide-react';
import AppLogo from './app-logo';

const adminNav: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: Settings },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Stories', href: '/admin/stories', icon: Heart },
    { title: 'News', href: '/admin/news', icon: Newspaper },
];

const editorNav: NavItem[] = [
    { title: 'Dashboard', href: '/editor/dashboard', icon: Settings },
    { title: 'Stories', href: '/editor/stories', icon: Heart },
    { title: 'News', href: '/editor/news', icon: Newspaper },
];

const footerNavItems: NavItem[] = [
    
];

export function AppSidebar() {
    const { props } = usePage<SharedData>();
    const roleName: string | undefined = props?.auth?.user?.role?.name;
    const isAdmin = roleName === 'admin'; 

    const items = isAdmin ? adminNav : editorNav;
    const homeHref = isAdmin ? '/admin/dashboard' : '/editor/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
