import { UserDataForm } from "@/app/profile/user-data-form";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/app/profile/change-password-form";
import { userRequireCurrentPasswordToChangeItAction } from "@/app/profile/actions";
import { SetPasswordForm } from "@/app/profile/set-password-form";
import { ProfileImage } from "@/app/profile/profile-image";

export default async function ProfilePage() {
  const user = await validateRequest();
  if (!user.user) redirect("/");

  const [requiresCurrentPassword] =
    await userRequireCurrentPasswordToChangeItAction(user.user.id);

  // TODO why user.user has 'password' in it?!!!!!
  console.log(user.user);
  return (
    <div>
      <div className="flex justify-center">
        <div className="mx-5 w-full py-4 md:w-[650px]">
          <ProfileImage user={user.user} />

          <p className="pb-3 text-lg font-semibold">Mis datos</p>
          <UserDataForm user={user.user} />

          {requiresCurrentPassword ? (
            <>
              <p className="py-3 text-lg font-semibold">Cambiar contraseña</p>
              <ChangePasswordForm user={user.user} />
            </>
          ) : (
            <>
              <p className="py-3 text-lg font-semibold">
                Establecer contraseña
              </p>
              <SetPasswordForm user={user.user} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
