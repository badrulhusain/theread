const { PrismaClient } = require('@prisma/client');

// Import the configuration we use in the main app to ensure consistency
// Note: transforming imports might be tricky without ts-node, so we'll mock the config here for the script
// effectively doing what lib/prisma.ts does but in CommonJS

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

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
