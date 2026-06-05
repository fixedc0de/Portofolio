// app/admin/page.tsx
"use client";
import { useState } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Auto-generate slug dari title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  // Upload gambar ke Vercel Blob
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const data = await response.json();
      if (data.url) {
        setCoverImage(data.url);
        setMessage("✅ Gambar berhasil diupload!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  // Submit blog post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          cover_image: coverImage,
          published,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Blog berhasil dipublikasikan!");
        // Reset form
        setTitle("");
        setSlug("");
        setContent("");
        setExcerpt("");
        setCoverImage("");
        setPublished(false);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-white/60">Buat dan kelola artikel blog Anda</p>
        </div>
        // Tambahkan di bagian atas form, setelah <div className="mb-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-all"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Judul Artikel</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Masukkan judul artikel"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="judul-artikel-anda"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              required
            />
            <p className="text-xs text-white/40 mt-1">
              URL: /blog/{slug || "judul-artikel"}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Ringkasan Singkat</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan artikel (maksimal 200 karakter)"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-none"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Gambar Cover</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer"
            />
            {uploading && <p className="text-xs text-amber-400 mt-2">Uploading...</p>}
            {coverImage && (
              <div className="mt-3">
                <img src={coverImage} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <p className="text-xs text-white/40 mt-2 break-all">{coverImage}</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Konten Artikel (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis artikel Anda di sini menggunakan Markdown..."
              rows={15}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-y font-mono text-sm"
              required
            />
            <p className="text-xs text-white/40 mt-1">
              Gunakan Markdown: **bold**, *italic*, ## heading, - list, ```code```
            </p>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 rounded bg-white/5 border border-white/10"
            />
            <label htmlFor="published" className="text-sm text-white/70">
              Publikasikan sekarang
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-all shadow-lg shadow-amber-500/20"
          >
            {loading ? "Menyimpan..." : "Publikasikan Artikel"}
          </button>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-xl ${message.includes("✅") ? "bg-emerald-500/20 border border-emerald-400/30" : "bg-red-500/20 border border-red-400/30"}`}>
              <p className="text-sm">{message}</p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}