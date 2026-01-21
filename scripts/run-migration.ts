import { Pool, neonConfig } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import ws from 'ws';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;


async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'db', 'add_idtoken_migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('📝 Running migration: add_idtoken_migration.sql');
    console.log('Migration SQL:', migrationSQL);
    
    // Execute the migration
    const client = await pool.connect();
    try {
      await client.query(migrationSQL);
      console.log('✅ Migration completed successfully!');
    } finally {
      client.release();
    }
    
    // Verify the column was added
    console.log('\n🔍 Verifying column exists...');
    const result = await pool.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'account' 
       AND column_name = 'idToken'`
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Column "idToken" verified in account table');
      console.log('Column details:', result.rows[0]);
    } else {
      console.log('⚠️  Warning: Could not verify column was added');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    // Check if column already exists
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('ℹ️  Column already exists, migration skipped');
    } else {
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

runMigration();

