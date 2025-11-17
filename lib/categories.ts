import { Category } from "./types";

export const DEFAULT_SEARCH_QUERY = "ImageNet 2011 Fall Release";

export async function fetchSearchResults(query: string): Promise<Category[]> {
  const trimmedQuery = query.trim();
  const actualQuery = trimmedQuery || DEFAULT_SEARCH_QUERY;
  const res = await fetch(`/api/categories/search?q=${encodeURIComponent(actualQuery)}`);
  if (!res.ok) {
    throw new Error("Failed to search categories");
  }
  return res.json();
}

export async function fetchSubcategories(path: string): Promise<Category[]> {
  const res = await fetch(`/api/categories?parentPath=${encodeURIComponent(path)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch subcategories");
  }
  return res.json();
}
