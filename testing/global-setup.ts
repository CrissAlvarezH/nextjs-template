import { createTestDatabase } from './db-utils';

export default async function globalSetup() {
  // 1. Create the test database and run migrations
  const { name: dbName, url: dbUrl } = await createTestDatabase();

  // 2. Set environment variables for tests and teardown to access
  process.env.TEST_DB_NAME = dbName;
  process.env.TEST_DB_URL = dbUrl;
}
