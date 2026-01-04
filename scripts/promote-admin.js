const { PrismaClient } = require('@prisma/client');
require('dotenv').config();  // Add this if using .env file

const prisma = new PrismaClient();  // No datasources needed

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address as an argument.');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { role: 'ADMIN' },
    });
    console.log(`Success! User ${user.email} is now an ADMIN.`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
