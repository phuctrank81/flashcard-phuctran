"use client"

import { useEffect, useState, type ComponentType } from "react"
import Link from "next/link"
import { Utensils, Apple, Beef, Coffee, Cake, HelpCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

type QuizTopic = {
  slug: string
  title: string
  description?: string
  questionCount?: number
}

const FALLBACK_TOPICS: QuizTopic[] = [
  { slug: "food", title: "Food", description: "Food vocabulary", questionCount: 8 },
  { slug: "fruits", title: "Fruits", description: "Fruits vocabulary", questionCount: 8 },
  { slug: "meat", title: "Meat", description: "Meat and seafood vocabulary", questionCount: 8 },
  { slug: "drinks", title: "Drinks", description: "Drinks vocabulary", questionCount: 8 },
  { slug: "desserts", title: "Desserts", description: "Desserts vocabulary", questionCount: 8 },
]

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  food: Utensils,
  fruits: Apple,
  meat: Beef,
  drinks: Coffee,
  desserts: Cake,
}

export default function QuizPage() {
  const [topics, setTopics] = useState<QuizTopic[]>(FALLBACK_TOPICS)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const res = await fetch("/api/quiz")
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load quiz topics")
        if (Array.isArray(data) && data.length > 0) {
          setTopics(data)
        }
      } catch (e: any) {
        setError(e.message || "Using fallback topics")
      }
    }
    loadTopics()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-slate-800 mb-4">Quiz Game</h1>
            <p className="text-xl text-slate-600">Choose a topic to start</p>
            {error && <p className="text-sm text-amber-600 mt-2">{error}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const Icon = iconMap[topic.slug] || HelpCircle
              return (
                <Link
                  key={topic.slug}
                  href={`/quiz/${topic.slug}`}
                  className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-12 h-12" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{topic.title}</h3>
                  <p className="text-slate-600 mb-4">{topic.description || "No description"}</p>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{topic.questionCount || 0} questions</span>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Start
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
