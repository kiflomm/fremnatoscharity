import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Footer from '@/components/Footer';
import { Header, AboutSection, DonationSection, NavigationSection } from '@/components/welcome';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const {  i18n, ready } = useTranslations();
    const { t } = useTranslation();
    const [forceUpdate, setForceUpdate] = useState(0);
    
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
        <>
            <Head title={t('organization')} />
            <Header />
            <NavigationSection />
            <DonationSection />
            <AboutSection />
            <Footer />
        </>
    );
}
