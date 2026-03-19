import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const messages = await db.message.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { userId, text } = await request.json();

  try {
    const message = await db.message.create({
      data: {
        text,
        userId,
        sender: "admin",
      },
    });

    // Also create a notification for the user
    await db.notification.create({
      data: {
        title: "Новое сообщение от бухгалтера",
        message: text.substring(0, 50) + "...",
        type: "message",
        userId,
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
