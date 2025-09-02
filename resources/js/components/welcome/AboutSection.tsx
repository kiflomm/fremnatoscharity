import { Link } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function AboutSection() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <section className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-green-50'} py-20 lg:py-32 overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sticky side nav */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24">
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">{t('about.title', { defaultValue: 'About Us' })}</h2>
                            <nav className="space-y-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur rounded-xl p-2 ring-1 ring-slate-200/60 dark:ring-slate-700/50">
                                {[
                                    { id: 'slide-1', title: t('slideshow.slide1.title') },
                                    { id: 'slide-2', title: t('slideshow.slide2.title') },
                                    { id: 'slide-3', title: t('slideshow.slide3.title') },
                                    { id: 'slide-4', title: t('slideshow.slide4.title') },
                                    { id: 'slide-5', title: t('slideshow.slide5.title') },
                                ].map((item, idx) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/70 transition-colors"
                                    >
                                        <span className="mr-2 text-slate-400">{String(idx + 1).padStart(2, '0')}</span>
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {[
                            { id: 'slide-1', title: t('slideshow.slide1.title'), description: t('slideshow.slide1.description') },
                            { id: 'slide-2', title: t('slideshow.slide2.title'), description: t('slideshow.slide2.description') },
                            { id: 'slide-3', title: t('slideshow.slide3.title'), description: t('slideshow.slide3.description') },
                            { id: 'slide-4', title: t('slideshow.slide4.title'), description: t('slideshow.slide4.description') },
                            { id: 'slide-5', title: t('slideshow.slide5.title'), description: t('slideshow.slide5.description') },
                        ].map((section, index) => (
                            <section id={section.id} key={section.id} className="scroll-mt-24">
                                <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur ring-1 ring-slate-200/60 dark:ring-slate-700/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
                                    <div className="absolute -top-4 -left-4 size-24 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-2xl" aria-hidden />
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                                {section.title}
                                            </h3>
                                            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {section.description}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        ))}

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="#donate" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-medium shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                                {t('cta.donate', { defaultValue: 'Donate Now' })}
                            </Link>
                            <Link href="#mission" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 px-6 py-3 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                {t('cta.learnMore', { defaultValue: 'Learn More' })}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
