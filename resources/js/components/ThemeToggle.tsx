import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-6 rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${theme === 'dark' 
          ? 'bg-blue-600 focus:ring-blue-500' 
          : 'bg-gray-300 focus:ring-gray-400'
        }
        ${className}
      `}
      aria-label={theme === 'dark' ? t('switch_to_light_mode') : t('switch_to_dark_mode')}
      title={theme === 'dark' ? t('switch_to_light_mode') : t('switch_to_dark_mode')}
    >
      {/* Toggle circle */}
      <div
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${theme === 'dark' 
            ? 'transform translate-x-6 bg-white' 
            : 'transform translate-x-0 bg-white'
          }
        `}
      >
        {/* Icon */}
        {theme === 'dark' ? (
          // Moon icon
          <svg
            className="w-3 h-3 text-gray-800"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          // Sun icon
          <svg
            className="w-3 h-3 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
