import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) return NextResponse.json([]);

  const results = [];

  // Search in Invoices
  const invoices = await db.invoice.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { client: { contains: q, mode: 'insensitive' } },
        { number: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 3
  });
  results.push(...invoices.map(i => ({ id: i.id, title: `Счет ${i.number}`, type: "invoice", detail: i.client, href: "/invoices" })));

  // Search in Documents
  const docs = await db.document.findMany({
    where: {
      userId: session.user.id,
      name: { contains: q, mode: 'insensitive' }
    },
    take: 3
  });
  results.push(...docs.map(d => ({ id: d.id, title: d.name, type: "document", detail: d.status, href: "/documents" })));

  return NextResponse.json(results);
}
