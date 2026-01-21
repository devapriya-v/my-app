# 🚀 GitHub OAuth - Quick Reference

## Environment Variables Needed

Add these to your `.env` file:

```env
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 🎯 Quick Setup (3 Minutes)

### 1. Create GitHub OAuth App
- Go to: https://github.com/settings/developers
- Click "OAuth Apps" → "New OAuth App"
- Fill in details:
  - **App name**: My App
  - **Homepage URL**: `http://localhost:3000`
  - **Callback URL**: `http://localhost:3000/api/auth/callback/github`
- Click "Register application"

### 2. Copy Credentials
- Copy **Client ID**
- Click "Generate a new client secret"
- Copy **Client Secret** (save it now, you can't see it again!)

### 3. Update .env File
```env
GITHUB_CLIENT_ID=Ov23liABC123XYZ789
GITHUB_CLIENT_SECRET=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

### 4. Restart Server
```bash
npm run dev
```

### 5. Test It!
- Go to `/sign-in`
- Click "Sign in with GitHub"
- Authorize the app
- ✅ You're in!

---

## 📍 Important URLs

### Development
- **Homepage URL**: `http://localhost:3000`
- **Callback URL**: `http://localhost:3000/api/auth/callback/github`

### Production (Create separate OAuth app)
- **Homepage URL**: `https://yourdomain.com`
- **Callback URL**: `https://yourdomain.com/api/auth/callback/github`

---

## 🔧 Common Issues

### "redirect_uri mismatch"
✅ Callback URL must be exactly: `http://localhost:3000/api/auth/callback/github`

### "Bad verification code"
✅ Check Client ID and Secret in `.env`, restart server

### Button not working
✅ Restart development server after updating `.env`

---

## 📚 Full Guide

For detailed instructions, see: `GITHUB_OAUTH_SETUP.md`

---

## ✨ What You Get

When users sign in with GitHub:
- ✅ Email address
- ✅ Full name
- ✅ Profile picture
- ✅ GitHub username
- ✅ Auto-created account
- ✅ Instant authentication

---

## 🔗 Quick Links

- **Create OAuth App**: https://github.com/settings/developers
- **GitHub OAuth Docs**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Your OAuth Apps**: https://github.com/settings/developers

---

**That's it! GitHub OAuth is ready to use! 🎉**
