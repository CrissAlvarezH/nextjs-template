import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schemas/index";

const queryClient = postgres(env.DB_URL, {
  max: 10, // maximum connection pool size
  idle_timeout: 20, // close idle connection after 20 seconds
  connect_timeout: 10, // timeout after 10 seconds when connecting
});
export const db = drizzle(queryClient, { schema });

export type Transaction = typeof db