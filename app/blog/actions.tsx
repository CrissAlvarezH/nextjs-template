"use server";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";
import { getPostsService } from "@/services/blog";
import { ListBlogPostsType } from "@/repositories/blogs";
import { InvalidParamTypeError } from "@/lib/errors";


export const listPostsAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({ page: z.string() }))
  .output(z.object({ posts: z.array(z.custom<ListBlogPostsType>()), totalPages: z.number() }))
  .handler(async ({ input: { page } }) => {
    const pageInt = parseInt(page)
    if (isNaN(pageInt)) throw new InvalidParamTypeError()
    return await getPostsService(pageInt);
  });
