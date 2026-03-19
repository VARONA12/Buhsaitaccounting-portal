import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

// Хелпер для отправки сообщения обратно в Телеграм (с кнопками или без)
async function sendTelegramMessage(chatId: string, text: string, reply_markup?: any) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) return;
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup,
        parse_mode: "Markdown"
      })
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

// Хелпер для ответа на Callback Query
async function answerCallbackQuery(callback_query_id: string, text?: string) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return;
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ callback_query_id, text })
        });
    } catch (err) {
        console.error(err);
    }
}

// Хелпер для скачивания файла
async function downloadTelegramFile(fileId: string): Promise<string | null> {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) return null;

  try {
    const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json() as any;
    
    if (!fileData.ok) return null;

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    
    const fileName = `${Date.now()}_${path.basename(filePath)}`;
    const relativePath = `/uploads/articles/${fileName}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);
    
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });

    const response = await fetch(downloadUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.writeFile(absolutePath, buffer);
    return relativePath;
  } catch (error) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as any;
    
    // Обработка нажатий на кнопки (Delete и т.д.)
    if (body.callback_query) {
        const query = body.callback_query;
        const data = query.data;
        const chatId = query.message.chat.id.toString();

        if (data.startsWith('delete_')) {
            const articleId = data.replace('delete_', '');
            try {
                await db.article.delete({ where: { id: articleId } });
                await answerCallbackQuery(query.id, "Статья удалена!");
                await sendTelegramMessage(chatId, "🗑 Статья успешно удалена.");
            } catch (err) {
                await answerCallbackQuery(query.id, "Ошибка при удалении");
            }
        }
        return NextResponse.json({ ok: true });
    }

    const message = body.message || body.channel_post;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const userId = message.from?.id?.toString();
    const ALLOWED_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (ALLOWED_CHAT_ID && chatId !== ALLOWED_CHAT_ID && userId !== ALLOWED_CHAT_ID) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text || message.caption || "";
    
    // Команды
    if (text.startsWith('/start') || text.startsWith('/help')) {
      await sendTelegramMessage(chatId, "🤖 *Бот для управления статьями*\n\n" + 
        "🔹 *Как создать:* Просто пришлите текст или фото с описанием. Используйте ключи для структуры:\n" +
        "`Заголовок: Название`\n" +
        "`Кратко: Превью`\n" +
        "`Текст: Основная статья`\n\n" +
        "🔹 *Команды:*\n" +
        "/list - Список последних статей и удаление\n" +
        "/help - Инструкция");
      return NextResponse.json({ ok: true });
    }

    if (text.startsWith('/list')) {
        const articles = await db.article.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        if (articles.length === 0) {
            await sendTelegramMessage(chatId, "📭 Список статей пуст.");
            return NextResponse.json({ ok: true });
        }

        for (const art of articles) {
            const btn = {
                inline_keyboard: [[{ text: "❌ Удалить", callback_data: `delete_${art.id}` }]]
            };
            await sendTelegramMessage(chatId, `📌 *${art.title}*\n${art.excerpt || art.content.substring(0, 50)}...`, btn);
        }
        return NextResponse.json({ ok: true });
    }

    // Сохранение статьи
    let title = "";
    let content = "";
    let excerpt = "";
    let image = "";

    if (message.photo && message.photo.length > 0) {
      const bestPhoto = message.photo[message.photo.length - 1];
      const localImagePath = await downloadTelegramFile(bestPhoto.file_id);
      if (localImagePath) image = localImagePath;
    }

    const lines = text.split('\n');
    let currentField: 'title' | 'excerpt' | 'content' = 'title';
    let structureDetected = false;

    lines.forEach((line: string) => {
      const lowerLine = line.toLowerCase().trim();
      if (lowerLine.startsWith('заголовок:')) {
        title = line.split(':').slice(1).join(':').trim();
        currentField = 'title';
        structureDetected = true;
      } else if (lowerLine.startsWith('кратко:') || lowerLine.startsWith('анонс:') || lowerLine.startsWith('превью:')) {
        excerpt = line.split(':').slice(1).join(':').trim();
        currentField = 'excerpt';
        structureDetected = true;
      } else if (lowerLine.startsWith('текст:')) {
        content = line.split(':').slice(1).join(':').trim();
        currentField = 'content';
        structureDetected = true;
      } else {
        if (currentField === 'title') {
          if (line.trim()) title = (title ? title + " " : "") + line.trim();
        } else if (currentField === 'excerpt') {
          excerpt = (excerpt ? excerpt + "\n" : "") + line;
        } else if (currentField === 'content') {
          content = (content ? content + "\n" : "") + line;
        }
      }
    });

    if (!structureDetected && text && !text.startsWith('/')) {
        const parts = text.split('\n\n');
        if (parts.length >= 2) {
            title = parts[0];
            content = parts.slice(1).join('\n\n');
        } else {
            title = text.substring(0, 50) + (text.length > 50 ? "..." : "");
            content = text;
        }
    }

    if (!title || !content || content.trim().length < 5) {
      if (!text.startsWith('/') && text.length > 0) {
        await sendTelegramMessage(chatId, "⚠️ Не удалось распознать. Используйте 'Заголовок:' и 'Текст:'.");
      }
      return NextResponse.json({ ok: true });
    }

    const article = await db.article.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        image: image || null,
        author: message.from?.first_name || "Администратор",
      },
    });

    await sendTelegramMessage(chatId, `✅ *Опубликовано!*\n\nЗаголовок: ${article.title}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true }); 
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return NextResponse.json({ error: "Missing token" });

    if (url) {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`);
        const data = await response.json();
        return NextResponse.json(data);
    }
    return NextResponse.json({ status: "ok", mode: "webhook" });
}
