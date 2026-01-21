# Google OAuth idToken Column Fix

## Problem
The Better Auth library was unable to query the database because the `idToken` column was missing from the `account` table:

```
Error: Failed query: select "id", "userId", "accountId", "providerId", "accessToken", "refreshToken", "idToken", ...
Error [NeonDbError]: column "idToken" does not exist
```

## Root Cause
The Drizzle schema in `lib/schema.ts` included the `idToken` field, but the database migration to add this column had not been run on the actual Neon database.

## Solution Applied

### 1. Created Migration Script
Created `scripts/run-migration.ts` that:
- Loads environment variables from `.env`
- Connects to the Neon database using Pool
- Executes the SQL migration from `db/add_idtoken_migration.sql`
- Verifies the column was added successfully

### 2. Installed Dependencies
Installed required packages:
```bash
npm install ws @types/ws
```

### 3. Ran Migration
Executed the migration using:
```bash
npm run db:migrate
```

This added the `idToken` column to the `account` table in your Neon database.

## What Changed

### Database Schema
The `account` table now includes:
- `idToken` (text, nullable) - Stores the ID token from OAuth providers like Google

### Files Modified/Created
1. **scripts/run-migration.ts** (new) - Migration runner script
2. **package.json** - Already had `db:migrate` script defined

## Testing
After the migration, your Google OAuth should work correctly. The error about the missing `idToken` column should no longer appear.

## Next Steps
If you encounter the same error again:
1. Check that the migration was successful by running: `npm run db:migrate`
2. Verify the column exists in your database
3. Restart your dev server if needed

## Additional Notes
- The migration is idempotent - running it multiple times won't cause issues
- The `idToken` field is used by OAuth providers (Google, GitHub, etc.) to store identity tokens
- This is a standard field required by Better Auth for OAuth authentication
