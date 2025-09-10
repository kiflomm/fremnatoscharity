import { CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Users, Home, Newspaper, BookOpen, Menu, X, DollarSign, Info, UserPlus, LogIn, Mail } from 'lucide-react';
import { SimpleLanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import type { SharedData } from '@/types';
import { motion } from 'framer-motion';



export default function NavigationSection() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Determine role for conditional profile route
    const userRole = auth?.user?.role?.name ?? null;
    const profileHref = userRole === 'guest' ? '/guests/profile' : '/settings/profile';

    
    return (
        <section id="navigation" className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 w-full">
            <CardContent className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-0 pb-0.5"> 
                                <div className="flex justify-between items-center pt-0.5">
                                    <div className="ml-auto flex items-center space-x-1.5 sm:space-x-2">
                                        <div className="flex items-center space-x-1 sm:space-x-1.5">
                                            <ThemeToggle className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
                                            <SimpleLanguageSwitcher
                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-1 sm:px-1.5 py-0.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-0.5">
                                    {/* Mobile Header with Hamburger */}
                                    <div className="flex items-center sm:hidden">
                                        <button
                                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                                        >
                                            {isMobileMenuOpen ? (
                                                <X className="h-5 w-5" />
                                            ) : (
                                                <Menu className="h-5 w-5" />
                                            )}
                                        </button>
                                        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 ml-2">
                                            {t("navigation.title", "Menu")}
                                        </h2>
                                    </div>

                                    {/* Mobile Menu - Collapsible */}
                                    {isMobileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-2 space-y-2 sm:hidden"
                                        >
                                            {/* Navigation Links */}
                                            <nav className="flex flex-col space-y-1.5">
                                                <Link 
                                                    href="/" 
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <Home className="h-4 w-4" />
                                                    {t("cta.home")}
                                                </Link>
                                                <Link 
                                                    href="/news" 
                                                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <Newspaper className="h-4 w-4" />
                                                    {t("cta.news")}
                                                </Link>
                                                <Link 
                                                    href="/stories/elders" 
                                                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <BookOpen className="h-4 w-4" />
                                                    Elders
                                                </Link>
                                                <Link 
                                                    href="/stories/childrens" 
                                                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <BookOpen className="h-4 w-4" />
                                                    Childrens
                                                </Link>
                                                <Link 
                                                    href="/stories/disabled" 
                                                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <BookOpen className="h-4 w-4" />
                                                    Disabled
                                                </Link>
                                                <Link 
                                                    href="/#donation" 
                                                    className="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium hover:bg-green-50 dark:hover:bg-green-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <DollarSign className="h-4 w-4" />
                                                    {t("nav.donate")}
                                                </Link>
                                                <Link 
                                                    href="/#about" 
                                                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium hover:bg-orange-50 dark:hover:bg-orange-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <Info className="h-4 w-4" />
                                                    {t("nav.about")}
                                                </Link>
                                                <Link 
                                                    href="/#contact" 
                                                    className="flex items-center gap-2 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium hover:bg-sky-50 dark:hover:bg-sky-950/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    {t("nav.contact", "Contact")}
                                                </Link>
                                            </nav>
                                            
                                            {/* Auth Buttons - Full width on mobile */}
                                            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700">
                                                {auth?.user ? (
                                                    <Link
                                                        href={profileHref}
                                                        className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30 transition-all duration-200"
                                                        aria-label={t('aria.profileSettings')}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <Users className="h-4 w-4" />
                                                        {t("cta.profile")}
                                                    </Link>
                                                ) : (
                                                    <div className="flex flex-col space-y-3">
                                                        <Link
                                                            href="/register"
                                                            className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 transition-all duration-200"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <UserPlus className="h-4 w-4" />
                                                            {t("cta.signUp")}
                                                        </Link>
                                                        <Link
                                                            href="/login"
                                                            className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <LogIn className="h-4 w-4" />
                                                            {t("cta.signIn")}
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Desktop Navigation - Horizontal layout */}
                                    <div className="hidden sm:flex items-center justify-between py-0.5">
                                        <nav className="flex items-center gap-1 lg:gap-2 text-sm">
                                            <Link href="/" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <Home className="h-3.5 w-3.5" />
                                                {t("cta.home")}
                                            </Link>
                                            <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                            <Link href="/news" className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <Newspaper className="h-3.5 w-3.5" />
                                                {t("cta.news")}
                                            </Link>
                                            <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                            <Link href="/stories/elders" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                Elders
                                            </Link>
                                            <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                            <Link href="/stories/childrens" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                Childrens
                                            </Link>
                                            <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                            <Link href="/stories/disabled" className="flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                Disabled
                                            </Link>
                                            <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                            <Link href="/#donation" className="flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium hover:bg-green-50 dark:hover:bg-green-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <DollarSign className="h-3.5 w-3.5" />
                                                {t("nav.donate")}
                                            </Link>
                                            <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                            <Link href="/#about" className="flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium hover:bg-orange-50 dark:hover:bg-orange-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <Info className="h-3.5 w-3.5" />
                                                {t("nav.about")}
                                            </Link>
                                            <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                            <Link href="/#contact" className="flex items-center gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium hover:bg-sky-50 dark:hover:bg-sky-950/20 px-1 py-0.5 rounded-md transition-all duration-200">
                                                <Mail className="h-3.5 w-3.5" />
                                                {t("nav.contact", "Contact")}
                                            </Link>
                                        </nav>
                                        <div className="flex items-center gap-1 lg:gap-1.5">
                                            {auth?.user ? (
                                                <Link
                                                    href={profileHref}
                                                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30 transition-all duration-200"
                                                    aria-label={t('aria.profileSettings')}
                                                >
                                                    <Users className="h-3.5 w-3.5" />
                                                    <span className="hidden lg:inline">{t("cta.profile")}</span>
                                                </Link>
                                            ) : (
                                                <div className="flex items-center gap-2 lg:gap-3">
                                                    <Link
                                                        href="/register"
                                                        className="flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 transition-all duration-200"
                                                    >
                                                        <UserPlus className="h-3.5 w-3.5" />
                                                        {t("cta.signUp")}
                                                    </Link>
                                                    <Link
                                                        href="/login"
                                                        className="flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200"
                                                    >
                                                        <LogIn className="h-3.5 w-3.5" />
                                                        {t("cta.signIn")}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
            </CardContent>
        </section>
    );
}
