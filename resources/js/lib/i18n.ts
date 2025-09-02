import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en/translation.json';
import amTranslations from '../locales/am/translation.json';
import tgTranslations from '../locales/tg/translation.json';

// Language resources
const resources = {
  en: {
    translation: enTranslations
  },
  am: {
    translation: amTranslations
  },
  tg: {
    translation: tgTranslations
  }
};

// i18next configuration
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Fallback language
    fallbackLng: 'tg',
    
    // Supported languages
    supportedLngs: ['en', 'am', 'tg'],
    
    // Language names for display
    lng: 'tg', // Default language
    
    // Namespaces
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Resources (for static loading)
    resources,
    
    // Detection options
    detection: {
      // Order of language detection
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      
      // Keys to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      
      // Cache user language
      caches: ['localStorage', 'cookie'],
      
      // Cookie options
      cookieOptions: {
        path: '/',
        sameSite: 'strict'
      }
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // React options
    react: {
      useSuspense: false, // Disable suspense for better UX
    },
    
    // Debug mode (set to false in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Save missing translations
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lngs: readonly string[], ns: string, key: string, fallbackValue: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${lngs.join(', ')}.${ns}.${key}`);
      }
    }
  });

// Export the configured i18n instance
export default i18n;

// Helper function to change language
export const changeLanguage = (lng: string) => {
  return i18n.changeLanguage(lng);
};

// Helper function to get current language
export const getCurrentLanguage = () => {
  return i18n.language;
};

// Helper function to get available languages
export const getAvailableLanguages = () => {
  return i18n.options.supportedLngs || ['en', 'am', 'tg'];
};

// Helper function to check if language is supported
export const isLanguageSupported = (lng: string) => {
  const supportedLngs = i18n.options.supportedLngs;
  return Array.isArray(supportedLngs) ? supportedLngs.includes(lng) : false;
};
