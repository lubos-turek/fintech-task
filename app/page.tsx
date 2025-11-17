'use client';

import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import TreeView from './components/TreeView';
import { Category } from './components/TreeView/types';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);

    if (!trimmedQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/categories/search?q=${encodeURIComponent(trimmedQuery)}`);
      if (!res.ok) {
        throw new Error('Failed to search categories');
      }
      const results = await res.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching categories:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    performSearch(query);
  }, [performSearch]);

  const handleEnter = useCallback((query: string) => {
    performSearch(query);
  }, [performSearch]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ImageNet Categories Explorer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse and search through ImageNet category hierarchy
          </p>
        </header>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onEnter={handleEnter}
            placeholder="Search ImageNet categories..."
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Search Results
              </h2>
              {isSearching ? (
                <div className="text-gray-600 dark:text-gray-400">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((category) => (
                    <TreeView
                      key={category.id}
                      path={category.path}
                      size={category.size}
                      displayWholePath={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-600 dark:text-gray-400">No results found</div>
              )}
            </div>
          </div>
        )}

        {/* Tree View */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="max-h-[600px] overflow-y-auto">
              <TreeView path="ImageNet 2011 Fall Release" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

