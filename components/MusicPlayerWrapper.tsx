// components/MusicPlayerWrapper.tsx
"use client";
import { useState, useEffect } from "react";
import MusicPlayer, { Track } from "./MusicPlayer";

export default function MusicPlayerWrapper() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("/api/music");
        const data = await res.json();
        setTracks(data.tracks || []);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-white/10 rounded animate-pulse w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return null;
  }

  return <MusicPlayer tracks={tracks} />;
}