import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Login Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Login Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #333333; font-size: 24px; font-weight: 600;">
                        Your Login Code
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 24px;">
                        Use the following code to complete your login:
                      </p>
                    </td>
                  </tr>
                  
                  <!-- OTP Code -->
                  <tr>
                    <td style="padding: 0 40px 30px 40px; text-align: center;">
                      <div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; display: inline-block;">
                        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #333333; font-family: 'Courier New', monospace;">
                          ${otp}
                        </span>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Info -->
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 20px;">
                        This code will expire in <strong>10 minutes</strong>.
                      </p>
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 20px;">
                        If you didn't request this code, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px 40px 40px; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 18px; text-align: center;">
                        This is an automated message, please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Your login code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
}
