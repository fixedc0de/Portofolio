// app/projects/page.tsx
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await sql`
    SELECT * FROM projects 
    ORDER BY featured DESC, created_at DESC
  `;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-serif bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent mb-4">
            Projects
          </h1>
          <p className="text-white/60 text-lg">
            Kumpulan proyek yang telah saya kerjakan selama perjalanan belajar programming.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project: any) => (
            <div 
              key={project.id}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-all duration-300"
            >
              {project.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-semibold group-hover:text-amber-200 transition-colors">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs text-amber-200">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-white/60 mb-4">
                  {project.description}
                </p>

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech: string) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  {project.live_url && (
                    <a 
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-br from-amber-500 to-rose-500 text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:from-amber-400 hover:to-rose-400 transition-all"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a 
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-white/20 transition-all"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40">Belum ada proyek yang ditambahkan.</p>
          </div>
        )}
      </div>
    </main>
  );
}