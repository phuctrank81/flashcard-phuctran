import Header from "@/components/header"

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900">Lịch học của tôi</h1>
        <p className="text-slate-600 mt-2">
          Chưa có lịch học. Bạn có thể bổ sung sau.
        </p>
      </main>
    </div>
  )
}
