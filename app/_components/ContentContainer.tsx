import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
  searchedText?: string;
}

export default function ContentContainer({ children, searchedText }: ContentContainerProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {searchedText && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Search Results
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

