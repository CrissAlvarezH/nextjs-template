"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { uploadImageAction } from "@/components/upload-img-btn/action";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

export interface UploadImgButtonProps extends ButtonProps {
  text: string;
}

// TODO make it generic
export function UploadImgButton({ text, ...props }: UploadImgButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPending, error, execute } = useServerAction(uploadImageAction);

  const handleOnChangeUploadImage = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (e.target.files.length > 0) {
      const image = e.target.files[0];
      const formData = new FormData();
      formData.append("image", image);
      void execute({ fileWrapper: formData });

      e.target.value = null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div>
          <p className="text-red-600">{error.error}</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleOnChangeUploadImage}
        accept="image/*"
      />
      <Button
        onClick={() => fileInputRef?.current?.click()}
        disabled={isPending}
        type="submit"
        {...props}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {text}
      </Button>
    </div>
  );
}
