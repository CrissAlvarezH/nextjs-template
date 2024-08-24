import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNavButton } from "@/components/navbar/user-nav-btn";
import { Suspense } from "react";

export default async function Navbar() {
  return (
    <div className="flex justify-center shadow">
      <div className="flex w-full max-w-5xl items-center justify-between py-1">
        <Link href="/">
          <Button variant="link">Home</Button>
        </Link>

        <div className="flex items-center gap-3">
          <Suspense fallback={<p>Cargando...</p>}>
            <UserNavButton />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
