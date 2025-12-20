"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Trophy, Timer, Volume2, VolumeX, ArrowLeft } from "lucide-react"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

interface QuizQuestion {
  id: string
  word: string
  correctAnswer: string
  options: string[]
}

const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  food: [
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
  ],
  fruits: [
    {
      id: "1",
      word: "Banana",
      correctAnswer: "Chuối",
      options: ["Táo", "Chuối", "Cam", "Nho"],
    },
    {
      id: "2",
      word: "Orange",
      correctAnswer: "Cam",
      options: ["Chanh", "Cam", "Bưởi", "Quýt"],
    },
    {
      id: "3",
      word: "Grape",
      correctAnswer: "Nho",
      options: ["Dâu", "Nho", "Mâm xôi", "Dâu tây"],
    },
    {
      id: "4",
      word: "Mango",
      correctAnswer: "Xoài",
      options: ["Xoài", "Đu đủ", "Dứa", "Thanh long"],
    },
    {
      id: "5",
      word: "Strawberry",
      correctAnswer: "Dâu tây",
      options: ["Dâu tây", "Dâu", "Việt quất", "Mâm xôi"],
    },
    {
      id: "6",
      word: "Watermelon",
      correctAnswer: "Dưa hấu",
      options: ["Dưa hấu", "Dưa chuột", "Bí đao", "Bí ngô"],
    },
    {
      id: "7",
      word: "Pineapple",
      correctAnswer: "Dứa",
      options: ["Dứa", "Khế", "Ổi", "Mãng cầu"],
    },
    {
      id: "8",
      word: "Peach",
      correctAnswer: "Đào",
      options: ["Đào", "Mận", "Lê", "Táo"],
    },
  ],
  meat: [
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
      options: ["Thịt bò", "Thịt lợn", "Thịt cừu", "Thịt vịt"],
    },
    {
      id: "3",
      word: "Fish",
      correctAnswer: "Cá",
      options: ["Tôm", "Cá", "Mực", "Cua"],
    },
    {
      id: "4",
      word: "Shrimp",
      correctAnswer: "Tôm",
      options: ["Tôm", "Cá", "Sò", "Nghêu"],
    },
    {
      id: "5",
      word: "Lamb",
      correctAnswer: "Thịt cừu",
      options: ["Thịt cừu", "Thịt dê", "Thịt bò", "Thịt lợn"],
    },
    {
      id: "6",
      word: "Crab",
      correctAnswer: "Cua",
      options: ["Cua", "Tôm", "Ghẹ", "Sò"],
    },
    {
      id: "7",
      word: "Salmon",
      correctAnswer: "Cá hồi",
      options: ["Cá hồi", "Cá ngừ", "Cá thu", "Cá rô"],
    },
    {
      id: "8",
      word: "Duck",
      correctAnswer: "Vịt",
      options: ["Vịt", "Gà", "Ngỗng", "Chim cút"],
    },
  ],
  drinks: [
    {
      id: "1",
      word: "Water",
      correctAnswer: "Nước",
      options: ["Nước", "Sữa", "Trà", "Nước ép"],
    },
    {
      id: "2",
      word: "Milk",
      correctAnswer: "Sữa",
      options: ["Sữa", "Sữa chua", "Kem", "Bơ"],
    },
    {
      id: "3",
      word: "Tea",
      correctAnswer: "Trà",
      options: ["Trà", "Cà phê", "Nước cam", "Nước chanh"],
    },
    {
      id: "4",
      word: "Orange Juice",
      correctAnswer: "Nước cam",
      options: ["Nước táo", "Nước cam", "Nước nho", "Nước dứa"],
    },
    {
      id: "5",
      word: "Soda",
      correctAnswer: "Nước ngọt có ga",
      options: ["Nước ngọt có ga", "Nước lọc", "Nước khoáng", "Nước ép"],
    },
    {
      id: "6",
      word: "Hot Chocolate",
      correctAnswer: "Sô cô la nóng",
      options: ["Sô cô la nóng", "Cà phê", "Trà sữa", "Sinh tố"],
    },
    {
      id: "7",
      word: "Smoothie",
      correctAnswer: "Sinh tố",
      options: ["Sinh tố", "Nước ép", "Trà đá", "Sữa chua"],
    },
    {
      id: "8",
      word: "Lemonade",
      correctAnswer: "Nước chanh",
      options: ["Nước chanh", "Nước cam", "Nước dứa", "Nước táo"],
    },
  ],
  desserts: [
    {
      id: "1",
      word: "Cake",
      correctAnswer: "Bánh ngọt",
      options: ["Bánh ngọt", "Bánh quy", "Kẹo", "Sô cô la"],
    },
    {
      id: "2",
      word: "Cookie",
      correctAnswer: "Bánh quy",
      options: ["Bánh quy", "Bánh mì", "Bánh bao", "Bánh bích quy"],
    },
    {
      id: "3",
      word: "Chocolate",
      correctAnswer: "Sô cô la",
      options: ["Sô cô la", "Kẹo", "Bánh", "Kem"],
    },
    {
      id: "4",
      word: "Candy",
      correctAnswer: "Kẹo",
      options: ["Kẹo", "Bánh", "Sô cô la", "Kem"],
    },
    {
      id: "5",
      word: "Pie",
      correctAnswer: "Bánh nướng",
      options: ["Bánh nướng", "Bánh flan", "Bánh kem", "Bánh bao"],
    },
    {
      id: "6",
      word: "Donut",
      correctAnswer: "Bánh donut",
      options: ["Bánh donut", "Bánh mì", "Bánh bao", "Bánh quy"],
    },
    {
      id: "7",
      word: "Pudding",
      correctAnswer: "Pudding",
      options: ["Pudding", "Kem", "Sữa chua", "Bánh flan"],
    },
    {
      id: "8",
      word: "Brownie",
      correctAnswer: "Bánh brownie",
      options: ["Bánh brownie", "Bánh quy", "Bánh kem", "Bánh sô cô la"],
    },
  ],
}

