'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { Download, FileText, AlertCircle, Loader, RefreshCw, Eye, X, ExternalLink } from "lucide-react";

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  downloadUrl: string;
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<{ [key: string]: DocumentFile[] }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('IELTS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Đóng modal khi nhấn Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewDoc(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/document');
      const data = await response.json();

      if (data.success) {
        setDocuments(data.files);
        const cats = data.categories || ['IELTS', 'TOEIC'];
        setCategories(cats);
        setActiveCategory(cats[0] || 'IELTS');
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

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

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'IELTS': return '🎯 IELTS';
      case 'TOEIC': return '📝 TOEIC';
      default: return cat;
    }
  };

  const currentDocs = documents[activeCategory] ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* PDF Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewDoc(null); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">{previewDoc.name}</h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <a
                  href={previewDoc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Mở tab mới</span>
                </a>
                <a
                  href={previewDoc.downloadUrl}
                  download={previewDoc.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Tải Về</span>
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* iframe viewer */}
            <div className="flex-1 overflow-hidden rounded-b-2xl">
              <iframe
                src={`${previewDoc.downloadUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full"
                title={previewDoc.name}
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">

          {/* Tiêu đề */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tài Liệu</h1>
            <p className="text-gray-600">Tải về các tài liệu ôn tập IELTS &amp; TOEIC</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 rounded-r-lg">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDocuments}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  Thử lại
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Documents List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📚 Danh Sách Tài Liệu
            </h2>

            {/* Category Tabs */}
            {categories.length > 0 && (
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-3 font-semibold border-b-2 transition ${
                      activeCategory === cat
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            )}

            {/* Content States */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : currentDocs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Chưa có tài liệu {activeCategory} nào
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                          {doc.uploadedBy && (
                            <span className="ml-2">👤 {doc.uploadedBy}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        title="Xem trước"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Xem</span>
                      </button>
                      <a
                        href={doc.downloadUrl}
                        download={doc.name}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Tải Về</span>
                      </a>
                    </div>
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