"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export function GoToLoginButton() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/login?callbackUrl=${pathname}`)}
      variant="link"
    >
      Ingresar
    </Button>
  );
}
