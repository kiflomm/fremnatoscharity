import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={title} />
            
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <a href="/" className="text-xl font-bold text-gray-900">
                                Fremnatos Charity
                            </a>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
                            <a href="/news" className="text-gray-500 hover:text-gray-900">News</a>
                            <a href="/stories" className="text-gray-500 hover:text-gray-900">Stories</a>
                            <a href="/login" className="text-gray-500 hover:text-gray-900">Login</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-500">
                        <p>&copy; 2025 Fremnatos Charity. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
