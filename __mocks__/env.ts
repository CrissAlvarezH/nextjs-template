// Mock for the env module used in tests
export const env = {
  // Server environment variables
  HOST_NAME: 'localhost',
  ENVIRONMENT: 'dev' as const,
  DB_HOST: 'localhost',
  DB_USER: 'postgres',
  DB_PASS: 'postgres',
  DB_PORT: '5439',
  DB_NAME: 'postgres',
  DB_URL: 'postgres://postgres:postgres@localhost:5439/postgres',
  GOOGLE_CLIENT_ID: 'mock_google_client_id',
  GOOGLE_CLIENT_ID_SECRET: 'mock_google_client_secret',
  RESEND_API_KEY: 'mock_resend_api_key',
  EMAIL_FROM: 'test@example.com',
  PUBLIC_BUCKET: 'mock_public_bucket',
  AWS_REGION: 'us-east-1',
  AWS_ACCESS_KEY_ID: 'mock_aws_access_key',
  AWS_SECRET_ACCESS_KEY: 'mock_aws_secret_key',
  SENTRY_AUTH_TOKEN: 'mock_sentry_auth_token',
  SENTRY_DSN: 'mock_sentry_dsn',

  // Client environment variables
  NEXT_PUBLIC_ENVIRONMENT: 'dev' as const,
  NEXT_PUBLIC_SENTRY_DSN: 'mock_sentry_dsn',
}; 