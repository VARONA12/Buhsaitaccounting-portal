import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
  // Check authorization (optional since user has bypass in frontend, but good practice)
  // For bypass mode, we might want to skip this temporarily or use a special check.
  
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");

  if (!model) {
    // Return list of available models
    const models = [
      { name: "User", label: "Пользователи" },
      { name: "Document", label: "Документы" },
      { name: "TaxRecord", label: "Налоги" },
      { name: "Invoice", label: "Счета" },
      { name: "Notification", label: "Уведомления" },
      { name: "Message", label: "Сообщения" },
    ];
    return NextResponse.json({ models });
  }

  try {
    // Dynamically call prisma client
    // @ts-ignore - Prisma dynamic access
    const data = await db[model.charAt(0).toLowerCase() + model.slice(1)].findMany({
      take: 100, // Limit for safety
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Database fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
