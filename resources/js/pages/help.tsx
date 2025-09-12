import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import DonationForm from '@/components/DonationForm';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

export default function Help() {
    const { auth, isAuthenticated, user } = usePage<SharedData>().props;
    const { t } = useTranslation();

    const handleUnauthenticatedClick = () => {
        router.visit('/login');
    };

    return (
        <FixedHeaderLayout title={t('donation_form.title')}>
            <DonationForm 
                isAuthenticated={isAuthenticated}
                user={user}
                onUnauthenticatedClick={handleUnauthenticatedClick}
            />
        </FixedHeaderLayout>
    );
}
