"use client"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createPostCommentAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";


export function AddCommentForm({ postId }: { postId: number }) {
  const { toast } = useToast()
  const [comment, setComment] = useState("")

  const { execute, isPending, hasErrored, result} = useAction(createPostCommentAction)

  useEffect(() => {
    if (hasErrored) {
      toast({ title: result.serverError, variant: "destructive" })
    }
  }, [hasErrored, result.serverError, toast])

  const onSubmit = async () => {
    execute({ content: comment, postId })
    setComment("") // reset
  }

  return (
    <div className="flex border rounded-md mb-5">
      <Input
        placeholder="Leave a comment"
        value={comment} onChange={e => setComment(e.target.value)} />

      <Button
        onClick={onSubmit} variant="secondary"
        disabled={isPending || comment.length == 0}>
        {isPending && <Loader2 className="w-4 h-4 mr-1" />}
        Comment
      </Button>
    </div>
  )
}
