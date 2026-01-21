// In-memory OTP storage (use Redis in production)
interface OTPData {
  otp: string;
  expiresAt: number;
}

const otpStore = new Map<string, OTPData>();

// Clean up expired OTPs every minute
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}, 60000);

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, otp: string): void {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(normalizedEmail, { otp, expiresAt });
}

export function verifyOTP(email: string, otp: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const data = otpStore.get(normalizedEmail);
  
  if (!data) {
    return false;
  }
  
  // Check if OTP has expired
  if (data.expiresAt < Date.now()) {
    otpStore.delete(normalizedEmail);
    return false;
  }
  
  // Verify OTP
  if (data.otp === otp) {
    otpStore.delete(normalizedEmail);
    return true;
  }
  
  return false;
}

export function hasRecentOTP(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const data = otpStore.get(normalizedEmail);
  
  if (!data) {
    return false;
  }
  
  // Check if OTP is still valid
  return data.expiresAt > Date.now();
}
