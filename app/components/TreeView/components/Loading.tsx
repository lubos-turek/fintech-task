export const Loading = ({ isLoading }: { isLoading: boolean }) => 
  isLoading ? (
    <div className="py-2 px-3 text-sm text-gray-500">Loading...</div>
  ) : null;

