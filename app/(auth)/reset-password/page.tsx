import { ResetPasswordForm } from "@/app/(auth)/reset-password/reset-password-form";
import { validateEmailVerificationCodeAction } from "@/app/(auth)/reset-password/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ResetPasswordPage(
  props: {
    searchParams: Promise<{
      id: number;
      code: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;

  const {
    id,
    code
  } = searchParams;

  if (!id || !code) {
    return (
      <div className="flex justify-center py-5">
        <p className="text-lg text-red-600">Link alterado</p>
      </div>
    );
  }

  const [isValid] = await validateEmailVerificationCodeAction({
    userId: id,
    code,
  });
  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-3 py-5">
        <p className="text-red-600">
          Este link ha vencido, vuelva a solicitar restablecer la contraseña en
          sel siguiente link:
        </p>
        <Link href="/forgot-password">
          <Button size="lg" variant="link" className="text-blue-600">
            Olvidé mi contraseña
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center px-4 py-4">
        <div className="w-full rounded-md border border-gray-300 p-5 shadow md:w-96">
          <ResetPasswordForm userId={id} code={code} />
        </div>
      </div>
    </div>
  );
}
