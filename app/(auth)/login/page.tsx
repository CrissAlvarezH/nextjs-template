import { Login } from "@/app/(auth)/login/login";

export default async function LoginPage(
  props: {
    searchParams: Promise<{ callbackUrl: string }>;
  }
) {
  const searchParams = await props.searchParams;

  const {
    callbackUrl = "/"
  } = searchParams;

  return (
    <div>
      <div className="flex items-center justify-center px-4 py-4">
        <div className="w-full rounded-md border border-gray-300 p-5 shadow md:w-96">
          <Login callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
