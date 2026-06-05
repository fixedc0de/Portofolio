// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import sql from '@/lib/db';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blogs = await sql`
    SELECT * FROM blogs WHERE slug = ${params.slug} AND published = true
  `;

  if (blogs.length === 0) {
    notFound();
  }

  const blog = blogs[0];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6">
      <article className="max-w-3xl mx-auto">
        {blog.cover_image && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-serif mb-4 bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent">
          {blog.title}
        </h1>

        <div className="text-white/40 text-sm mb-8">
          {new Date(blog.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-amber-200" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-amber-100" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-white/80" {...props} />,
              code: ({node, ...props}) => <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-white/5 border border-white/10 rounded-lg p-4 overflow-x-auto mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}