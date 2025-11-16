import { initializeFTS5 } from '../lib/fts5'

async function main() {
  console.log('Initializing FTS5 virtual table...')
  await initializeFTS5()
  console.log('FTS5 virtual table initialized successfully!')
}

main()
  .catch((e) => {
    console.error('Error initializing FTS5:', e)
    process.exit(1)
  })
  .finally(async () => {
    const { prisma } = await import('../lib/prisma')
    await prisma.$disconnect()
  })
