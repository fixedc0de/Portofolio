// app/api/music/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { z } from 'zod';

const trackSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255),
  artist: z.string().max(255).default('Unknown'),
  album: z.string().max(255).optional().default(''),
  cover_url: z.string().url().optional().default(''),
  audio_url: z.string().url('URL audio wajib diisi'),
  duration: z.number().int().min(0).default(0),
  track_order: z.number().int().min(0).default(0),
});

// GET: List semua tracks (public)
export async function GET() {
  try {
    const tracks = await sql`
      SELECT * FROM tracks 
      ORDER BY track_order ASC, created_at DESC
    `;
    
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

// POST: Tambah track baru (admin only - dilindungi middleware)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = trackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { title, artist, album, cover_url, audio_url, duration, track_order } = result.data;

    const track = await sql`
      INSERT INTO tracks (title, artist, album, cover_url, audio_url, duration, track_order)
      VALUES (${title}, ${artist}, ${album}, ${cover_url}, ${audio_url}, ${duration}, ${track_order})
      RETURNING *
    `;
    
    return NextResponse.json({ track: track[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating track:', error);
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 });
  }
}