# Database Operations

## Running Migrations

To run all pending migrations:
```bash
npm run db:migrate
```

## Seeding Data

### Credit Packages

To seed the credit packages into the database:

**Option 1: Using npm script (recommended)**
```bash
npm run db:seed-credits
```

**Option 2: Using raw SQL**
```bash
psql -d your_database_url -f db/seed-credit-packages.sql
```

**Option 3: Using tsx directly**
```bash
npx tsx scripts/seed-credit-packages.ts
```

### Available Credit Packages

The seeding will create the following credit packages:

| Package | Credits | Price | Description |
|---------|---------|-------|-------------|
| Paquete Básico | 100 | $9.99 | Entry-level package |
| Paquete Popular | 250 | $19.99 | Most popular option |
| Paquete Premium | 500 | $34.99 | Best value package |

The seeding script uses `ON CONFLICT DO UPDATE` to ensure it can be run safely multiple times without creating duplicates.

## Development Workflow

1. Make schema changes in `db/schemas/`
2. Generate migration: `npm run db:generate`
3. Run migration: `npm run db:migrate` 
4. Seed initial data: `npm run db:seed-credits`