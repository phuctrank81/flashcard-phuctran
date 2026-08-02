  "use client";

  import { useState } from "react";
  import Link from "next/link";
  import Header from "@/components/header";

  export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRegister = async (event?: React.FormEvent) => {
      event?.preventDefault();
      setError(null);
      setSuccess(null);

      // ✅ Validation chi tiết hơn
      if (!username.trim() || !email.trim() || !password || !confirmPassword) {
        setError("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      // ✅ Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Email không hợp lệ");
        return;
      }

      // ✅ Validate username length
      if (username.trim().length < 3) {
        setError("Tên người dùng phải có ít nhất 3 ký tự");
        return;
      }

      // ✅ Validate password length
      if (password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      if (password !== confirmPassword) {
        setError("Mật khẩu nhập lại không khớp");
        return;
      }

      try {
        setLoading(true);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(), // ✅ Trim whitespace
            email: email.trim().toLowerCase(), // ✅ Lowercase email
            password,
          }),
        });

        const responseText = await res.text();
        const data = responseText ? JSON.parse(responseText) : {};

        if (!res.ok) {
          throw new Error(data.message || "Đăng ký thất bại");
        }

        setSuccess("Đăng ký thành công! Vui lòng kiểm tra email và xác nhận tài khoản trước khi đăng nhập.");

        // ✅ Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        handleRegister();
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">
              Đăng ký tài khoản
            </h1>

            {error && (
              <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 text-sm bg-green-50 text-green-600 rounded-lg border border-green-200">
                {success}
              </div>
            )}

            <form onSubmit={(e) => handleRegister(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên người dùng"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 active:bg-indigo-700 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng ký...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>

            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              Đã có tài khoản?{" "}
              <Link 
                href="/login" 
                className="text-indigo-600 font-semibold hover:underline hover:text-indigo-700 transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }
