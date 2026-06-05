// app/admin/blogs/page.tsx
import Link from "next/link";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const blogs = await sql`
    SELECT * FROM blogs ORDER BY created_at DESC
  `;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent mb-2">
              Kelola Blog
            </h1>
            <p className="text-white/60">Daftar semua artikel blog Anda</p>
          </div>
          <Link
            href="/admin"
            className="bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-amber-500/20"
          >
            + Buat Artikel Baru
          </Link>
        </div>

        <div className="space-y-4">
          {blogs.map((blog: any) => (
            <div
              key={blog.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-amber-400/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{blog.title}</h2>
                    {blog.published ? (
                      <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs text-emerald-200">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-full text-xs text-yellow-200">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-3">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span>Slug: {blog.slug}</span>
                    <span>•</span>
                    <span>{new Date(blog.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-all"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 mb-4">Belum ada artikel</p>
            <Link
              href="/admin"
              className="inline-block bg-gradient-to-br from-amber-500 to-rose-500 text-white px-6 py-3 rounded-xl font-medium"
            >
              Buat Artikel Pertama
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}