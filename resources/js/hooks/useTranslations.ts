import { useTranslation } from 'react-i18next';

/**
 * Custom hook for translations with additional utilities
 */
export function useTranslations() {
    const { t, i18n, ready } = useTranslation();

    /**
     * Translate a key with fallback
     */
    const translate = (key: string, options?: any, fallback?: string): string => {
        const translation = t(key, options);
        
        // If translation is the same as key (meaning not found), use fallback
        if (translation === key && fallback) {
            return fallback;
        }
        
        // Ensure we always return a string
        return typeof translation === 'string' ? translation : String(translation);
    };

    /**
     * Translate with pluralization
     */
    const translatePlural = (key: string, count: number, options?: any) => {
        return t(key, { count, ...options });
    };

    /**
     * Translate with interpolation
     */
    const translateWithInterpolation = (key: string, values: Record<string, any>) => {
        return t(key, values);
    };

    /**
     * Check if a translation key exists
     */
    const hasTranslation = (key: string) => {
        return t(key) !== key;
    };

    /**
     * Get current language
     */
    const getCurrentLanguage = () => {
        return i18n.language;
    };

    /**
     * Get available languages
     */
    const getAvailableLanguages = () => {
        return i18n.options.supportedLngs || ['en', 'am', 'tg'];
    };

    /**
     * Change language
     */
    const changeLanguage = (language: string) => {
        return i18n.changeLanguage(language);
    };

    /**
     * Check if i18next is ready
     */
    const isReady = () => {
        return ready;
    };

    return {
        t: translate,
        translate,
        translatePlural,
        translateWithInterpolation,
        hasTranslation,
        getCurrentLanguage,
        getAvailableLanguages,
        changeLanguage,
        isReady,
        i18n,
        ready
    };
}

/**
 * Hook for getting language information
 */
export function useLanguage() {
    const { i18n } = useTranslation();

    return {
        current: i18n.language,
        available: i18n.options.supportedLngs || ['en', 'am', 'tg'],
        change: (language: string) => i18n.changeLanguage(language),
        isRTL: () => {
            // For now, all our languages are LTR
            return false;
        }
    };
}

/**
 * Hook for formatting numbers, dates, etc. based on current language
 */
export function useLocaleFormatting() {
    const { i18n } = useTranslation();

    const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
        try {
            return new Intl.NumberFormat(i18n.language, options).format(number);
        } catch (error) {
            return number.toString();
        }
    };

    const formatCurrency = (amount: number, currency: string = 'ETB', options?: Intl.NumberFormatOptions) => {
        try {
            return new Intl.NumberFormat(i18n.language, {
                style: 'currency',
                currency,
                ...options
            }).format(amount);
        } catch (error) {
            return `${currency} ${formatNumber(amount)}`;
        }
    };

    const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return new Intl.DateTimeFormat(i18n.language, options).format(dateObj);
        } catch (error) {
            return new Date(date).toLocaleDateString();
        }
    };

    const formatRelativeTime = (date: Date | string) => {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

            const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

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
            return formatDate(date, { dateStyle: 'short' });
        }
    };

    return {
        formatNumber,
        formatCurrency,
        formatDate,
        formatRelativeTime
    };
}
