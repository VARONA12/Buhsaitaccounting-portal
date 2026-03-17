import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
    const user = await db.user.findFirst({
      where: {
        phone: {
          contains: normalizedPhone,
        },
      },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
