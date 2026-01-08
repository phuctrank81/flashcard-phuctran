"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

type Flashcard = {
  _id: string
  word: string
  definition: string
  example: string
}

export default function FlashcardsPage() {
  // 1. Luôn khởi tạo là mảng rỗng []
  const [words, setWords] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchWords = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/vocab");

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setWords(data);
    } catch (err) {
      setError("Không lấy được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  fetchWords();
}, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          IELTS Vocabulary Flashcards
        </h1>

        {/* Trạng thái đang tải */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-slate-600">Đang tải từ vựng</p>
          </div>
        )}

        {/* Trạng thái lỗi */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Hiển thị danh sách từ vựng */}
        {!loading && !error && (
          <div className="grid gap-6">
            {words.length > 0 ? (
              words.map((item) => (
                <div 
                  key={item._id} 
                  className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-blue-600 capitalize">
                      {item.word}
                    </h2>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-500 rounded-full uppercase">
                      New Word
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">Nghĩa:</span> {item.definition}
                    </p>
                    
                    {item.example && (
                      <div className="pl-4 border-l-4 border-slate-100 italic text-slate-500 text-sm">
                         {item.example} 
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-10">Danh sách từ vựng ko có gì</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}