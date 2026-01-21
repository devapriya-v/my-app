import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

async function verifySchema() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Get all columns in the account table
    console.log('\n📋 Account table schema:');
    const result = await pool.query(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns 
       WHERE table_name = 'account'
       ORDER BY ordinal_position`
    );
    
    console.table(result.rows);
    
    // Check specifically for idToken
    const idTokenColumn = result.rows.find(row => row.column_name === 'idToken');
    if (idTokenColumn) {
      console.log('\n✅ idToken column exists!');
      console.log('   Type:', idTokenColumn.data_type);
      console.log('   Nullable:', idTokenColumn.is_nullable);
    } else {
      console.log('\n❌ idToken column NOT found!');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifySchema();
