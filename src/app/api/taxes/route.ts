import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const taxes = await db.taxRecord.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    // Если у пользователя нет налогов, вернем стандартные (для примера в начале)
    if (taxes.length === 0) {
      return NextResponse.json([
        {
          id: "def-1",
          title: "УСН 1 кв. (Пример)",
          dueDate: "2024-04-25T00:00:00.000Z",
          status: "уведомление",
        },
        {
          id: "def-2",
          title: "Страховые взносы (Пример)",
          dueDate: "2024-04-28T00:00:00.000Z",
          status: "оплата",
        },
      ]);
    }

    return NextResponse.json(taxes);
  } catch (error) {
    console.error("Ошибка получения налогов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
