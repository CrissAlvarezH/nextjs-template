"use client"

import { Button } from "@/components/ui/button";
import { useEffect } from "react";


export default function Error({ error, reset }: { error: Error & { digest: string }, reset: () => void }) {

  useEffect(() => {
    console.log("error", error)
  }, [error])

  // TODO set a better style to this
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  )
}