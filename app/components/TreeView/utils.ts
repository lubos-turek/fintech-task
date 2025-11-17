import { Category } from './types';

export function getLabelFromPath(path: string, displayWholePath: boolean = false): string {
  if (displayWholePath) {
    return path.replace(/ > /g, ' ▶ ');
  }
  if (!path.includes(' > ')) {
    return path;
  }
  const parts = path.split(' > ');
  const lastPart = parts[parts.length - 1];
  return lastPart || path;
}

export async function fetchSubcategories(path: string): Promise<Category[]> {
  const res = await fetch(`/api/categories?parentPath=${encodeURIComponent(path)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch subcategories');
  }
  return res.json();
}

