import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Slide {
    id: number;
    imageUrl: string;
    alt: string;
    title?: string;
    description?: string;
}

interface ImageSlideshowProps {
    slides: Slide[];
    autoPlay?: boolean;
    interval?: number;
    showIndicators?: boolean;
    showArrows?: boolean;
    showCaptions?: boolean;
    className?: string;
    captionVariant?: 'glass' | 'solid' | 'none';
    captionPosition?: 'auto' | 'bottom' | 'center' | 'top';
}

export default function ImageSlideshow({
    slides,
    autoPlay = true,
    interval = 5000,
    showIndicators = true,
    showArrows = true,
    showCaptions = false,
    className = '',
    captionVariant = 'glass',
    captionPosition = 'auto'
}: ImageSlideshowProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const touchStartX = useRef<number | null>(null);
    const { theme } = useTheme();

    const total = slides.length;

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(((index % total) + total) % total);
        setProgress(0);
    }, [total]);

    const goToPrevious = useCallback(() => {
        goToSlide(currentSlide - 1);
    }, [currentSlide, goToSlide]);

    const goToNext = useCallback(() => {
        goToSlide(currentSlide + 1);
    }, [currentSlide, goToSlide]);

    // Auto-play with progress bar
    useEffect(() => {
        if (!autoPlay || isPaused || total <= 1) return;

        const stepMs = 50;
        const increment = (100 * stepMs) / interval;
        const timer = setInterval(() => {
            setProgress((p) => {
                if (p + increment >= 100) {
                    goToNext();
                    return 0;
                }
                return p + increment;
            });
        }, stepMs);

        return () => clearInterval(timer);
    }, [autoPlay, interval, goToNext, isPaused, total]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!containerRef.current) return;
            if (document.activeElement !== containerRef.current) return;
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goToNext, goToPrevious]);

    // Swipe navigation
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null) return;
        const dx = e.touches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 60) {
            dx > 0 ? goToPrevious() : goToNext();
            touchStartX.current = null;
        }
    };
    const onTouchEnd = () => {
        touchStartX.current = null;
    };

    if (total === 0) {
        return (
            <div className={`${className} relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900`}> 
                <div className="h-64 sm:h-80 md:h-[28rem] flex items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 size-14 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur flex items-center justify-center shadow">
                            <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">No images available</p>
                    </div>
                </div>
            </div>
        );
    }

    const slide = slides[currentSlide];

    return (
        <div
            ref={containerRef}
            className={`${className} group relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/60 dark:ring-slate-700/50`}
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label="Image slideshow"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Background image */}
            <div className={`relative h-64 sm:h-80 md:h-[28rem] ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <img
                    key={slide.id}
                    src={slide.imageUrl}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover will-change-transform scale-105 transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                    }}
                />

                {/* Fallback */}
                <div className={`hidden absolute inset-0 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} items-center justify-center`}>
                    <div className="text-center">
                        <div className="mx-auto mb-3 size-12 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Image not available</p>
                    </div>
                </div>

                {/* Gradient overlays (stronger bottom scrim for readability) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

                {/* Captions with glass/solid variants and configurable position */}
                {showCaptions && (slide.title || slide.description) && (
                    <div
                        className={[
                            'absolute inset-x-0 p-4 sm:p-6',
                            captionPosition === 'top' && 'top-4 sm:top-6',
                            captionPosition === 'center' && 'top-1/2 -translate-y-1/2',
                            captionPosition === 'bottom' && 'bottom-4 sm:bottom-6',
                            captionPosition === 'auto' && 'top-1/2 -translate-y-1/2 md:translate-y-0 md:top-auto md:bottom-6'
                        ].filter(Boolean).join(' ')}
                    >
                        <div className="max-w-3xl mx-auto">
                            <div
                                className={[
                                    'transition-all duration-300 rounded-2xl border shadow-lg',
                                    'px-4 py-3 sm:px-6 sm:py-4',
                                    'backdrop-blur',
                                    captionVariant === 'none' && 'bg-transparent border-transparent shadow-none',
                                    captionVariant === 'glass' && 'bg-black/35 border-white/10 hover:bg-black/45',
                                    captionVariant === 'solid' && 'bg-black/70 border-black/40',
                                    captionPosition === 'center' ? 'mx-auto text-center' : 'mx-auto text-center'
                                ].filter(Boolean).join(' ')}
                            >
                                {slide.title && (
                                    <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight drop-shadow [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                                        {slide.title}
                                    </h3>
                                )}
                                {slide.description && (
                                    <p className="mt-1.5 sm:mt-2 text-white/95 text-sm sm:text-base leading-relaxed drop-shadow [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
                                        {slide.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                {autoPlay && total > 1 && (
                    <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-white/20">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-[width] duration-75"
                            style={{ width: `${progress}%` }}
                            aria-hidden
                        />
                    </div>
                )}

                {/* Arrows */}
                {showArrows && total > 1 && (
                    <>
                        <button
                            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 grid place-items-center size-9 sm:size-10 rounded-full bg-white/80 text-slate-900 shadow-xl backdrop-blur hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all z-20"
                            onClick={goToPrevious}
                            aria-label="Previous slide"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 grid place-items-center size-9 sm:size-10 rounded-full bg-white/80 text-slate-900 shadow-xl backdrop-blur hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all z-20"
                            onClick={goToNext}
                            aria-label="Next slide"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Indicators */}
                {showIndicators && total > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className={`group/ind w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    i === currentSlide
                                        ? 'w-6 bg-white shadow-md'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={i === currentSlide}
                            />
                        ))}
                    </div>
                )}

                {/* Counter */}
                {total > 1 && (
                    <div className="absolute top-3 right-3 z-20 rounded-full bg-black/40 text-white text-xs px-2.5 py-1 backdrop-blur">
                        {currentSlide + 1} / {total}
                    </div>
                )}
            </div>
        </div>
    );
}
