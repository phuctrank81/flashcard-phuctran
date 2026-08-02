"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setShowResend(false);
    setResendMessage(null);

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message || "Đăng nhập thất bại";
        setError(msg);
        if (res.status === 403 && String(msg).toLowerCase().includes("xác nhận")) {
          setShowResend(true);
        }
        return;
      }

      // ✅ (Tuỳ backend) Lưu token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Redirect vào trang chính
      router.push("/"); // hoặc "/dashboard"

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage(null);
    if (!email.trim()) {
      setResendMessage("Vui lòng nhập email để gửi lại xác nhận");
      return;
    }

    try {
      setResendLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResendMessage(data?.message || data?.emailError || "Không gửi được email");
      } else {
        setResendMessage(data?.message || "Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setResendMessage(message || "Lỗi gửi lại email");
    } finally {
      setResendLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-center mb-2">
            Đăng nhập
          </h1>


          {error && (
            <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {showResend && (
            <div className="mb-4">
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full bg-white border border-indigo-600 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                {resendLoading ? "Đang gửi lại..." : "Gửi lại email xác nhận"}
              </button>
              {resendMessage && (
                <div className="mt-2 text-sm text-slate-700">{resendMessage}</div>
              )}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full border border-slate-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-100"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full border border-slate-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-100"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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

