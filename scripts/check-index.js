const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking for Search Index ---');
  try {
    const result = await prisma.$queryRaw`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'blogs' AND indexname = 'blogs_search_idx';
    `;
    console.log('Index check result:', result);
    
    if (result.length > 0) {
      console.log('SUCCESS: The GIN search index exists.');
    } else {
      console.log('FAILURE: The GIN search index does not exist yet.');
    }
  } catch (error) {
    console.error('Check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
