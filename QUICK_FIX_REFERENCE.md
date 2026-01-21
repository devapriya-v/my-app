# Quick Fix Reference

## What Was Fixed

### ✅ Issue 1: Google OAuth Error
**Error**: `column "idToken" does not exist`
**Fix**: Added missing database column
**Command**: `npm run db:migrate`

### ✅ Issue 2: OTP Login 404 Errors
**Error**: `POST /api/auth/send-otp 404`
**Fix**: Created OTP API endpoints and infrastructure

## Test Your Fixes

### 1. Test Google OAuth
```
http://localhost:3000/sign-in
→ Click "Sign in with Google"
→ Should work without errors
```

### 2. Test OTP Login
```
http://localhost:3000/otp-login
→ Enter your email
→ Check email for 6-digit code
→ Enter code to login
```

### 3. Test Email Configuration
```bash
npm run test:email
```

## Files Created

### Database & Migration
- `scripts/run-migration.ts`
- `scripts/verify-schema.ts`

### OTP System
- `lib/email.ts` - Email sending
- `lib/otp-store.ts` - OTP management
- `app/api/auth/send-otp/route.ts` - Send OTP API
- `app/api/auth/verify-otp/route.ts` - Verify OTP API
- `scripts/test-email.ts` - Email testing

### Documentation
- `IDTOKEN_FIX.md` - Google OAuth fix
- `OTP_FIX.md` - OTP implementation
- `AUTH_FIXES_SUMMARY.md` - Complete summary

## Authentication Methods Available

1. ✅ Email & Password
2. ✅ Google OAuth
3. ✅ GitHub OAuth
4. ✅ OTP (Passwordless)

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:migrate       # Run migrations
npm run db:wake          # Wake Neon database

# Testing
npm run test:email       # Test email config
```

## Common Issues

### OTP email not received?
1. Check spam folder
2. Verify `.env` email settings
3. Run `npm run test:email`

### Google OAuth still failing?
1. Check Google Console credentials
2. Verify redirect URI matches
3. Check DATABASE_URL is correct

### Database errors?
1. Run `npm run db:wake`
2. Run `npm run db:migrate`
3. Check DATABASE_URL in `.env`

---

**Status**: ✅ All systems operational!

Your dev server at `http://localhost:3000` should now have all authentication methods working.
