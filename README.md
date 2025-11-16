# ImageNet Categories Explorer

Browse and search the ImageNet category hierarchy with an interactive tree view and debounced search. Built with Next.js 16, React 19, TypeScript, Prisma, SQLite, Docker, and Tailwind CSS.

## Design Decisions

- **Streamed Data Ingestion**: Data is streamed into the database to prevent memory and CPU exhaustion with large datasets.

- **SQLite Database**: SQLite provides simplicity, zero-configuration, and excellent read performance.

- **Lazy-Loaded Categories**: Categories are loaded on-demand to improve initial page load and reduce memory usage.

- **FTS5 Full-Text Search**: FTS5 enables fast path search at the cost of added database complexity.

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

   # Or run migrations
   npm run db:migrate

   # Initialize FTS5 for full-text search
   npm run db:init-fts5
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Database

The project uses SQLite with Prisma. The database file is stored in:
- Local development: `./dev.db`
- Docker: `./data/dev.db`

### Prisma Schema

The schema defines an `ImageNetCategory` model with hierarchical relationships (parent/children), storing category paths, sizes, and depth levels. FTS5 is configured for fast full-text search on category paths.

### Database Commands

- **Generate Prisma Client:** `npm run db:generate`
- **Push schema changes:** `npm run db:push`
- **Create migration:** `npm run db:migrate`
- **Open Prisma Studio:** `npm run db:studio`

## Docker Volumes

The Docker setup uses volumes to persist:
- SQLite database files in `./data` directory
- Prisma schema and migrations in `./prisma` directory

## Environment Variables

- `DATABASE_URL` - SQLite database connection string (default: `file:./dev.db`)
- `NODE_ENV` - Node environment (development/production)

## Notes

- The SQLite database file is created automatically when you run `db:push` or `db:migrate`
- In Docker, the database is persisted in the `./data` directory
- Make sure to run `db:generate` after modifying the Prisma schema
- The production Dockerfile uses Next.js standalone output for optimal image size
