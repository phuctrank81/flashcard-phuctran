import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Thư mục lưu PDF
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'documents');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// GET: Lấy danh sách PDF
export async function GET(request: NextRequest) {
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    
    // Lọc chỉ các file PDF
    const pdfFiles = files.filter(file => 
      file.toLowerCase().endsWith('.pdf')
    ).map(file => {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = fs.statSync(filePath);
      
      return {
        name: file,
        size: stats.size,
        uploadDate: stats.mtime,
        downloadUrl: `/api/document/download?file=${encodeURIComponent(file)}`
      };
    });

    return NextResponse.json(
      {
        success: true,
        files: pdfFiles,
        totalFiles: pdfFiles.length
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

// POST: Upload PDF (tùy chọn)
export async function POST(request: NextRequest) {
  try {
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

    // Lưu file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(UPLOAD_DIR, file.name);
    
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json(
      {
        success: true,
        message: 'Tải file lên thành công',
        file: {
          name: file.name,
          size: file.size,
          downloadUrl: `/api/document/download?file=${encodeURIComponent(file.name)}`
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
