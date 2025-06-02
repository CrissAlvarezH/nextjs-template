// test-utils/globalTeardown.ts
import { dropTestDatabase } from './db-utils';

export default async function globalTeardown() {
  // 1. Read the database name from environment variables
  const testDbName = process.env.TEST_DB_NAME;
  
  if (!testDbName) {
    console.warn('TEST_DB_NAME not found in environment variables, test database was probably not created.');
    return;
  }

  // 2. Drop the database
  await dropTestDatabase(testDbName);
  
  // 3. Clean up environment variables
  delete process.env.TEST_DB_NAME;
  delete process.env.TEST_DB_URL;
}
