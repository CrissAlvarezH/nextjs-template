import Link from "next/link";
import { EmailPasswordLoginForm } from "@/app/(auth)/login/email-password-login-form";
import { Button } from "@/components/ui/button";
import { GoogleLoginButton } from "@/app/(auth)/login/google-login-btn";

export default async function LoginPage() {
  return (
    <div>
      <div className="flex items-center justify-center px-4 py-4">
        <div className="w-full rounded-md border border-gray-300 p-5 shadow md:w-96">
          <p className="pb-4 text-center text-lg font-bold">
            Ingresa a tu cuenta
          </p>

          <div className="pb-5">
            <Link href="/api/login/google" className="flex items-center">
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

          <EmailPasswordLoginForm />

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

            <Link
              href="/signup"
              className="flex flex-1 items-center justify-end"
            >
              <Button
                variant="link"
                size="sm"
                className="text-gray-500 hover:text-black"
              >
                Registrarme
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
