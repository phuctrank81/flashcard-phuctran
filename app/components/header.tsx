import { BookOpen } from "lucide-react"

export default function Header() {
  const handleStartStudy = () => {
    console.log("Start study")
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-indigo-600">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            IELTS Master
          </span>
        </div>

        {/* Actions */}
        <button
          onClick={handleStartStudy}
          className="text-slate-900 hover:text-indigo-600 transition-colors font-semibold"
        >
          Flashcards
        </button>
      </div>
    </header>
  )
}
