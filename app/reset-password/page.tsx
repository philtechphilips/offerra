"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import api from "@/app/lib/api";
import { toast } from "sonner";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid reset link. Redirecting back to forgot password page.");
            router.push("/forgot-password");
        }
    }, [token, email, router]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            await api.post("/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            setIsSuccess(true);
            toast.success("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Password reset failed. Please try a new reset link.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="dot-pattern absolute inset-0 -z-10 opacity-40" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)]"
                >
                    <div className="h-20 w-20 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto mb-8 text-emerald-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black text-black mb-4 tracking-tight">Security updated</h1>
                    <p className="text-zinc-500 font-medium text-sm mb-10 leading-relaxed">
                        Your password has been successfully reset. You will be redirected to the login page shortly.
                    </p>
                    <Link
                        href="/login"
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:opacity-70 transition-opacity"
                    >
                        Proceed to Login manually
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="dot-pattern absolute inset-0 -z-10 opacity-40" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <h1 className="text-3xl font-black text-black mb-3 tracking-tight">Reset password</h1>
                    <p className="text-zinc-500 font-medium text-sm max-w-sm px-6">
                        Almost there. Please choose a new password for your account.
                    </p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full h-14 px-5 pr-12 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-[#1C4ED8] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full h-14 px-5 pr-12 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-[#1C4ED8] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#1C4ED8] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "Updating Security..." : "Reset Password"}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
