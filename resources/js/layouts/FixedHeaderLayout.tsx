import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Header, NavigationSection } from '@/components/welcome';
import Footer from '@/components/Footer';

interface FixedHeaderLayoutProps {
    children: ReactNode;
    title?: string;
    hideFooter?: boolean;
}

export default function FixedHeaderLayout({ children, title, hideFooter = false }: FixedHeaderLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Head title={title} />
            
            {/* Header and Navigation */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
                <Header />
                <NavigationSection />
            </div>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            {!hideFooter && <Footer />}
        </div>
    );
}
