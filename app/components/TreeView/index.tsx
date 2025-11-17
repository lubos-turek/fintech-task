'use client';

import { useMemo,useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TreeViewProps, Category } from './types';
import { getLabelFromPath, fetchSubcategories } from './utils';
import { ExpandIcon } from './components/ExpandIcon';
import { SubcategoriesCount } from './components/SubcategoriesCount';
import { Loading } from './components/Loading';
import { SubcategoriesContainer } from './components/SubcategoriesContainer';
import { CategoryContainer } from './components/CategoryContainer';

export default function TreeView({ path, size }: TreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const label = useMemo(() => getLabelFromPath(path), [path]);

  const { data: subcategories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories', path],
    queryFn: () => fetchSubcategories(path),
    enabled: isExpanded,
  });

  const onClick = () => {
    if (size !== 0)
      setIsExpanded(!isExpanded);
  };

  return (
    <>
      <CategoryContainer onClick={onClick}>
        <ExpandIcon isExpanded={isExpanded} size={size ?? 0} />
        <span className="text-gray-800 dark:text-gray-200">{label}</span>
        <SubcategoriesCount count={size ?? subcategories.length} />
      </CategoryContainer>

      {isExpanded && (
        <SubcategoriesContainer>
          <Loading isLoading={isLoading}>
            {subcategories.map((category) => (
              <TreeView key={category.id} path={category.path} size={category.size} />
            ))}
          </Loading>
        </SubcategoriesContainer>
      )}
    </>
  );
}

