# 🔧 Network Connectivity Issues - Troubleshooting Guide

## Issues Detected

You're experiencing two network-related problems:

### 1. ❌ Google Fonts Connection Failure
```
Failed to download `Geist` from Google Fonts
Error while requesting https://fonts.googleapis.com/css2
```

### 2. ❌ Neon Database Connection Timeout
```
Connect Timeout Error
Error connecting to database: TypeError: fetch failed
timeout: 10000ms
```

## Root Cause

These are **network connectivity issues**, not code problems. Possible causes:

1. **Unstable Internet Connection** - Your network connection is dropping or slow
2. **Firewall/Antivirus Blocking** - Security software blocking outbound connections
3. **Proxy/VPN Issues** - Network proxy interfering with connections
4. **Neon Database Sleep Mode** - Free tier databases go to sleep after inactivity
5. **DNS Resolution Issues** - Can't resolve external domain names

## Solutions Applied

### ✅ Fixed Google Fonts Issue
- Removed Google Fonts dependency from `app/layout.tsx`
- Now using system fonts (fallback fonts)
- **Result**: No more font loading errors

### 🔄 Database Connection - Needs Your Action

## Immediate Actions to Take

### Option 1: Wake Up Your Neon Database (Most Likely Fix)

Neon free tier databases automatically sleep after 5 minutes of inactivity.

1. **Open Neon Console**: https://console.neon.tech
2. **Login** with your account
3. **Select your project**: `neondb`
4. **Check database status** - If it says "Sleeping" or "Idle":
   - Click on the database
   - It should automatically wake up
5. **Wait 30 seconds** for it to fully wake
6. **Refresh your app**: http://localhost:3000

### Option 2: Check Your Internet Connection

1. **Test basic connectivity**:
   ```powershell
   ping google.com
   ping fonts.googleapis.com
   ```

2. **Test Neon endpoint**:
   ```powershell
   ping ep-damp-term-ahde44qc-pooler.c-3.us-east-1.aws.neon.tech
   ```

3. **Check if you can access**:
   - https://fonts.googleapis.com (should load)
   - https://console.neon.tech (should load)

### Option 3: Disable Firewall/Antivirus Temporarily

1. **Windows Firewall**:
   - Open Windows Security
   - Firewall & network protection
   - Temporarily disable (for testing)
   - Try accessing your app again

2. **Antivirus Software**:
   - Temporarily disable
   - Test the connection
   - Re-enable after testing

### Option 4: Check VPN/Proxy Settings

If you're using a VPN or proxy:
1. Disconnect from VPN
2. Clear proxy settings
3. Try again

### Option 5: Increase Database Timeout

If your connection is just slow (not blocked), increase the timeout:

**Edit `lib/db.ts`**:
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

import * as schema from "./schema";

// Increase fetch timeout for slow connections
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    // Increase timeout to 30 seconds
    timeout: 30000,
  },
});

export const db = drizzle(sql, { schema });
```

## Testing Your Connection

### Test 1: Run the connection test script
```bash
npx tsx scripts/test-db-connection.ts
```

**Expected output if working**:
```
✅ Connection successful!
✅ Account table accessible
✅ Session table accessible
✅ User table accessible
```

### Test 2: Try accessing your app
```bash
npm run dev
```

Then open: http://localhost:3000

## Common Error Messages & Solutions

### "Connect Timeout Error"
- **Cause**: Database is sleeping or network is slow
- **Fix**: Wake database from Neon console OR increase timeout

### "TypeError: fetch failed"
- **Cause**: Network connection dropped
- **Fix**: Check internet connection, restart router

### "Failed to download fonts"
- **Cause**: Can't reach fonts.googleapis.com
- **Fix**: ✅ Already fixed by removing Google Fonts

## Verification Steps

After trying the solutions above:

1. ✅ **Fonts issue**: Should be resolved (we removed Google Fonts)

2. 🔄 **Database issue**: 
   - Wake your Neon database
   - Wait 30 seconds
   - Refresh your app
   - Should work!

## Still Having Issues?

### Check Neon Dashboard
1. Go to: https://console.neon.tech
2. Check if your database is:
   - ✅ Active (green)
   - ⚠️ Sleeping (yellow) - Click to wake
   - ❌ Suspended (red) - May need to upgrade plan

### Alternative: Use a Different Network
- Try mobile hotspot
- Try different WiFi network
- This helps identify if it's your network

### Contact Neon Support
If database won't wake or connect:
- Check Neon status: https://neon.tech/status
- Contact support: https://neon.tech/docs/introduction/support

## Quick Fix Summary

**Most likely solution** (90% of cases):

1. Open https://console.neon.tech
2. Click on your database project
3. Wait for it to wake up (30 seconds)
4. Refresh http://localhost:3000
5. Should work! ✅

---

**Next Steps**: Try the solutions above and let me know which one works!
