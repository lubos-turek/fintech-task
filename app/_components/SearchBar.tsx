"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onEnter?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, onEnter, placeholder = "Search categories..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, { cancel }] = useDebounce(query, 1000);

  useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cancel();
      console.log("Enter pressed, search:", query);
      onEnter?.(query);
    }
  };

  return (
    <div className="flex justify-center mb-8">
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
    </div>
  );
}
