import { SignupForm } from "@/app/signup/signup-form";

export default async function SignupPage() {
  return (
    <div>
      <div className="flex items-center justify-center px-4 py-4">
        <div className="w-full rounded-md border border-gray-300 p-5 shadow md:w-2/3 lg:w-2/4 xl:w-2/5">
          <p className="pb-2 text-center text-lg font-bold">Registrarse</p>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
