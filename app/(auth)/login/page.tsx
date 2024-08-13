import Link from "next/link";
import { EmailPasswordLoginForm } from "@/app/(auth)/login/email-password-login-form";
import { Button } from "@/components/ui/button";

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
              <Button className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="mr-4 h-6 w-6"
                >
                  <path
                    fill="#4285F4"
                    d="M44.5,20H24v8.5h11.7c-1.1,5-5.4,8.5-11.7,8.5c-7,0-12.7-5.7-12.7-12.7S17,12.7,24,12.7c3.2,0,6.1,1.2,8.3,3.2l6.4-6.4C35.5,6.5,29.8,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20c9.9,0,19.2-7.2,19.2-20C44.5,22.7,44.5,21.3,44.5,20z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.9,14.6l6.6,4.8c1.8-3.6,5.4-6.4,10.5-6.4c3.2,0,6.1,1.2,8.3,3.2l6.4-6.4C35.5,6.5,29.8,4,24,4C16.1,4,9.1,8.8,6.9,14.6z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24,44c5.8,0,11.4-2.3,15.4-6.1l-7.2-5.9c-2.1,1.5-4.9,2.4-8.1,2.4c-6.2,0-11.5-4.2-13.3-9.9L6.7,35C9.1,40,16.1,44,24,44z"
                  />
                  <path
                    fill="#EA4335"
                    d="M44.5,20H24v8.5h11.7c-0.6,3-2.2,5.5-4.5,7.2l0,0l7.2,5.9c-0.5,0.5,6.6-4.8,6.6-13.6C45,22.7,44.5,21.3,44.5,20z"
                  />
                </svg>
                Ingresar con Google
              </Button>
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
            <Link href="/signup" className="flex flex-1 justify-start">
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
