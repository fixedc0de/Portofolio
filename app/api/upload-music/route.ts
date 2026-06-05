// app/api/upload-music/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'audio/mpeg',      // .mp3
  'audio/mp3',       // .mp3 (alternate)
  'audio/wav',       // .wav
  'audio/ogg',       // .ogg
  'audio/m4a',       // .m4a
  'audio/x-m4a',     // .m4a
  'audio/mp4',       // .m4a
];
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.mp4'];

function getExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Validasi ekstensi
    const ext = getExtension(filename);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Validasi ukuran
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    if (!request.body) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const uniqueFilename = `music/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    const blob = await put(uniqueFilename, request.body, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload music error:', error);
    return NextResponse.json({ error: 'Failed to upload music' }, { status: 500 });
  }
}