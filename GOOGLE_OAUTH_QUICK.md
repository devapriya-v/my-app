# 🚀 Google OAuth - Quick Reference

## Environment Variables Needed

Add these to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🎯 Quick Setup (5 Minutes)

### 1. Create Google Cloud Project
- Go to: https://console.cloud.google.com/
- Create new project
- Enable Google+ API

### 2. Configure OAuth Consent Screen
- Go to "OAuth consent screen"
- Choose "External"
- Fill in app name and email
- Add scopes: `userinfo.email`, `userinfo.profile`
- Add yourself as test user

### 3. Create OAuth Credentials
- Go to "Credentials"
- Create "OAuth client ID"
- Type: "Web application"
- **Authorized JavaScript origins:**
  ```
  http://localhost:3000
  ```
- **Authorized redirect URIs:**
  ```
  http://localhost:3000/api/auth/callback/google
  ```

### 4. Copy Credentials
- Copy **Client ID**
- Copy **Client Secret**
- Paste into `.env` file

### 5. Restart Server
```bash
npm run dev
```

### 6. Test It!
- Go to `/sign-in`
- Click "Sign in with Google"
- Authorize the app
- ✅ You're in!

---

## 📍 Important URLs

### Development
- **JavaScript Origin**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3000/api/auth/callback/google`

### Production (Update these in Google Cloud Console)
- **JavaScript Origin**: `https://yourdomain.com`
- **Redirect URI**: `https://yourdomain.com/api/auth/callback/google`

---

## 🔧 Common Issues

### "redirect_uri_mismatch"
✅ Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

### "invalid_client"
✅ Check `.env` file for correct Client ID and Secret

### Button not working
✅ Restart development server after updating `.env`

---

## 📚 Full Guide

For detailed instructions, see: `GOOGLE_OAUTH_SETUP.md`

---

## ✨ What You Get

When users sign in with Google:
- ✅ Email address
- ✅ Full name
- ✅ Profile picture
- ✅ Auto-created account
- ✅ Instant authentication

---

**That's it! Google OAuth is ready to use! 🎉**
