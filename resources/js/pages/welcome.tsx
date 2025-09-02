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
    const { t } = useTranslation();
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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
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

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            title: t('navigation.news'),
            description: 'Stay updated with our latest activities and impact stories',
            href: '#'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            title: t('navigation.elders'),
            description: 'Supporting our elderly community with care and dignity',
            href: '#'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: t('navigation.children'),
            description: 'Nurturing the next generation with love and opportunity',
            href: '#'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Contact Us',
            description: 'Get in touch to learn more about our mission',
            href: '#'
        }
    ];

    return (
        <>
            <Head title={t('organization')} />
            
            {/* Full-Width Logo Banner */}
            <header className="relative">
                                                {/* Full-width logo banner with responsive height */}
                <div className="w-full overflow-hidden">
                    {/* Logo for small devices */}
                    <img 
                        src="/images/slideshow/logo4.png" 
                        alt="Fremnatos Charity Organization Banner" 
                        className="w-full h-32 object-contain sm:hidden"
                    />
                    {/* Logo for medium and larger devices */}
                    <img 
                        src="/images/slideshow/logo.jpg" 
                        alt="Fremnatos Charity Organization Banner" 
                        className="w-full h-auto object-cover hidden sm:block"
                    />
                    </div>
                    
                    {/* Navigation Bar */}
                <nav className={`${theme === 'dark' ? 'bg-gray-900/95 backdrop-blur-sm border-gray-700' : 'bg-white/95 backdrop-blur-sm border-gray-200'} shadow-lg border-b transition-all duration-300 sticky top-0 z-50`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-3 sm:py-4">
                            <div></div>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                {/* Always visible theme and language switchers */}
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <ThemeToggle className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
                                    <SimpleLanguageSwitcher 
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                    />
                                </div>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                ) : (
                                    <div className="flex space-x-2 sm:space-x-3">
                                        <Link
                                            href={login()}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            {t('register')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                            </div>
                        </div>
                    </nav>
            </header>

            {/* Hero Section */}
            <section className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-green-50'} py-20 lg:py-32 overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                                {t('main_title')}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                {t('mission_description')}
                            </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="#donate"
                                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 hover:scale-105"
                            >
                                Donate Now
                            </Link>
                            <Link
                                href="#mission"
                                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                                    </div>
            </section>

            {/* Mission Statement Section */}
            <section id="mission" className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {t('about_mission')}
                            </span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
                                </div>
                                
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                            <ImageSlideshow slides={slides} autoPlay={true} interval={5000} />
                        </div>
                        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-8 rounded-3xl shadow-xl`}>
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                                Our Commitment to Community
                            </h3>
                            <p className={`text-lg leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {t('mission_description')}
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} p-4 rounded-2xl shadow-lg`}>
                                    <div className="text-2xl font-bold text-blue-600">500+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">Lives Touched</div>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} p-4 rounded-2xl shadow-lg`}>
                                    <div className="text-2xl font-bold text-green-600">15+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">Years Service</div>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} p-4 rounded-2xl shadow-lg`}>
                                    <div className="text-2xl font-bold text-purple-600">3</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">Focus Areas</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features/Highlights Section */}
            <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                How We Make a Difference
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Explore our key areas of impact and discover how you can be part of our mission
                        </p>
                                </div>
                                
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}
                            >
                                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Donation CTA Section */}
            <section id="donate" className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                                </div>
                                
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Your Support Changes Lives
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Every contribution, no matter the size, makes a real difference in the lives of elders, children, and those with mental disabilities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 hover:scale-105">
                            Donate Now
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                            Bank Details
                        </button>
                                </div>
                                
                    {/* Bank Accounts */}
                    <div className={`${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-3xl p-8 shadow-2xl`}>
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                            {t('bank_accounts')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="text-center">
                                <h4 className="font-semibold text-green-600 mb-2">{t('commercial_bank')}</h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1000241223195</p>
                                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1000564271498</p>
                                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1000622132404</p>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <h4 className="font-semibold text-blue-600 mb-2">{t('wegagen_bank')}</h4>
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">0827742010102</p>
                            </div>
                            
                            <div className="text-center">
                                <h4 className="font-semibold text-purple-600 mb-2">{t('abyssinia_bank')}</h4>
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">146309151</p>
                            </div>
                            
                            <div className="text-center">
                                <h4 className="font-semibold text-orange-600 mb-2">{t('awash_bank')}</h4>
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">013251148569500</p>
                            </div>
                            
                            <div className="text-center">
                                <h4 className="font-semibold text-indigo-600 mb-2">{t('berhan_bank')}</h4>
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1500700167456</p>
                            </div>
                            
                            <div className="text-center">
                                <h4 className="font-semibold text-teal-600 mb-2">{t('dashen_bank')}</h4>
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">5013032975011</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
