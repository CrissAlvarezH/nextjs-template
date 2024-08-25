"use client";
import { Loader2 } from "lucide-react";
import { useServerAction } from "zsa-react";
import { logoutAction } from "@/app/(auth)/login/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { isPending, execute: logout } = useServerAction(logoutAction);

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <button
            type="submit"
            className="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
          >
            Cerrar sesión
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Seguro que quieres cerrar sesión?</DialogTitle>
            <DialogDescription>
              <div className="flex justify-end pt-7">
                <Button disabled={isPending} onClick={() => logout()}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cerrar sesión
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
