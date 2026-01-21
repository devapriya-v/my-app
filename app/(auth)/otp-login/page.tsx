"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function OTPLogin() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSendOTP = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to send OTP");
                setLoading(false);
                return;
            }

            setStep("otp");
            setLoading(false);
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Invalid OTP");
                setLoading(false);
                return;
            }

            // Force page reload to update session
            window.location.href = "/";
        } catch (err) {
            setError("Failed to verify OTP. Please try again.");
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setOtp("");
        await handleSendOTP();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Login with Code
                    </CardTitle>
                    <CardDescription>
                        {step === "email"
                            ? "Enter your email to receive a login code"
                            : "Enter the 6-digit code sent to your email"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    {step === "email" ? (
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendOTP();
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        disabled
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            setStep("email");
                                            setOtp("");
                                            setError("");
                                        }}
                                        title="Change email"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="otp">Verification Code</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setOtp(value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && otp.length === 6) {
                                            handleVerifyOTP();
                                        }
                                    }}
                                    className="text-center text-2xl tracking-widest"
                                />
                                <p className="text-xs text-gray-500">
                                    Code expires in 10 minutes
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    {step === "email" ? (
                        <>
                            <Button
                                className="w-full"
                                onClick={handleSendOTP}
                                disabled={loading || !email}
                            >
                                {loading ? "Sending..." : "Send Code"}
                            </Button>
                            <p className="text-sm text-center text-gray-500">
                                Back to{" "}
                                <Link href="/sign-in" className="text-blue-500 hover:underline">
                                    Password Login
                                </Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <Button
                                className="w-full"
                                onClick={handleVerifyOTP}
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleResendOTP}
                                disabled={loading}
                            >
                                Resend Code
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
