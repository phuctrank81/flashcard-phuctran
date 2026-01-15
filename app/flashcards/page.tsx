"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

type Flashcard = {
  _id: string;
  word: string;
  definition: string;
  example?: string;
};

export default function FlashcardsPage() {
  const [words, setWords] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchWords = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const res = await fetch(`${apiBase}/api/vocab`);

        if (!res.ok) throw new Error("Fetch failed");

        const data: Flashcard[] = await res.json();
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          IELTS Vocabulary Flashcards
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="ml-3 text-slate-600">Đang tải từ vựng...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6">
            {words.length > 0 ? (
              words.map((item) => (
                <div
                  key={item._id}
                  className="p-6 bg-white rounded-2xl shadow-sm border"
                >
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">
                    {item.word}
                  </h2>

                  <p className="text-slate-700 mb-1">
                    <b>Nghĩa:</b> {item.definition}
                  </p>

                  {item.example && (
                    <p className="italic text-slate-500">
                      {item.example}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-10">
                Chưa có từ vựng nào
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}