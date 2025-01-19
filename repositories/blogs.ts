import "server-only";
import { db, Transaction } from "@/db"; // Adjust the import path as necessary
import { blogPostComment, blogPosts, SelectBlogPost, SelectBlogPostComment, SelectBlogPostCommentType } from "@/db/schemas/blog";
import { count, eq } from "drizzle-orm";
import { DatabaseError } from "@/lib/errors";
import { users } from "@/db/schemas/users"


export type ListBlogPostsType = Omit<SelectBlogPost, "author" | "content"> & {
  author: {
    id: number, name: string
  }
}

export async function listBlogPosts(
  page: number, pageSize: number
): Promise<{ posts: ListBlogPostsType[], totalPages: number }> {
  const offset = (page - 1) * pageSize;

  const posts = await db
    .select({
      blog: {
        id: blogPosts.id,
        title: blogPosts.title,
        description: blogPosts.description,
        date: blogPosts.date,
        banner: blogPosts.banner,
      },
      author: {
        id: users.id, name: users.name
      }
    })
    .from(blogPosts)
    .innerJoin(users, eq(users.id, blogPosts.author))
    .limit(pageSize).offset(offset);

  // change the format of { blog: {...}, author: {...} } to { title: "..", ..., author: { id: ..., name: ...} }
  const flatPosts = posts.map(p => ({ ...p.blog, author: p.author }))

  const [{ count: totalPosts }] = await db
    .select({ count: count() })
    .from(blogPosts);

  const totalPages = Math.ceil(totalPosts / pageSize);

  return { posts: flatPosts, totalPages }
}

export type RetrieveBlogPostType = Omit<SelectBlogPost, "author"> & {
  author: {id: number, name: string}
}

export async function retrieveBlogPost(id: number): Promise<RetrieveBlogPostType | undefined> {
  const posts = await db
    .select({
      blog: blogPosts,
      author: {
        id: users.id, name: users.name
      }
    })
    .from(blogPosts)
    .innerJoin(users, eq(users.id, blogPosts.author))
    .where(eq(blogPosts.id, id))

  if (posts.length > 0) return { ...posts[0].blog, author: posts[0].author }
  else return undefined
}

export type InsertBlogPostType = {
  title: string
  description: string,
  content: string,
  author: number
}

export async function insertBlogPost(
  data: InsertBlogPostType,
  tx?: Transaction,
) {
  tx = tx || db
  const res = await tx.insert(blogPosts).values({ ...data, date: new Date() }).returning();
  if (res.length === 0) throw new DatabaseError("Error in insert blog post");
  return res[0]
}

export async function updateBlogPostBannerPath(id: number, newPath: string, tx?: Transaction) {
  tx = tx || db
  await tx.update(blogPosts).set({ banner: newPath }).where(eq(blogPosts.id, id))
}

export async function deleteBlogPost(id: number) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
}

export type ListPostCommentType = {
  comment: SelectBlogPostCommentType,
  author: {id: number, picture: string | null, pictureHash: string | null, name: string}
}

export async function listPostComments(postId: number): Promise<ListPostCommentType[]> {
  return await db
    .select({
      comment: blogPostComment,
      author: {
        id: users.id, picture: users.picture, 
        pictureHash: users.pictureHash, name: users.name
      }
    })
    .from(blogPostComment)
    .innerJoin(users, eq(users.id, blogPostComment.author))
    .where(eq(blogPostComment.post, postId))
}

export async function insertPostComment(content: string, postId: number, authorId: number, date: Date) {
  return db.insert(blogPostComment).values({
    content, post: postId, author: authorId, date
  })
}