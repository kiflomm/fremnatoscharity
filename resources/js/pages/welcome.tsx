import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import { AboutSection, ContactSection, DonationSection, HeroSection } from '@/components/welcome';
import DonationFormSection from '@/components/welcome/DonationFormSection';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ImageSlideshow from '@/components/ImageSlideshow';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const {  i18n, ready } = useTranslations();
    const { t } = useTranslation();
    const [forceUpdate, setForceUpdate] = useState(0);
    
    // Force English for public page regardless of stored preference
    useEffect(() => {
        i18n.changeLanguage('en');
    }, [i18n]);
    
    // Force re-render when language changes
    useEffect(() => {
        const handleLanguageChange = () => {
            setForceUpdate(prev => prev + 1);
        };
        
        i18n.on('languageChanged', handleLanguageChange);
        
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);
    
    
    // Don't render until i18next is ready
    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <FixedHeaderLayout title={t('organization')}>
            <div className="block md:hidden">
                <ImageSlideshow />
            </div>
            <div className="hidden md:block">
                <HeroSection />
            </div>
            <DonationSection />
            <DonationFormSection />
            <AboutSection />
            <ContactSection />
        </FixedHeaderLayout>
    );
}
