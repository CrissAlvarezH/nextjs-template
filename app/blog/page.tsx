import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Paginator } from "@/components/pagination";
import { listPostsAction } from "@/app/blog/actions";
import { getImageUrl } from "@/lib/utils";
import { validateRequest } from "@/lib/auth";

export default async function BlogPage({ params: { page = 1 } }) {
  const [data, error] = await listPostsAction({ page });
  if (error) throw new Error(error.error) // to make the error.tsx take it

  const user = await validateRequest()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="flex justify-between">
          <h2 className="mb-6 text-xl font-semibold">Latest Posts</h2>

          {user.user && (
            <Link href="/blog/create">
              <Button variant="secondary">
                Create a new post
              </Button>
            </Link>
          )}
        </div>

        {data.posts.length == 0 && (
          <div>
            <h1>There ins't any post yet</h1>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <Card
              key={post.id}
              className="group relative h-[300px] overflow-hidden"
            >
              <Image
                src={getImageUrl(post.banner, "")}
                alt={`Cover image for ${post.title}`}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-60 p-6 opacity-100 transition-opacity duration-300 group-hover:opacity-90">
                <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-white">
                  {post.title}
                </h3>


                <div className="mb-2 flex items-center text-sm text-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("en-CA")}
                  <p className="pl-1">/ by {post.author.name.split(" ")[0]}</p>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-white">
                  {post.description}
                </p>
                <Button asChild variant="secondary" className="mt-auto w-full">
                  <Link href={`/blog/${post.id}`}>Read more</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {data.totalPages > 1 &&
          <Paginator totalPages={data.totalPages} />
        }
      </main>
    </div>
  );
}
