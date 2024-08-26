import { getFileUrl } from "@/lib/files";
import { streamImageFromUrl } from "@/lib/images";

export async function GET(request: Request) {
  const imageKey = new URL(request.url).searchParams.get("src") || "";
  const imageUrl = await getFileUrl(imageKey);

  return streamImageFromUrl(imageUrl);
}
