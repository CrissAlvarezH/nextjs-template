import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/app/(auth)/login/logout-btn";
import { logoutAction } from "@/app/(auth)/login/actions";

export default async function Navbar() {
  const user = await validateRequest();

  return (
    <div className="flex justify-center shadow">
      <div className="flex w-full max-w-5xl items-center justify-between py-1">
        <Link href="/">
          <Button variant="link">Home</Button>
        </Link>

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

                  <div className="mt-2 flex flex-col border-y">
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full">
                        Mis datos
                      </Button>
                    </Link>
                  </div>
                  <div className="flex cursor-pointer justify-end pt-2">
                    <form
                      action={async () => {
                        "use server";
                        await logoutAction();
                      }}
                    >
                      <LogoutButton />
                    </form>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/login">
              <Button variant="link">Ingresar</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
