"use client"

import { BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSession } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()
  const [username, setUsername] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user")
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed?.username) setUsername(parsed.username)
      if (parsed?.role === "admin") setIsAdmin(true)
    } catch {
      // Ignore malformed localStorage
    }
  }, [])

  const displayName = useMemo(() => {
    return session?.user?.name || session?.user?.email || username
  }, [session, username])

  const initials = useMemo(() => {
    if (!displayName) return "?"
    const trimmed = displayName.trim()
    if (!trimmed) return "?"
    return trimmed[0].toUpperCase()
  }, [displayName])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsOpen(false)
    router.push("/login")
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
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
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 text-slate-700 font-semibold hover:text-indigo-600 transition-colors"
                aria-haspopup="menu"
                aria-expanded={isOpen}
              >
                <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold">
                  {initials}
                </span>
                <span className="max-w-[140px] truncate">{displayName}</span>
                <span className="text-slate-500">▾</span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3">
                    <div className="text-slate-500 text-sm font-semibold">Notifications</div>
                    <p className="text-slate-700 text-sm italic mt-1">No new notifications.</p>
                  </div>
                  <div className="border-t border-slate-200" />
                  <div className="py-2">
                    <Link
                      href="/schedule"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      My schedule
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
