"use client";

import Link from "next/link";
import Header from "@/components/header";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-center mb-2">
            Đăng nhập
          </h1>
          <p className="text-center text-slate-500 mb-6">
            Chào mừng bạn quay lại haha
          </p>

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-slate-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full border border-slate-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold cursor-pointer transition-colors"
          >
            Đăng nhập
          </button>

          <p className="text-center text-sm text-slate-600 mt-4">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
