// app/music/page.tsx
import Link from "next/link";

export default function MusicPage() {
  // Ganti dengan Playlist ID YouTube Anda
  // Cara dapat: Buka playlist di YouTube → Lihat URL
  // Link format: https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf
  // Playlist ID: PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf (bagian setelah list=)
  
  const playlists = [
    {
      title: "Favorites",
      description: "Lagu-lagu favorit yang menemani keseharian saya",
      youtubeId: "PLtz9ombNXUfYAQPoIE95wiusLVA-AHQSl", // GANTI DENGAN PLAYLIST ID YOUTUBE ANDA
      color: "from-amber-500/20 to-rose-500/20",
      icon: "🎵",
    },
    {
      title: "Coding Vibes",
      description: "Playlist untuk fokus coding dan belajar",
      youtubeId: "PLtz9ombNXUfYAQPoIE95wiusLVA-AHQSl", // GANTI DENGAN PLAYLIST ID YOUTUBE ANDA
      color: "from-blue-500/20 to-purple-500/20",
      icon: "💻",
    },
    {
      title: "Chill & Relax",
      description: "Musik santai untuk waktu istirahat",
      youtubeId: "PLtz9ombNXUfYAQPoIE95wiusLVA-AHQSl", // GANTI DENGAN PLAYLIST ID YOUTUBE ANDA
      color: "from-emerald-500/20 to-teal-500/20",
      icon: "🌿",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-sm">Kembali</span>
          </Link>

          <h1 className="text-5xl font-serif bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent mb-4">
            My Playlist
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Kumpulan lagu favorit yang menemani perjalanan saya. Klik play untuk mendengarkan!
          </p>
        </div>

        {/* Playlists Grid */}
        <div className="space-y-12">
          {playlists.map((playlist, index) => (
            <div key={index} className="space-y-4">
              <div className={`bg-gradient-to-br ${playlist.color} border border-white/10 rounded-2xl p-8`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{playlist.icon}</span>
                  <h2 className="text-2xl font-semibold">{playlist.title}</h2>
                </div>
                <p className="text-white/70 mb-6">{playlist.description}</p>
                
                {/* YouTube Embed - Responsive 16:9 */}
                <div className="relative rounded-xl overflow-hidden bg-black/40" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/videoseries?list=${playlist.youtubeId}`}
                    title={playlist.title}
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 border border-red-400/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Tentang Playlist Ini</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Playlist ini berisi lagu-lagu yang saya sukai dan sering saya dengarkan. 
                Anda bisa langsung memutar lagu di sini tanpa perlu membuka YouTube. 
                Selamat mendengarkan! 🎧
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}