import { SignupForm } from "@/app/(auth)/signup/signup-form";

export default async function SignupPage() {
  return (
    <div>
      <div className="flex items-center justify-center px-4 py-4">
        <div className="w-full rounded-md border border-gray-300 p-5 shadow md:w-96">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
