'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onEnter?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  onEnter,
  placeholder = 'Search categories...' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounce (1 second)
    if (query.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        console.log('Debounced search:', query);
        onSearch?.(query);
      }, 1000);
    }

    // Cleanup on unmount or query change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter pressed, search:', query);
      onEnter?.(query);
      
      // Clear debounce timer since we're handling it immediately
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
}

