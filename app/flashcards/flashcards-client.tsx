"use client"

import { useMemo, useState } from "react"

export type Flashcard = {
  _id: string
  word: string
  definition: string
  example?: string
}

type FlashcardsClientProps = {
  words: Flashcard[]
}

export default function FlashcardsClient({ words }: FlashcardsClientProps) {
  const [isLearning, setIsLearning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const totalCount = words.length > 0 ? words.length : 900
  const current = words[currentIndex]

  const progress = useMemo(() => {
    if (words.length === 0) return 0
    return Math.round(((currentIndex + 1) / words.length) * 100)
  }, [currentIndex, words.length])

  const startLearning = () => {
    setIsLearning(true)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const stopLearning = () => {
    setIsLearning(false)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const goNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  if (!isLearning) {
    return (
      <section className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={startLearning}
          className="w-full text-left group"
          aria-label="B?t ð?u h?c flashcards IELTS"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl transition-transform duration-300 group-hover:scale-[1.01]">
            <div className="absolute right-6 top-6 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              {totalCount}+ t?
            </div>
            <h2 className="text-3xl font-black">IELTS 900 T? V?ng</h2>
            <p className="mt-3 text-base text-white/90">
              B?m ð? b?t ð?u h?c flashcards và luy?n ghi nh? t? v?ng nhanh hõn.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 font-bold text-indigo-700 shadow-lg">
              B?t ð?u h?c
              <span className="text-xl">?</span>
            </div>
          </div>
        </button>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold">{totalCount}</div>
            <div className="text-sm text-slate-500">T? v?ng</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold">IELTS</div>
            <div className="text-sm text-slate-500">Ch? ð?</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold">Flashcard</div>
            <div className="text-sm text-slate-500">Phýõng pháp</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Ti?n ð?</p>
              <p className="text-xl font-bold text-slate-800">
                {words.length > 0 ? currentIndex + 1 : 0}/{words.length}
              </p>
            </div>
            <button
              type="button"
              onClick={stopLearning}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              K?t thúc
            </button>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {words.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Chýa có t? v?ng nào ð? h?c.
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{isFlipped ? "Ngh?a" : "T?"}</p>
              <h3 className="mt-4 text-4xl font-black text-slate-800">
                {isFlipped ? current.definition : current.word}
              </h3>
              {isFlipped && current.example && (
                <p className="mt-4 text-base italic text-slate-500">{current.example}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Trý?c
          </button>
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            disabled={words.length === 0}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isFlipped ? "Xem t?" : "Xem ngh?a"}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= words.length - 1}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Ti?p
          </button>
        </div>
      </div>
    </section>
  )
}
