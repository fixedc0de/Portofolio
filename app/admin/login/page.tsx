// app/admin/login/page.tsx
"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. Pindahkan logika form ke dalam komponen terpisah
function LoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <h1 className="text-3xl font-serif bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent mb-2">
        Admin Login
      </h1>
      <p className="text-white/60 mb-6">Masuk untuk mengelola konten</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            placeholder="Masukkan password admin"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-amber-500/20"
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// 2. Komponen Utama Halaman (Membungkus dengan Suspense)
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Suspense boundary WAJIB untuk useSearchParams */}
        <Suspense fallback={
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="animate-pulse text-white/60">Memuat halaman login...</div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}