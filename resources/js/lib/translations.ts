/**
 * Translation helper functions for the application
 */

// Type definitions for supported languages
export type SupportedLocale = 'en' | 'am' | 'tg';

export interface LanguageInfo {
    code: SupportedLocale;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
}

// Language configuration
export const languages: LanguageInfo[] = [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', direction: 'ltr' },
    { code: 'tg', name: 'Tigrinya', nativeName: 'ትግርኛ', direction: 'ltr' },
];

/**
 * Get language information by code
 */
export function getLanguageInfo(code: SupportedLocale): LanguageInfo | undefined {
    return languages.find(lang => lang.code === code);
}

/**
 * Get all supported language codes
 */
export function getSupportedLocales(): SupportedLocale[] {
    return languages.map(lang => lang.code);
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
    return getSupportedLocales().includes(locale as SupportedLocale);
}

/**
 * Get the current locale from the document or default to 'en'
 */
export function getCurrentLocale(): SupportedLocale {
    // Try to get from meta tag or global variable
    const metaLocale = document.querySelector('meta[name="locale"]')?.getAttribute('content');
    if (metaLocale && isSupportedLocale(metaLocale)) {
        return metaLocale;
    }

    // Try to get from window object (set by Inertia)
    const windowLocale = (window as any).locale;
    if (windowLocale && isSupportedLocale(windowLocale)) {
        return windowLocale;
    }

    // Default to English
    return 'en';
}

/**
 * Get the text direction for a locale
 */
export function getTextDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
    const language = getLanguageInfo(locale);
    return language?.direction || 'ltr';
}

/**
 * Format a number according to locale
 */
export function formatNumber(number: number, locale: SupportedLocale = getCurrentLocale()): string {
    try {
        return new Intl.NumberFormat(locale).format(number);
    } catch (error) {
        // Fallback to default formatting
        return number.toString();
    }
}

/**
 * Format a currency amount according to locale
 */
export function formatCurrency(
    amount: number, 
    currency: string = 'ETB', 
    locale: SupportedLocale = getCurrentLocale()
): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch (error) {
        // Fallback to simple formatting
        return `${currency} ${formatNumber(amount, locale)}`;
    }
}

/**
 * Format a date according to locale
 */
export function formatDate(
    date: Date | string, 
    options: Intl.DateTimeFormatOptions = {},
    locale: SupportedLocale = getCurrentLocale()
): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options,
        }).format(dateObj);
    } catch (error) {
        // Fallback to default formatting
        return new Date(date).toLocaleDateString();
    }
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
    date: Date | string,
    locale: SupportedLocale = getCurrentLocale()
): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (diffInSeconds < 60) {
            return rtf.format(-diffInSeconds, 'second');
        } else if (diffInSeconds < 3600) {
            return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
        } else if (diffInSeconds < 86400) {
            return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
        } else if (diffInSeconds < 2592000) {
            return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
        } else if (diffInSeconds < 31536000) {
            return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
        } else {
            return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
        }
    } catch (error) {
        // Fallback to simple formatting
        return formatDate(date, { dateStyle: 'short' }, locale);
    }
}

/**
 * Get plural form for a given count
 */
export function getPluralForm(
    count: number,
    singular: string,
    plural: string,
    locale: SupportedLocale = getCurrentLocale()
): string {
    // For now, use simple English pluralization
    // In the future, this could be enhanced with proper pluralization rules for each language
    return count === 1 ? singular : plural;
}

/**
 * Utility to switch language
 */
export function switchLanguage(locale: SupportedLocale): void {
    if (isSupportedLocale(locale)) {
        window.location.href = `/lang/${locale}`;
    }
}

/**
 * Get language-specific CSS classes
 */
export function getLanguageClasses(locale: SupportedLocale = getCurrentLocale()): string {
    const direction = getTextDirection(locale);
    const language = getLanguageInfo(locale);
    
    return `lang-${locale} dir-${direction} ${language?.code || 'en'}`;
}
