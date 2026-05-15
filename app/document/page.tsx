'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { Download, FileText, AlertCircle, Loader } from "lucide-react";

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  downloadUrl: string;
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Lấy danh sách PDF
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/document');
      const data = await response.json();

      if (data.success) {
        setDocuments(data.files);
        setError(null);
      } else {
        setError(data.error || 'Không thể tải danh sách file');
      }
    } catch (err) {
      setError('Lỗi khi kết nối tới server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Refresh danh sách file
        await fetchDocuments();
      } else {
        setError(data.error || 'Tải file lên thất bại');
      }
    } catch (err) {
      setError('Lỗi khi tải file lên');
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input
      if (e.target) e.target.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Tiêu đề */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tài Liệu</h1>
            <p className="text-gray-600">Tải về các tài liệu học tập</p>
          </div>

          {/* Upload Section (tùy chọn) */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tải lên Tài Liệu</h2>
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-100 transition">
                <FileText className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                <p className="text-sm text-gray-700">
                  {uploading ? 'Đang tải lên...' : 'Nhấp để chọn file PDF'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Chỉ chấp nhận file PDF</p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                ✕
              </button>
            </div>
          )}

          {/* Documents List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Danh Sách Tài Liệu
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Chưa có tài liệu nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={doc.downloadUrl}
                      download={doc.name}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex-shrink-0 ml-4"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Tải Về</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}