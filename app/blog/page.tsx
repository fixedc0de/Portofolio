// app/blog/page.tsx
import Link from 'next/link';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const blogs = await sql`
    SELECT * FROM blogs 
    WHERE published = true 
    ORDER BY created_at DESC
  `;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-serif bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent mb-4">
            Blog
          </h1>
          <p className="text-white/60 text-lg">
            Pemikiran dan pengalaman saya seputar teknologi, programming, dan kehidupan kampus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <Link 
              key={blog.id} 
              href={`/blog/${blog.slug}`}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-all duration-300"
            >
              {blog.cover_image && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={blog.cover_image} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-amber-200 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-white/60 text-sm line-clamp-3">
                  {blog.excerpt || blog.content.substring(0, 150) + '...'}
                </p>
                <div className="mt-4 text-xs text-white/40">
                  {new Date(blog.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40">Belum ada artikel yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </main>
  );
}