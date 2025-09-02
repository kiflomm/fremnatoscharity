import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { SimpleLanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <header className="relative">
            {/* Full-width logo banner with responsive height */}
            <div className="w-full overflow-hidden">
                {/* Logo for small devices */}
                <img 
                    src="/images/slideshow/logo4.png" 
                    alt="Fremnatos Charity Organization Banner" 
                    className="w-full h-auto object-contain sm:hidden"
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
                        <div className="hidden sm:block">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                                {t('main_title')}
                            </span>
                        </div>
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
    );
}
