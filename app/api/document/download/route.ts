import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3, s3Bucket } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Thiếu S3 object key' },
        { status: 400 }
      );
    }

    const response = await s3.send(new GetObjectCommand({
      Bucket: s3Bucket,
      Key: key,
    }));

    if (!response.Body) {
      throw new Error('S3 returned an empty file body');
    }

    const fileName = decodeURIComponent(key.split('/').pop() || 'document.pdf');

    return new NextResponse(response.Body.transformToWebStream(), {
      headers: {
        'Content-Type': response.ContentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        ...(response.ContentLength ? { 'Content-Length': response.ContentLength.toString() } : {}),
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải file về' },
      { status: 500 }
    );
  }
}