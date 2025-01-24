import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNavButton } from "@/components/navbar/user-nav-btn";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-dvw bg-background z-30">
      <div className="flex justify-center shadow">
        <div className="flex w-full max-w-5xl items-center justify-between py-1 px-2">
          <div className="flex">
            <Link href="/">
              <Button variant="link">Home</Button>
            </Link>
            <Link href="/blog">
              <Button variant="link">Blog</Button>
            </Link>
          </div>

          <Suspense fallback={<Skeleton className="h-5 w-20" />}>
            <UserNavButton />
          </Suspense>
        </div>
      </div >
    </div>
  );
}
