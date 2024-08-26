import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(key: string | null, fallback: string) {
  return key ? "/api/images?src=" + key : fallback;
}
