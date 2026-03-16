import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { title, dueDate, status, targetUserId } = await request.json();

  try {
    // If targetUserId is provided, create for specific user.
    // If not, we might need a way to create global records, 
    // but the current schema requires a userId.
    // For now, let's allow creating for a specific user or finding all users and creating for each.
    
    if (targetUserId) {
      const tax = await db.taxRecord.create({
        data: {
          title,
          dueDate: new Date(dueDate),
          status,
          userId: targetUserId,
        },
      });
      return NextResponse.json(tax);
    } else {
      // Create for ALL users (Global event)
      const users = await db.user.findMany({ where: { isAdmin: false } });
      const creations = users.map(user => 
        db.taxRecord.create({
          data: {
            title,
            dueDate: new Date(dueDate),
            status,
            userId: user.id
          }
        })
      );
      await Promise.all(creations);
      return NextResponse.json({ success: true, count: users.length });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
