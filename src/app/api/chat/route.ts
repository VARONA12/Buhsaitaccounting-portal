import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await db.message.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await request.json();

  const message = await db.message.create({
    data: {
      text,
      sender: "user",
      userId: session.user.id
    }
  });

  // Эмуляция ответа бухгалтера (через 1 сек)
  setTimeout(async () => {
    try {
      await db.message.create({
        data: {
          text: "Здравствуйте! Я получил ваш вопрос. Изучу документы и вернусь с ответом в ближайшее время.",
          sender: "admin",
          userId: session.user.id
        }
      });
      console.log("Auto-reply sent for user", session.user.id);
    } catch (e) {
      console.error("Auto-reply failed");
    }
  }, 1500);

  return NextResponse.json(message);
}
