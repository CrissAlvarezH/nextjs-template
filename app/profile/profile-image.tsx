"use client";

import { DatabaseUserAttributes } from "@/lib/auth";
import { UploadImgButton } from "@/components/upload-img-btn";
import { useServerAction } from "zsa-react";
import { uploadProfileImageAction } from "@/app/profile/actions";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export function ProfileImage({ user }: { user: DatabaseUserAttributes }) {
  const { isPending, error, execute } = useServerAction(
    uploadProfileImageAction,
  );

  return (
    <div className="flex items-center gap-5 pb-7">
      {error && (
        <div>
          <p className="text-red-600">{error.error}</p>
        </div>
      )}
      <Image
        src={getImageUrl(user.picture, "/profile-picture-empty.jpg")}
        width={120}
        placeholder="blur"
        blurDataURL={user.pictureHash || ""}
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
        loading={isPending}
        onFileUpload={(formData) => execute({ fileWrapper: formData })}
      />
    </div>
  );
}
