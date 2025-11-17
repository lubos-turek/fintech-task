'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TreeViewProps, Category } from './types';
import { getLabelFromPath, fetchSubcategories } from './utils';
import { ExpandIcon } from './components/ExpandIcon';
import { SubcategoriesCount } from './components/SubcategoriesCount';
import { Loading } from './components/Loading';
import { SubcategoriesContainer } from './components/SubcategoriesContainer';
import { CategoryContainer } from './components/CategoryContainer';
import { EmptyState } from './components/EmptyState';

export default function TreeView({ path }: TreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
 
  const label = getLabelFromPath(path);

  const { data: subcategories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories', path],
    queryFn: () => fetchSubcategories(path),
    enabled: isExpanded,
  });

  return (
    <>
      <CategoryContainer onClick={() => setIsExpanded(!isExpanded)}>
        <ExpandIcon isExpanded={isExpanded} />
        <span className="text-gray-800 dark:text-gray-200">{label}</span>
        <SubcategoriesCount count={subcategories.length} />
      </CategoryContainer>

      {isExpanded && (
        <SubcategoriesContainer>
          <Loading isLoading={isLoading} />
          {!isLoading && (subcategories.length > 0 ? (
            subcategories.map((category) => (
              <TreeView key={category.id} path={category.path} />
            ))
          ) : (
            <EmptyState />
          ))}
        </SubcategoriesContainer>
      )}
    </>
  );
}

