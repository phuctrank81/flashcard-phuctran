import Header from "@/components/header"
import Footer from "@/components/footer"
import { headers } from "next/headers"
import FlashcardsClient, { type Flashcard } from "./flashcards-client"

export default async function FlashcardsPage() {
  const headerList = await headers()
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000"
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  let words: Flashcard[] = []
  let error: string | null = null

  try {
    const res = await fetch(`${baseUrl}/api/vocab`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error("Failed to fetch")

    words = await res.json()
  } catch (err) {
    console.error(err)
    error = "Không l?y ðý?c t? v?ng"
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          IELTS Vocabulary Flashcards
        </h1>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {!error && <FlashcardsClient words={words} />}
      </main>

      <Footer />
    </div>
  )
}
