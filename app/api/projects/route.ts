// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, slug, description, long_description, tech_stack, image_url, live_url, github_url, featured } = await req.json();
    
    const project = await sql`
      INSERT INTO projects (title, slug, description, long_description, tech_stack, image_url, live_url, github_url, featured)
      VALUES (${title}, ${slug}, ${description}, ${long_description}, ${tech_stack}, ${image_url}, ${live_url}, ${github_url}, ${featured})
      RETURNING *
    `;
    
    return NextResponse.json({ project: project[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}