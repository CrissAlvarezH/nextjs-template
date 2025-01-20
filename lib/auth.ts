import "server-only";
import { Lucia } from "lucia";
import { db } from "@/db";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { users, sessions } from "@/db/schemas";
import { SelectSession } from "@/db/schemas/users";
import { cache } from "react";
import { Google } from "arctic";
import { env } from "@/env";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";


const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attr) => {
    return {
      id: attr.id,
      picture: attr.picture,
      pictureHash: attr.pictureHash,
      name: attr.name,
      email: attr.email,
      phone: attr.phone,
    };
  },
});

export type DatabaseUserAttributes = {
  id: number;
  picture: string;
  pictureHash: string;
  name: string;
  email: string;
  phone: string;
};

export interface UserAndSession {
  user: DatabaseUserAttributes | null;
  session: SelectSession | null;
}

export const validateRequest = cache(async (): Promise<UserAndSession> => {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
});

export async function setSession(userId: number) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const googleAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_ID_SECRET,
  `${env.HOST_NAME}/api/login/google/callback`,
);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyUserPassword(hashed: string, password: string) {
  return await bcrypt.compare(password, hashed);
}
