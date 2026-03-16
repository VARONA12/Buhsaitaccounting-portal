import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ isAdmin: false, error: "No session ID" }, { status: 401 });
  }

  try {
    console.log("Checking admin status for ID:", session.user.id);
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, phone: true }
    });
    console.log("DB Result:", user);

    return NextResponse.json({ 
      isAdmin: !!user?.isAdmin,
      sessionId: session.user.id,
      dbFound: !!user,
      dbIsAdmin: user?.isAdmin,
      dbPhone: user?.phone,
      debug: {
        sessionId: session.user.id,
        dbFound: !!user,
        dbIsAdmin: user?.isAdmin,
        dbPhone: user?.phone
      }
    });
  } catch (error: any) {
    return NextResponse.json({ isAdmin: false, error: error.message }, { status: 500 });
  }
}
