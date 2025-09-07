import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Globe, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface LanguageSwitcherProps {
    currentLocale?: string;
    className?: string;
    showLabels?: boolean;
}

const languages = [
    { code: 'tg', name: 'Tigrinya', nativeName: 'ትግርኛ' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { code: 'en', name: 'English', nativeName: 'English' },
];

export default function LanguageSwitcher({ 
    currentLocale, 
    className = '',
    showLabels = true 
}: LanguageSwitcherProps) {
    const { i18n } = useTranslation();
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    // Use i18next current language if no currentLocale prop is provided
    const activeLocale = currentLocale || i18n.language;

    const handleLanguageChange = (locale: string) => {
        if (locale !== activeLocale) {
            // Change language in i18next
            i18n.changeLanguage(locale);
        }
        setIsOpen(false);
    };

    const currentLanguage = languages.find(lang => lang.code === activeLocale) || languages[0];

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200 bg-gray-800 border-gray-600 hover:bg-gray-700' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'} border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                aria-label="Select language"
            >
                <Globe className="w-4 h-4" />
                {showLabels && (
                    <span className="hidden sm:inline">
                        {currentLanguage.nativeName}
                    </span>
                )}
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className={`absolute right-0 z-20 mt-2 w-48 ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-md shadow-lg transition-colors duration-300`}>
                        <div className="py-1">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors duration-150 ${
                                        language.code === activeLocale 
                                            ? (theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700')
                                            : (theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {language.nativeName}
                                        </span>
                                        {showLabels && (
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                                {language.name}
                                            </span>
                                        )}
                                    </div>
                                    {language.code === activeLocale && (
                                        <Check className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Compact version for mobile or space-constrained areas
export function CompactLanguageSwitcher({ 
    currentLocale = 'en', 
    className = '' 
}: Omit<LanguageSwitcherProps, 'showLabels'>) {
    return (
        <LanguageSwitcher 
            currentLocale={currentLocale} 
            className={className} 
            showLabels={false} 
        />
    );
}

// Simple dropdown version
export function SimpleLanguageSwitcher({ 
    currentLocale, 
    className = '' 
}: Omit<LanguageSwitcherProps, 'showLabels'>) {
    const { i18n } = useTranslation();
    const { theme } = useTheme();
    const activeLocale = currentLocale || i18n.language;

    const handleLanguageChange = (locale: string) => {
        if (locale !== activeLocale) {
            // Change language in i18next
            i18n.changeLanguage(locale);
        }
    };

    return (
        <Select value={activeLocale} onValueChange={handleLanguageChange}>
            <SelectTrigger className={`w-full ${className}`}>
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <SelectValue placeholder="Select language" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {language.nativeName}
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
