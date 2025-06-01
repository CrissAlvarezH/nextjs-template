// Jest setup file to configure environment for tests
import '@testing-library/jest-dom';

// Mock the env module globally for all tests
jest.mock('@/env', () => require('./__mocks__/env.ts'));

// Set up process.env for tests if needed
Object.assign(process.env, {
  NODE_ENV: 'test',
  NEXT_PUBLIC_ENVIRONMENT: 'dev'
});
