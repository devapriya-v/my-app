import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function testConnection() {
  console.log('Testing Neon Database Connection...\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not defined in .env file');
    process.exit(1);
  }

  console.log('Database URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('\n1. Testing basic connection...');
    const startTime = Date.now();
    
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Connection successful! (${duration}ms)`);
    console.log(`   PostgreSQL Version: ${result[0].pg_version.split(' ')[0]} ${result[0].pg_version.split(' ')[1]}`);
    console.log(`   Server Time: ${result[0].current_time}`);
    
    console.log('\n2. Testing account table...');
    const accountTest = await sql`SELECT COUNT(*) as count FROM "account"`;
    console.log(`✅ Account table accessible. Records: ${accountTest[0].count}`);
    
    console.log('\n3. Testing session table...');
    const sessionTest = await sql`SELECT COUNT(*) as count FROM "session"`;
    console.log(`✅ Session table accessible. Records: ${sessionTest[0].count}`);
    
    console.log('\n4. Testing user table...');
    const userTest = await sql`SELECT COUNT(*) as count FROM "user"`;
    console.log(`✅ User table accessible. Records: ${userTest[0].count}`);
    
    console.log('\n✅ All database tests passed!');
    console.log('Your database connection is working correctly.\n');
    
  } catch (error: any) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Connect Timeout')) {
      console.error('\n🔍 Troubleshooting:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify the DATABASE_URL in your .env file');
      console.error('   3. Check if your firewall is blocking the connection');
      console.error('   4. Try accessing Neon dashboard: https://console.neon.tech');
      console.error('   5. Your Neon database might be in sleep mode - try waking it up from the dashboard');
    }
    
    process.exit(1);
  }
}

testConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
