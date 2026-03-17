import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const userCount = await prisma.user.count()
  console.log(`Connection successful! Total users in main DB: ${userCount}`)
  
  const users = await prisma.user.findMany({ take: 5 })
  console.log('Sample users:', users.map(u => ({ id: u.id, name: u.name, phone: u.phone })))
}

main()
  .catch((e) => {
    console.error('Connection failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
