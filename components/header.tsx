"use client"

import { BookOpen } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user")
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed?.username) setUsername(parsed.username)
    } catch {
      // Ignore malformed localStorage
    }
  }, [])

  const displayName = useMemo(() => {
    return session?.user?.name || session?.user?.email || username
  }, [session, username])


  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Study MVP</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/flashcards" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
            Flashcards
          </Link>
          <Link href="/quiz" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
            Quiz Game
          </Link>
          {displayName ? (
            <span className="text-slate-700 font-semibold">
              Profile: {displayName}
            </span>
          ) : (
            <Link href="/login" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
