import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await db.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { client, amount, dueDate, number } = await request.json();

  const invoice = await db.invoice.create({
    data: {
      number,
      client,
      amount,
      dueDate: new Date(dueDate),
      userId: session.user.id
    }
  });

  // Create local notification
  await db.notification.create({
    data: {
      title: "Счет выставлен",
      message: `Счет ${number} для ${client} успешно создан.`,
      type: "success",
      userId: session.user.id
    }
  });

  return NextResponse.json(invoice);
}
