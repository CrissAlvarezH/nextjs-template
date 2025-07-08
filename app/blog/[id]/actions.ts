"use server"
import { createPostCommentService, listPostCommentsService, retrieveBlogPostService } from "@/services/blog"
import { authenticatedAction, unauthenticatedAction } from "@/lib/server-actions"
import { z } from "zod"
import { InvalidIdentifierError } from "@/lib/errors"
import { revalidatePath } from "next/cache"


export const retrieveBlogPostAction = unauthenticatedAction
  .inputSchema(z.string())
  .action(async ({ parsedInput }) => {
    const id = parseInt(parsedInput)
    if (isNaN(id)) throw new InvalidIdentifierError()
    return await retrieveBlogPostService(id)
  })

export const listPostCommentsAction = unauthenticatedAction
  .inputSchema(z.number())
  .action(async ({ parsedInput }) => {
    return await listPostCommentsService(parsedInput)
  })

export const createPostCommentAction = authenticatedAction
  .inputSchema(z.object({ content: z.string().min(1), postId: z.number() }))
  .action(async ({ parsedInput: {content, postId}, ctx: { user } }) => {
    const res = await createPostCommentService(content, postId, user.id)
    revalidatePath("/blog/"+postId)
    return res
  })
