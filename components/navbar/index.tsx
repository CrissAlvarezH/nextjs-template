import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNavButton } from "@/components/navbar/user-nav-btn";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Navbar() {
  return (
    <div className="flex justify-center shadow">
      <div className="flex w-full max-w-5xl items-center justify-between py-1">
        <Link href="/">
          <Button variant="link">Home</Button>
        </Link>

        <div className="flex items-center gap-3">
          <Suspense fallback={<Skeleton className="h-5 w-20" />}>
            <UserNavButton />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
