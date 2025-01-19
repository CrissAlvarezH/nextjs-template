import "server-only";

import {
  listBlogPosts, insertBlogPost, updateBlogPostBannerPath, InsertBlogPostType, retrieveBlogPost,
  listPostComments,
  insertPostComment
} from "@/repositories/blogs"
import { uploadFileToBucket } from "@/lib/files";
import { db } from "@/db";


export async function getPostsService(page: number, pageSize: number = 9) {
  return listBlogPosts(page, pageSize)
}

export async function createBlogPostService(data: InsertBlogPostType, image: File) {
  await db.transaction(async (tx) => {
    const post = await insertBlogPost(data, tx)

    const path = "posts/post_" + post.id
    await uploadFileToBucket(image.stream(), path)
    await updateBlogPostBannerPath(post.id, path, tx)
  })
}

export async function retrieveBlogPostService(id: number) {
  return retrieveBlogPost(id)
}

export async function listPostCommentsService(postId: number) {
  return listPostComments(postId)
}

export async function createPostCommentService(content: string, postId: number, authorId: number) {
  return insertPostComment(content, postId, authorId, new Date())
}