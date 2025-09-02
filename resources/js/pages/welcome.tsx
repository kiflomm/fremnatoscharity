import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Footer from '@/components/Footer';
import ImageSlideshow from '@/components/ImageSlideshow';
import { SimpleLanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslations } from '@/hooks/useTranslations';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth, locale } = usePage<SharedData>().props;
    const { translate, i18n, ready } = useTranslations();
    const { t } = useTranslation(); // Direct hook for better reactivity
    const { theme } = useTheme();
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
        return <div>Loading...</div>;
    }
    
    const slides = [
        {
            id: 1,
            imageUrl: '/images/slideshow/la.jpg',
            alt: 'Charity work - Helping elders',
            title: t('slideshow.slide1.title'),
            description: t('slideshow.slide1.description')
        },
        {
            id: 2,
            imageUrl: '/images/slideshow/chicago.jpg',
            alt: 'Charity work - Supporting children',
            title: t('slideshow.slide2.title'),
            description: t('slideshow.slide2.description')
        },
        {
            id: 3,
            imageUrl: '/images/slideshow/ny.jpg',
            alt: 'Charity work - Mental health support',
            title: t('slideshow.slide3.title'),
            description: t('slideshow.slide3.description')
        },
        {
            id: 4,
            imageUrl: '/images/slideshow/ny.jpg',
            alt: 'Charity work - Community service',
            title: t('slideshow.slide4.title'),
            description: t('slideshow.slide4.description')
        },
        {
            id: 5,
            imageUrl: '/images/slideshow/ny.jpg',
            alt: 'Charity work - Community service',
            title: t('slideshow.slide5.title'),
            description: t('slideshow.slide5.description')
        }
    ];

    return (
        <>
            <Head title={t('organization')}>
            </Head>
            
            {/* Header */}
            <header className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo and Organization Name */}
                        <div className="flex items-center space-x-4">
                        <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                                <img 
                                    src="/images/slideshow/logo2.jpg" 
                                    alt="Fremnatos-logo" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    {t('organization_name')}
                                </h1>
                                {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('organization_description')}</p> */}
                            </div>
                        </div>
                        
                        {/* Header Image */}
                        <div className="hidden md:block">
                            <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                                <img 
                                    src="/images/slideshow/logo3.jpg" 
                                    alt="Fremnatos-logo" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Bar */}
                    <nav className="bg-blue-500 text-white py-3 px-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-6 text-sm">
                                <a href="#" className="hover:text-gray-300 transition-colors">{t('navigation.vision')}</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">{t('navigation.news')}</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">{t('navigation.elders')}</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">{t('navigation.mentally_disabled')}</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">{t('navigation.children')}</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">{t('navigation.help_them')}</a>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <ThemeToggle className="text-white" />
                                    <SimpleLanguageSwitcher 
                                        className="text-gray-800 px-4 py-2 rounded text-lg font-medium hover:bg-gray-200 transition-colors bg-transparent border border-gray-400"
                                    />
                                </div>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="bg-white text-gray-800 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                ) : (
                                    <div className="flex space-x-2">
                                        <Link
                                            href={login()}
                                            className="bg-green-600 text-white-800 px-4 py-2 rounded text-sm font-medium hover:bg-green-900 transition-colors"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-600 transition-colors"
                                        >
                                            {t('register')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main key={`${i18n.language}-${forceUpdate}`} className={`max-w-7xl mx-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold mb-4">{t('main_title')}</h2>
                        
                        {/* Image Slideshow */}
                        <ImageSlideshow slides={slides} autoPlay={true} interval={5000} />

                        {/* Description */}
                        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border transition-colors duration-300`}>
                            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">{t('about_mission')}</h3>
                            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed transition-colors duration-300`}>
                                {t('mission_description')}
                            </p>
                        </div>
                    </div>

                    {/* Bank Accounts Sidebar */}
                    <div className="lg:col-span-1">
                        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border transition-colors duration-300`}>
                            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold mb-4">{t('bank_accounts')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600  mb-2">{t('commercial_bank')}</h4>
                                    {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('commercial_bank')}</p> */}
                                    <div className="mt-2 space-y-1">
                                        <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>1000241223195</p>
                                        <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>1000564271498</p>
                                        <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>1000622132404</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r  from-blue-600 to-purple-600 mb-2">{t('wegagen_bank')}</h4>
                                    {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('wegagen_bank')}</p> */}
                                    <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>0827742010102</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">{t('abyssinia_bank')}</h4>
                                    {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('abyssinia_bank')}</p> */}
                                    <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>146309151</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">{t('awash_bank')}</h4>
                                    {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('awash_bank')}</p> */}
                                    <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>013251148569500</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">{t('berhan_bank')}</h4>
                                    {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('berhan_bank')}</p> */}
                                    <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>1500700167456</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 mb-2">{t('dashen_bank')}</h4>
                                    {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('dashen_bank')}</p> */}
                                    <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>5013032975011</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-2">{t('anbessa_bank')}</h4>
                                    {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{t('anbessa_bank')}</p> */}
                                    <p className={`text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-black'} p-2 rounded transition-colors duration-300`}>00312082554-22</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
