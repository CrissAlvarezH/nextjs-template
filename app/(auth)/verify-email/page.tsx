import { checkUserCodeAction } from "@/app/(auth)/verify-email/actions";

export default async function VerifyEmailPage(
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
        <p className="text-lg text-red-600">Link invalido</p>
      </div>
    );
  }

  try {
    await checkUserCodeAction({ userId: Number(id), code });
  } catch (error) {
    return (
      <div className="flex justify-center py-5">
        <p className="text-lg text-red-600">Link invalido</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-5">
      <p className="text-xl font-semibold text-green-700">
        Tu email ha sido confirmado exitosamente
      </p>
      <p className="pt-1">ya puedes ingresar con tu correo y contraseña</p>
    </div>
  );
}
