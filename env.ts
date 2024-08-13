 import { createEnv } from "@t3-oss/env-nextjs"
 import { z } from "zod"

 export const env = createEnv({
   server: {
     DB_HOST: z.string(),
     DB_USER: z.string(),
     DB_PASS: z.string(),
     DB_NAME: z.string(),
     DB_URL: z.string(),
   },
   client: {},
   runtimeEnv: {
     // Database
     DB_HOST: process.env.DB_HOST,
     DB_USER: process.env.DB_USER,
     DB_PASS: process.env.DB_PASS,
     DB_NAME: process.env.DB_NAME,
     DB_URL: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
   }
 })