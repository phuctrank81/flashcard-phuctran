"use client"

import { useEffect, useMemo, useState } from "react"
import Header from "@/components/header"

type UserInfo = {
  email?: string
  role?: string
}

type VocabItem = {
  _id: string
  word: string
  definition: string
  example?: string
}

type QuizQuestion = {
  word: string
  correctAnswer: string
  options: string[]
}

type QuizTopic = {
  _id?: string
  slug: string
  title: string
  description?: string
  questions: QuizQuestion[]
  questionCount?: number
}

const SAMPLE_QUESTIONS = JSON.stringify(
  [
    {
      word: "Apple",
      correctAnswer: "Tao",
      options: ["Tao", "Cam", "Nho", "Xoai"],
    },
  ],
  null,
  2,
)

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [vocab, setVocab] = useState<VocabItem[]>([])
  const [quizTopics, setQuizTopics] = useState<QuizTopic[]>([])

  const [word, setWord] = useState("")
  const [definition, setDefinition] = useState("")
  const [example, setExample] = useState("")
  const [editingVocabId, setEditingVocabId] = useState("")

  const [slug, setSlug] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questionsJson, setQuestionsJson] = useState(SAMPLE_QUESTIONS)
  const [editingQuizSlug, setEditingQuizSlug] = useState("")

  const adminEmail = currentUser?.email || ""
  const isAdmin = currentUser?.role === "admin"

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-email": adminEmail,
    }),
    [adminEmail],
  )

  const fetchAll = async () => {
    const [vocabRes, quizRes] = await Promise.all([fetch("/api/vocab"), fetch("/api/quiz")])
    const [vocabData, quizData] = await Promise.all([vocabRes.json(), quizRes.json()])
    if (!vocabRes.ok) throw new Error(vocabData.message || "Failed to load vocab")
    if (!quizRes.ok) throw new Error(quizData.message || "Failed to load quiz topics")
    setVocab(vocabData)
    setQuizTopics(quizData)
  }

  useEffect(() => {
    const init = async () => {
      try {
        const raw = localStorage.getItem("user")
        if (!raw) {
          setError("Please login first.")
          return
        }
        const parsed = JSON.parse(raw)
        setCurrentUser(parsed)
        await fetchAll()
      } catch (e: any) {
        setError(e.message || "Failed to load admin page")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const resetVocabForm = () => {
    setWord("")
    setDefinition("")
    setExample("")
    setEditingVocabId("")
  }

  const resetQuizForm = () => {
    setSlug("")
    setTitle("")
    setDescription("")
    setQuestionsJson(SAMPLE_QUESTIONS)
    setEditingQuizSlug("")
  }

  const submitVocab = async () => {
    try {
      setError("")
      if (!word.trim() || !definition.trim()) {
        throw new Error("Word and definition are required")
      }

      const url = editingVocabId ? `/api/vocab/${editingVocabId}` : "/api/vocab"
      const method = editingVocabId ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify({
          word: word.trim(),
          definition: definition.trim(),
          example: example.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to save vocab")
      await fetchAll()
      resetVocabForm()
    } catch (e: any) {
      setError(e.message || "Failed to save vocab")
    }
  }

  const removeVocab = async (id: string) => {
    try {
      setError("")
      const res = await fetch(`/api/vocab/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-email": adminEmail,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to delete vocab")
      await fetchAll()
      if (editingVocabId === id) resetVocabForm()
    } catch (e: any) {
      setError(e.message || "Failed to delete vocab")
    }
  }

  const submitQuizTopic = async () => {
    try {
      setError("")
      const parsedQuestions = JSON.parse(questionsJson)
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error("Questions must be a non-empty array")
      }

      const body = {
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        description: description.trim(),
        questions: parsedQuestions,
      }

      if (!body.slug || !body.title) throw new Error("Slug and title are required")

      const url = editingQuizSlug ? `/api/quiz/${editingQuizSlug}` : "/api/quiz"
      const method = editingQuizSlug ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to save quiz topic")
      await fetchAll()
      resetQuizForm()
    } catch (e: any) {
      setError(e.message || "Failed to save quiz topic")
    }
  }

  const removeQuizTopic = async (topicSlug: string) => {
    try {
      setError("")
      const res = await fetch(`/api/quiz/${topicSlug}`, {
        method: "DELETE",
        headers: {
          "x-admin-email": adminEmail,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to delete quiz topic")
      await fetchAll()
      if (editingQuizSlug === topicSlug) resetQuizForm()
    } catch (e: any) {
      setError(e.message || "Failed to delete quiz topic")
    }
  }

  const loadVocabForEdit = (item: VocabItem) => {
    setEditingVocabId(item._id)
    setWord(item.word || "")
    setDefinition(item.definition || "")
    setExample(item.example || "")
  }

  const loadQuizForEdit = (topic: QuizTopic) => {
    setEditingQuizSlug(topic.slug)
    setSlug(topic.slug)
    setTitle(topic.title)
    setDescription(topic.description || "")
    setQuestionsJson(JSON.stringify(topic.questions || [], null, 2))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">Loading admin...</main>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12 text-red-600">{error || "Please login first."}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Content Management</h1>
          <p className="text-slate-600 mt-1">
            Signed in as: <span className="font-semibold">{adminEmail || "unknown"}</span>
          </p>
          {!isAdmin && (
            <p className="text-amber-600 mt-2">
              Your account is not admin. Save actions will fail until your role is set to admin.
            </p>
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Vocabulary</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Word"
            />
            <input
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Definition"
            />
            <input
              value={example}
              onChange={(e) => setExample(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Example"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={submitVocab}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {editingVocabId ? "Update word" : "Add word"}
            </button>
            {editingVocabId && (
              <button
                onClick={resetVocabForm}
                className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="text-left px-3 py-2">Word</th>
                  <th className="text-left px-3 py-2">Definition</th>
                  <th className="text-left px-3 py-2">Example</th>
                  <th className="text-left px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vocab.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-semibold">{item.word}</td>
                    <td className="px-3 py-2">{item.definition}</td>
                    <td className="px-3 py-2">{item.example || "-"}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button
                        onClick={() => loadVocabForEdit(item)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeVocab(item._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Quiz Topics</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Slug (example: food)"
              disabled={Boolean(editingQuizSlug)}
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Title"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Description"
            />
          </div>

          <textarea
            value={questionsJson}
            onChange={(e) => setQuestionsJson(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 w-full min-h-56 font-mono text-sm"
          />

          <div className="flex gap-3">
            <button
              onClick={submitQuizTopic}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {editingQuizSlug ? "Update topic" : "Add topic"}
            </button>
            {editingQuizSlug && (
              <button
                onClick={resetQuizForm}
                className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="space-y-3">
            {quizTopics.map((topic) => (
              <div key={topic.slug} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-slate-900 font-bold">
                      {topic.title} ({topic.slug})
                    </div>
                    <div className="text-slate-600 text-sm">{topic.description || "No description"}</div>
                    <div className="text-slate-500 text-sm mt-1">
                      Questions: {topic.questionCount ?? topic.questions?.length ?? 0}
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => loadQuizForEdit(topic)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeQuizTopic(topic.slug)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
