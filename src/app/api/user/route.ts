import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      loginSessions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    }
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { 
    name, 
    company, 
    birthDate, 
    phone,
    password,
    inn, 
    legalAddress, 
    taxSystem, 
    lastMonthProfit, 
    notifEmail, 
    notifSms, 
    notifTelegram 
  } = body;

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (company !== undefined) data.company = company;
  if (birthDate !== undefined) data.birthDate = birthDate;
  if (phone !== undefined) data.phone = phone;
  if (inn !== undefined) data.inn = inn;
  if (legalAddress !== undefined) data.legalAddress = legalAddress;
  if (taxSystem !== undefined) data.taxSystem = taxSystem;
  if (lastMonthProfit !== undefined) data.lastMonthProfit = lastMonthProfit;
  if (notifEmail !== undefined) data.notifEmail = notifEmail;
  if (notifSms !== undefined) data.notifSms = notifSms;
  if (notifTelegram !== undefined) data.notifTelegram = notifTelegram;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;
  }

  const updatedUser = await db.user.update({
    where: { id: (session.user as any).id },
    data: data
  });

  return NextResponse.json(updatedUser);
}
