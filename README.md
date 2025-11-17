
# ImageNet Categories Explorer

Browse and search the ImageNet category hierarchy with an interactive tree view and debounced search.

Built with Next.js 16, React 19, TypeScript, React Query, Prisma, SQLite, Docker, and Tailwind CSS.

I focused mainly on the Frontend as I apply for Frontend role. I wanted to get the important parts of the backend right (linear data transformation, fast search) but then I spent more time to polish the frontend.

## Design Decisions

- **Streamed Data Ingestion**: Data is parsed using SAX and batch inserted into the database.

- **SQLite Database**: SQLite is used for simplicity. FTS5 enables fast search.

- **Lazy-Loaded Categories**: Categories are loaded on-demand to improve initial page load and reduce memory usage.

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- npm

## Getting Started

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

3. **Set up the database:**

   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database (creates database if it doesn't exist)
   npm run db:push

   # Initialize FTS5 for full-text search
   npm run db:init-fts5

   # Import data from structure_released.xml
   npm run import:xml
   ```


4. **Start the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tasks

### Task 1

*Create a database (use any database system you like) to store these tuples `(string, number)` and fill it with the data you obtained in the first step.*

✅ I wrote a script that parses the XML using SAX, flattens the tree and batch-inserts the nodes into the database. The script stores tuples of `(path: string, size: number)` along with hierarchical metadata (parentPath, depth, label): [scripts/import-xml.ts](scripts/import-xml.ts)

🏃 **Run the script**: `npm run import:xml`

### Task 2

* *Write an algorithm that will output such a tree. You have to read this data in a linear form from the database.*
* *What is the complexity of your algorithm (in big O notation)?*

✅ In the [`export-tree`](scripts/export-tree.ts) script, I read all items from the database and group them by `parentPath`. Then I use depth-first-search (DFS) through the tree from the root node to construct the tree structure. The tree is output to [`data/category-tree.json`](data/category-tree.json).

✅ **Complexity Analysis**: O(n) time complexity - grouping visits each node once (O(n)), and DFS reconstruction also visits each node once (O(n)), where n is the total number of categories.

🏃 **Run the script**: `npm run export:tree`

### Task 3

* *Design and build an interface to show this data. Choose yourself what you would like to highlight in the data and how to show it.*
* *Don’t load the whole dataset at once on the frontend*
* *Implement search in this UI*

✅ Created a frontend interface with the following features:
- **Interactive Tree View**: Expandable/collapsible category hierarchy with lazy loading (categories load on-demand when expanded)
- **Debounced Search**: Full-text search with 1-second debounce to reduce API calls, powered by SQLite FTS5
- **Search Highlighting**: Matching text is highlighted in search results

🏃 **Run the production application**: `docker-compose up --build` and open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Development

1. **Build and run with Docker Compose (development mode):**

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   This will:
   - Build the development Docker image
   - Start the Next.js development server
   - Mount your local files for hot-reloading
   - Create a `data` directory for the SQLite database

2. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Production

1. **Build and run with Docker Compose (production mode):**

   ```bash
   docker-compose up --build
   ```

   This will:
   - Build an optimized production Docker image
   - Run the application in production mode
   - Persist SQLite database in the `data` directory

2. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:init-fts5` - Initialize FTS5 virtual table for full-text search
- `npm run import:xml` - Import ImageNet category data from `data/structure_released.xml`
- `npm run export:tree` - Export category tree structure to `data/category-tree.json`

## Environment Variables

- `DATABASE_URL` - SQLite database connection string (default: `file:./dev.db`)
- `NODE_ENV` - Node environment (development/production)

## How I would proceed

- Adding tests
