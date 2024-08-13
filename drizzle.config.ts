import {defineConfig} from "drizzle-kit";
import {env} from "@/env";

export default defineConfig({
  schema: "./db/schemas/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DB_URL
  },
  migrations: {
    table: "drizzle_migrations",
    schema: "public"
  }
})
