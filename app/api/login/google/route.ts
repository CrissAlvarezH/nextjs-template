import { googleAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";


export async function GET(request: Request): Promise<Response> {
  const callbackUrl = new URL(request.url).searchParams.get("callbackUrl");

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const authUrl = await googleAuth.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  const cks = await cookies();

  cks.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cks.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cks.set("callback_url", callbackUrl || "/", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  // Redirect to the Google auth URL
  return new Response(null, {
    status: 302,
    headers: { Location: authUrl.toString() },
  });
}
