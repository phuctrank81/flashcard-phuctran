import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { Document } from '@/lib/models/document';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    await clientPromise;

    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu ID file' },
        { status: 400 }
      );
    }

    // Kiểm tra ID hợp lệ
    if (!ObjectId.isValid(fileId)) {
      return NextResponse.json(
        { success: false, error: 'ID file không hợp lệ' },
        { status: 400 }
      );
    }

    // Tìm file trong MongoDB
    const document = await Document.findById(fileId);

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'File không tìm thấy' },
        { status: 404 }
      );
    }

    // Trả về file
    return new NextResponse(document.fileData, {
      headers: {
        'Content-Type': document.mimeType || 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.fileName}"`,
        'Content-Length': document.size.toString(),
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
