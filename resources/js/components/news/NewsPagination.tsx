import { Link } from '@inertiajs/react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface NewsPaginationProps {
  links: PaginationLink[];
}

export default function NewsPagination({ links }: NewsPaginationProps) {
  // Don't render if there are only basic pagination links (prev, current, next)
  if (!links || links.length <= 3) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center px-4">
      <nav className="flex space-x-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url || '#'}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              link.active
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </nav>
    </div>
  );
}
