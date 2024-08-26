"use server";
import { authenticatedAction } from "@/lib/server-actions";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { uploadFileToBucket } from "@/lib/files";
import { updateUserPicture } from "@/repositories/users";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { rgbaToDataURL, rgbaToThumbHash } from "thumbhash";

export const uploadImageAction = authenticatedAction
  .createServerAction()
  .input(z.object({ fileWrapper: z.instanceof(FormData) }))
  .handler(async ({ input, ctx: { user } }) => {
    const file = input.fileWrapper.get("image") as File;
    const key = `users/${user.id}/profile_${uuidv4()}`;

    await uploadFileToBucket(file.stream(), key);

    const buffer = await file.arrayBuffer();
    const thumbnailBuffer = await sharp(Buffer.from(buffer))
      .raw()
      .ensureAlpha()
      .resize(2)
      .toBuffer({ resolveWithObject: true });

    const thumbHash = rgbaToDataURL(
      thumbnailBuffer.info.width,
      thumbnailBuffer.info.height,
      thumbnailBuffer.data,
    );

    await updateUserPicture(user.id, key, thumbHash);

    redirect("/profile");
  });
