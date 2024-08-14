import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="flex justify-center pt-4">
        <div className="w-full rounded-md border border-gray-300 p-5 shadow md:w-96">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
