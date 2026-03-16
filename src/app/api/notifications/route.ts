import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  if (id === "all") {
    await db.notification.updateMany({
      where: { userId: session.user.id },
      data: { read: true }
    });
  } else {
    await db.notification.update({
      where: { id },
      data: { read: true }
    });
  }

  return NextResponse.json({ success: true });
}
