import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { PDFDocument } from '@/lib/models/document';
import { requireAdmin } from '@/lib/adminAuth';

// GET: Lấy danh sách PDF từ MongoDB, nhóm theo danh mục.
export async function GET() {
  try {
    await clientPromise;

    const documents = await PDFDocument.find({})
      .select('fileName size uploadedAt uploadedBy category _id')
      .sort({ category: 1, uploadedAt: -1 })
      .lean();

    const groupedFiles: { [key: string]: unknown[] } = {};
    documents.forEach((doc) => {
      const category = doc.category || 'IELTS';
      if (!groupedFiles[category]) groupedFiles[category] = [];
      groupedFiles[category].push({
        id: doc._id.toString(),
        name: doc.fileName,
        size: doc.size,
        uploadDate: doc.uploadedAt,
        uploadedBy: doc.uploadedBy,
        category: doc.category,
        downloadUrl: `/api/document/download?id=${doc._id.toString()}`,
      });
    });

    return NextResponse.json({
      success: true,
      files: groupedFiles,
      categories: Object.keys(groupedFiles),
    });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách file' },
      { status: 500 },
    );
  }
}

// POST: Chỉ admin được tải PDF lên.
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    await clientPromise;
    const formData = await request.formData();
    const file = formData.get('file');
    const category = (formData.get('category') as string) || 'IELTS';

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Không có file được gửi' },
        { status: 400 },
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Chỉ chấp nhận file PDF' },
        { status: 400 },
      );
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File quá lớn (giới hạn 50MB)' },
        { status: 400 },
      );
    }

    const newDocument = new PDFDocument({
      fileName: file.name,
      fileData: Buffer.from(await file.arrayBuffer()),
      mimeType: file.type,
      size: file.size,
      category,
      uploadedAt: new Date(),
      uploadedBy: adminCheck.user.email,
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
          downloadUrl: `/api/document/download?id=${savedDoc._id.toString()}`,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải file lên' },
      { status: 500 },
    );
  }
}

// DELETE: Chỉ admin được xóa PDF.
export async function DELETE(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    await clientPromise;
    const fileId = request.nextUrl.searchParams.get('id');
    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu ID file' },
        { status: 400 },
      );
    }

    await PDFDocument.findByIdAndDelete(fileId);
    return NextResponse.json({ success: true, message: 'Xóa file thành công' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xóa file' },
      { status: 500 },
    );
  }
}
