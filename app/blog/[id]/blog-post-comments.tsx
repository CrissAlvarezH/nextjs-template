import { listPostCommentsAction } from "./actions"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"
import { formatDateToLocaleString } from "@/lib/dates"


export async function BlogPostComments({ postId }: { postId: number }) {
  const { data: comments, serverError } = await listPostCommentsAction(postId)

  if (serverError) return <p>error {serverError}</p>
  return (
    <div className="py-3">
      {comments?.length == 0 && (
        <p className="text-gray-500">There isn&apos;t any comment yet</p>
      )}

      {comments?.map(c => (
        <div key={c.comment.id} className="py-3">
          <div className="flex gap-3">
            <Image
              width={100} height={100} alt="picture image"
              className="w-11 h-11 rounded-full object-cover"
              src={getImageUrl(c.author.picture, "")} />
            <div>
              <p className="font-bold">{c.author.name}</p>
              <p className="text-sm text-gray-500">{formatDateToLocaleString(new Date(c.comment.date))}</p>
            </div>
          </div>
          <p className="py-2 px-2">{c.comment.content}</p>
        </div>
      ))}
    </div>
  )
}