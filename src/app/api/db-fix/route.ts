import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const results: any[] = [];
  
  const queries = [
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "inn" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "taxSystem" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastMonthProfit" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "legalAddress" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "birthDate" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT 'Базовый';`
  ];

  for (const query of queries) {
    try {
      await db.$executeRawUnsafe(query);
      results.push({ query, status: "SUCCESS" });
    } catch (e: any) {
      results.push({ query, status: "ERROR", error: e.message });
    }
  }

  // Check current columns
  try {
    const columns = await db.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `);
    results.push({ info: "Current columns", columns });
  } catch (e: any) {
    results.push({ info: "Failed to check columns", error: e.message });
  }

  return NextResponse.json({ 
    message: "Database fix attempt completed",
    results 
  });
}
