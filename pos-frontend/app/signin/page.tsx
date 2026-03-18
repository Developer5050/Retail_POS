"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Eye, EyeOff, Home } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign in data:", { ...formData, rememberMe });
    };

    const handleGoogleSignIn = () => {
        console.log("Sign in with Google");
    };

    const handleFacebookSignIn = () => {
        console.log("Sign in with Facebook");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-2">
            <div className="w-full max-w-md">
                <div className="stat-card bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 p-6">

                    {/* Header */}
                    <div className="mb-3 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="bg-[#27AA83] p-2 rounded-md">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                RetailPOS
                            </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-[15px]">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Sign In Form */}
                    <form onSubmit={handleSignIn} className="space-y-3">

                        {/* Name Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:ring-offset-0 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:ring-offset-0 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:ring-offset-0 dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:ring-offset-0 dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-3 h-3 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:border-gray-600 cursor-pointer accent-[#27AA83]"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-[13px] text-[#27AA83] hover:text-[#209a75] hover:underline underline-offset-2 decoration-[#27AA83] font-semibold transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-[#27AA83] hover:bg-[#209a75] text-white font-semibold rounded-lg transition-colors mb-3 cursor-pointer"
                        >
                            Sign In
                        </Button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                or
                            </span>
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-1 gap-3">
                            {/* Google */}
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FcGoogle className="w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                                    Google
                                </span>
                            </button>
                        </div>

                        {/* Sign Up */}
                        {/* <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-[13px] text-[#27AA83] hover:text-[#209a75] hover:underline underline-offset-2 decoration-[#27AA83] font-semibold transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p> */}

                    </form>
                </div>
            </div>
        </div>
    );
}
