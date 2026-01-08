const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Quick Ping ---');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ping`;
    console.log('Ping result:', result);
  } catch (error) {
    console.error('Ping failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
