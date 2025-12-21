"use client"

import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">IELTS Master</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/flashcards" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
            Flashcards
          </Link>
          <Link href="/quiz" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
            Quiz Game
          </Link>
        </nav>
      </div>
    </header>
  )
}
