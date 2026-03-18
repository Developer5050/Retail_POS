"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyEmail() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        console.log("Verifying OTP:", code);
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(30);
            console.log("Resending OTP...");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-2">
            <div className="w-full max-w-[430px]">
                <div className="stat-card bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 p-6">
                    
                    {/* Header */}
                    <div className="mb-3 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="bg-[#27AA83] p-2 rounded-md">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                RetailPOS
                            </span>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-[#27AA83]" />
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            Verify your email
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            We've sent a verification code to your email address.
                        </p>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#27AA83] focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition-all"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-[#27AA83] hover:bg-[#209a75] text-white font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Verify Email
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={timer > 0}
                                    className={`font-semibold transition-colors ${
                                        timer > 0 
                                        ? "text-gray-400 cursor-not-allowed" 
                                        : "text-[#27AA83] hover:text-[#209a75] hover:underline cursor-pointer"
                                    }`}
                                >
                                    {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                                </button>
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/signin"
                                className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
