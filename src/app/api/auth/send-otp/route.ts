import { NextResponse } from "next/server";
import { memoryOtpStore } from "@/lib/otpStore";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Номер телефона обязателен" }, { status: 400 });
    }

    // Генерируем случайный код из 4 цифр
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Сохраняем код, он будет действителен 5 минут
    memoryOtpStore.set(phone, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    const SMSC_LOGIN = process.env.SMSC_LOGIN;
    const SMSC_PASSWORD = process.env.SMSC_PASSWORD;

    // Если указаны API-ключи от SMSC.RU, отправляем боевую СМС
    if (SMSC_LOGIN && SMSC_PASSWORD) {
      const message = `Код входа в ЭлитФинанс: ${code}`;
      const cleanPhone = phone.replace(/[^0-9]/g, ""); 
      const url = `https://smsc.ru/sys/send.php?login=${SMSC_LOGIN}&psw=${SMSC_PASSWORD}&phones=${cleanPhone}&mes=${encodeURIComponent(message)}&fmt=3`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log("Ответ от СМС-шлюза:", data);
      
      if (data.error) {
        return NextResponse.json({ error: "Не удалось отправить СМС. Ошибка шлюза: " + data.error_msg }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: "СМС отправлено на телефон" });
    } else {
      // РЕЖИМ РАЗРАБОТКИ
      console.log("\n" + "=".repeat(50));
      console.log("🚀 ВНИМАНИЕ: РЕЖИМ РАЗРАБОТКИ");
      console.log(`📱 НОМЕР: ${phone}`);
      console.log(`🔑 КОД ИЗ СМС: ${code}`);
      console.log("=".repeat(50) + "\n");
      
      return NextResponse.json({ 
        success: true, 
        message: "Режим разработки: код отображен в терминале сервера",
        devCode: process.env.NODE_ENV === "development" ? code : undefined
      });
    }
  } catch (error) {
    console.error("Ошибка API отправки СМС:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
