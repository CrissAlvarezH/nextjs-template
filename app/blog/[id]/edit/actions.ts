"use server"
import { z } from "zod"
import { authenticatedAction } from "@/lib/server-actions";
import { updateBlogPostService, retrieveBlogPostService } from "@/services/blog";
import { editBlogSchema } from "./validations";
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache";

export const updatePostAction = authenticatedAction
  .inputSchema(editBlogSchema.extend({
    id: z.number(),
    imageWrapper: z.instanceof(FormData).optional()
  }))
  .action(async ({ parsedInput: { id, imageWrapper, ...data }, ctx: { user } }) => {
    // Get the current post to check authorization
    const currentPost = await retrieveBlogPostService(id);
    if (!currentPost) {
      throw new Error("Blog post not found");
    }

    // Check if the user is the author
    if (currentPost.author.id !== user.id) {
      throw new Error("You can only edit your own blog posts");
    }

    const image = imageWrapper?.get("image") as File | undefined;
    await updateBlogPostService(id, data, image);

    revalidatePath(`/blog/${id}`);
    revalidatePath("/blog");
    redirect(`/blog/${id}`);
  });

export const fetchPostForEditAction = authenticatedAction
  .inputSchema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const post = await retrieveBlogPostService(id);
    if (!post) {
      throw new Error("Blog post not found");
    }

    // Check if the user is the author
    if (post.author.id !== user.id) {
      throw new Error("You can only edit your own blog posts");
    }

    return post;
  });
