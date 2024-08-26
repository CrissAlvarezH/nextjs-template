import { UserDataForm } from "@/app/profile/user-data-form";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/app/profile/change-password-form";
import { userRequireCurrentPasswordToChangeItAction } from "@/app/profile/actions";
import { SetPasswordForm } from "@/app/profile/set-password-form";
import Image from "next/image";
import { UploadImgButton } from "@/components/upload-img-btn";
import { getImageUrl } from "@/lib/images";

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
          <div className="flex items-center gap-5 pb-7">
            <Image
              src={getImageUrl(user.user.picture, "/profile-picture-empty.jpg")}
              width={120}
              placeholder="blur"
              blurDataURL={user.user.pictureHash}
              height={120}
              priority
              className="h-32 w-32 rounded-full border object-cover"
              alt="User profile picture"
            />

            <UploadImgButton
              text="Cambiar foto"
              size="sm"
              variant="secondary"
              className="rounded-full"
            />
          </div>

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
