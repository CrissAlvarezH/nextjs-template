import { Markdown } from "@/components/markdown"
import { retrieveBlogPostAction } from "./actions"
import { notFound } from "next/navigation"
import { BlogPostComments } from "./blog-post-comments";
import { AddCommentForm } from "./add-comment-form";


type BlogPostPageProps = {
  params: {
    id: string
  }
}

export default async function BlogPostPage({ params: { id } }: BlogPostPageProps) {
  const [post, error] = await retrieveBlogPostAction(id)
  if (error) throw new Error(error.error)
  if (!post) notFound()

  return (
    <div className="flex justify-center pb-32">
      <div className="w-[900px]">

        {/* Post header */}
        <div className="py-8 px-7 bg-gray-100/80">
          <div className="flex flex-col md:flex-row justify-between">
            <h1 className="text-4xl font-bold">{post.title}</h1>

            <div className="flex items-center">
              <p className="text-sm font-semibold text-gray-400">{new Date(post?.date).toLocaleDateString("en-CA")}</p>
              <p className="text-xl px-1.5 font-bold">·</p>
              <p className="text-sm font-light">{post.author.name}</p>
            </div>
          </div>

          <p className="pt-4">{post.description}</p>
        </div>

        {/* Content */}
        <div className="p-5">
          <Markdown content={post.content} />
        </div>

        <p className="text-2xl font-bold pt-10 pb-3">Comments</p>
        <AddCommentForm postId={post.id}/>

        <div className="mt-10 border-b border-gray-200" />

        <BlogPostComments postId={post.id} />
      </div>
    </div>
  )
}
