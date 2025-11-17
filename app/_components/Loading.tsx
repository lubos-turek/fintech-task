export const Loading = ({ isLoading, children }: { isLoading: boolean; children?: React.ReactNode }) =>
  isLoading ? <div className="py-2 px-3 text-sm text-gray-500">Loading</div> : <>{children}</>;
