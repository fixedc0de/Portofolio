// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename || !request.body) {
      return NextResponse.json({ error: 'Missing filename or body' }, { status: 400 });
    }
    
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true,
    });
    
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}