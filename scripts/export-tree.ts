import * as fs from "fs";
import * as path from "path";
import { prisma } from "../lib/prisma";

interface CategoryNode {
  name: string;
  size: number;
  children: CategoryNode[];
}

interface CategoryRecord {
  id: number;
  path: string;
  label: string;
  size: number;
  depth: number;
  parentPath: string | null;
}

async function loadAllCategories(): Promise<CategoryRecord[]> {
  console.log("Loading all categories from database...");
  const categories = await prisma.imageNetCategory.findMany({
    orderBy: {
      depth: "asc",
    },
  });
  console.log(`Loaded ${categories.length} categories`);
  return categories;
}

function groupByParentPath(categories: CategoryRecord[]): Map<string | null, CategoryRecord[]> {
  const grouped = new Map<string | null, CategoryRecord[]>();

  for (const category of categories) {
    const parentPath = category.parentPath;
    if (!grouped.has(parentPath)) {
      grouped.set(parentPath, []);
    }
    grouped.get(parentPath)!.push(category);
  }

  return grouped;
}

function buildTree(
  rootPath: string,
  categoriesByParent: Map<string | null, CategoryRecord[]>
): CategoryNode | null {
  // Find the root category (parentPath is null)
  const rootCategories = categoriesByParent.get(null) || [];
  const rootCategory = rootCategories.find((c) => c.path === rootPath);

  if (!rootCategory) {
    return null;
  }

  return {
    name: rootCategory.label,
    size: rootCategory.size,
    children: buildChildren(rootPath, categoriesByParent),
  };
}

function buildChildren(
  parentPath: string,
  categoriesByParent: Map<string | null, CategoryRecord[]>
): CategoryNode[] {
  const children = categoriesByParent.get(parentPath) || [];
  return children.map((child) => ({
    name: child.label,
    size: child.size,
    children: buildChildren(child.path, categoriesByParent),
  }));
}

async function main() {
  const rootPath = "ImageNet 2011 Fall Release";
  const outputPath = path.join(process.cwd(), "data", "category-tree.json");

  // Load all categories
  const categories = await loadAllCategories();

  if (categories.length === 0) {
    console.error("No categories found in database. Please run import-xml.ts first.");
    process.exit(1);
  }

  // Group by parentPath
  console.log("Grouping categories by parentPath...");
  const categoriesByParent = groupByParentPath(categories);
  console.log(`Found ${categoriesByParent.size} unique parent paths`);

  // Build tree starting from root
  console.log(`Building tree structure from root: "${rootPath}"...`);
  const tree = buildTree(rootPath, categoriesByParent);

  if (!tree) {
    console.error(`Root category "${rootPath}" not found in database.`);
    process.exit(1);
  }

  // Ensure data directory exists
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write to JSON file
  console.log(`Writing tree to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2), "utf-8");

  console.log("Export completed successfully!");
  console.log(`Tree structure exported to: ${outputPath}`);
}

main()
  .catch((e) => {
    console.error("Error exporting tree:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

