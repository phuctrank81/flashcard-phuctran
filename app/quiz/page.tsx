"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { CheckCircle2, XCircle, Trophy, Timer, Volume2, VolumeX } from "lucide-react"
import { Utensils, Apple, Beef, Coffee, Cake } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"

interface QuizQuestion {
  id: string
  word: string
  correctAnswer: string
  options: string[]
}

interface QuizTopic {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  questionCount: number
}

const FOOD_QUIZ_DATA: QuizQuestion[] = [
  {
    id: "1",
    word: "Apple",
    correctAnswer: "Táo",
    options: ["Táo", "Chuối", "Cam", "Xoài"],
  },
  {
    id: "2",
    word: "Bread",
    correctAnswer: "Bánh mì",
    options: ["Bánh quy", "Bánh mì", "Bánh bao", "Bánh ngọt"],
  },
  {
    id: "3",
    word: "Cheese",
    correctAnswer: "Phô mai",
    options: ["Bơ", "Sữa chua", "Phô mai", "Kem"],
  },
  {
    id: "4",
    word: "Pizza",
    correctAnswer: "Bánh pizza",
    options: ["Hamburger", "Sandwich", "Bánh pizza", "Hot dog"],
  },
  {
    id: "5",
    word: "Chicken",
    correctAnswer: "Thịt gà",
    options: ["Thịt bò", "Thịt lợn", "Thịt gà", "Cá"],
  },
  {
    id: "6",
    word: "Salad",
    correctAnswer: "Rau trộn",
    options: ["Súp", "Rau trộn", "Mì ống", "Cơm"],
  },
  {
    id: "7",
    word: "Ice Cream",
    correctAnswer: "Kem",
    options: ["Bánh flan", "Kem", "Pudding", "Sữa chua"],
  },
  {
    id: "8",
    word: "Coffee",
    correctAnswer: "Cà phê",
    options: ["Trà", "Cà phê", "Sữa", "Nước cam"],
  },
]

const FRUITS_QUIZ_DATA: QuizQuestion[] = [
  {
    id: "1",
    word: "Banana",
    correctAnswer: "Chuối",
    options: ["Táo", "Chuối", "Cam", "Xoài"],
  },
  {
    id: "2",
    word: "Orange",
    correctAnswer: "Cam",
    options: ["Táo", "Chuối", "Cam", "Xoài"],
  },
  {
    id: "3",
    word: "Grapes",
    correctAnswer: "Nho",
    options: ["Nho", "Dưa hấu", "Dâu tây", "Dứa"],
  },
]

const MEAT_QUIZ_DATA: QuizQuestion[] = [
  {
    id: "1",
    word: "Beef",
    correctAnswer: "Thịt bò",
    options: ["Thịt bò", "Thịt lợn", "Thịt gà", "Cá"],
  },
  {
    id: "2",
    word: "Pork",
    correctAnswer: "Thịt lợn",
    options: ["Thịt bò", "Thịt lợn", "Thịt gà", "Cá"],
  },
  {
    id: "3",
    word: "Fish",
    correctAnswer: "Cá",
    options: ["Thịt bò", "Thịt lợn", "Thịt gà", "Cá"],
  },
]

const DRINKS_QUIZ_DATA: QuizQuestion[] = [
  {
    id: "1",
    word: "Water",
    correctAnswer: "Nước",
    options: ["Nước", "Trà", "Cà phê", "Sữa"],
  },
  {
    id: "2",
    word: "Tea",
    correctAnswer: "Trà",
    options: ["Nước", "Trà", "Cà phê", "Sữa"],
  },
  {
    id: "3",
    word: "Milk",
    correctAnswer: "Sữa",
    options: ["Nước", "Trà", "Cà phê", "Sữa"],
  },
]

const DESSERTS_QUIZ_DATA: QuizQuestion[] = [
  {
    id: "1",
    word: "Cake",
    correctAnswer: "Bánh ngọt",
    options: ["Bánh ngọt", "Kem", "Bánh quy", "Kẹo"],
  },
  {
    id: "2",
    word: "Cookie",
    correctAnswer: "Bánh quy",
    options: ["Bánh ngọt", "Kem", "Bánh quy", "Kẹo"],
  },
  {
    id: "3",
    word: "Candy",
    correctAnswer: "Kẹo",
    options: ["Bánh ngọt", "Kem", "Bánh quy", "Kẹo"],
  },
]

const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: "food",
    title: "Đồ ăn",
    description: "Từ vựng về các món ăn phổ biến",
    icon: <Utensils className="w-12 h-12" />,
    color: "from-red-500 to-orange-500",
    questionCount: 8,
  },
  {
    id: "fruits",
    title: "Trái cây",
    description: "Các loại trái cây thường gặp",
    icon: <Apple className="w-12 h-12" />,
    color: "from-green-500 to-emerald-500",
    questionCount: 3,
  },
  {
    id: "meat",
    title: "Thịt & Hải sản",
    description: "Từ vựng về thịt và hải sản",
    icon: <Beef className="w-12 h-12" />,
    color: "from-pink-500 to-rose-500",
    questionCount: 3,
  },
  {
    id: "drinks",
    title: "Đồ uống",
    description: "Các loại đồ uống phổ biến",
    icon: <Coffee className="w-12 h-12" />,
    color: "from-blue-500 to-cyan-500",
    questionCount: 3,
  },
  {
    id: "desserts",
    title: "Tráng miệng",
    description: "Các món tráng miệng ngon",
    icon: <Cake className="w-12 h-12" />,
    color: "from-purple-500 to-pink-500",
    questionCount: 3,
  },
]

