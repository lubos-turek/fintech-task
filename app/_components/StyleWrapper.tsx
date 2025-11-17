import { ReactNode } from 'react';

interface StyleWrapperProps {
  children: ReactNode;
}

export default function StyleWrapper({ children }: StyleWrapperProps) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </main>
  );
}

