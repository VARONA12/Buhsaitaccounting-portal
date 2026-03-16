import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const phone = "9214026061";
  const password = "ADMIN_ELITE_2024";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { phone },
    data: { 
      password: hashedPassword,
      isAdmin: true 
    },
  });

  console.log(`Success! Fixed Admin access for: ${user.name}`);
  console.log(`Phone: ${phone}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
