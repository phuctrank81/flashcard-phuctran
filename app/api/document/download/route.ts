import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'documents');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'Thiếu tên file' },
        { status: 400 }
      );
    }

    // Kiểm tra tính hợp lệ của tên file (tránh directory traversal)
    const decodedFileName = decodeURIComponent(fileName);
    const filePath = path.normalize(path.join(UPLOAD_DIR, decodedFileName));

    // Đảm bảo file nằm trong thư mục được phép
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json(
        { success: false, error: 'Truy cập không hợp lệ' },
        { status: 403 }
      );
    }

    // Kiểm tra file tồn tại
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'File không tìm thấy' },
        { status: 404 }
      );
    }

    // Đọc file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Trả về file với headers để download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${decodedFileName}"`,
        'Content-Length': fileBuffer.length.toString(),
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
