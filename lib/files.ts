import "server-only";
import { GetObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// if the access keys are not provided then it will use the session credentials
let s3Client: S3Client;
if (env.AWS_ACCESS_KEY_ID) {
  s3Client = new S3Client({
    region: env.AWS_REGION != null ? env.AWS_REGION : undefined,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey:
        env.AWS_SECRET_ACCESS_KEY != null ? env.AWS_SECRET_ACCESS_KEY : "",
    },
  });
} else {
  s3Client = new S3Client();
}

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

export async function deleteFileFromBucket(filename: string) {
  const Key = filename;
  const Bucket = env.PUBLIC_BUCKET;

  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket,
      Key,
    }));
  } catch (e) {
    // Log the error but don't throw - we don't want to fail the update if delete fails
    console.error(`Failed to delete file ${filename} from S3:`, e);
  }
}
