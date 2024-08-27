import { rgbaToDataURL } from "thumbhash";

export async function encodeImageToBlurhashBase64(src: string) {
  // load image
  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });

  // resize image (new size)
  const width = 5;
  const height = 5;

  // get image data
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No image context.");
  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);

  // convert to a hash base64
  return rgbaToDataURL(width, height, imageData.data);
}
