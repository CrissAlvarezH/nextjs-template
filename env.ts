import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    HOST_NAME: z.string().min(1),
    ENVIRONMENT: z
      .string()
      .min(1)
      .regex(/^(dev|prod)$/),
    DB_HOST: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASS: z.string().min(1),
    DB_PORT: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_URL: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_ID_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    PUBLIC_BUCKET: z.string().min(1),
    AWS_REGION: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().min(1),
    SENTRY_DSN: z.string().min(1),
    WOMPI_SECRET_KEY: z.string().min(1),
    WOMPI_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z
      .string()
      .min(1)
      .regex(/^(dev|prod)$/),
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),
    NEXT_PUBLIC_WOMPI_PUBLIC_KEY: z.string().min(1),
  },
  runtimeEnv: {
    HOST_NAME: process.env.HOST_NAME,
    ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,

    // Database
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_URL: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,

    // on vercel sslmode is needed
    // DB_URL: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`,

    // Google api keys
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_ID_SECRET: process.env.GOOGLE_CLIENT_ID_SECRET,

    // Emails
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,

    // Aws access keys (these are optional because if it is running on aws then are loaded by session)
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    // Public files, it will be like /public folder but for production
    PUBLIC_BUCKET: process.env.PUBLIC_BUCKET,

    // Errors
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Wompi
    WOMPI_SECRET_KEY: process.env.WOMPI_SECRET_KEY,
    WOMPI_WEBHOOK_SECRET: process.env.WOMPI_WEBHOOK_SECRET,
    NEXT_PUBLIC_WOMPI_PUBLIC_KEY: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
  },
});
