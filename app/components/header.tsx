"use client"

import { BookOpen, Play } from "lucide-react"

interface FlashcardHeaderProps {
  onStartStudy: () => void
  flashcardsCount: number
}

export function FlashcardHeader({ onStartStudy, flashcardsCount }: FlashcardHeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Flashcard Pro</h1>
        </div>
        <button
          onClick={onStartStudy}
          disabled={flashcardsCount === 0}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          Bắt đầu học
        </button>
      </div>
    </header>
  )
}
