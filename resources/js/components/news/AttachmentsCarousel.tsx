import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ImageAtt = { url: string; width?: number | null; height?: number | null; order: number };
type VideoAtt = { embedUrl: string; provider: string; order: number };

export interface AttachmentsCarouselProps {
    title: string;
    images?: ImageAtt[];
    videos?: VideoAtt[];
}

export default function AttachmentsCarousel({ title, images = [], videos = [] }: AttachmentsCarouselProps) {
    const items = useMemo(() => {
        return [
            ...images.map(a => ({ type: 'image' as const, order: a.order, data: a })),
            ...videos.map(a => ({ type: 'video' as const, order: a.order, data: a })),
        ].sort((a, b) => a.order - b.order);
    }, [images, videos]);

    const [index, setIndex] = useState(0);
    
    // Reset index when items change (e.g., switching between news articles)
    useEffect(() => {
        setIndex(0);
    }, [items]);
    
    const hasItems = items.length > 0;
    const canPrev = hasItems && index > 0;
    const canNext = hasItems && index < items.length - 1;

    if (!hasItems) return null;

    const current = items[index];
    
    // Safety check to prevent errors during rapid switching
    if (!current || !current.type) {
        return (
            <div className="aspect-video bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative max-w-full">
            <div className="aspect-video bg-gray-100 dark:bg-slate-700 overflow-hidden max-w-full">
                {current.type === 'image' ? (
                    <img
                        src={(current.data as ImageAtt).url}
                        alt={title}
                        className="w-full h-full object-cover"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                ) : (
                    <iframe
                        src={(current.data as VideoAtt).embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen={true}
                        title={`${title} - attachment ${index + 1}`}
                    />
                )}
            </div>

            {/* Controls */}
            <div className="absolute inset-y-0 left-0 flex items-center p-2">
                <Button type="button" size="icon" variant="secondary" className="h-8 w-8" disabled={!canPrev} onClick={() => setIndex(i => Math.max(0, i - 1))}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center p-2">
                <Button type="button" size="icon" variant="secondary" className="h-8 w-8" disabled={!canNext} onClick={() => setIndex(i => Math.min(items.length - 1, i + 1))}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Dots */}
            {items.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            aria-label={`Go to attachment ${i + 1}`}
                            className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'} border border-black/10`}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}


