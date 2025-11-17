"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar, TreeView, ContentContainer, Header, StyleWrapper, Loading, EmptyResult, Category } from "./_components";
import { fetchSearchResults, DEFAULT_SEARCH_QUERY } from "@/lib/categories";

export default function Home() {
  const [searchedText, setSearchedText] = useState("");

  const { data: searchResults = [], isLoading: isSearching } = useQuery<Category[]>({
    queryKey: ["categories", "search", searchedText],
    queryFn: () => fetchSearchResults(searchedText),
  });

  return (
    <StyleWrapper>
      <Header />

      <SearchBar
        onSearch={setSearchedText}
        onEnter={setSearchedText}
        placeholder="Search ImageNet categories..."
      />

      <ContentContainer searchedText={searchedText}>
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
                  searchedText={searchedText || DEFAULT_SEARCH_QUERY}
                />
              ))}
            </div>
          ) : <EmptyResult />}
        </Loading>
      </ContentContainer>
    </StyleWrapper>
  );
}
