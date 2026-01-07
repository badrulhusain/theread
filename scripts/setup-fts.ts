import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('--- Setting up Full-Text Search ---');

  try {
    // 1. Add column if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='search_vector') THEN
          ALTER TABLE blogs ADD COLUMN search_vector tsvector;
        END IF;
      END
      $$;
    `);
    console.log('✓ Column search_vector ensured.');

    // 2. Create index if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS blogs_search_idx ON blogs USING GIN (search_vector);
    `);
    console.log('✓ GIN index ensured.');

    // 3. Create or replace the trigger function
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION blogs_search_trigger() RETURNS trigger AS $$
      BEGIN
        new.search_vector :=
          setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(new.content, '')), 'B');
        return new;
      END
      $$ LANGUAGE plpgsql;
    `);
    console.log('✓ Trigger function created/updated.');

    // 4. Create trigger if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE event_object_table='blogs' AND trigger_name='blogs_search_update') THEN
          CREATE TRIGGER blogs_search_update BEFORE INSERT OR UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION blogs_search_trigger();
        END IF;
      END
      $$;
    `);
    console.log('✓ Trigger ensured.');

    // 5. Update existing records
    await prisma.$executeRawUnsafe(`
      UPDATE blogs SET search_vector = 
        setweight(to_tsvector('english', coalesce(title, '')), 'A') || 
        setweight(to_tsvector('english', coalesce(content, '')), 'B');
    `);
    console.log('✓ Existing records updated with search vectors.');

    console.log('--- Full-Text Search Setup Complete ---');
  } catch (error) {
    console.error('Error setting up FTS:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
