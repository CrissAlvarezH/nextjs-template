import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'node',
  // Add more setup options before each test is run
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/env$': '<rootDir>/__mocks__/env.ts',
  },
  globalSetup: '<rootDir>/testing/global-setup.ts',
  globalTeardown: '<rootDir>/testing/global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/testing/setup-tests.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@t3-oss/env-nextjs|lucia|arctic|@lucia-auth)/)',
  ],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)