
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (user) {
      console.log("VALID_USER_ID_FOUND: " + user.id);
    } else {
      console.log("NO_USERS_FOUND");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
