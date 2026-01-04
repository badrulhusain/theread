import { db } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "author@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.upsert({
    where: { email },
    update: {
      role: "AUTHOR",
    },
    create: {
      email,
      name: "Test Author",
      password: hashedPassword,
      role: "AUTHOR",
    },
  });

  console.log("User created/updated:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
