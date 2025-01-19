"use server"
import { createPostCommentService, listPostCommentsService, retrieveBlogPostService } from "@/services/blog"
import { authenticatedAction, unauthenticatedAction } from "@/lib/server-actions"
import { RetrieveBlogPostType } from "@/repositories/blogs"
import { z } from "zod"
import { InvalidIdentifierError } from "@/lib/errors"


export const retrieveBlogPostAction = authenticatedAction
  .createServerAction()
  .input(z.string())
  .output(z.custom<RetrieveBlogPostType | undefined>())
  .handler(async ({ input }) => {
    const id = parseInt(input)
    if (isNaN(id)) throw new InvalidIdentifierError()
    return await retrieveBlogPostService(id)
  })

export const listPostCommentsAction = unauthenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input }) => {
    return await listPostCommentsService(input)
  })

export const createPostCommentAction = authenticatedAction
  .createServerAction()
  .input(z.object({ content: z.string().min(1), postId: z.number() }))
  .handler(async ({ input: {content, postId}, ctx: { user } }) => {
    return await createPostCommentService(content, postId, user.id)
  })
