import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

// Хелпер для отправки сообщения обратно в Телеграм
async function sendTelegramMessage(chatId: string, text: string) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) return;
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      })
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

// Хелпер для скачивания файла из Телеграм
async function downloadTelegramFile(fileId: string): Promise<string | null> {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) return null;

  try {
    const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();
    
    if (!fileData.ok) {
      console.error('getFile failed:', fileData);
      return null;
    }

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    
    const fileName = `${Date.now()}_${path.basename(filePath)}`;
    const relativePath = `/uploads/articles/${fileName}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);
    
    // Обеспечиваем наличие директории
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });

    const response = await fetch(downloadUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.writeFile(absolutePath, buffer);
    return relativePath;
  } catch (error) {
    console.error('Error downloading file from Telegram:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body.channel_post;

    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const userId = message.from?.id?.toString();

    // Загруженные данные из ENV
    const ALLOWED_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Простая проверка прав (по ID чата или отправителя)
    if (ALLOWED_CHAT_ID && chatId !== ALLOWED_CHAT_ID && userId !== ALLOWED_CHAT_ID) {
      console.log(`Unauthorized message from chat: ${chatId}, user: ${userId}`);
      return NextResponse.json({ ok: true });
    }

    const text = message.text || message.caption || "";
    
    if (text.startsWith('/start')) {
      await sendTelegramMessage(chatId, "🤖 Привет! Я бот для публикации статей.\n\n" + 
        "Пришлите текст в формате:\n" +
        "Заголовок: Название\n" +
        "Кратко: Описание\n" +
        "Текст: Содержание статьи...\n\n" +
        "Или просто пришлите фото с этим описанием в подписи (или без заголовков, тогда я попробую угадать).");
      return NextResponse.json({ ok: true });
    }

    let title = "";
    let content = "";
    let excerpt = "";
    let image = "";

    // Обработка фото
    if (message.photo && message.photo.length > 0) {
      const bestPhoto = message.photo[message.photo.length - 1]; // Берем самое большое разрешение
      const localImagePath = await downloadTelegramFile(bestPhoto.file_id);
      if (localImagePath) {
        image = localImagePath;
      }
    }

    // Парсинг сообщения
    const lines = text.split('\n');
    let currentField: 'title' | 'excerpt' | 'content' = 'title';
    let structureDetected = false;

    lines.forEach(line => {
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
      } else if (lowerLine.startsWith('/post')) {
        // Пропускаем команду
      } else {
        // Накопление текста для текущего поля
        if (currentField === 'title') {
          if (line.trim()) title = (title ? title + " " : "") + line.trim();
        } else if (currentField === 'excerpt') {
          excerpt = (excerpt ? excerpt + "\n" : "") + line;
        } else if (currentField === 'content') {
          content = (content ? content + "\n" : "") + line;
        }
      }
    });

    // Умные фолбеки, если структура не соблюдена идеально
    if (!structureDetected && text && !text.startsWith('/')) {
        const parts = text.split('\n\n');
        if (parts.length >= 2) {
            title = parts[0];
            content = parts.slice(1).join('\n\n');
        } else if (parts.length === 1) {
            title = text.substring(0, 50) + (text.length > 50 ? "..." : "");
            content = text;
        }
    }

    if (!title || !content || content.trim().length < 5) {
      if (!text.startsWith('/') && text.length > 0) {
        await sendTelegramMessage(chatId, "⚠️ Не удалось распознать формат. Пожалуйста, отправьте статью c заголовком и текстом или просто длинным сообщением.");
      }
      return NextResponse.json({ ok: true });
    }

    const authorName = message.from?.first_name || "Администратор";

    // Создание статьи в БД
    const article = await db.article.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        image: image || null,
        author: authorName,
      },
    });

    await sendTelegramMessage(chatId, `✅ Статья успешно опубликована!\n\n🔗 Раздел статей: /articles\n📌 Заголовок: ${article.title}\n👤 Автор: ${article.author}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Major error in Telegram Webhook:', error);
    return NextResponse.json({ ok: true }); 
  }
}

// Хендлер для управления вебхуком
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!BOT_TOKEN) return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not found in env" });

    if (url) {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`);
        const data = await response.json();
        return NextResponse.json({
            info: "Attempting to set webhook",
            target: url,
            telegram_response: data
        });
    }

    // Получаем текущий статус
    const statusResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const statusData = await statusResponse.json();

    return NextResponse.json({ 
        message: "Telegram Webhook Manager",
        usage: "Send ?url=https://your-domain.com/api/telegram-webhook to set webhook",
        current_status: statusData
    });
}
