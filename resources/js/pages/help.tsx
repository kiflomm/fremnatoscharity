import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import DonationFormSection from '@/components/welcome/DonationFormSection';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';

interface ProfessionalHelpCategory {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
    translations?: Record<string, string>;
}

interface HelpPageProps extends SharedData {
    professionalHelpCategories: ProfessionalHelpCategory[];
}

export default function Help() {
    const { auth, isAuthenticated, user, professionalHelpCategories } = usePage<HelpPageProps>().props;
    const { t } = useTranslation();

    const handleUnauthenticatedClick = () => {
        toast.dismiss('login-required');
        toast.info('Please login first.', { id: 'login-required' });
        router.visit('/login');
    };

    return (
        <FixedHeaderLayout title={t('donation_form.title')}>
            <DonationFormSection professionalHelpCategories={professionalHelpCategories} autoOpen />
            <Toaster position="top-right" richColors />
        </FixedHeaderLayout>
    );
}
