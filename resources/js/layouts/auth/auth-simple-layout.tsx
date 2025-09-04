import Header from '@/components/welcome/Header';
import NavigationSection from '@/components/welcome/NavigationSection';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-svh bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Header with logo banner */}
            <Header />
            
            {/* Main content area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
                    {/* Auth Form */}
                    <div className="order-2 lg:order-1 lg:col-span-1">
                        <div className="max-w-md mx-auto lg:mx-0">
                            <div 
                                id="auth-form" 
                                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border-0 p-8 scroll-mt-20"
                            >
                                <div className="space-y-6">
                                    <div className="text-center space-y-3">
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
                                    </div>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Section with slideshow and stats */}
                    <div className="order-1 lg:order-2 lg:col-span-2">
                        <NavigationSection />
                    </div>
                </div>
            </div>
        </div>
    );
}
