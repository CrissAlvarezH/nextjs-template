"use server"
import { z } from "zod"
import { authenticatedAction } from "@/lib/server-actions";
import { createBlogPostService } from "@/services/blog";
import { newBlogSchema } from "./validations";
import { redirect } from "next/navigation"


export const createPostAction = authenticatedAction
  .inputSchema(newBlogSchema.extend({ imageWrapper: z.instanceof(FormData) }))
  .action(async ({ parsedInput: { imageWrapper, ...data }, ctx: { user } }) => {
    const image = imageWrapper.get("image") as File
    await createBlogPostService({ ...data, author: user.id }, image)
    redirect("/blog")
  })
