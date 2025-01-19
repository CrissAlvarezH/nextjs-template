import { listPostCommentsAction } from "./actions"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"


export async function BlogPostComments({ postId }: { postId: number }) {
  const [comments, error] = await listPostCommentsAction(postId)

  if (error) return <p>error {error.error}</p>
  return (
    <div className="py-3">
      {comments.length == 0 && (
        <p className="text-gray-500">There isn&apos;t any comment yet</p>
      )}

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