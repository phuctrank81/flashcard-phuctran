import { BookOpen } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-slate-300 border-t border-slate-700">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white">IELTS Master</span>
                    </div>

                    <div className="text-sm text-center md:text-left">
                        <p>Học tiếng Anh hiệu quả mỗi ngày với phương pháp flashcard</p>
                    </div>

                    <div className="text-sm text-slate-400">© 2025 IELTS Master. All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}