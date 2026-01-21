import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function wakeDatabase() {
  console.log('🔄 Waking up Neon database...\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL, {
    fetchOptions: {
      cache: 'no-store',
    },
  });
  
  console.log('Sending wake-up query to database...');
  console.log('(This may take 10-30 seconds if database is sleeping)\n');
  
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    attempt++;
    console.log(`Attempt ${attempt}/${maxRetries}...`);
    
    try {
      const startTime = Date.now();
      
      // Simple query to wake up the database
      const result = await sql`SELECT 1 as wake_up, NOW() as current_time`;
      
      const duration = Date.now() - startTime;
      
      console.log(`\n✅ Database is awake! (Response time: ${duration}ms)`);
      console.log(`   Server time: ${result[0].current_time}`);
      
      // Test all tables
      console.log('\n📊 Testing tables...');
      const userCount = await sql`SELECT COUNT(*) as count FROM "user"`;
      const sessionCount = await sql`SELECT COUNT(*) as count FROM "session"`;
      const accountCount = await sql`SELECT COUNT(*) as count FROM "account"`;
      
      console.log(`   Users: ${userCount[0].count}`);
      console.log(`   Sessions: ${sessionCount[0].count}`);
      console.log(`   Accounts: ${accountCount[0].count}`);
      
      console.log('\n🎉 Database is fully operational!');
      console.log('You can now use your app at: http://localhost:3000\n');
      
      process.exit(0);
      
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        console.log(`   Retrying in 5 seconds...\n`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('\n❌ Failed to wake database after 3 attempts.');
        console.error('\n🔍 Troubleshooting:');
        console.error('   1. Check your internet connection');
        console.error('   2. Open Neon Console: https://console.neon.tech');
        console.error('   3. Verify your database is not suspended');
        console.error('   4. Check DATABASE_URL in .env is correct');
        console.error('\nSee NETWORK_TROUBLESHOOTING.md for more help.\n');
        process.exit(1);
      }
    }
  }
}

wakeDatabase();
