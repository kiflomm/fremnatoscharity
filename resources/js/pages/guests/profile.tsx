import { Head } from '@inertiajs/react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import ProfileInfoForm from '@/components/guests/ProfileInfoForm';
import PasswordUpdateForm from '@/components/guests/PasswordUpdateForm';
import AccountDeleteForm from '@/components/guests/AccountDeleteForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GuestProfile() {
    return (
        <FixedHeaderLayout title="Guest profile">
            <Head title="Guest profile" />
            <div className="mx-auto max-w-3xl px-4 py-8">
                    <ProfileInfoForm />
            </div>
        </FixedHeaderLayout>
    );
}


