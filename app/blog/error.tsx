"use client"

import { Button } from "@/components/ui/button";
import { useEffect } from "react";


export default function Error({ error, reset }: { error: Error & { digest: string }, reset: () => void }) {

  useEffect(() => {
    console.log("error", error)
  }, [error])

  // TODO set a better style to this
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-5">
      <h1 className="font-bold">Something went wrong</h1>
      <p className="font-light">{error.message}</p>
      <Button variant="secondary" onClick={reset}>Retry</Button>
    </div>
  )
}