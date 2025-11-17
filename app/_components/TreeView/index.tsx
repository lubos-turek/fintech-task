"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TreeViewProps } from "./types";
import { Category } from "@/lib/types";
import { getDisplayLabel } from "./utils";
import { fetchSubcategories } from "@/lib/categories";
import { ExpandIcon, SubcategoriesCount, SubcategoriesContainer, CategoryContainer } from "./components";
import { Loading } from "../";

export default function TreeView({ path, size, searchedText }: TreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const label = useMemo(() => getDisplayLabel(path, searchedText), [path, searchedText]);

  const { data: subcategories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories", path],
    queryFn: () => fetchSubcategories(path),
    enabled: isExpanded,
  });

  const onClick = () => {
    if (size !== 0) setIsExpanded(!isExpanded);
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
              <TreeView key={category.id} path={category.path} size={category.size} searchedText={searchedText} />
            ))}
          </Loading>
        </SubcategoriesContainer>
      )}
    </>
  );
}
