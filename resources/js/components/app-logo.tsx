import AppLogoIcon from './app-logo-icon';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function AppLogo() {
    const { props } = usePage<SharedData>();
    const roleName: string | undefined = props?.auth?.user?.role?.name;
    const label = roleName === 'admin' ? 'Admin Dashboard' : roleName === 'editor' ? 'Editor Workspace' : 'Laravel Starter Kit';
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">{label}</span>
            </div>
        </>
    );
}
