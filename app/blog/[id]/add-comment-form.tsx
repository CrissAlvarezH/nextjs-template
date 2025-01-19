"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useServerAction } from "zsa-react";
import { createPostCommentAction } from "./actions";
import { useToast } from "@/hooks/use-toast";


export function AddCommentForm({ postId }: { postId: number }) {
  const { toast } = useToast()
  const [comment, setComment] = useState("")

  const { execute, isPending } = useServerAction(createPostCommentAction)

  const onSubmit = async () => {
    const [res, error] = await execute({ content: comment, postId })
    if (error)
      return toast({ title: "Error: " + error.error, variant: "destructive" })

    setComment("") // reset
  }

  return (
    <div className="flex border rounded-md mb-5">
      <Input
        placeholder="Leave a comment"
        value={comment} onChange={e => setComment(e.target.value)} />

      <Button
        onClick={onSubmit} variant="secondary"
        disabled={comment.length == 0}>
        {isPending && <Loader2 className="w-4 h-4 mr-1" />}
        Comment
      </Button>
    </div>
  )
}
