import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

/**
 * Initialize FTS5 virtual table for full-text search
 * This should be called after database migrations
 */
export async function initializeFTS5() {
  await prisma.$executeRaw`
    CREATE VIRTUAL TABLE IF NOT EXISTS imagenet_categories_fts USING fts5(
      id UNINDEXED,
      label,
      content='imagenet_categories',
      content_rowid='id'
    )
  `

  // Create triggers to keep FTS5 table in sync
  await prisma.$executeRaw`
    CREATE TRIGGER IF NOT EXISTS imagenet_categories_fts_insert AFTER INSERT ON imagenet_categories BEGIN
      INSERT INTO imagenet_categories_fts(rowid, label) VALUES (new.id, new.label);
    END
  `

  await prisma.$executeRaw`
    CREATE TRIGGER IF NOT EXISTS imagenet_categories_fts_delete AFTER DELETE ON imagenet_categories BEGIN
      INSERT INTO imagenet_categories_fts(imagenet_categories_fts, rowid, label) VALUES('delete', old.id, old.label);
    END
  `

  await prisma.$executeRaw`
    CREATE TRIGGER IF NOT EXISTS imagenet_categories_fts_update AFTER UPDATE ON imagenet_categories BEGIN
      INSERT INTO imagenet_categories_fts(imagenet_categories_fts, rowid, label) VALUES('delete', old.id, old.label);
      INSERT INTO imagenet_categories_fts(rowid, label) VALUES (new.id, new.label);
    END
  `

  // Populate FTS5 table with existing data
  await prisma.$executeRaw`
    INSERT OR IGNORE INTO imagenet_categories_fts(rowid, label) 
    SELECT id, label FROM imagenet_categories
  `
}

/**
 * Format search term for FTS5 query
 * FTS5 supports simple term searches - escape special characters
 * For simple term search, we can use the term directly without quotes
 */
function formatFTS5Query(searchTerm: string): string {
  // Escape special FTS5 characters that need escaping: ", ', \
  // For FTS5 term search (not phrase), we escape special characters
  let escaped = searchTerm.replace(/\\/g, '\\\\')
  escaped = escaped.replace(/"/g, '""')
  escaped = escaped.replace(/'/g, "''")
  // For term search, return as-is (FTS5 will match anywhere in the text)
  return escaped
}

/**
 * Search categories using FTS5
 * @param searchTerm - The search term to look for in category labels
 * @param limit - Maximum number of results to return
 * @returns Array of category IDs matching the search term
 */
export async function searchCategories(searchTerm: string, limit: number = 100): Promise<number[]> {
  const formattedQuery = formatFTS5Query(searchTerm)
  // Use $queryRawUnsafe for FTS5 MATCH queries
  // SQLite FTS5 MATCH requires the query string to be embedded directly in SQL
  // Escape single quotes for SQL string literal safety
  const sqlEscaped = formattedQuery.replace(/'/g, "''")
  const results = await prisma.$queryRawUnsafe<Array<{ rowid: number }>>(
    `SELECT rowid FROM imagenet_categories_fts WHERE imagenet_categories_fts MATCH '${sqlEscaped}' ORDER BY rank LIMIT ${limit}`
  )

  return results.map((r) => r.rowid)
}

/**
 * Search categories and return full category objects
 * @param searchTerm - The search term to look for in category labels
 * @param limit - Maximum number of results to return
 * @returns Array of ImageNetCategory objects matching the search term
 */
export async function searchCategoriesFull(searchTerm: string, limit: number = 100) {
  const categoryIds = await searchCategories(searchTerm, limit)
  
  if (categoryIds.length === 0) {
    return []
  }

  return prisma.imageNetCategory.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  })
}

