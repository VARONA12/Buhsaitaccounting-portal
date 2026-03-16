import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const phone = process.argv[2];
  if (!phone) {
    console.error("Please provide a phone number");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    console.error("User not found");
    process.exit(1);
  }

  await prisma.user.update({
    where: { phone },
    data: { isAdmin: true },
  });

  console.log(`User ${phone} is now an admin`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
