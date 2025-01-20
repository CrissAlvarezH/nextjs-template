import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { googleAuth, setSession } from "@/lib/auth";
import { createGoogleUserService } from "@/services/users";
import { getAccountByGoogleId } from "@/repositories/users";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
    const afterLoginUrl = cookieStore.get("callback_url")?.value || "/";

    if (!googleAuth) {
      console.error("Google auth configuration is not properly initialized");
      return new Response(null, { status: 500 });
    }

    if (
      !code ||
      !state ||
      !storedState ||
      state !== storedState ||
      !codeVerifier
    ) {
      console.error("Invalid OAuth state or missing parameters", {
        hasCode: !!code,
        hasState: !!state,
        hasStoredState: !!storedState,
        stateMatch: state === storedState,
        hasCodeVerifier: !!codeVerifier,
      });
      return new Response(null, { status: 400 });
    }

    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      codeVerifier,
    );
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser: GoogleUser = await response.json();

    const existingAccount = await getAccountByGoogleId(googleUser.sub);

    if (existingAccount) {
      await setSession(existingAccount.userId);
      return new Response(null, {
        status: 302,
        headers: {
          Location: afterLoginUrl,
        },
      });
    }

    const userId = await createGoogleUserService(googleUser);
    await setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: afterLoginUrl,
      },
    });
  } catch (e) {
    console.error("Error on google callback router", {
      error: e,
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
    });
    
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
