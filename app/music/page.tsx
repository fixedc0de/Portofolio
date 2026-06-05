// app/music/page.tsx
import Link from "next/link";

export default function MusicPage() {
  // Ganti dengan Playlist ID Spotify Anda
  // Cara dapat: Buka playlist di Spotify → Click "..." → Share → Copy Playlist Link
  // Link format: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
  // Playlist ID: 37i9dQZF1DXcBWIGoYBM5M (bagian setelah /playlist/)
  
  const playlists = [
    {
      title: "Favorites",
      description: "Lagu-lagu favorit yang menemani keseharian saya",
      spotifyId: "4ceyu2sM4Jm9g647ht5WZR", // GANTI DENGAN PLAYLIST ID ANDA
      color: "from-amber-500/20 to-rose-500/20",
    },
    {
      title: "Coding Vibes",
      description: "Playlist untuk fokus coding dan belajar",
      spotifyId: "4ceyu2sM4Jm9g647ht5WZR", // GANTI DENGAN PLAYLIST ID ANDA
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      title: "Chill & Relax",
      description: "Musik santai untuk waktu istirahat",
      spotifyId: "4ceyu2sM4Jm9g647ht5WZR", // GANTI DENGAN PLAYLIST ID ANDA
      color: "from-emerald-500/20 to-teal-500/20",
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
                <h2 className="text-2xl font-semibold mb-2">{playlist.title}</h2>
                <p className="text-white/70 mb-6">{playlist.description}</p>
                
                {/* Spotify Embed */}
                <div className="rounded-xl overflow-hidden">
                  <iframe
                    src={`https://open.spotify.com/embed/playlist/${playlist.spotifyId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                    style={{ minHeight: '352px' }}
                  ></iframe>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-500/20 border border-amber-400/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Tentang Playlist Ini</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Playlist ini berisi lagu-lagu yang saya sukai dan sering saya dengarkan. 
                Anda bisa langsung memutar lagu di sini tanpa perlu membuka aplikasi Spotify. 
                Jika Anda memiliki akun Spotify, Anda juga bisa save playlist ini ke library Anda!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}