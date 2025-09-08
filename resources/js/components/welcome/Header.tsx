import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react'; 
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <header className="relative pt-2 sm:pt-0">
            {/* Full-width logo banner with responsive height - optimized for viewport */}
            <div className="w-full overflow-hidden">
                {/* Logo for small devices */}
                <img 
                    src="https://res.cloudinary.com/dpheomaz9/image/upload/v1756810180/logo4_gwh2sz.png" 
                    alt={t('images.bannerAlt')}
                    className="w-full h-auto object-contain sm:hidden max-h-32"
                />
                {/* Logo for medium and larger devices - constrained height */}
                <img 
                    src="https://res.cloudinary.com/dpheomaz9/image/upload/v1756810180/logo_yeosov.jpg" 
                    alt={t('images.bannerAlt')} 
                    className="w-full h-auto object-cover hidden sm:block max-h-24 lg:max-h-28 xl:max-h-32"
                />
            </div>
        </header>
    );
}
