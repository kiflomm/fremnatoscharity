import { Newspaper } from 'lucide-react';

interface EmptyNewsStateProps {
  isMobile?: boolean;
}

export default function EmptyNewsState({ isMobile = false }: EmptyNewsStateProps) {
  if (isMobile) {
    return (
      <div className="text-center py-12 px-4">
        <Newspaper className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No news yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <Newspaper className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No News Available</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for the latest news and updates.
        </p>
      </div>
    </div>
  );
}
