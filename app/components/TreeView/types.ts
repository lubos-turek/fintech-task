export interface Category {
  id: number;
  path: string;
  size: number;
  depth: number;
  parentPath: string | null;
}

export interface TreeViewProps {
  path: string;
  size?: number;
}

