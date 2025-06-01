"use client";

import { useState, useRef, useEffect } from "react";
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
import { EditBlogSchemaType, editBlogSchema } from "./validations"
import { useServerAction } from "zsa-react";
import { updatePostAction, fetchPostForEditAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

export default function EditBlogPostPage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const postId = params.id as string;

  const { toast } = useToast()

  const { execute: updatePost, isPending: isUpdating, error: updateError } = useServerAction(updatePostAction)
  const { execute: fetchPost, error: fetchError } = useServerAction(fetchPostForEditAction)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<EditBlogSchemaType>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  const contentWatch = watch("content");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const [post, error] = await fetchPost(postId);
        
        if (error) {
          toast({
            title: "Error loading post",
            description: error.error,
            variant: "destructive",
          });
          return;
        }

        if (post) {
          reset({
            title: post.title,
            description: post.description,
            content: post.content,
          });
          
          if (post.banner) {
            setCurrentBanner(post.banner);
            setPreviewUrl(getImageUrl(post.banner, ""));
          }
        }
      } catch (error) {
        toast({
          title: "Error loading post",
          description: "Failed to load the blog post for editing",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, fetchPost, reset, toast]);

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

  const onSubmit = (data: EditBlogSchemaType) => {
    const imageWrapper = new FormData();
    if (image) {
      imageWrapper.append("image", image);
    }

    updatePost({
      ...data,
      id: parseInt(postId),
      imageWrapper: image ? imageWrapper : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              Edit Blog Post
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
              {(updateError || fetchError) && (
                <div>
                  <p className="text-red-500">
                    {updateError?.error || fetchError?.error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                form="blog-post-form"
                disabled={isUpdating}
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <SaveIcon className="mr-2 h-4 w-4" />
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 