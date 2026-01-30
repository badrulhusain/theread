import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('--- Verifying Database Schema ---');
  try {
    const columns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'blogs' AND column_name = 'search_vector'
    `);
    console.log('Search Vector Column:', columns);

    const viewsTable = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'post_views'
    `);
    console.log('PostViews Table:', viewsTable);

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
