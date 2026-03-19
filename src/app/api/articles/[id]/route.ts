import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await db.article.findUnique({
      where: { id, published: true },
    });
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
