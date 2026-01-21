# 🔐 GitHub OAuth Setup Guide

## Quick Overview

This guide will help you set up GitHub OAuth authentication for your application. Users will be able to sign in/sign up using their GitHub accounts.

---

## 📋 Step-by-Step Setup

### Step 1: Go to GitHub Developer Settings

1. **Sign in to GitHub**
   - Go to: https://github.com/

2. **Navigate to Developer Settings**
   - Click your profile picture (top right)
   - Click "Settings"
   - Scroll down to "Developer settings" (bottom of left sidebar)
   - Click "OAuth Apps"

---

### Step 2: Create a New OAuth App

1. **Click "New OAuth App"**
   - Or click "Register a new application"

2. **Fill in Application Details**

   **Application name:**
   ```
   My App (or your app name)
   ```

   **Homepage URL:**
   ```
   http://localhost:3000
   ```

   **Application description:** (Optional)
   ```
   My awesome application
   ```

   **Authorization callback URL:**
   ```
   http://localhost:3000/api/auth/callback/github
   ```

   ⚠️ **IMPORTANT**: The callback URL must be **exactly** this:
   - `http://localhost:3000/api/auth/callback/github`
   - No trailing slash
   - Must include `/api/auth/callback/github`

3. **Click "Register application"**

---

### Step 3: Get Your Credentials

After registering, you'll see your OAuth app details:

1. **Copy Client ID**
   - You'll see "Client ID" displayed
   - Click the copy icon or select and copy it
   - It looks like: `Ov23liABC123XYZ789`

2. **Generate Client Secret**
   - Click "Generate a new client secret"
   - Copy the secret **immediately** (you won't be able to see it again!)
   - It looks like: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t`

---

### Step 4: Update Your .env File

Open your `.env` file and update the GitHub OAuth credentials:

```env
GITHUB_CLIENT_ID=your-actual-client-id
GITHUB_CLIENT_SECRET=your-actual-client-secret
```

**Example:**
```env
GITHUB_CLIENT_ID=Ov23liABC123XYZ789
GITHUB_CLIENT_SECRET=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

---

### Step 5: Restart Your Development Server

Restart your server to load the new environment variables:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing

1. **Open your app**
   - Go to `http://localhost:3000/sign-in`

2. **Click "Sign in with GitHub"**
   - You should be redirected to GitHub's authorization page

3. **Authorize the app**
   - Click "Authorize [your-username]"

4. **Success!**
   - You should be redirected back to your app
   - You should be logged in

---

## 🎯 What Happens Behind the Scenes

1. **User clicks "Sign in with GitHub"**
   - App redirects to GitHub's OAuth page

2. **User authorizes the app**
   - GitHub asks for permission to share email and profile

3. **GitHub redirects back**
   - Sends authorization code to your callback URL

4. **Better Auth handles the rest**
   - Exchanges code for user information
   - Creates or updates user in database
   - Creates session
   - Redirects to home page

---

## 📁 Files Modified

- ✅ `lib/auth.ts` - Added GitHub OAuth provider
- ✅ `.env` - Added GitHub credentials
- ✅ `app/(auth)/sign-in/page.tsx` - Added GitHub sign-in button
- ✅ `app/(auth)/sign-up/page.tsx` - Added GitHub sign-up button

---

## 🔒 Security Best Practices

### For Development
- ✅ Use `http://localhost:3000` for testing
- ✅ Keep credentials in `.env` file (never commit to git)
- ✅ Add `.env` to `.gitignore`

### For Production
1. **Create a New OAuth App for Production**
   - Don't use the same app for dev and production
   - Create a separate OAuth app

2. **Update URLs**
   - Homepage URL: `https://yourdomain.com`
   - Callback URL: `https://yourdomain.com/api/auth/callback/github`

3. **Environment Variables**
   - Set environment variables in your hosting platform
   - Use different credentials for production

4. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Monitor for suspicious activity

---

## 🐛 Troubleshooting

### "The redirect_uri MUST match the registered callback URL"

**Problem**: The callback URL doesn't match what's configured in GitHub.

**Solution**:
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Edit your OAuth app
3. Make sure the callback URL is **exactly**:
   ```
   http://localhost:3000/api/auth/callback/github
   ```
4. Save changes and try again

---

### "Bad verification code"

**Problem**: The authorization code is invalid or expired.

**Solution**:
1. Try the authentication flow again
2. Make sure your system time is correct
3. Check that `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct in `.env`
4. Restart your development server

---

### GitHub Sign-In Button Not Working

**Problem**: Button clicks but nothing happens.

**Solution**:
1. Check browser console for errors
2. Verify `GITHUB_CLIENT_ID` is set in `.env`
3. Restart development server
4. Clear browser cache and cookies

---

### "Application suspended"

**Problem**: Your OAuth app has been suspended by GitHub.

**Solution**:
1. Check your email for notifications from GitHub
2. Review GitHub's terms of service
3. Contact GitHub support if needed

---

## 🌐 Production Deployment

### 1. Create Production OAuth App

1. Go to GitHub Developer Settings
2. Create a **new** OAuth app for production
3. Use production URLs:
   - Homepage: `https://yourdomain.com`
   - Callback: `https://yourdomain.com/api/auth/callback/github`

### 2. Update Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):
```env
GITHUB_CLIENT_ID=your-production-client-id
GITHUB_CLIENT_SECRET=your-production-client-secret
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Test Production

1. Deploy your app
2. Test GitHub sign-in on production
3. Verify users are created in database

---

## 📊 User Data Received from GitHub

When a user signs in with GitHub, you receive:

- ✅ Email address (if public or granted permission)
- ✅ Full name
- ✅ Profile picture URL
- ✅ GitHub username
- ✅ GitHub user ID

This data is automatically stored in your database by Better Auth.

---

## 🔄 OAuth Flow Diagram

```
┌─────────────┐
│  User clicks│
│  "Sign in   │
│  with GitHub"│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Redirect to│
│  GitHub     │
│  OAuth Page │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  User       │
│  authorizes │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  GitHub     │
│  redirects  │
│  to callback│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Better Auth│
│  creates    │
│  session    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  User logged│
│  in! ✓      │
└─────────────┘
```

---

## 📚 Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Better Auth Documentation](https://better-auth.com/)
- [OAuth 2.0 Explained](https://oauth.net/2/)

---

## ✅ Checklist

Before going live, make sure:

- [ ] GitHub OAuth app created
- [ ] Client ID and Secret copied
- [ ] `.env` file updated with credentials
- [ ] Callback URL is correct: `http://localhost:3000/api/auth/callback/github`
- [ ] Development server restarted
- [ ] GitHub sign-in tested and working
- [ ] Production OAuth app created (separate from dev)
- [ ] Production URLs configured
- [ ] Environment variables set in production
- [ ] Production GitHub sign-in tested

---

## 🎨 GitHub Button Features

- ✅ Official GitHub logo
- ✅ Clean, professional styling
- ✅ Consistent with GitHub branding
- ✅ Responsive design
- ✅ Hover effects

---

## 💡 Tips

### Email Privacy
- Some GitHub users have private emails
- GitHub may provide a noreply email instead
- Handle this gracefully in your app

### Scopes
- By default, you get public profile and email
- You can request additional scopes if needed
- See GitHub OAuth scopes documentation

### Rate Limits
- GitHub has rate limits for OAuth
- Monitor your usage
- Implement proper error handling

---

**Need Help?** If you encounter any issues, check the troubleshooting section or refer to the GitHub OAuth documentation.

**Happy Authenticating! 🎉**
