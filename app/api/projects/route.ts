// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { projectSchema } from '@/lib/validators';

export async function GET() {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY featured DESC, created_at DESC
    `;
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { title, slug, description, long_description, tech_stack, image_url, live_url, github_url, featured } = result.data;

    // Check if slug already exists
    const existing = await sql`SELECT id FROM projects WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const project = await sql`
      INSERT INTO projects (title, slug, description, long_description, tech_stack, image_url, live_url, github_url, featured)
      VALUES (${title}, ${slug}, ${description}, ${long_description}, ${tech_stack}, ${image_url}, ${live_url}, ${github_url}, ${featured})
      RETURNING id, title, slug, featured, created_at
    `;
    
    return NextResponse.json({ project: project[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}