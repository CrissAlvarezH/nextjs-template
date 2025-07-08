"use server";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";
import { getPostsService } from "@/services/blog";
import { InvalidParamTypeError } from "@/lib/errors";


export const listPostsAction = unauthenticatedAction
  .inputSchema(z.object({ page: z.string() }))
  .action(async ({ parsedInput: { page } }) => {
    const pageInt = parseInt(page)
    if (isNaN(pageInt)) throw new InvalidParamTypeError()
    return await getPostsService(pageInt);
  });
