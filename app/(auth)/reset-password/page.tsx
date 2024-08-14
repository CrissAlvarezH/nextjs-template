import { ResetPasswordForm } from "@/app/(auth)/reset-password/reset-password-form";
import { justValidateEmailVerificationCode } from "@/app/(auth)/reset-password/actions";

export default async function ResetPasswordPage({
  searchParams: { id, code },
}: {
  searchParams: {
    id: number;
    code: string;
  };
}) {
  if (!id || !code) {
    return (
      <div className="flex justify-center py-5">
        <p className="text-lg text-red-600">Link alterado</p>
      </div>
    );
  }

  const isValid = await justValidateEmailVerificationCode(id, code);
  if (!isValid) {
    return (
      <div className="flex justify-center py-5">
        <p className="text-lg text-red-600">Link invalido</p>
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
