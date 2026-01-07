const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Finding Current Database User ---');
  try {
    const result = await prisma.$queryRaw`SELECT current_user`;
    console.log('Your Database User is:', result[0].current_user);
    console.log('\n--- SQL Command to Run ---');
    console.log(`ALTER TABLE blogs OWNER TO "${result[0].current_user}";`);
    console.log('ALTER TABLE categories OWNER TO "' + result[0].current_user + '";');
    console.log('ALTER TABLE tags OWNER TO "' + result[0].current_user + '";');
  } catch (error) {
    console.error('Error fetching user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
