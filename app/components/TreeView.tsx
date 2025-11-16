'use client';

import { useState } from 'react';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
}

function TreeNodeComponent({ node }: { node: TreeNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4">
      <div 
        className="flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="mr-2 text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span className="mr-2 w-4" />}
        <span className="text-gray-800 dark:text-gray-200">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700">
          {node.children!.map((child) => (
            <TreeNodeComponent key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ data }: TreeViewProps) {
  return (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        ImageNet Categories
      </h2>
      <div className="max-h-[600px] overflow-y-auto">
        {data.map((node) => (
          <TreeNodeComponent key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

