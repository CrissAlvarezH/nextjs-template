"use client";

import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon, SaveIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewBlogSchemaType, newBlogSchema } from "./validations"
import { useServerAction } from "zsa-react";
import { createPostAction } from "./actions";
import { useToast } from "@/hooks/use-toast";


export default function NewBlogPostPage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const { toast } = useToast()

  const { execute: createPost, isPending: isCreating, error: createError } = useServerAction(createPostAction)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NewBlogSchemaType>({
    resolver: zodResolver(newBlogSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  const contentWatch = watch("content");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: NewBlogSchemaType) => {
    console.log({
      ...data,
      image,
    });

    if (!image) {
      return toast({title: "Debes elegir una imagen", variant: "destructive" })
    }

    const imageWrapper = new FormData()
    imageWrapper.append("image", image)

    createPost({...data, imageWrapper})
  };

  return (
    <div className="flex justify-center px-4 py-2 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative flex h-40 flex-col justify-end overflow-hidden p-6">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
              backgroundColor: previewUrl ? "transparent" : "bg-primary",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
          <div className="relative z-10 flex w-full items-end justify-between">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              Create New Blog Post
            </h2>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shadow-md"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Change Image
              </Button>
            </div>
          </div>
          <Input
            id="image"
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </CardHeader>

        <CardContent>
          <form
            id="blog-post-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2 py-2">
              <Label htmlFor="title">Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    placeholder="Enter blog post title"
                    {...field}
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Enter blog post description"
                    {...field}
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "write" | "preview")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="mt-0">
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="content"
                        placeholder="Write your blog post content here (Markdown supported)"
                        className="min-h-[300px]"
                        {...field}
                      />
                    )}
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <div className="prose min-h-[300px] max-w-none overflow-auto rounded-md border bg-white p-4">
                    <Markdown content={contentWatch}/>
                  </div>
                </TabsContent>
              </Tabs>
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>


            <div className="flex items-center gap-3 justify-end">
              {createError && (
                <div>
                  <p className="text-red-500">{createError.error}</p>
                </div>
              )}

              <Button
                type="submit"
                form="blog-post-form"
                disabled={isCreating}
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <SaveIcon className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
