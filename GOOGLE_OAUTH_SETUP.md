# 🔐 Google OAuth Setup Guide

## Quick Overview

This guide will help you set up Google OAuth authentication for your application. Users will be able to sign in/sign up using their Google accounts.

---

## 📋 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter a project name (e.g., "My App Auth")
   - Click "Create"

3. **Select Your Project**
   - Make sure your new project is selected in the dropdown

---

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"

2. **Search for Google+ API**
   - In the search bar, type "Google+ API"
   - Click on "Google+ API"
   - Click "Enable"

---

### Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - In the left sidebar, click "OAuth consent screen"

2. **Choose User Type**
   - Select "External" (unless you have a Google Workspace)
   - Click "Create"

3. **Fill in App Information**
   - **App name**: Your app name (e.g., "My App")
   - **User support email**: Your email address
   - **Developer contact email**: Your email address
   - Click "Save and Continue"

4. **Scopes** (Step 2)
   - Click "Add or Remove Scopes"
   - Select these scopes:
     - `userinfo.email`
     - `userinfo.profile`
   - Click "Update"
   - Click "Save and Continue"

5. **Test Users** (Step 3)
   - Add your email address as a test user
   - Click "Save and Continue"

6. **Summary** (Step 4)
   - Review your settings
   - Click "Back to Dashboard"

---

### Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - In the left sidebar, click "Credentials"

2. **Create Credentials**
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "OAuth client ID"

3. **Configure OAuth Client**
   - **Application type**: Select "Web application"
   - **Name**: Enter a name (e.g., "My App Web Client")

4. **Add Authorized JavaScript Origins**
   - Click "+ Add URI" under "Authorized JavaScript origins"
   - Add these URIs:
     ```
     http://localhost:3000
     ```
   - For production, also add:
     ```
     https://yourdomain.com
     ```

5. **Add Authorized Redirect URIs**
   - Click "+ Add URI" under "Authorized redirect URIs"
   - Add these URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - For production, also add:
     ```
     https://yourdomain.com/api/auth/callback/google
     ```

6. **Create**
   - Click "Create"
   - A popup will appear with your credentials

7. **Copy Your Credentials**
   - **Client ID**: Copy this (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Client Secret**: Copy this (looks like: `GOCSPX-abc123xyz789`)
   - Click "OK"

---

### Step 5: Update Your .env File

Open your `.env` file and update the Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz789def456
```

---

### Step 6: Restart Your Development Server

If your server is already running, restart it to load the new environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

---

## 🧪 Testing

1. **Open your app**
   - Go to `http://localhost:3000/sign-in`

2. **Click "Sign in with Google"**
   - You should be redirected to Google's login page

3. **Sign in with Google**
   - Use your Google account
   - Grant permissions when asked

4. **Success!**
   - You should be redirected back to your app
   - You should be logged in

---

## 🎯 What Happens Behind the Scenes

1. **User clicks "Sign in with Google"**
   - App redirects to Google's OAuth page

2. **User authorizes the app**
   - Google asks for permission to share email and profile

3. **Google redirects back**
   - Sends authorization code to your callback URL

4. **Better Auth handles the rest**
   - Exchanges code for user information
   - Creates or updates user in database
   - Creates session
   - Redirects to home page

---

## 📁 Files Modified

- ✅ `lib/auth.ts` - Added Google OAuth provider
- ✅ `.env` - Added Google credentials
- ✅ `app/(auth)/sign-in/page.tsx` - Added Google sign-in button
- ✅ `app/(auth)/sign-up/page.tsx` - Added Google sign-up button

---

## 🔒 Security Best Practices

### For Development
- ✅ Use `http://localhost:3000` for testing
- ✅ Keep credentials in `.env` file (never commit to git)
- ✅ Add `.env` to `.gitignore`

### For Production
1. **Update Authorized URIs**
   - Add your production domain to authorized origins
   - Add production callback URL

2. **Environment Variables**
   - Set environment variables in your hosting platform
   - Never expose credentials in client-side code

3. **OAuth Consent Screen**
   - Submit for verification if needed
   - Update privacy policy and terms of service links

4. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Monitor for suspicious activity

---

## 🐛 Troubleshooting

### "Error 400: redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Make sure this URI is added:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Save and try again

---

### "Error 401: invalid_client"

**Problem**: Client ID or Client Secret is incorrect.

**Solution**:
1. Double-check your `.env` file
2. Make sure there are no extra spaces
3. Verify the credentials in Google Cloud Console
4. Restart your development server

---

### "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen not configured properly.

**Solution**:
1. Go to Google Cloud Console → OAuth consent screen
2. Make sure you've added required scopes
3. Add your email as a test user
4. Save changes and try again

---

### Google Sign-In Button Not Working

**Problem**: Button clicks but nothing happens.

**Solution**:
1. Check browser console for errors
2. Verify `GOOGLE_CLIENT_ID` is set in `.env`
3. Restart development server
4. Clear browser cache and cookies

---

## 🌐 Production Deployment

### 1. Update Google Cloud Console

Add your production URLs:

**Authorized JavaScript origins:**
```
https://yourdomain.com
```

**Authorized redirect URIs:**
```
https://yourdomain.com/api/auth/callback/google
```

### 2. Update Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Verify OAuth Consent Screen

If your app will be used by users outside your organization:
1. Submit your app for verification
2. Add privacy policy URL
3. Add terms of service URL
4. Wait for Google's approval (can take a few days)

---

## 📊 User Data Received from Google

When a user signs in with Google, you receive:

- ✅ Email address
- ✅ Full name
- ✅ Profile picture URL
- ✅ Google user ID

This data is automatically stored in your database by Better Auth.

---

## 🔄 OAuth Flow Diagram

```
┌─────────────┐
│  User clicks│
│  "Sign in   │
│  with Google"│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Redirect to│
│  Google     │
│  OAuth Page │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  User grants│
│  permission │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Google     │
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

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Better Auth Documentation](https://better-auth.com/)
- [OAuth 2.0 Explained](https://oauth.net/2/)

---

## ✅ Checklist

Before going live, make sure:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Authorized URIs added (development and production)
- [ ] `.env` file updated with credentials
- [ ] Development server restarted
- [ ] Google sign-in tested and working
- [ ] Production URLs added to Google Cloud Console
- [ ] Environment variables set in production
- [ ] OAuth consent screen submitted for verification (if needed)

---

**Need Help?** If you encounter any issues, check the troubleshooting section or refer to the Google OAuth documentation.

**Happy Authenticating! 🎉**
