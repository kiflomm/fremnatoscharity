import { Head } from '@inertiajs/react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import ProfileInfoForm from '@/components/guests/ProfileInfoForm';
import PasswordUpdateForm from '@/components/guests/PasswordUpdateForm';
import AccountDeleteForm from '@/components/guests/AccountDeleteForm';
import MembershipHistory from '@/components/guests/MembershipHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from 'sonner';

interface Membership {
    id: number;
    name: string;
    father_name?: string;
    gender?: string;
    age?: number;
    country?: string;
    region?: string;
    city?: string;
    woreda?: string;
    kebele?: string;
    profession?: string;
    education_level?: string;
    phone_number?: string;
    help_profession?: string[];
    donation_amount?: number;
    donation_currency?: string;
    donation_time?: string;
    property_type?: string;
    additional_property?: string;
    property_donation_time?: string;
    created_at: string;
    updated_at: string;
}

interface ProfessionalHelpCategory {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
}

interface GuestProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
    memberships: Membership[];
    professionalHelpCategories: ProfessionalHelpCategory[];
}

export default function GuestProfile({ mustVerifyEmail, status, memberships, professionalHelpCategories }: GuestProfileProps) {
    return (
        <FixedHeaderLayout title="Guest profile">
            <Head title="Guest profile" />
            <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
                <ProfileInfoForm />
                <MembershipHistory memberships={memberships} professionalHelpCategories={professionalHelpCategories} />
            </div>
            <Toaster position="top-right" richColors />
        </FixedHeaderLayout>
    );
}


