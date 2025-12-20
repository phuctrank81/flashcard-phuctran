"use client"

import Header from "../components/Header"
import Footer from "../components/Footer"

export default function FlashcardsPage() {
  return (
    <div>
      <Header />

      {/* Vùng có thể kéo lên xuống */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-[200vh] px-4 py-8">
          {/* Nội dung trống / placeholder */}
        </div>
      </main>
      <Footer />
    </div>
  )
}
