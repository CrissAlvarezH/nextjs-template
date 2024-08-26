import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import { LogoutButton } from "@/components/navbar/logout-btn";
import { GoToLoginButton } from "@/components/navbar/go-to-login-btn";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export async function UserNavButton() {
  const user = await validateRequest();

  return (
    <>
      {user.user ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <div className="flex items-center gap-2">
                <Image
                  width={100}
                  height={100}
                  src={getImageUrl(
                    user.user.picture,
                    "/profile-picture-empty.jpg",
                  )}
                  placeholder="blur"
                  blurDataURL={user.user.pictureHash || ""}
                  className="h-7 w-7 rounded-full object-cover"
                  alt="User profile picture"
                />
                {user.user?.name.split(" ")[0]}
              </div>
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
                <LogoutButton />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <GoToLoginButton />
      )}
    </>
  );
}
