"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Trophy, Timer, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

type QuizQuestion = {
  word: string
  correctAnswer: string
  options: string[]
}

type QuizTopic = {
  slug: string
  title: string
  description?: string
  questions: QuizQuestion[]
}

const FALLBACK_QUIZ: Record<string, QuizTopic> = {
  food: {
    slug: "food",
    title: "Food",
    description: "Food vocabulary",
    questions: [
      { word: "Apple", correctAnswer: "Tao", options: ["Tao", "Chuoi", "Cam", "Xoai"] },
      { word: "Bread", correctAnswer: "Banh mi", options: ["Banh mi", "Banh ngot", "Pho", "Com"] },
    ],
  },
  fruits: {
    slug: "fruits",
    title: "Fruits",
    description: "Fruit vocabulary",
    questions: [
      { word: "Orange", correctAnswer: "Cam", options: ["Cam", "Nho", "Dua", "Tao"] },
      { word: "Grape", correctAnswer: "Nho", options: ["Nho", "Cam", "Tao", "Dua"] },
    ],
  },
}

type GameState = "loading" | "ready" | "playing" | "result"

const ANSWER_COLORS = [
  "bg-red-500 hover:bg-red-600 border-red-600",
  "bg-blue-500 hover:bg-blue-600 border-blue-600",
  "bg-yellow-500 hover:bg-yellow-600 border-yellow-600",
  "bg-green-500 hover:bg-green-600 border-green-600",
]

export default function TopicQuizPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = String(params.topicId || "")

  const [topic, setTopic] = useState<QuizTopic | null>(null)
  const [gameState, setGameState] = useState<GameState>("loading")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadTopic = async () => {
      try {
        const res = await fetch(`/api/quiz/${topicId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load topic")
        setTopic(data)
        setGameState("ready")
      } catch (e: any) {
        const fallback = FALLBACK_QUIZ[topicId]
        if (fallback) {
          setTopic(fallback)
          setGameState("ready")
          setError("Using fallback quiz data.")
          return
        }
        setError(e.message || "Quiz topic not found")
        setGameState("result")
      }
    }
    loadTopic()
  }, [topicId])

  const quizData = topic?.questions || []
  const currentQuestion = quizData[currentQuestionIndex]
  const progress = quizData.length ? ((currentQuestionIndex + 1) / quizData.length) * 100 : 0

  useEffect(() => {
    if (gameState === "playing" && !isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (gameState === "playing" && timeLeft === 0 && !isAnswered) {
      setIsAnswered(true)
    }
  }, [gameState, isAnswered, timeLeft])

  const maxScore = useMemo(() => quizData.length * 100 + quizData.length * 10, [quizData.length])

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || !currentQuestion) return
    setSelectedAnswer(answer)
    setIsAnswered(true)
    if (answer === currentQuestion.correctAnswer) {
      const timeBonus = Math.floor(timeLeft / 2)
      setScore((prev) => prev + 100 + timeBonus)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setTimeLeft(20)
      return
    }
    setGameState("result")
  }

  const handleRestart = () => {
    setGameState("ready")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setTimeLeft(20)
  }

  if (gameState === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12">Loading quiz...</main>
        <Footer />
      </div>
    )
  }

  if (!topic || quizData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
          <p className="text-red-600">{error || "No quiz questions available."}</p>
          <button onClick={() => router.push("/quiz")} className="mt-4 text-indigo-600 hover:underline">
            Back to topics
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  if (gameState === "ready") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <button
              onClick={() => router.push("/quiz")}
              className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to topics
            </button>

            <h1 className="text-5xl font-black text-slate-800 mb-4">{topic.title}</h1>
            <p className="text-xl text-slate-600 mb-8">{topic.description || "Vocabulary quiz"}</p>
            {error && <p className="text-amber-600 mb-4">{error}</p>}

            <div className="bg-slate-100 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-slate-800">{quizData.length}</div>
                  <div className="text-sm text-slate-600">Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800">20s</div>
                  <div className="text-sm text-slate-600">Per question</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800">+100</div>
                  <div className="text-sm text-slate-600">Base score</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setGameState("playing")}
              className="bg-indigo-600 text-white px-12 py-5 rounded-2xl text-2xl font-bold hover:scale-105 transition-transform shadow-2xl"
            >
              Start
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (gameState === "result") {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-2">Finished</h2>
              <p className="text-xl text-slate-600">Good work.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="text-7xl font-black text-purple-600 mb-2">{score}</div>
                <p className="text-slate-600 text-lg">Score</p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Accuracy</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all"
              >
                Play again
              </button>
              <button
                onClick={() => router.push("/quiz")}
                className="w-full bg-slate-200 text-slate-800 py-4 rounded-xl font-bold text-lg hover:bg-slate-300 transition-all"
              >
                Choose another topic
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        <div className="bg-slate-100 border-b border-slate-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="bg-white px-4 py-2 rounded-full text-slate-800 font-bold">
              Question {currentQuestionIndex + 1}/{quizData.length}
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-full text-slate-800 font-bold flex items-center gap-2">
                <Timer className="w-5 h-5" />
                {timeLeft}s
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-purple-600 font-bold">{score} points</div>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-12 mb-6">
              <div className="text-center">
                <h2 className="text-5xl md:text-6xl font-black text-slate-800">{currentQuestion.word}</h2>
                <p className="text-xl text-slate-500 mt-4">Choose the correct Vietnamese meaning</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correctAnswer
                const isSelected = option === selectedAnswer
                const showResult = isAnswered

                let buttonClass = `${ANSWER_COLORS[index % 4]} text-white p-6 rounded-2xl border-4 font-bold text-xl transition-all transform active:scale-95 shadow-xl`
                if (showResult && isCorrect) buttonClass += " ring-8 ring-green-400"
                if (showResult && isSelected && !isCorrect) buttonClass += " ring-8 ring-red-400 opacity-50"

                return (
                  <button
                    key={`${option}-${index}`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-8 h-8" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-8 h-8" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {isAnswered && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
                >
                  {currentQuestionIndex < quizData.length - 1 ? "Next question" : "Show result"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
