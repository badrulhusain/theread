const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('Testing connection (JS)...');
  try {
    const result = await prisma.$queryRawUnsafe('SELECT 1 as connected');
    console.log('Connection successful:', result);
    
    // Check if post_views exists
    const tables = await prisma.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', tables);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(err => console.error('Unhandled:', err));
