import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET = process.env.S3_BUCKET;

const s3Client = new S3Client({
  region: AWS_REGION,
  ...(AWS_ACCESS_KEY && AWS_SECRET_KEY
    ? {
        credentials: {
          accessKeyId: AWS_ACCESS_KEY,
          secretAccessKey: AWS_SECRET_KEY,
        },
      }
    : {}),
});

function normalizeKey(key = "") {
  return String(key).replace(/^\/+/, "");
}

function assertS3Config() {
  if (!BUCKET) {
    throw new Error("S3_BUCKET is missing in environment variables");
  }
}

// GET URL
async function getObjectURL(key, expiresIn = 3600) {
  assertS3Config();
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: normalizeKey(key),
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// PUT URL
async function putObjectURL(key, contentType) {
  assertS3Config();
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: normalizeKey(key),
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}

// Direct upload using backend credentials (useful when browser->S3 CORS blocks presigned PUT).
async function uploadObject(key, body, contentType) {
  assertS3Config();
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: normalizeKey(key),
    Body: body,
    ContentType: contentType,
  });

  return await s3Client.send(command);
}

// DELETE
async function deleteObject(key) {
  assertS3Config();
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: normalizeKey(key),
  });

  return await s3Client.send(command);
}

export {
  getObjectURL,
  putObjectURL,
  uploadObject,
  deleteObject,
};