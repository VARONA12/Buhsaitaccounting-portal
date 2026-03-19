import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, phone, message } = await request.json();

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Missing Telegram Bot Token or Chat ID in environment variables");
      // Still return success to user for UX, but log error internally
      return NextResponse.json({ success: true, warning: "Internal configuration missing" });
    }

    const text = `
🆕 *Новая заявка с сайта!*
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
💬 *Сообщение:* ${message || "—"}
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
      return NextResponse.json({ error: "Failed to send to Telegram" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
