import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'toggle' | 'button' | 'icon-only';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  variant = 'toggle',
  size = 'default',
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const getThemeIcon = () => {
    if (theme === 'dark') {
      return (
        <svg
          className="h-4 w-4 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-4 w-4 transition-all duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx={12} cy={12} r={5} />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );
  };

  const getThemeLabel = () => {
    return theme === 'dark' ? t('switch_to_light_mode') : t('switch_to_dark_mode');
  };

  if (variant === 'button') {
    return (
      <Toggle
        pressed={theme === 'dark'}
        onPressedChange={toggleTheme}
        className={cn(
          "group relative overflow-hidden transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
          "border border-slate-200 dark:border-slate-700",
          "shadow-lg hover:shadow-xl",
          "data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-600 data-[state=on]:to-purple-600",
          "data-[state=on]:text-white data-[state=on]:shadow-blue-500/25",
          "data-[state=off]:text-slate-600 dark:text-slate-400",
          size === 'sm' && "h-8 px-3",
          size === 'lg' && "h-12 px-6 text-base",
          className
        )}
        aria-label={getThemeLabel()}
        title={getThemeLabel()}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            {getThemeIcon()}
            {/* Animated background glow */}
            <div className={cn(
              "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
              "bg-gradient-to-r from-blue-400/20 to-purple-400/20",
              "group-hover:opacity-100 group-data-[state=on]:opacity-100"
            )} />
          </div>
          {showLabel && (
            <span className="font-medium">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          )}
        </div>
      </Toggle>
    );
  }

  if (variant === 'icon-only') {
    return (
      <Toggle
        pressed={theme === 'dark'}
        onPressedChange={toggleTheme}
        className={cn(
          "group relative overflow-hidden transition-all duration-300",
          "hover:scale-110 active:scale-95",
          "bg-slate-100 dark:bg-slate-800",
          "border border-slate-200 dark:border-slate-700",
          "shadow-md hover:shadow-lg",
          "data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-600 data-[state=on]:to-purple-600",
          "data-[state=on]:text-white data-[state=on]:shadow-blue-500/25",
          "data-[state=off]:text-slate-600 dark:text-slate-400",
          size === 'sm' && "h-8 w-8",
          size === 'lg' && "h-12 w-12",
          className
        )}
        aria-label={getThemeLabel()}
        title={getThemeLabel()}
      >
        <div className="relative">
          {getThemeIcon()}
          {/* Rotating background effect */}
          <div className={cn(
            "absolute inset-0 rounded-full transition-transform duration-500",
            "bg-gradient-to-r from-blue-400/10 to-purple-400/10",
            "group-data-[state=on]:rotate-180"
          )} />
        </div>
      </Toggle>
    );
  }

  // Default toggle switch variant
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <button
        onClick={toggleTheme}
        className={cn(
          "group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "shadow-inner",
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'bg-gradient-to-r from-amber-400 to-orange-400'
        )}
        aria-label={getThemeLabel()}
        title={getThemeLabel()}
      >
        {/* Background pattern overlay */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className={cn(
            "absolute inset-0 opacity-20 transition-opacity duration-300",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
              : 'bg-gradient-to-r from-amber-300 to-orange-300'
          )} />
          {/* Animated particles effect */}
          <div className={cn(
            "absolute inset-0 opacity-30 transition-all duration-500",
            theme === 'dark' 
              ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%)]' 
              : 'bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.3),transparent_50%)]'
          )} />
        </div>

        {/* Toggle circle */}
        <div
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition-all duration-300",
            "flex items-center justify-center shadow-lg",
            theme === 'dark' 
              ? 'translate-x-5 bg-white shadow-blue-200/50' 
              : 'translate-x-0 bg-white shadow-amber-200/50'
          )}
        >
          {/* Icon with smooth rotation */}
          <div className={cn(
            "transition-transform duration-300",
            theme === 'dark' ? 'rotate-0' : 'rotate-180'
          )}>
            {theme === 'dark' ? (
              <svg
                className="h-3 w-3 text-slate-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg
                className="h-3 w-3 text-amber-500"
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
        </div>

        {/* Hover glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
          "bg-gradient-to-r from-blue-400/20 to-purple-400/20",
          "group-hover:opacity-100"
        )} />

        {/* Animated border */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-transparent transition-all duration-300",
          "group-hover:border-blue-400/50 group-focus:border-blue-500/50"
        )} />
      </button>
    </div>
  );
};

export default ThemeToggle;