const KAHOOT_COLORS = [
  { bg: "bg-red-500", hover: "hover:bg-red-600", border: "border-red-600", selected: "bg-red-700" },
  { bg: "bg-blue-500", hover: "hover:bg-blue-600", border: "border-blue-600", selected: "bg-blue-700" },
  { bg: "bg-yellow-500", hover: "hover:bg-yellow-600", border: "border-yellow-600", selected: "bg-yellow-700" },
  { bg: "bg-green-500", hover: "hover:bg-green-600", border: "border-green-600", selected: "bg-green-700" },
]

const TOPIC_NAMES: Record<string, string> = {
  food: "Đồ ăn",
  fruits: "Trái cây",
  meat: "Thịt & Hải sản",
  drinks: "Đồ uống",
  desserts: "Tráng miệng",
}

type GameState = "ready" | "playing" | "result"

export default function TopicQuizPage() {
  const params = useParams()
  const router = useRouter()
  const topic = params.topic as string

  const [gameState, setGameState] = useState<GameState>("ready")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const quizData = QUIZ_DATA[topic] || QUIZ_DATA.food
  const topicName = TOPIC_NAMES[topic] || "Quiz"
  const currentQuestion = quizData[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100

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
        audioRef.current.play().catch(() => {})
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
    if (currentQuestionIndex < quizData.length - 1) {
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

  if (gameState === "ready") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <button
              onClick={() => router.push("/quiz")}
              className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại chọn chủ đề
            </button>

            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">🎯</span>
              </div>
              <h1 className="text-6xl font-black text-slate-800 mb-4">{topicName}</h1>
              <p className="text-2xl text-slate-600 font-semibold mb-8">Kiểm tra kiến thức của bạn</p>
            </div>

            <div className="bg-slate-100 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-slate-800">{quizData.length}</div>
                  <div className="text-sm text-slate-600">Câu hỏi</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800">20s</div>
                  <div className="text-sm text-slate-600">Mỗi câu</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800">+100</div>
                  <div className="text-sm text-slate-600">Điểm/câu</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setGameState("playing")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl text-2xl font-bold hover:scale-110 transition-transform shadow-2xl"
            >
              Bắt đầu!
            </button>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  if (gameState === "result") {
    const maxScore = quizData.length * 100 + quizData.length * 10
    const percentage = Math.round((score / maxScore) * 100)

    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
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
              <button
                onClick={() => router.push("/quiz")}
                className="w-full bg-slate-200 text-slate-800 py-4 rounded-xl font-bold text-lg hover:bg-slate-300 transition-all active:scale-95"
              >
                Chọn chủ đề khác
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Top bar with timer and score */}
        <div className="bg-slate-100 border-b border-slate-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/quiz")}
                className="bg-white px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="bg-white px-4 py-2 rounded-full text-slate-800 font-bold">
                Câu {currentQuestionIndex + 1}/{quizData.length}
              </div>
              <button
                onClick={toggleMusic}
                className="bg-white p-2 rounded-full text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-full text-slate-800 font-bold flex items-center gap-2">
                <Timer className="w-5 h-5" />
                {timeLeft}s
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-purple-600 font-bold">{score} điểm</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Question card */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-12 mb-6">
              <div className="text-center">
                <h2 className="text-5xl md:text-6xl font-black text-slate-800">{currentQuestion.word}</h2>
                <p className="text-xl text-slate-500 mt-4">Chọn nghĩa tiếng Việt đúng</p>
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-transform shadow-2xl"
                >
                  {currentQuestionIndex < quizData.length - 1 ? "Câu tiếp theo →" : "Xem kết quả 🏆"}
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
