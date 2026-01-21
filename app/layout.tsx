import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My App - Authentication",
  description: "Next.js app with Better Auth - Google OAuth, GitHub OAuth, Email/Password, and OTP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
