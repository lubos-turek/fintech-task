import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
}

export default function ContentContainer({ children }: ContentContainerProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}

