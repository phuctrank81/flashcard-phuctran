import Header from "@/components/header"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900">Trang cá nhân</h1>
        <p className="text-slate-600 mt-2">
          Khu vực này đang được xây dựng. Bạn có thể tùy chỉnh sau.
        </p>
      </main>
    </div>
  )
}
