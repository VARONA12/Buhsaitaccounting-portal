import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Existing users:");
  users.forEach(u => console.log(`- ${u.phone} (${u.name})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
