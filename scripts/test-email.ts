import { sendOTPEmail } from '../lib/email';
import dotenv from 'dotenv';


dotenv.config();

async function testEmail() {
  console.log('🔄 Testing email configuration...\n');
  
  // Check environment variables
  console.log('Email Configuration:');
  console.log('  HOST:', process.env.EMAIL_HOST);
  console.log('  PORT:', process.env.EMAIL_PORT);
  console.log('  USER:', process.env.EMAIL_USER);
  console.log('  FROM:', process.env.EMAIL_FROM);
  console.log('  PASSWORD:', process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
  console.log('');

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email configuration incomplete!');
    console.error('Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in .env');
    process.exit(1);
  }

  try {
    const testOTP = '123456';
    const testEmail = process.env.EMAIL_USER; // Send to self for testing
    
    console.log(`📧 Sending test OTP to ${testEmail}...`);
    await sendOTPEmail(testEmail, testOTP);
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Check your inbox for the OTP email');
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

testEmail();
