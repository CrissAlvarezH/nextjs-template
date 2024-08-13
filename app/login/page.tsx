import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  return (
    <div>
      <div className="flex items-center justify-center px-4 py-4">
        <div className="w-full rounded-md border border-gray-300 p-5 shadow md:w-2/3 lg:w-2/4 xl:w-2/5">
          <p className="pb-2 text-center text-lg font-bold">Ingresar</p>
          <LoginForm />
          <div className="flex justify-center gap-1 pt-2 text-sm">
            <Button variant="link">
              <Link href="/signup">Tambien puedes registrarte</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
