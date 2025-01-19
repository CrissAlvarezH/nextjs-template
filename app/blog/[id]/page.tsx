import { Markdown } from "@/components/markdown"
import { listPostCommentsAction, retrieveBlogPostAction } from "./actions"
import { notFound } from "next/navigation"
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";


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

          <p className="py-4">{post.description}</p>

          <div className="border-y border-gray-300">
            <Button variant="ghost" >
              <MessageCircle className="w-4 h-4 mr-1" />
              3
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <Markdown content={post.content} />
        </div>

        {/* Leave a comment */}
        <p className="text-2xl font-bold pt-10 pb-3">Comments</p>
        <div className="flex border rounded-md mb-5">
          <Input placeholder="Leave a comment" />
          <Button variant="secondary">Comment</Button>
        </div>

        <div className="mt-10 border-b border-gray-200" />

        {/* TODO fix this with a server component */}
        <BlogPostComments postId={post.id} />
      </div>
    </div>
  )
}

async function BlogPostComments({ postId }: { postId: number }) {
  const [comments, error] = await listPostCommentsAction(postId)

  if (error) return console.error("error on blog post comments", error)
  if (!comments) return console.error("comment null")
  return (
    <div className="py-3">
      {comments.map(c => (
        <div key={c.comment.id} className="py-3">
          <div className="flex gap-3">
            <Image
              width={100} height={100} alt="picture image"
              className="w-11 h-11 rounded-full"
              src={getImageUrl(c.author.picture, "")} />
            <div>
              <p className="font-bold">{c.author.name}</p>
              <p className="text-sm text-gray-500">{new Date(c.comment.date).toLocaleDateString("en-CA")}</p>
            </div>
          </div>
          <p className="py-2 px-2">{c.comment.content}</p>
        </div>
      ))}
    </div>
  )
}