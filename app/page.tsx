"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "./components/SearchBar";
import TreeView from "./components/TreeView";
import ContentContainer from "./_components/ContentContainer";
import Header from "./_components/Header";
import StyleWrapper from "./_components/StyleWrapper";
import { Category } from "./components/TreeView/types";

const DEFAULT_SEARCH_QUERY = "ImageNet 2011 Fall Release";

async function fetchSearchResults(query: string): Promise<Category[]> {
  const trimmedQuery = query.trim();
  const actualQuery = trimmedQuery || DEFAULT_SEARCH_QUERY;
  const res = await fetch(
    `/api/categories/search?q=${encodeURIComponent(actualQuery)}`,
  );
  if (!res.ok) {
    throw new Error("Failed to search categories");
  }
  return res.json();
}

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
        {isSearching ? (
          <div className="text-gray-600 dark:text-gray-400">
            Searching...
          </div>
        ) : searchResults.length > 0 ? (
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
      </ContentContainer>
    </StyleWrapper>
  );
}
