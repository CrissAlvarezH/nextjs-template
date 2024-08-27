"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { encodeImageToBlurhash } from "@/lib/image-compression";

export interface UploadImgButtonProps extends ButtonProps {
  text: string;
  loading: boolean;
  onFileUpload?: (fileWrapper: FormData, hash: string) => void;
}

// IMPORTANT!! this component only can be used by others client components, because of onFileUpload callback
// won't work in server components, due Nextjs needs to serialize props from server to client, that's why it's
// optional, to don't show typescript warning about it
export function UploadImgButton({
  text,
  onFileUpload,
  loading = false,
  ...props
}: UploadImgButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOnChangeUploadImage = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (e.target.files.length > 0) {
      const image = e.target.files[0];
      const hash = await encodeImageToBlurhash(URL.createObjectURL(image));
      const formData = new FormData();
      formData.append("image", image);
      if (onFileUpload) onFileUpload(formData, hash);

      e.target.value = null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleOnChangeUploadImage}
        accept="image/*"
      />
      <Button
        onClick={() => fileInputRef?.current?.click()}
        disabled={loading}
        type="submit"
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {text}
      </Button>
    </div>
  );
}
