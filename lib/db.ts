import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

import * as schema from "./schema";

// Configure Neon with increased timeout for slow/unstable connections
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    // Increase timeout to 30 seconds to handle slow connections
    // and database wake-up time (Neon free tier sleeps after 5 min inactivity)
    cache: 'no-store',
  },
});

export const db = drizzle(sql, { schema });
