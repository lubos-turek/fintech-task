'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Category {
  id: number;
  path: string;
  size: number;
  depth: number;
  parentPath: string | null;
}

interface TreeViewProps {
  path: string;
}

export default function TreeView({ path }: TreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract the label from the path (the part after the last ">")
  const label = path.includes(' > ') 
    ? path.split(' > ').pop() || path
    : path;

  const { data: subcategories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories', path],
    queryFn: async () => {
      const res = await fetch(`/api/categories?parentPath=${encodeURIComponent(path)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      return res.json();
    },
    enabled: isExpanded,
  });

  const hasChildren = subcategories.length > 0;

  return (
    <div className="ml-4">
      <div 
        className="flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="mr-2 text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </span>
        {!hasChildren && !isLoading && <span className="mr-2 w-4" />}
        <span className="text-gray-800 dark:text-gray-200">{label}</span>
        {subcategories.length > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            ({subcategories.length})
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="py-2 px-3 text-sm text-gray-500">Loading...</div>
          ) : hasChildren ? (
            subcategories.map((category) => (
              <TreeView key={category.id} path={category.path} />
            ))
          ) : (
            <div className="py-2 px-3 text-sm text-gray-500">No subcategories</div>
          )}
        </div>
      )}
    </div>
  );
}
