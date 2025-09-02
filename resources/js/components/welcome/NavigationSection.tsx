import ImageSlideshow from '@/components/ImageSlideshow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Link, usePage } from '@inertiajs/react';
import { Heart, Users, Calendar, Target, ArrowRight } from 'lucide-react';
import { SimpleLanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import type { SharedData } from '@/types';
import { motion, Variants } from 'framer-motion';

interface Slide {
    id: number;
    imageUrl: string;
    alt: string;
    title: string;
    description: string;
}

export default function NavigationSection() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { t } = useTranslation();

    const slides: Slide[] = [
        {
            id: 1,
            imageUrl: 'https://res.cloudinary.com/dpheomaz9/image/upload/v1756810180/la_vznqng.jpg',
            alt: t('slideshow.slide1.alt'),
            title: t('slideshow.slide1.title'),
            description: t('slideshow.slide1.description')
        },
        {
            id: 2,
            imageUrl: 'https://res.cloudinary.com/dpheomaz9/image/upload/v1756810180/chicago_j8ekxp.jpg',
            alt: t('slideshow.slide2.alt'),
            title: t('slideshow.slide2.title'),
            description: t('slideshow.slide2.description')
        },
        {
            id: 3,
            imageUrl: 'https://res.cloudinary.com/dpheomaz9/image/upload/v1756810180/ny_uq5fio.jpg',
            alt: t('slideshow.slide3.alt'),
            title: t('slideshow.slide3.title'),
            description: t('slideshow.slide3.description')
        },
        {
            id: 4,
            imageUrl: 'https://res.cloudinary.com/dpheomaz9/image/upload/v1756810180/ny_uq5fio.jpg',
            alt: t('slideshow.slide4.alt'),
            title: t('slideshow.slide4.title'),
            description: t('slideshow.slide4.description')
        },
        {
            id: 5,
            imageUrl: 'https://res.cloudinary.com/dpheomaz9/image/upload/v1756810180/chicago_j8ekxp.jpg',
            alt: t('slideshow.slide5.alt'),
            title: t('slideshow.slide5.title'),
            description: t('slideshow.slide5.description')
        }
    ];

    const stats = [
        {
            icon: Heart,
            value: '500+',
            label: t('stats.livesTouched'),
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950/20'
        },
        {
            icon: Calendar,
            value: '15+',
            label: t('stats.yearsService'),
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950/20'
        },
        {
            icon: Target,
            value: '3',
            label: t('stats.focusAreas'),
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20'
        }
    ];

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }
      
    return (
        <section id="navigation" className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 max-h-[calc(100svh-140px)] lg:max-h-[calc(100svh-180px)] overflow-y-auto">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-0 pb-4">
                            <CardHeader className="pb-4 px-2">
                                <div className="flex justify-between items-center">
                                    <div className="ml-auto flex items-center space-x-2 sm:space-x-4 py-4">
                                        {/* Always visible theme and language switchers */}
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <ThemeToggle className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
                                            <SimpleLanguageSwitcher
                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Navigation */}
                                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                                    <nav className="flex items-center gap-3 sm:gap-4 text-sm">
                                        <Link href="/admin/news" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                                            {t("cta.news")}
                                        </Link>
                                        <span className="text-slate-300 dark:text-slate-600">|</span>
                                        <Link href="/admin/stories" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                                            {t("cta.stories")}
                                        </Link>
                                    </nav>
                                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                                        {auth?.user ? (
                                            <Link
                                                href="/settings/profile"
                                                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                                                aria-label={t('aria.profileSettings')}
                                            >
                                                <Users className="h-4 w-4" />
                                                <span className="hidden sm:inline">{t("cta.profile")}</span>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <Link
                                                    href="/register"
                                                    className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    {t("cta.signUp")}
                                                </Link>
                                                <Link
                                                    href="/login"
                                                    className="rounded-md px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                                                >
                                                    {t("cta.signIn")}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <CardDescription className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                    
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
              <motion.div
                variants={itemVariants}
                className="mt-8 lg:mt-10 flex flex-col flex-row gap-4 justify-center items-center"
              >
                <Button asChild size="lg" className="group font-medium">
                  <Link href="#donate">
                    <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    {t("cta.donate")}
                    <ArrowRight
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="group font-medium bg-transparent">
                  <Link href="#about">
                    {t("cta.learnMore")}
                    <ArrowRight
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
