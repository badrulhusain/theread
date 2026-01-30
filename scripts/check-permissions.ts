import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('--- Checking Database Permissions ---');
  try {
    const currentUser = await prisma.$queryRawUnsafe('SELECT current_user');
    console.log('Current User:', currentUser);

    const tableOwner = await prisma.$queryRawUnsafe(`
      SELECT tableowner 
      FROM pg_tables 
      WHERE tablename = 'blogs'
    `);
    console.log('Table Owner:', tableOwner);

    const permissions = await prisma.$queryRawUnsafe(`
      SELECT grantee, privilege_type 
      FROM information_schema.role_table_grants 
      WHERE table_name = 'blogs'
    `);
    console.log('Permissions for "blogs":', permissions);

  } catch (error) {
    console.error('Error checking permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
