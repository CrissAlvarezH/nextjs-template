import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client();

export async function uploadFileToBucket(file: any, filename: string) {
  const Key = filename;
  const Bucket = env.PUBLIC_BUCKET;

  let res;

  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file,
        ContentType: file.type,
      },
      queueSize: 4,
      leavePartsOnError: false,
    });

    res = await parallelUploads.done();
  } catch (e) {
    throw e;
  }

  return res;
}

export async function getFileUrl(key: string) {
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.PUBLIC_BUCKET,
      Key: key,
    }),
    { expiresIn: 3600 },
  );
}