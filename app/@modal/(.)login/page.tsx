"use client";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Login } from "@/app/(auth)/login/login";

export default function LoginModalPage({
  searchParams: { callbackUrl = "/" },
}: {
  searchParams: { callbackUrl: string };
}) {
  const pathname = usePathname();
  const router = useRouter();

  // its necessary validate pathname because with user by email and password enter
  // and redirect the modal does not disappears, remain in the body html page
  if (pathname !== "/login") return;
  return (
    <>
      <Dialog defaultOpen={true} open={true} onOpenChange={() => router.back()}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle title="login" className="hidden" />
          <div>
            <Login callbackUrl={callbackUrl} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
