// app/music/page.tsx
import Link from "next/link";
import sql from "@/lib/db";
import MusicPlayerWrapper from "@/components/MusicPlayerWrapper";

export const dynamic = 'force-dynamic';

export default async function MusicPage() {
  let tracks: any[] = [];
  let error = null;

  try {
    const result = await sql`
      SELECT * FROM tracks ORDER BY track_order ASC, created_at DESC
    `;
    tracks = result || [];
  } catch (err: any) {
    console.error('Error fetching tracks:', err);
    error = err.message || 'Failed to load tracks';
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6 pb-32">
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
            Kumpulan lagu favorit yang menemani perjalanan saya. Tekan play untuk mendengarkan!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
            <p className="text-red-200 text-sm">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-red-300/70 text-xs mt-2">
              Pastikan tabel <code className="bg-white/10 px-1 rounded">tracks</code> sudah dibuat di Neon Database.
            </p>
          </div>
        )}

        {/* Tracks List */}
        {tracks.length > 0 ? (
          <div className="space-y-3">
            {tracks.map((track: any, index: number) => (
              <div
                key={track.id}
                className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Track Number / Cover */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center">
                    {track.cover_url ? (
                      <img 
                        src={track.cover_url} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-amber-300/80 font-semibold text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{track.title}</h3>
                    <p className="text-white/60 text-sm truncate">{track.artist}</p>
                  </div>

                  {/* Album (desktop only) */}
                  {track.album && (
                    <div className="hidden md:block flex-shrink-0 w-48">
                      <p className="text-white/50 text-sm truncate">{track.album}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 border border-amber-400/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-300/60">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
            <p className="text-white/60 mb-2">Belum ada lagu</p>
            <p className="text-white/40 text-sm">Upload lagu melalui Admin Panel</p>
          </div>
        ) : null}

        {/* Info Box */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-500/20 border border-amber-400/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Tentang Playlist Ini</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Lagu-lagu ini saya upload sendiri dan merupakan favorit saya. 
                Semua file musik di-host secara langsung dan bisa diputar tanpa perlu aplikasi tambahan.
                Selamat mendengarkan! 🎧
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Music Player - Client Component */}
      <MusicPlayerWrapper />
    </main>
  );
}