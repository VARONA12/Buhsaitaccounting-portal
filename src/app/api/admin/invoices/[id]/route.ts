import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

// Build update: 2026-03-16 16:15
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { status } = await request.json();

  try {
    const invoice = await db.invoice.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
