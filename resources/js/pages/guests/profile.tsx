import { Head, usePage } from '@inertiajs/react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import type { SharedData } from '@/types';

export default function GuestProfile() {
    const { auth } = usePage<SharedData>().props;

    return (
        <FixedHeaderLayout title="Guest profile">
            <Head title="Guest profile" />
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-semibold">Welcome, {auth?.user?.name}</h1>
                <p className="mt-2 text-muted-foreground">This is your guest profile page.</p>
            </div>
        </FixedHeaderLayout>
    );
}


