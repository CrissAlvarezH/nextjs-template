import "server-only";
import { db } from "@/db";
import { users, sessions } from "@/db/schemas";
import { SelectSession } from "@/db/schemas/users";
import { cache } from "react";
import { Google } from "arctic";
import { env } from "@/env";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRY_DAYS = 30;

export type DatabaseUserAttributes = {
  id: number;
  picture: string | null;
  pictureHash: string | null;
  name: string;
  email: string;
  phone: string | null;
  credits: number;
};

export interface UserAndSession {
  user: DatabaseUserAttributes | null;
  session: SelectSession | null;
}

function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

function createSessionCookie(sessionId: string) {
  const expires = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  return {
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    attributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      expires,
      path: "/",
    },
  };
}

function createBlankSessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    attributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      expires: new Date(0),
      path: "/",
    },
  };
}

async function validateSessionId(sessionId: string): Promise<UserAndSession> {
  const [sessionResult] = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));

  if (!sessionResult) {
    return { user: null, session: null };
  }

  const { session, user } = sessionResult;

  if (session.expiresAt <= new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return { user: null, session: null };
  }

  const sessionNeedsRefresh = session.expiresAt.getTime() - Date.now() < 15 * 24 * 60 * 60 * 1000;

  if (sessionNeedsRefresh) {
    const newExpiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await db
      .update(sessions)
      .set({ expiresAt: newExpiresAt })
      .where(eq(sessions.id, sessionId));
    
    session.expiresAt = newExpiresAt;
  }

  return {
    user: {
      id: user.id,
      picture: user.picture,
      pictureHash: user.pictureHash,
      name: user.name,
      email: user.email,
      phone: user.phone,
      credits: user.credits,
    },
    session,
  };
}

export const validateRequest = cache(async (): Promise<UserAndSession> => {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await validateSessionId(sessionId);
  
  try {
    if (!result.session) {
      const blankCookie = createBlankSessionCookie();
      (await cookies()).set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes,
      );
    } else {
      const sessionNeedsRefresh = result.session.expiresAt.getTime() - Date.now() < 15 * 24 * 60 * 60 * 1000;
      if (sessionNeedsRefresh) {
        const sessionCookie = createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    }
  } catch {
    // Next.js throws when setting cookies during page rendering
  }
  
  return result;
});

export async function setSession(userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  const sessionCookie = createSessionCookie(sessionId);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return sessionId;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
  
  const blankCookie = createBlankSessionCookie();
  (await cookies()).set(
    blankCookie.name,
    blankCookie.value,
    blankCookie.attributes,
  );
}

export async function invalidateAllUserSessions(userId: number): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
  
  const blankCookie = createBlankSessionCookie();
  (await cookies()).set(
    blankCookie.name,
    blankCookie.value,
    blankCookie.attributes,
  );
}

export async function logout(): Promise<void> {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    await invalidateSession(sessionId);
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