const KAHOOT_COLORS = [
  { bg: "bg-red-500", hover: "hover:bg-red-600", border: "border-red-600", selected: "bg-red-700" },
  { bg: "bg-blue-500", hover: "hover:bg-blue-600", border: "border-blue-600", selected: "bg-blue-700" },
  { bg: "bg-yellow-500", hover: "hover:bg-yellow-600", border: "border-yellow-600", selected: "bg-yellow-700" },
  { bg: "bg-green-500", hover: "hover:bg-green-600", border: "border-green-600", selected: "bg-green-700" },
]

type GameState = "ready" | "playing" | "result"

export default function QuizPage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>("ready")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentQuizData, setCurrentQuizData] = useState<QuizQuestion[]>(FOOD_QUIZ_DATA)
  const [currentTopic, setCurrentTopic] = useState<string>("food")

  const currentQuestion = currentQuizData[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentQuizData.length) * 100

  useEffect(() => {
    if (gameState === "playing" && !isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true)
    }
  }, [gameState, timeLeft, isAnswered])

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/placeholder.mp3")
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying && gameState === "playing") {
        audioRef.current.play().catch(() => {
          console.log("[v0] Audio autoplay blocked")
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isMusicPlaying, gameState])

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === currentQuestion.correctAnswer) {
      const timeBonus = Math.floor(timeLeft / 2)
      setScore(score + 100 + timeBonus)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentQuizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setTimeLeft(20)
    } else {
      setGameState("result")
    }
  }

  const handleRestart = () => {
    setGameState("ready")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setTimeLeft(20)
  }

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying)
  }

  const startQuiz = (topic: string) => {
    setCurrentTopic(topic)
    setCurrentQuizData(getQuizData(topic))
    setGameState("playing")
  }

  const getQuizData = (topic: string): QuizQuestion[] => {
    switch (topic) {
      case "food":
        return FOOD_QUIZ_DATA
      case "fruits":
        return FRUITS_QUIZ_DATA
      case "meat":
        return MEAT_QUIZ_DATA
      case "drinks":
        return DRINKS_QUIZ_DATA
      case "desserts":
        return DESSERTS_QUIZ_DATA
      default:
        return FOOD_QUIZ_DATA
    }
  }

  if (gameState === "ready") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <div className="flex-1 px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-slate-800 mb-4">Quiz Game</h1>
              <p className="text-xl text-slate-600">Chọn chủ đề để bắt đầu kiểm tra kiến thức của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {QUIZ_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => startQuiz(topic.id)}
                  className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topic.color} rounded-t-2xl`}
                  ></div>

                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${topic.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {topic.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{topic.title}</h3>
                  <p className="text-slate-600 mb-4">{topic.description}</p>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{topic.questionCount} câu hỏi</span>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Bắt đầu →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  if (gameState === "result") {
    const maxScore = currentQuizData.length * 100 + currentQuizData.length * 10
    const percentage = Math.round((score / maxScore) * 100)

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-2">Hoàn thành!</h2>
              <p className="text-xl text-slate-600">Bạn đã làm rất tốt!</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="text-7xl font-black text-purple-600 mb-2">{score}</div>
                <p className="text-slate-600 text-lg">điểm</p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Chính xác</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg active:scale-95"
              >
                Chơi lại
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col">
        {/* Top bar with timer and score */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold">
                Câu {currentQuestionIndex + 1}/{currentQuizData.length}
              </div>
              <button
                onClick={toggleMusic}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold flex items-center gap-2">
                <Timer className="w-5 h-5" />
                {timeLeft}s
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold">
                {score} điểm
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Question card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
              <div className="text-center">
                <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-4">{currentQuestion.word}</h2>
                <p className="text-slate-600 text-lg">Chọn nghĩa tiếng Việt đúng</p>
              </div>
            </div>

            {/* Answer buttons in Kahoot style */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correctAnswer
                const isSelected = option === selectedAnswer
                const showResult = isAnswered
                const colorScheme = KAHOOT_COLORS[index]

                let buttonClass = `${colorScheme.bg} text-white p-6 rounded-2xl border-4 ${colorScheme.border} font-bold text-xl transition-all transform active:scale-95 shadow-xl `

                if (!showResult) {
                  buttonClass += colorScheme.hover
                } else if (isCorrect) {
                  buttonClass += "ring-8 ring-green-400"
                } else if (isSelected && !isCorrect) {
                  buttonClass += "ring-8 ring-red-400 opacity-50"
                }

                return (
                  <button
                    key={index}
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

            {/* Next button */}
            {isAnswered && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleNext}
                  className="bg-white text-purple-600 px-12 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-transform shadow-2xl"
                >
                  {currentQuestionIndex < currentQuizData.length - 1 ? "Câu tiếp theo →" : "Xem kết quả 🏆"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
