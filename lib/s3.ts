import { S3Client } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

if (!region || !bucket) {
  throw new Error('Missing AWS_REGION or AWS_S3_BUCKET environment variables');
}

export const s3 = new S3Client({ region });
export const s3Bucket = bucket;
