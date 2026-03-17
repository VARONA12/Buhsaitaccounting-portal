import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const counts = {
    users: await prisma.user.count(),
    documents: await prisma.document.count(),
    invoices: await prisma.invoice.count(),
    messages: await prisma.message.count(),
    notifications: await prisma.notification.count(),
    taxRecords: await prisma.taxRecord.count()
  }
  console.log('--- RECAP COUNTS ---')
  console.log(counts)
}

main().finally(() => prisma.$disconnect())
