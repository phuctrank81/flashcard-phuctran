import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { PDFDocument } from '@/lib/models/document';

// GET: Lấy danh sách PDF từ MongoDB
export async function GET(request: NextRequest) {
  try {
    await clientPromise;

    const documents = await PDFDocument.find({})
      .select('fileName size uploadedAt _id')
      .sort({ uploadedAt: -1 })
      .lean();

    const files = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.fileName,
      size: doc.size,
      uploadDate: doc.uploadedAt,
      downloadUrl: `/api/document/download?id=${doc._id.toString()}`
    }));

    return NextResponse.json(
      {
        success: true,
        files,
        totalFiles: files.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách file' },
      { status: 500 }
    );
  }
}

// POST: Upload PDF lên MongoDB
export async function POST(request: NextRequest) {
  try {
    await clientPromise;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không có file được gửi' },
        { status: 400 }
      );
    }

    // Kiểm tra loại file
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { success: false, error: 'Chỉ chấp nhận file PDF' },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước (giới hạn 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File quá lớn (giới hạn 50MB)' },
        { status: 400 }
      );
    }

    // Chuyển file thành Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Lưu vào MongoDB
    const newDocument = new PDFDocument({
      fileName: file.name,
      fileData: buffer,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date(),
    });

    const savedDoc = await newDocument.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Tải file lên thành công',
        file: {
          id: savedDoc._id.toString(),
          name: savedDoc.fileName,
          size: savedDoc.size,
          downloadUrl: `/api/document/download?id=${savedDoc._id.toString()}`
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải file lên' },
      { status: 500 }
    );
  }
}
