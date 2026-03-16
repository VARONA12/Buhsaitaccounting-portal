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

  if (invoices.length === 0) {
    return NextResponse.json([
      { id: "inv-1", number: "INV-001", client: "ООО Вектор", amount: "45000", status: "Оплачен", createdAt: new Date().toISOString() },
      { id: "inv-2", number: "INV-002", client: "ИП Соколов", amount: "12800", status: "Ожидание", createdAt: new Date().toISOString() },
      { id: "inv-3", number: "INV-003", client: "ПАО Газпром", amount: "850000", status: "Оплачен", createdAt: new Date().toISOString() },
      { id: "inv-4", number: "INV-004", client: "ООО Ромашка", amount: "3200", status: "Просрочен", createdAt: new Date().toISOString() },
      { id: "inv-5", number: "INV-005", client: "ЗАО Техно", amount: "95600", status: "Ожидание", createdAt: new Date().toISOString() },
      { id: "inv-6", number: "INV-006", client: "ИП Петров", amount: "5500", status: "Оплачен", createdAt: new Date().toISOString() },
      { id: "inv-7", number: "INV-007", client: "ООО Строй", amount: "124000", status: "Ожидание", createdAt: new Date().toISOString() },
    ]);
  }

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
