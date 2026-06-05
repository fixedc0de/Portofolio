// app/api/blogs/[slug]/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blogs = await sql`
      SELECT * FROM blogs WHERE slug = ${params.slug}
    `;
    
    if (blogs.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ blog: blogs[0] });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { title, content, excerpt, cover_image, published } = await req.json();
    
    const blog = await sql`
      UPDATE blogs 
      SET title = ${title}, content = ${content}, excerpt = ${excerpt}, 
          cover_image = ${cover_image}, published = ${published},
          updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${params.slug}
      RETURNING *
    `;
    
    return NextResponse.json({ blog: blog[0] });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await sql`DELETE FROM blogs WHERE slug = ${params.slug}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}