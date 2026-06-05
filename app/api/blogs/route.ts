// app/api/blogs/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { blogSchema } from '@/lib/validators';

export async function GET() {
  try {
    const blogs = await sql`
      SELECT id, title, slug, excerpt, cover_image, published, created_at, updated_at 
      FROM blogs 
      WHERE published = true 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = blogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { title, slug, content, excerpt, cover_image, published } = result.data;

    // Check if slug already exists
    const existing = await sql`SELECT id FROM blogs WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const blog = await sql`
      INSERT INTO blogs (title, slug, content, excerpt, cover_image, published)
      VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${cover_image}, ${published})
      RETURNING id, title, slug, published, created_at
    `;
    
    return NextResponse.json({ blog: blog[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}