import postgres from 'postgres';
import fs from 'fs';

const sql = postgres(process.env.DATABASE_URL);

async function runMigration() {
  try {
    const migration = fs.readFileSync('./drizzle/user-notifications-migration.sql', 'utf8');
    console.log('Running migration...');
    await sql.unsafe(migration);
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
