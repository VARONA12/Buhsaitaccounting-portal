import { NextResponse } from "next/server";
import { memoryOtpStore } from "@/lib/otpStore";

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "Отсутствуют данные" }, { status: 400 });
    }

    const storedData = memoryOtpStore.get(phone);

    if (!storedData) {
      return NextResponse.json({ error: "Код не запрашивался или срок его действия истек" }, { status: 400 });
    }

    if (Date.now() > storedData.expiresAt) {
      memoryOtpStore.delete(phone);
      return NextResponse.json({ error: "Срок действия кода истек. Запросите код заново." }, { status: 400 });
    }

    // Проверка самого кода (Добавлен мастер-код 7777 для тестов)
    if (code !== "7777" && storedData.code !== code) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    // Успешный вход! Удаляем код, чтобы его нельзя было использовать повторно.
    memoryOtpStore.delete(phone);

    // В будущем здесь можно выдавать JWT токен или создавать пользовательскую сессию,
    // например с использованием cookies, next-auth или iron-session.
    // Пока просто возвращаем успех:

    return NextResponse.json({ success: true, message: "Вход успешен" });
  } catch (error) {
    console.error("Ошибка верификации СМС:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
