import { useState, useEffect } from 'react';
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
}

export default function ImageSlideshow({ slides, autoPlay = true, interval = 5000 }: ImageSlideshowProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { theme } = useTheme();

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    if (slides.length === 0) {
        return (
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
                <div className="relative h-96">
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                            <p className="text-lg">No images available</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden mb-6 transition-colors duration-300`}>
            {/* Image container with overlaid text */}
            <div className="relative h-[500px]" style={{ minHeight: '500px' }}>

                
                {/* Current Image */}
                <img 
                    src={slides[currentSlide].imageUrl} 
                    alt={slides[currentSlide].alt} 
                    className="absolute inset-0 w-full h-full object-cover z-1"
                    style={{ 
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onLoad={(e) => {
                        console.log('Image loaded successfully:', slides[currentSlide].imageUrl);
                        console.log('Image dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                        console.log('Image visible:', e.currentTarget.offsetWidth, 'x', e.currentTarget.offsetHeight);
                        console.log('Image element:', e.currentTarget);
                    }}
                    onError={(e) => {
                        console.error('Image failed to load:', slides[currentSlide].imageUrl);
                        // Hide the broken image and show fallback content
                        e.currentTarget.style.display = 'none';
                        const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallbackDiv) {
                            fallbackDiv.style.display = 'flex';
                        }
                    }}
                />
                
                {/* Fallback content when image fails to load */}
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center transition-colors duration-300`} style={{ display: 'none' }}>
                    <div className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                        <svg className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-medium">Image not available</p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Please add your images to the slideshow</p>
                    </div>
                </div>
                
                {/* Navigation Arrows */}
                {slides.length > 1 && (
                    <>
                        <button 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2  bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg z-30"
                            onClick={goToPrevious}
                            aria-label="Previous slide"
                        >
                            <svg className="w-6 h-6 transition-transform duration-300 hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <button 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2  bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg z-30"
                            onClick={goToNext}
                            aria-label="Next slide"
                        >
                            <svg className="w-6 h-6 transition-transform duration-300 hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
                
                {/* Text overlay on lower half of image */}
                <div className="absolute  bottom-15 left-0 right-0  bg-opacity-50 p-6 z-20 transition-all duration-300 hover:bg-opacity-70">
                    <div className="text-center">
                        {slides[currentSlide].title && (
                            <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg transition-all duration-300 hover:scale-105 transform">{slides[currentSlide].title}</h3>
                        )}
                        {slides[currentSlide].description && (
                            <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg whitespace-pre-line transition-all duration-300 hover:font-bold leading-relaxed">{slides[currentSlide].description}</p>
                        )}
                    </div>
                </div>
                
                {/* Slide Indicators */}
                {slides.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                                    index === currentSlide 
                                        ? 'bg-white bg-opacity-100 shadow-lg' 
                                        : 'bg-white bg-opacity-30 hover:bg-opacity-70 hover:shadow-md'
                                }`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
                
                {/* Slide Counter */}
                {slides.length > 1 && (
                    <div className="absolute top-4 right-4  bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
                        {currentSlide + 1} / {slides.length}
                    </div>
                )}
            </div>
        </div>
    );
}
