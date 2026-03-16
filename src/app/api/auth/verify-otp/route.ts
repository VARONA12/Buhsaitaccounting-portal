import { NextResponse } from "next/server";
import { memoryOtpStore } from "@/lib/otpStore";

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "Отсутствуют данные" }, { status: 400 });
    }

    // МАСТЕР-КОД для тестирования (7777)
    if (code === "7777") {
      return NextResponse.json({ success: true, message: "Вход успешен (мастер-код)" });
    }

    const storedData = memoryOtpStore.get(phone);

    if (!storedData) {
      return NextResponse.json({ error: "Код не запрашивался или срок его действия истек" }, { status: 400 });
    }

    if (Date.now() > storedData.expiresAt) {
      memoryOtpStore.delete(phone);
      return NextResponse.json({ error: "Срок действия кода истек. Запросите код заново." }, { status: 400 });
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    memoryOtpStore.delete(phone);

    return NextResponse.json({ success: true, message: "Вход успешен" });
  } catch (error) {
    console.error("Ошибка верификации СМС:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
