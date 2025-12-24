import { BookOpen, GraduationCap, Zap, Trophy, Brain, Target } from "lucide-react"
import Link from "next/link"
import BannerSlider from "../components/banner"
import Header from "../components/header"
import Footer from "../components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Banner Slider */}
      <BannerSlider />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold mb-6">
              ✨ Học từ vựng IELTS hiệu quả
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
              Chinh phục IELTS với
              <span className="text-indigo-600"> Flashcard & Quiz</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 text-pretty">
              Phương pháp học từ vựng thông minh, giúp bạn ghi nhớ lâu dài và đạt điểm cao trong kỳ thi IELTS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/flashcards"
                className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 inline-flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Bắt đầu học ngay
              </Link>
              <Link
                href="/quiz"
                className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all inline-flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Làm Quiz
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Flashcards thông minh</h3>
              <p className="text-slate-600">
                Học từ vựng với hệ thống flashcard hiệu quả, hỗ trợ ghi nhớ lâu dài qua phương pháp lặp lại ngắt quãng.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Quiz đa dạng</h3>
              <p className="text-slate-600">
                Kiểm tra kiến thức với các bài quiz trắc nghiệm, theo dõi tiến độ và xác định điểm yếu cần cải thiện.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Theo dõi tiến độ</h3>
              <p className="text-slate-600">
                Thống kê chi tiết về quá trình học tập, giúp bạn dễ dàng theo dõi và điều chỉnh kế hoạch học.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-indigo-600 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-indigo-200">Từ vựng Academic</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-indigo-200">Người dùng</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">7.5+</div>
                <div className="text-indigo-200">Điểm IELTS trung bình</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 border border-indigo-100">
            <GraduationCap className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Sẵn sàng chinh phục IELTS?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Bắt đầu hành trình học từ vựng hiệu quả ngay hôm nay với Study MVP.
            </p>
            <Link
              href="/flashcards"
              className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 inline-flex items-center gap-2"
            >
              Học ngay miễn phí
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  )
}
