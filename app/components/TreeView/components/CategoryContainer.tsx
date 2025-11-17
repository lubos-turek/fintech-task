export const CategoryContainer = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <div 
    className="ml-4 flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
);

