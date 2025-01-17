import { z } from "zod"


export const newBlogSchema = z.object({
  title: z.string().min(15, {
    message: "Title must be at least 15 characters.",
  }),
  description: z.string().min(30, {
    message: "Description must be at least 30 characters.",
  }),
  content: z.string().min(1, {
    message: "Content must not be empty.",
  }),
});

export type NewBlogSchemaType = z.infer<typeof newBlogSchema>;