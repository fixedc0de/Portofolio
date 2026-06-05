// app/admin/music/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover_url: string;
  audio_url: string;
  duration: number;
  track_order: number;
};

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("Unknown");
  const [album, setAlbum] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [trackOrder, setTrackOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/music");
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const uploadFile = async (file: File, type: 'music' | 'image') => {
    setUploading(true);
    try {
      const endpoint = type === 'music' ? '/api/upload-music' : '/api/upload';
      const response = await fetch(`${endpoint}?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      const data = await response.json();
      if (!data.url) throw new Error("Upload failed");
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      setMessage("❌ File audio wajib diupload");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Upload audio
      const audioUrl = await uploadFile(audioFile, 'music');
      
      // Upload cover (jika ada)
      let coverImageUrl = coverUrl;
      if (coverFile) {
        coverImageUrl = await uploadFile(coverFile, 'image');
      }

      // Save to database
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          album,
          cover_url: coverImageUrl,
          audio_url: audioUrl,
          duration: 0,
          track_order: trackOrder,
        }),
      });

      if (res.ok) {
        setMessage("✅ Lagu berhasil ditambahkan!");
        // Reset form
        setTitle("");
        setArtist("Unknown");
        setAlbum("");
        setCoverUrl("");
        setAudioFile(null);
        setCoverFile(null);
        setTrackOrder(tracks.length);
        fetchTracks();
      } else {
        const data = await res.json();
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus lagu ini?")) return;

    try {
      const res = await fetch(`/api/music/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("✅ Lagu berhasil dihapus");
        fetchTracks();
      }
    } catch (error) {
      setMessage("❌ Gagal menghapus lagu");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif bg-gradient-to-br from-white to-amber-200/60 bg-clip-text text-transparent mb-2">
            Kelola Musik
          </h1>
          <p className="text-white/60">Upload dan kelola playlist Anda</p>
        </div>

        {/* Form Upload */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tambah Lagu Baru</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Judul Lagu *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Artis</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Album</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">File Audio * (MP3, WAV, OGG, M4A - Max 10MB)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Cover Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Atau URL Cover</label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Urutan</label>
              <input
                type="number"
                value={trackOrder}
                onChange={(e) => setTrackOrder(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                min="0"
              />
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all"
            >
              {uploading ? "Mengupload file..." : loading ? "Menyimpan..." : "Tambah Lagu"}
            </button>

            {message && (
              <div className={`p-3 rounded-xl text-sm ${message.includes("✅") ? "bg-emerald-500/20 border border-emerald-400/30" : "bg-red-500/20 border border-red-400/30"}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* List Tracks */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Lagu ({tracks.length})</h2>
          
          {tracks.length === 0 ? (
            <p className="text-white/40 text-center py-8">Belum ada lagu</p>
          ) : (
            <div className="space-y-2">
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center">
                    {track.cover_url ? (
                      <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-amber-300/80 text-xs font-semibold">#{track.track_order}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{track.title}</h4>
                    <p className="text-white/60 text-sm truncate">{track.artist}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="flex-shrink-0 px-3 py-1.5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}