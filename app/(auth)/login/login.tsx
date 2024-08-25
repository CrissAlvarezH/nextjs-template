"use client";
import Link from "next/link";
import { GoogleLoginButton } from "@/app/(auth)/login/google-login-btn";
import { EmailPasswordLoginForm } from "@/app/(auth)/login/email-password-login-form";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { isUserAlreadyLoggedInAction } from "@/app/(auth)/login/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Login({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const { execute: isUserAlreadyLoggedIn } = useServerAction(
    isUserAlreadyLoggedInAction,
    {
      onSuccess: (res) => {
        if (res.data) router.replace(callbackUrl);
      },
    },
  );

  useEffect(() => {
    void isUserAlreadyLoggedIn();
  }, []);

  return (
    <>
      <p className="pb-4 text-center text-lg font-bold">Ingresa a tu cuenta</p>

      <div className="pb-5">
        <Link
          href={`/api/login/google?callbackUrl=${callbackUrl}`}
          className="flex items-center"
        >
          <GoogleLoginButton />
        </Link>
      </div>

      <div className="flex items-center py-2">
        <hr className="flex-1" />
        <span className="px-2 text-gray-600">Ó</span>
        <hr className="flex-1" />
      </div>

      <p className="py-3 text-center font-semibold">
        Ingresar con correo y contraseña
      </p>

      <EmailPasswordLoginForm callbackUrl={callbackUrl} />

      <div className="flex items-center justify-center gap-1 pt-4 text-sm">
        <Link href="/forgot-password" className="flex flex-1 justify-start">
          <Button
            size="sm"
            variant="link"
            className="text-gray-500 hover:text-black"
          >
            Olvidé mi contraseña
          </Button>
        </Link>

        <Link href="/signup" className="flex flex-1 items-center justify-end">
          <Button
            variant="link"
            size="sm"
            className="text-gray-500 hover:text-black"
          >
            Registrarme
          </Button>
        </Link>
      </div>
    </>
  );
}
