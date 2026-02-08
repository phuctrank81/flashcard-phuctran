import Header from "@/components/header";
import Footer from "@/components/footer";
import { headers } from "next/headers";

type Flashcard = {
  _id: string;
  word: string;
  definition: string;
  example?: string;
};

export default async function FlashcardsPage() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  let words: Flashcard[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/vocab`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch");

    words = await res.json();
  } catch (err) {
    console.error(err);
    error = "Không lấy được từ vựng";
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          IELTS Vocabulary Flashcards
        </h1>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {!error && (
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
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <div className="text-5xl"></div>
                <h2 className="mt-4 text-xl font-bold text-slate-800">
                  Chưa có từ vựng nào
                </h2>
                <p className="mt-2 text-slate-600">
                  Hãy thêm từ mới để bắt đầu học flashcards.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
