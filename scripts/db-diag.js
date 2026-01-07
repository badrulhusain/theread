const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Diagnostic ---');
  try {
    const currentUser = await prisma.$queryRaw`SELECT current_user`;
    console.log('Current User:', currentUser);

    const tableOwner = await prisma.$queryRaw`
      SELECT tableowner 
      FROM pg_tables 
      WHERE tablename = 'blogs'
    `;
    console.log('Table Owner (blogs):', tableOwner);

    const sessions = await prisma.$queryRaw`SELECT session_user, current_user`;
    console.log('Session Info:', sessions);

  } catch (error) {
    console.error('Error during diagnostic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
