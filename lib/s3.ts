import { S3Client } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.AWS_S3_BUCKET || '';

const credentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
    }
  : undefined;

export const s3 = new S3Client({ region, credentials });
export const s3Bucket = bucket;

export function getAwsS3ConfigError() {
  const missing: string[] = [];

  if (!process.env.AWS_REGION) missing.push('AWS_REGION');
  if (!process.env.AWS_S3_BUCKET) missing.push('AWS_S3_BUCKET');
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    missing.push('AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY');
  }

  if (missing.length > 0) {
    return `Thiếu cấu hình AWS trên Vercel: ${missing.join(', ')}. Hãy thêm vào Project Settings > Environment Variables.`;
  }

  return null;
}
