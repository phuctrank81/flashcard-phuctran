'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { ChevronLeft, Download, Eye, ExternalLink, FileText, FolderOpen, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type DocumentFile = {
  id: string;
  name: string;
  downloadUrl: string;
};

type DocumentCatalog = Record<string, Record<string, DocumentFile[]>>;

// Thêm PDF vào public/documents rồi khai báo tại đây.
// Ví dụ: public/documents/ielts/cambridge/ielts-cambridge-14.pdf
const DOCUMENT_CATALOG: DocumentCatalog = {
  IELTS: {
    'IELTS Cambridge': [
      {
        id: 'ielts-cambridge-14',
        name: 'IELTS Cambridge 14',
        downloadUrl: '/documents/ielts/cambridge/ielts-cambridge-14.pdf',
      },
      {
        id: 'ielts-cambridge-13',
        name: 'IELTS Cambridge 13',
        downloadUrl: '/documents/ielts/cambridge/ielts-cambridge-13.pdf',
      },
    ],
  },
  TOEIC: {},
};

export default function DocumentPage() {
  const [activeCategory, setActiveCategory] = useState('IELTS');
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewDoc(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const seriesGroups = DOCUMENT_CATALOG[activeCategory] || {};
  const seriesNames = Object.keys(seriesGroups);
  const currentDocs = activeSeries ? seriesGroups[activeSeries] || [] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={(event) => event.target === event.currentTarget && setPreviewDoc(null)}>
          <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="truncate font-semibold text-gray-900">{previewDoc.name}</h3>
              <div className="ml-4 flex gap-2">
                <a href={previewDoc.downloadUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-100 p-2 text-gray-700" title="Mở tab mới"><ExternalLink className="h-4 w-4" /></a>
                <a href={previewDoc.downloadUrl} download={previewDoc.name} className="rounded-lg bg-blue-500 p-2 text-white" title="Tải về"><Download className="h-4 w-4" /></a>
                <button onClick={() => setPreviewDoc(null)} className="rounded-lg p-2 text-gray-500" aria-label="Đóng"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <iframe src={`${previewDoc.downloadUrl}#toolbar=1&navpanes=0`} className="min-h-0 flex-1 rounded-b-2xl" title={previewDoc.name} />
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-4xl flex-grow px-4 py-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Tài liệu</h1>
        <p className="mb-8 text-gray-600">Tài liệu ôn tập IELTS và TOEIC</p>

        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {Object.keys(DOCUMENT_CATALOG).map((category) => (
            <button key={category} onClick={() => { setActiveCategory(category); setActiveSeries(null); }} className={`border-b-2 px-4 py-3 font-semibold transition ${activeCategory === category ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}>
              {category}
            </button>
          ))}
        </div>

        {activeSeries ? (
          <section>
            <button onClick={() => setActiveSeries(null)} className="mb-4 flex items-center gap-1 text-sm font-semibold text-blue-600"><ChevronLeft className="h-4 w-4" />{activeCategory}</button>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{activeSeries}</h2>
            <div className="space-y-3">
              {currentDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex min-w-0 items-center gap-3"><FileText className="h-8 w-8 shrink-0 text-red-500" /><h3 className="truncate font-semibold text-gray-900">{doc.name}</h3></div>
                  <div className="ml-4 flex gap-2"><button onClick={() => setPreviewDoc(doc)} className="rounded-lg bg-gray-100 p-2 text-gray-700" title="Xem"><Eye className="h-4 w-4" /></button><a href={doc.downloadUrl} download={doc.name} className="rounded-lg bg-blue-500 p-2 text-white" title="Tải về"><Download className="h-4 w-4" /></a></div>
                </div>
              ))}
            </div>
          </section>
        ) : seriesNames.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {seriesNames.map((series) => (
              <button key={series} onClick={() => setActiveSeries(series)} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-blue-400 hover:shadow-md">
                <FolderOpen className="h-9 w-9 text-blue-500" />
                <div><h2 className="font-bold text-gray-900">{series}</h2><p className="text-sm text-gray-500">{seriesGroups[series].length} tài liệu</p></div>
              </button>
            ))}
          </div>
        ) : <p className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">Chưa có tài liệu {activeCategory}.</p>}
      </main>
      <Footer />
    </div>
  );
}
///