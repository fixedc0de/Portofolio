// app/api/blogs/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const blogs = await sql`
      SELECT * FROM blogs 
      WHERE published = true 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, slug, content, excerpt, cover_image, published } = await req.json();
    
    const blog = await sql`
      INSERT INTO blogs (title, slug, content, excerpt, cover_image, published)
      VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${cover_image}, ${published})
      RETURNING *
    `;
    
    return NextResponse.json({ blog: blog[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}