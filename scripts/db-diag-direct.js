const { Client } = require('pg');
require('dotenv').config();

// Extract direct URL if it exists, otherwise use DATABASE_URL
// Note: Prisma Accelerate URLs (prisma+postgres://) won't work with 'pg'
let url = process.env.DATABASE_URL;

if (url.startsWith('prisma+')) {
    console.error('Error: DATABASE_URL is a Prisma Accelerate URL. Please provide a direct PostgreSQL URL (postgres://...) in an environment variable (e.g., DIRECT_URL) to run this diagnostic.');
    process.exit(1);
}

const client = new Client({
  connectionString: url,
});

async function main() {
  console.log('--- Direct Database Diagnostic ---');
  try {
    await client.connect();
    
    const currentUserRes = await client.query('SELECT current_user');
    console.log('Current User:', currentUserRes.rows[0].current_user);

    const tableOwnerRes = await client.query(`
      SELECT tableowner 
      FROM pg_tables 
      WHERE tablename = 'blogs'
    `);
    
    if (tableOwnerRes.rows.length > 0) {
        console.log('Table Owner (blogs):', tableOwnerRes.rows[0].tableowner);
    } else {
        console.log('Table "blogs" not found in pg_tables.');
    }

    const sessionsRes = await client.query('SELECT session_user, current_user');
    console.log('Session Info:', sessionsRes.rows[0]);

  } catch (error) {
    console.error('Error during diagnostic:', error);
  } finally {
    await client.end();
  }
}

main();
