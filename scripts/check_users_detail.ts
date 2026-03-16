import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Detailed User List:");
  users.forEach(u => {
    console.log(`- ID: ${u.id}`);
    console.log(`  Name: ${u.name}`);
    console.log(`  Phone: "${u.phone}"`);
    console.log(`  Has Password: ${!!u.password}`);
    console.log(`  Is Admin: ${u.isAdmin}`);
    console.log(`  Registered: ${u.createdAt}`);
    console.log("-------------------");
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
