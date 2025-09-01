import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Dashboard() {
    useEffect(() => {
        // Redirect to admin dashboard
        router.visit('/admin/dashboard');
    }, []);

    return null;
}
