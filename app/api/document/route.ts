import { NextRequest, NextResponse } from 'next/server';
import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { requireAdmin } from '@/lib/adminAuth';
import { getAwsS3ConfigError, s3, s3Bucket } from '@/lib/s3';

type DocumentGroup = Record<string, Record<string, unknown[]>>;

function getDocumentDetails(key: string) {
  const segments = key.split('/');
  const fileName = decodeURIComponent(segments.at(-1) || key);
  const categoryFromPath = segments[0] === 'documents' ? segments[1]?.toUpperCase() : undefined;
  const category = categoryFromPath === 'TOEIC' ? 'TOEIC' : categoryFromPath === 'IELTS' ? 'IELTS' : /toeic/i.test(fileName) ? 'TOEIC' : 'IELTS';
  const seriesFromPath = segments[0] === 'documents' && segments.length >= 4 ? decodeURIComponent(segments[2]) : undefined;
  const series = seriesFromPath || (category === 'IELTS' && /cambridge/i.test(fileName) ? 'IELTS Cambridge' : category === 'TOEIC' ? 'Tài liệu TOEIC' : 'Tài liệu IELTS khác');

  return { fileName, category, series };
}

// Lấy danh sách PDF trực tiếp từ bucket S3.
export async function GET() {
  try {
    const awsConfigError = getAwsS3ConfigError();
    if (awsConfigError) {
      return NextResponse.json({ success: false, error: awsConfigError }, { status: 500 });
    }

    const result = await s3.send(new ListObjectsV2Command({ Bucket: s3Bucket }));
    const groupedFiles: DocumentGroup = {};

    result.Contents?.forEach((object) => {
      if (!object.Key || object.Key.endsWith('/')) return;
      const { fileName, category, series } = getDocumentDetails(object.Key);
      if (!groupedFiles[category]) groupedFiles[category] = {};
      if (!groupedFiles[category][series]) groupedFiles[category][series] = [];
      groupedFiles[category][series].push({
        id: object.Key,
        name: fileName,
        size: object.Size || 0,
        uploadDate: object.LastModified,
        category,
        series,
        downloadUrl: `/api/document/download?key=${encodeURIComponent(object.Key)}`,
      });
    });

    return NextResponse.json({ success: true, files: groupedFiles, categories: Object.keys(groupedFiles) });
  } catch (error) {
    console.error('Error listing S3 files:', error);
    const message = error instanceof Error ? error.message : 'Không thể lấy danh sách file từ S3';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Chỉ admin được tải PDF lên S3.
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const awsConfigError = getAwsS3ConfigError();
    if (awsConfigError) {
      return NextResponse.json({ success: false, error: awsConfigError }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category') === 'TOEIC' ? 'TOEIC' : 'IELTS';
    const series = (formData.get('series') as string)?.trim() || (category === 'IELTS' ? 'IELTS Cambridge' : 'Tài liệu TOEIC');

    if (!(file instanceof File)) return NextResponse.json({ success: false, error: 'Không có file được gửi' }, { status: 400 });
    if (file.type !== 'application/pdf') return NextResponse.json({ success: false, error: 'Chỉ chấp nhận file PDF' }, { status: 400 });
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ success: false, error: 'File quá lớn (giới hạn 50MB)' }, { status: 400 });

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const s3Key = `documents/${category}/${encodeURIComponent(series)}/${Date.now()}-${randomUUID()}-${safeFileName}`;
    await s3.send(new PutObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }));

    return NextResponse.json({
      success: true,
      message: 'Tải file lên S3 thành công',
      file: { id: s3Key, name: file.name, size: file.size, downloadUrl: `/api/document/download?key=${encodeURIComponent(s3Key)}` },
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    const message = error instanceof Error ? error.message : 'Lỗi khi tải file lên S3';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Chỉ admin được xóa PDF trên S3.
export async function DELETE(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const awsConfigError = getAwsS3ConfigError();
    if (awsConfigError) {
      return NextResponse.json({ success: false, error: awsConfigError }, { status: 500 });
    }

    const key = request.nextUrl.searchParams.get('key');
    if (!key) return NextResponse.json({ success: false, error: 'Thiếu S3 object key' }, { status: 400 });

    await s3.send(new DeleteObjectCommand({ Bucket: s3Bucket, Key: key }));
    return NextResponse.json({ success: true, message: 'Xóa file thành công' });
  } catch (error) {
    console.error('Error deleting file:', error);
    const message = error instanceof Error ? error.message : 'Lỗi khi xóa file';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
