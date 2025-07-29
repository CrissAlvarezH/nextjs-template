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
import { Wallet } from "lucide-react";

export async function UserNavButton() {
  const user = await validateRequest();

  return (
    <>
      {user.user ? (
        <div className="flex items-center gap-3">
          {/* Credit Balance */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200">
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">{user.user.credits}</span>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100/80 rounded-md px-2">
                <Image
                  width={100}
                  height={100}
                  src={getImageUrl(
                    user.user.picture,
                    "/profile-picture-empty.jpg",
                  )}
                  placeholder={user.user.pictureHash ? "blur" : "empty"}
                  blurDataURL={user.user.pictureHash || ""}
                  className="h-7 w-7 rounded-full object-cover"
                  alt="User profile picture"
                />
                <p className="text-sm">{user.user?.name.split(" ")[0]}</p>
              </div>
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
        </div>
      ) : (
        <GoToLoginButton />
      )}
    </>
  );
}
