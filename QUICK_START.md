# 🚀 Quick Start - OTP Authentication

## ⚡ 3-Minute Setup

### 1. Get Gmail App Password (2 minutes)

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Scroll to **App passwords** → Click it
4. Select **Mail** and your device
5. Copy the 16-character password (looks like: `xxxx xxxx xxxx xxxx`)

### 2. Update .env File (30 seconds)

Open `.env` and replace these lines:

```env
EMAIL_USER=your-email@gmail.com          # ← Your Gmail address
EMAIL_PASSWORD=your-app-password         # ← The 16-char password from step 1
EMAIL_FROM=your-email@gmail.com          # ← Same as EMAIL_USER
```

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=john.doe@gmail.com
```

### 3. Test It! (30 seconds)

```bash
npm run dev
```

Then:
1. Open http://localhost:3000/sign-in
2. Click **"Login with Code"**
3. Enter your email
4. Check your inbox for the OTP
5. Enter the 6-digit code
6. ✅ You're in!

---

## 🎯 That's It!

You now have a working OTP authentication system!

## 📱 Where to Find the Feature

The "Login with Code" button appears on:
- `/sign-in` page
- `/sign-up` page
- Direct access: `/otp-login`

## 🔍 What Happens Behind the Scenes

1. **User enters email** → System generates random 6-digit OTP
2. **OTP stored** → In memory with 10-minute expiration
3. **Email sent** → Via nodemailer using your Gmail
4. **User enters OTP** → System verifies it matches
5. **Success!** → User is authenticated (auto-created if new)

## 💡 Pro Tips

### For Testing
- Use your own email address
- Check spam folder if email doesn't arrive
- OTP expires in 10 minutes
- You can click "Resend Code" to get a new one

### For Production
- Switch from in-memory to Redis (see OTP_SETUP.md)
- Add rate limiting (prevent spam)
- Consider using SendGrid or AWS SES for better deliverability

## 🐛 Troubleshooting

### "Failed to send OTP"
- ✅ Check your Gmail App Password is correct
- ✅ Make sure 2FA is enabled on your Google account
- ✅ Check the server console for detailed errors

### Email Not Arriving
- ✅ Check spam/junk folder
- ✅ Wait 1-2 minutes (sometimes delayed)
- ✅ Verify EMAIL_USER and EMAIL_FROM are the same

### Invalid OTP Error
- ✅ Make sure you're entering all 6 digits
- ✅ Check if OTP expired (10-minute limit)
- ✅ Request a new code with "Resend Code"

## 📚 Need More Help?

- **Detailed Setup**: See `OTP_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Gmail Help**: https://support.google.com/accounts/answer/185833

---

**Happy Coding! 🎉**
