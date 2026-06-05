// app/api/music/[id]/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const track = await sql`
      DELETE FROM tracks WHERE id = ${id} RETURNING audio_url
    `;

    if (track.length === 0) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting track:', error);
    return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 });
  }
}