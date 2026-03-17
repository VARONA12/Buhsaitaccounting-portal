import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create an admin user if not exists
  const admin = await prisma.user.upsert({
    where: { phone: '80000000000' },
    update: {},
    create: {
      phone: '80000000000',
      name: 'Администратор',
      company: 'ЭлитФинанс',
      plan: 'Премиум',
      isAdmin: true,
      password: 'admin', // In real app use hash
    },
  })

  // Create some dummy clients
  const client1 = await prisma.user.upsert({
    where: { phone: '1234567890' },
    update: {},
    create: {
      phone: '1234567890',
      name: 'Иван Иванов',
      company: 'ООО Ромашка',
      inn: '7700112233',
      taxSystem: 'УСН',
      documents: {
        create: [
          { name: 'Устав компании', status: 'Одобрено' },
          { name: 'Договор аренды', status: 'На проверке' },
        ]
      },
      invoices: {
        create: [
          { number: 'INV-001', client: 'ООО Ромашка', amount: '15000', status: 'Ожидание', dueDate: new Date('2026-04-01') },
        ]
      }
    },
  })

  console.log({ admin, client1 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
