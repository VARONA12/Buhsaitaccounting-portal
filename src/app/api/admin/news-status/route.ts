import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const TOKEN = 'ef-cleanup-2026';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('token') !== TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await db.newsItem.count();
    const latest = await db.newsItem.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { title: true, source: true, publishedAt: true },
    });
    return NextResponse.json({ ok: true, count, latest, dbConnected: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, dbConnected: false, error: message }, { status: 500 });
  }
}
