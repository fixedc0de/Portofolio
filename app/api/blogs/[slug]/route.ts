// app/api/blogs/[slug]/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { blogSchema } from '@/lib/validators';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const blogs = await sql`
      SELECT * FROM blogs WHERE slug = ${slug}
    `;
    
    if (blogs.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ blog: blogs[0] });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const result = blogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { title, content, excerpt, cover_image, published } = result.data;

    const blog = await sql`
      UPDATE blogs 
      SET title = ${title}, content = ${content}, excerpt = ${excerpt}, 
          cover_image = ${cover_image}, published = ${published},
          updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${slug}
      RETURNING id, title, slug, updated_at
    `;

    if (blog.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ blog: blog[0] });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    await sql`DELETE FROM blogs WHERE slug = ${slug}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}