# OTP Email Authentication Setup

This guide will help you configure the OTP (One-Time Password) email authentication feature.

## Features

- **Login with Code**: Users can authenticate using a 6-digit OTP sent to their email
- **No password required**: Passwordless authentication option
- **Auto-registration**: New users are automatically created when they verify their OTP
- **Secure**: OTPs expire after 10 minutes
- **User-friendly**: Clean UI with email and OTP verification steps

## Email Configuration

### Using Gmail

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification"
   - Scroll down to "App passwords"
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update your `.env` file**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### Using Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
```

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=your-verified-sender@yourdomain.com
```

#### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=your-verified-email@yourdomain.com
```

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/sign-in`

3. Click the **"Login with Code"** button

4. Enter your email address

5. Check your email for the 6-digit OTP

6. Enter the OTP to complete authentication

## How It Works

### Flow Diagram

```
User enters email → OTP generated → Email sent → User enters OTP → Verified → Authenticated
```

### Technical Details

1. **OTP Generation**: Random 6-digit code generated server-side
2. **Storage**: OTPs stored in-memory with 10-minute expiration (use Redis for production)
3. **Email Delivery**: Sent via nodemailer using configured SMTP settings
4. **User Creation**: New users automatically created on successful OTP verification
5. **Session Management**: Integrated with Better Auth session system

## Production Considerations

### 1. Use Redis for OTP Storage

Replace the in-memory storage in `lib/otp-store.ts` with Redis:

```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function storeOTP(email: string, otp: string): Promise<void> {
    await redis.setex(`otp:${email.toLowerCase()}`, 600, otp); // 10 minutes
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = await redis.get(`otp:${email.toLowerCase()}`);
    if (storedOTP === otp) {
        await redis.del(`otp:${email.toLowerCase()}`);
        return true;
    }
    return false;
}
```

### 2. Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// In send-otp route
const attempts = await redis.incr(`otp-attempts:${email}`);
if (attempts > 5) {
    return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
    );
}
await redis.expire(`otp-attempts:${email}`, 3600); // 1 hour
```

### 3. Email Templates

Consider using a professional email template service like:
- SendGrid Dynamic Templates
- Mailgun Templates
- AWS SES Templates

### 4. Monitoring

Add logging and monitoring:
- Track OTP send success/failure rates
- Monitor email delivery rates
- Alert on high failure rates

## Troubleshooting

### OTP Email Not Received

1. **Check spam folder**
2. **Verify email credentials** in `.env`
3. **Check console logs** for error messages
4. **Test SMTP connection**:
   ```bash
   npm install -g nodemailer
   ```

### "Failed to send OTP" Error

1. Check your email provider's SMTP settings
2. Ensure app password is correct (for Gmail)
3. Check if your IP is blocked by the email provider
4. Verify firewall settings allow outbound SMTP connections

### OTP Verification Fails

1. Ensure OTP hasn't expired (10-minute limit)
2. Check for typos in the OTP
3. Verify email address matches exactly

## Security Best Practices

1. **Always use HTTPS** in production
2. **Implement rate limiting** on OTP requests
3. **Use Redis** instead of in-memory storage
4. **Add CAPTCHA** to prevent automated abuse
5. **Log authentication attempts** for security monitoring
6. **Set proper CORS policies**
7. **Validate email addresses** before sending OTPs

## Files Modified/Created

- `lib/email.ts` - Email sending utility
- `lib/otp-store.ts` - OTP storage and verification
- `app/api/auth/send-otp/route.ts` - API to send OTP
- `app/api/auth/verify-otp/route.ts` - API to verify OTP
- `app/(auth)/otp-login/page.tsx` - OTP login UI
- `app/(auth)/sign-in/page.tsx` - Updated with "Login with Code" button
- `app/(auth)/sign-up/page.tsx` - Updated with "Login with Code" button
- `.env` - Email configuration variables

## Support

For issues or questions, please check:
- [Nodemailer Documentation](https://nodemailer.com/)
- [Better Auth Documentation](https://better-auth.com/)
- Your email provider's SMTP documentation
