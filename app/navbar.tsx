import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/app/login/logout-btn";
import { logout } from "@/app/login/actions";

export default async function Navbar() {
  const user = await validateRequest();

  return (
    <div className="flex justify-center shadow">
      <div className="flex w-full max-w-5xl items-center justify-between py-1">
        <Button variant="link">
          <Link href="/">Home</Link>
        </Button>

        <div className="flex items-center gap-3">
          {user.user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  Hi, {user.user?.name.split(" ")[0]}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">{user.user?.name}</p>
                  <p className="text-xs text-gray-500">{user.user?.email}</p>
                  <div className="flex cursor-pointer justify-end pt-2">
                    <form action={logout}>
                      <LogoutButton />
                    </form>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="link">
              <Link href="/login">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
