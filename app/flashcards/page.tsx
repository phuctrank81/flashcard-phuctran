"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  X,
  Save,
} from "lucide-react"
import Header from "../components/Header"

interface Flashcard {
  id: string
  question: string
  answer: string
}

const INITIAL_DATA: Flashcard[] = [
  { id: "1", question: "Acquire", answer: "Đạt được, giành được (v)" },
  { id: "2", question: "Consequence", answer: "Hậu quả, kết quả (n)" },
  { id: "3", question: "Determine", answer: "Xác định, quyết định (v)" },
  { id: "4", question: "Pervasive", answer: "Lan tỏa, phổ biến khắp mọi nơi (adj)" },
  { id: "5", question: "Mitigate", answer: "Giảm nhẹ, làm dịu bớt (v)" },
  { id: "6", question: "Conducive", answer: "Có lợi, dẫn đến (adj)" },
  { id: "7", question: "Paradigm", answer: "Khuôn mẫu, mô hình (n)" },
]

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  /* ===================== LOAD / SAVE ===================== */
  useEffect(() => {
    const saved = localStorage.getItem("my-flashcards")
    if (saved) {
      try {
        setFlashcards(JSON.parse(saved))
      } catch {
        setFlashcards(INITIAL_DATA)
      }
    } else {
      setFlashcards(INITIAL_DATA)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("my-flashcards", JSON.stringify(flashcards))
  }, [flashcards])

  /* ===================== CRUD ===================== */
  const addCard = (question: string, answer: string) => {
    setFlashcards((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        question,
        answer,
      },
    ])
    setShowAddModal(false)
  }

  const deleteCard = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thẻ này không?")) return
    setFlashcards((prev) => prev.filter((c) => c.id !== id))
  }

  /* ===================== STUDY MODE ===================== */
  if (isStudyMode) {
    return <StudyMode cards={flashcards} onExit={() => setIsStudyMode(false)} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ✅ HEADER THỐNG NHẤT */}
      <Header
        onStartStudy={() => setIsStudyMode(true)}
        flashcardsCount={flashcards.length}
      />

      <main className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Bộ sưu tập của bạn
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Quản lý và ôn tập các từ vựng đã lưu.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 px-4 py-2 rounded-lg font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Thêm từ
          </button>
        </div>

        {flashcards.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card) => (
              <div
                key={card.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between h-48"
              >
                <div>
                  <h3 className="font-bold text-lg">{card.question}</h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-3">
                    {card.answer}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddCardModal
          onClose={() => setShowAddModal(false)}
          onAdd={addCard}
        />
      )}
    </div>
  )
}

/* ===================== COMPONENTS ===================== */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20 bg-white rounded-xl border border-dashed">
      <p className="text-slate-500">Chưa có từ vựng nào</p>
      <button
        onClick={onAdd}
        className="mt-4 text-indigo-600 font-medium"
      >
        Thêm thẻ đầu tiên
      </button>
    </div>
  )
}

function StudyMode({
  cards,
  onExit,
}: {
  cards: Flashcard[]
  onExit: () => void
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const card = cards[index]

  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col items-center justify-center">
      <button
        onClick={onExit}
        className="absolute top-4 left-4 p-2 bg-white/10 rounded-full"
      >
        <X />
      </button>

      <div
        onClick={() => setFlipped(!flipped)}
        className="bg-white text-slate-900 rounded-2xl p-12 cursor-pointer w-[90%] max-w-xl text-center"
      >
        {flipped ? card.answer : card.question}
      </div>

      <div className="flex gap-6 mt-8">
        <button
          disabled={index === 0}
          onClick={() => {
            setFlipped(false)
            setIndex(index - 1)
          }}
        >
          <ArrowLeft />
        </button>

        <button onClick={() => setFlipped(!flipped)}>
          Lật
        </button>

        <button
          disabled={index === cards.length - 1}
          onClick={() => {
            setFlipped(false)
            setIndex(index + 1)
          }}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  )
}

function AddCardModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (q: string, a: string) => void
}) {
  const [q, setQ] = useState("")
  const [a, setA] = useState("")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (q && a) onAdd(q, a)
        }}
        className="bg-white p-6 rounded-xl w-full max-w-md"
      >
        <h3 className="font-bold mb-4">Thêm từ mới</h3>

        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Từ vựng"
          className="w-full border rounded p-2 mb-3"
        />

        <textarea
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Nghĩa"
          className="w-full border rounded p-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="text-indigo-600 font-medium">
            Lưu
          </button>
        </div>
      </form>
    </div>
  )
}
