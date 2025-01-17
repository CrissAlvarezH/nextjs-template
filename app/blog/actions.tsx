"use server";
import { authenticatedAction, unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";
import { createBlogPostService, getPostsService } from "@/services/blog";
import { newBlogSchema } from "./create/validations";
import { redirect } from "next/navigation"
import { ListBlogPostsType } from "@/repositories/blogs";


export const listPostsAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({ page: z.number().optional().default(1) }))
  .output(z.object({ posts: z.array(z.custom<ListBlogPostsType>()), totalPages: z.number() }))
  .handler(async ({ input: { page } }) => {
    return await getPostsService(page);
  });

export const createPostAction = authenticatedAction
  .createServerAction()
  .input(newBlogSchema.extend({ imageWrapper: z.instanceof(FormData) }))
  .handler(async ({ input: { imageWrapper, ...data }, ctx: { user } }) => {
    const image = imageWrapper.get("image") as File
    await createBlogPostService({ ...data, author: user.id }, image)
    redirect("/blog")
  })
