import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const messages = await db.message.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await request.json();

  try {
    const message = await db.message.create({
      data: {
        text,
        userId: session.user.id,
        sender: "user"
      }
    });

    // Notify admin (maybe create a notification for all admins?)
    // In a real app we'd use WebSockets or push notifications.

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
