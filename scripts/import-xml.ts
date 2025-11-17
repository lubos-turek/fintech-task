import * as fs from "fs";
import * as path from "path";
import * as sax from "sax";
import { prisma } from "../lib/prisma";

function getLabelFromPath(path: string): string {
  if (!path.includes(" > ")) {
    return path;
  }
  const parts = path.split(" > ");
  const lastPart = parts[parts.length - 1];
  return lastPart || path;
}

interface SynsetNode {
  words: string;
  wnid: string;
  children: SynsetNode[];
  size?: number;
  depth?: number;
  path?: string;
}

async function parseXML(filePath: string): Promise<SynsetNode[]> {
  return new Promise((resolve, reject) => {
    const parser = sax.createStream(true, { trim: true });
    const rootNodes: SynsetNode[] = [];
    const nodeStack: SynsetNode[] = [];

    parser.on("opentag", (node: sax.Tag | sax.QualifiedTag) => {
      if (node.name === "synset") {
        const words = (node.attributes as any).words || "";
        const wnid = (node.attributes as any).wnid || "";

        const synsetNode: SynsetNode = {
          words,
          wnid,
          children: [],
        };

        if (nodeStack.length === 0) {
          rootNodes.push(synsetNode);
        } else {
          const parent = nodeStack[nodeStack.length - 1];
          parent.children.push(synsetNode);
        }

        nodeStack.push(synsetNode);
      }
    });

    parser.on("closetag", (tagName: string) => {
      if (tagName === "synset") {
        nodeStack.pop();
      }
    });

    parser.on("error", (err: Error) => {
      reject(err);
    });

    parser.on("end", () => {
      resolve(rootNodes);
    });

    fs.createReadStream(filePath).pipe(parser);
  });
}

function calculateSizes(node: SynsetNode): number {
  if (node.children.length === 0) {
    // Leaf node - size is 0
    node.size = 0;
    return 1; // Return 1 to count this leaf for parent
  }

  let leafCount = 0;
  for (const child of node.children) {
    leafCount += calculateSizes(child);
  }
  node.size = leafCount;
  return leafCount;
}

interface CategoryData {
  words: string;
  size: number;
  depth: number;
  path: string;
}

function flattenTree(nodes: SynsetNode[], parentPath: string = "", depth: number = 0): CategoryData[] {
  const result: CategoryData[] = [];

  for (const node of nodes) {
    const path = parentPath ? `${parentPath} > ${node.words}` : node.words;

    if (node.size === undefined) {
      throw new Error(`Size not calculated for node: ${node.words}`);
    }

    result.push({
      words: node.words,
      size: node.size,
      depth,
      path,
    });

    // Recursively process children
    const children = flattenTree(node.children, path, depth + 1);
    result.push(...children);
  }

  return result;
}

async function insertIntoDatabase(categories: CategoryData[]) {
  const batchSize = 1000;

  // Sort by depth to ensure parents are inserted before children
  const sortedCategories = [...categories].sort((a, b) => a.depth - b.depth);

  console.log(`Inserting ${sortedCategories.length} categories into database...`);

  // Insert categories in depth order (parents first)
  for (let i = 0; i < sortedCategories.length; i += batchSize) {
    const batch = sortedCategories.slice(i, i + batchSize);

    const createPromises = batch.map((cat) => {
      // Find parent path by removing last " > " segment
      const lastSeparator = cat.path.lastIndexOf(" > ");
      const parentPath = lastSeparator === -1 ? null : cat.path.substring(0, lastSeparator);

      // Extract label from path (last part after " > " or whole path if not present)
      const label = getLabelFromPath(cat.path);

      return prisma.imageNetCategory.create({
        data: {
          path: cat.path,
          label,
          size: cat.size,
          depth: cat.depth,
          parentPath,
        },
      });
    });

    await Promise.all(createPromises);

    if ((i + batchSize) % 5000 === 0 || i + batchSize >= sortedCategories.length) {
      console.log(
        `Inserted ${Math.min(i + batchSize, sortedCategories.length)}/${sortedCategories.length} categories...`
      );
    }
  }
}

async function main() {
  const xmlPath = path.join(process.cwd(), "data", "structure_released.xml");

  if (!fs.existsSync(xmlPath)) {
    console.error(`XML file not found at: ${xmlPath}`);
    process.exit(1);
  }

  console.log("Parsing XML file...");
  const rootNodes = await parseXML(xmlPath);
  console.log(`Parsed ${rootNodes.length} root nodes`);

  console.log("Calculating sizes...");
  for (const node of rootNodes) {
    calculateSizes(node);
  }

  console.log("Flattening tree structure...");
  const flatCategories = flattenTree(rootNodes);
  console.log(`Generated ${flatCategories.length} category entries`);

  // Clear existing data
  console.log("Clearing existing categories...");
  await prisma.imageNetCategory.deleteMany({});

  // Insert into database
  await insertIntoDatabase(flatCategories);

  console.log("Import completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error importing XML:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
