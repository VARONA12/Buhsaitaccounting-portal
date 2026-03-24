import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const TOKEN = 'ef-cleanup-2026';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('token') !== TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await db.newsItem.deleteMany({});
  return NextResponse.json({ deleted: result.count, ok: true });
}
