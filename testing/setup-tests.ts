import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import '@testing-library/jest-dom';
import * as schema from '../db/schemas/index';

// Mock the env module globally for all tests
jest.mock('@/env', () => require('../__mocks__/env.ts'));

// Mock Next.js unstable_cache function for testing
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn), // Just return the original function without caching
}));

// Mock the auth module to avoid ES module issues with lucia
jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn().mockImplementation(async (password: string) => `hashed_${password}`),
  verifyUserPassword: jest.fn().mockImplementation(async (hashed: string, password: string) => 
    hashed === `hashed_${password}`
  ),
  lucia: {
    createSession: jest.fn(),
    validateSession: jest.fn(),
    createSessionCookie: jest.fn(),
    createBlankSessionCookie: jest.fn(),
  },
  googleAuth: {
    createAuthorizationURL: jest.fn(),
    validateAuthorizationCode: jest.fn(),
  },
  validateRequest: jest.fn(),
  setSession: jest.fn(),
}));

// Set up process.env for tests if needed
Object.assign(process.env, {
  NODE_ENV: 'test',
  NEXT_PUBLIC_ENVIRONMENT: 'dev',
  // Set database connection values for tests to match .env configuration
  DB_HOST: 'localhost',
  DB_USER: 'postgres',
  DB_PASS: 'postgres',
  DB_PORT: '5439',
});

// Ensure the TEST_DB_URL is defined (by globalSetup)
if (!process.env.TEST_DB_URL) {
  throw new Error('TEST_DB_URL environment variable is missing in setupTests.ts');
}

// 1. Create a postgres client connection to the test database
const client = postgres(process.env.TEST_DB_URL);

// 2. Initialize the Drizzle client with the test database
export const db = drizzle(client, { schema });

// Mock the @/db module to use our test database connection
jest.mock('@/db', () => ({
  db: db,
  Transaction: db,
}));

// Now, before each test, you could clean individual tables if you need.
// For example:
beforeEach(async () => {
  // Optional: execute TRUNCATE on all tables
  // await db.executeSQL(`TRUNCATE table1, table2 RESTART IDENTITY CASCADE`);
});

// When all tests are done, close the client
afterAll(async () => {
  await client.end();
});
