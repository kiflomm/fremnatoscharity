import ImageSlideshow from '@/components/ImageSlideshow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { Heart, Users, Calendar, Target, ArrowRight, Sparkles } from 'lucide-react';

interface Slide {
    id: number;
    imageUrl: string;
    alt: string;
    title: string;
    description: string;
}

export default function MissionSection() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const slides: Slide[] = [
        {
            id: 1,
            imageUrl: '/images/slideshow/la.jpg',
            alt: 'Charity work - Helping elders',
            title: t('slideshow.slide1.title'),
            description: t('slideshow.slide1.description')
        },
        {
            id: 2,
            imageUrl: '/images/slideshow/chicago.jpg',
            alt: 'Charity work - Supporting children',
            title: t('slideshow.slide2.title'),
            description: t('slideshow.slide2.description')
        },
        {
            id: 3,
            imageUrl: '/images/slideshow/ny.jpg',
            alt: 'Charity work - Mental health support',
            title: t('slideshow.slide3.title'),
            description: t('slideshow.slide3.description')
        },
        {
            id: 4,
            imageUrl: '/images/slideshow/ny.jpg',
            alt: 'Charity work - Community service',
            title: t('slideshow.slide4.title'),
            description: t('slideshow.slide4.description')
        },
        {
            id: 5,
            imageUrl: '/images/slideshow/ny.jpg',
            alt: 'Charity work - Community service',
            title: t('slideshow.slide5.title'),
            description: t('slideshow.slide5.description')
        }
    ];

    const stats = [
        {
            icon: Heart,
            value: '500+',
            label: 'Lives Touched',
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950/20'
        },
        {
            icon: Calendar,
            value: '15+',
            label: 'Years Service',
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950/20'
        },
        {
            icon: Target,
            value: '3',
            label: 'Focus Areas',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20'
        }
    ];

    return (
        <section id="mission" className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Image Slideshow */}
                    <div className="order-2 lg:order-1">
                        <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <ImageSlideshow slides={slides} autoPlay={true} interval={5000} />
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Mission Content */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-blue-600" />
                                    Our Commitment to Community
                                </CardTitle>
                                <CardDescription className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {t('mission_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {stats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className={`${stat.bgColor} p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                        >
                                            <div className="flex flex-col items-center text-center space-y-2">
                                                <div className={`p-2 rounded-lg ${stat.bgColor} border border-slate-200/50 dark:border-slate-700/50`}>
                                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                                </div>
                                                <div className={`text-2xl font-bold ${stat.color}`}>
                                                    {stat.value}
                                                </div>
                                                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Call to Action */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link href="#donate" className="flex items-center justify-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    Donate Now
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="flex-1 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
                                <Link href="#mission" className="flex items-center justify-center gap-2">
                                    Learn More
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
