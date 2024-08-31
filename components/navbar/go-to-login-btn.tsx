"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export function GoToLoginButton() {
  const pathname = usePathname();
  const router = useRouter();

  let callbackUrl = pathname;
  // this urls are not allowed to be redirected after login, just go to /
  if (["/verify-email", "/reset-password"].includes(pathname))
    callbackUrl = "/";

  return (
    <Button
      onClick={() => router.push(`/login?callbackUrl=${callbackUrl}`)}
      variant="link"
    >
      Ingresar
    </Button>
  );
}
