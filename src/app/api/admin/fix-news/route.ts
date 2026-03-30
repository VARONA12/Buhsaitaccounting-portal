import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const TOKEN = 'ef-cleanup-2026';

// Patterns of joined words to fix
const TEXT_FIXES: [RegExp, string][] = [
  [/еслисоблюдены/g, 'если соблюдены'],
  [/созданииООО/g, 'создании ООО'],
  [/являетсяруководителемООО/g, 'является руководителем ООО'],
  [/Налоговикиуточнили/g, 'Налоговики уточнили'],
  [/помощьюсервиса/g, 'помощью сервиса'],
  [/условияЗарегистрировать/g, 'условия. Зарегистрировать'],
  [/бизнесаСудебная/g, 'бизнеса. Судебная'],
  [/заявлениене/g, 'заявление не'],
  [/регистрациине/g, 'регистрации не'],
  [/онлайн-регистрациябизнеса/g, 'онлайн-регистрация бизнеса'],
  // Generic: fix common patterns where a lowercase Russian letter is followed by an uppercase one without space
  [/([а-яё])([А-ЯЁ])/g, '$1 $2'],
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('token') !== TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = url.searchParams.get('dry') === '1';

  const allNews = await db.newsItem.findMany({ where: { published: true } });
  const fixes: { id: string; titleBefore?: string; titleAfter?: string; contentChanged: boolean }[] = [];

  for (const item of allNews) {
    let title = item.title;
    let content = item.content;
    let excerpt = item.excerpt;
    let changed = false;

    for (const [pattern, replacement] of TEXT_FIXES) {
      const newTitle = title.replace(pattern, replacement);
      const newContent = content.replace(pattern, replacement);
      const newExcerpt = excerpt ? excerpt.replace(pattern, replacement) : excerpt;

      if (newTitle !== title || newContent !== content || newExcerpt !== excerpt) {
        changed = true;
      }
      title = newTitle;
      content = newContent;
      excerpt = newExcerpt;
    }

    if (changed) {
      fixes.push({
        id: item.id,
        titleBefore: item.title !== title ? item.title : undefined,
        titleAfter: item.title !== title ? title : undefined,
        contentChanged: item.content !== content,
      });

      if (!dryRun) {
        await db.newsItem.update({
          where: { id: item.id },
          data: { title, content, excerpt },
        });
      }
    }
  }

  return NextResponse.json({
    mode: dryRun ? 'dry-run' : 'applied',
    totalChecked: allNews.length,
    totalFixed: fixes.length,
    fixes,
  });
}
