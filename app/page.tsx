'use client';

import SearchBar from './components/SearchBar';
import TreeView from './components/TreeView';

export default function Home() {
  const handleSearch = (query: string) => {
    // This will be called after 1 second of debounce
    // Currently just logs to console as requested
  };

  const handleEnter = (query: string) => {
    // This will be called when Enter is pressed
    // Currently just logs to console as requested
  };

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

