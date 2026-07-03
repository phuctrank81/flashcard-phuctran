import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { PDFDocument } from '@/lib/models/document';
import { getServerSession } from 'next-auth/next';

// GET: Lấy danh sách PDF từ MongoDB (grouped by category)
export async function GET(request: NextRequest) {
  try {
    await clientPromise;

    const documents = await PDFDocument.find({})
      .select('fileName size uploadedAt uploadedBy category _id')
      .sort({ category: 1, uploadedAt: -1 })
      .lean();

    // Group by category
    const groupedFiles: { [key: string]: any[] } = {};
    documents.forEach(doc => {
      const category = doc.category || 'IELTS';
      if (!groupedFiles[category]) {
        groupedFiles[category] = [];
      }
      groupedFiles[category].push({
        id: doc._id.toString(),
        name: doc.fileName,
        size: doc.size,
        uploadDate: doc.uploadedAt,
        uploadedBy: doc.uploadedBy,
        category: doc.category,
        downloadUrl: `/api/document/download?id=${doc._id.toString()}`
      });
    });

    return NextResponse.json(
      {
        success: true,
        files: groupedFiles,
        categories: Object.keys(groupedFiles)
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

// POST: Upload PDF lên MongoDB (Admin & User)
export async function POST(request: NextRequest) {
  try {
    // Kiểm tra xem user đã login chưa
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập để tải file lên' },
        { status: 401 }
      );
    }

    await clientPromise;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'IELTS';

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
      category,
      uploadedAt: new Date(),
      uploadedBy: session.user.email || session.user.name || 'Unknown',
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

// DELETE: Xóa PDF (chỉ Admin)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    // Kiểm tra xem user có phải admin không
    // Giả sử admin email hoặc role cụ thể
    const isAdmin = session.user.email === 'admin@example.com' || 
                    (session.user as any).role === 'admin';

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Chỉ admin có quyền xóa file' },
        { status: 403 }
      );
    }

    await clientPromise;

    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu ID file' },
        { status: 400 }
      );
    }

    await PDFDocument.findByIdAndDelete(fileId);

    return NextResponse.json(
      { success: true, message: 'Xóa file thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xóa file' },
      { status: 500 }
    );
  }
}
