export const SubcategoriesCount = ({ count }: { count: number }) =>
  count > 0 ? <span className="ml-2 text-sm text-gray-500">({count})</span> : null;
