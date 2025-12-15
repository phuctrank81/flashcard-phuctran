import {
  BookOpen,
} from "lucide-react"

const FlashcardHeader = ({ onStartStudy, flashcardsCount }: { onStartStudy: () => void; flashcardsCount: number }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 text-indigo-600">
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">IELTS Master</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-slate-500 text-sm hidden sm:inline-block font-medium">{flashcardsCount} thẻ từ</span>
        <button
          onClick={onStartStudy}
          disabled={flashcardsCount === 0}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200 active:scale-95"
        >
          Học Ngay
        </button>
      </div>
    </div>
  </header>
)

export default FlashcardHeader