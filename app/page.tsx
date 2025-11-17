"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar, TreeView, ContentContainer, Header, StyleWrapper, Loading, Category } from "./_components";
import { fetchSearchResults, DEFAULT_SEARCH_QUERY } from "@/lib/categories";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults = [], isLoading: isSearching } = useQuery<Category[]>({
    queryKey: ["categories", "search", searchQuery],
    queryFn: () => fetchSearchResults(searchQuery),
  });

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [],
  );

  const handleEnter = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [],
  );

  return (
    <StyleWrapper>
      <Header />

      <SearchBar
        onSearch={handleSearch}
        onEnter={handleEnter}
        placeholder="Search ImageNet categories..."
      />

      <ContentContainer>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Search Results
        </h2>
        <Loading isLoading={isSearching}>
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((category) => (
                <TreeView
                  key={category.id}
                  path={category.path}
                  size={category.size}
                  displayWholePath={true}
                  isSearchResult={true}
                  searchedText={searchQuery || DEFAULT_SEARCH_QUERY}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">
              No results found
            </div>
          )}
        </Loading>
      </ContentContainer>
    </StyleWrapper>
  );
}
