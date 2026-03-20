"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import api from "@/app/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post("/forgot-password", { email });
            setIsSent(true);
            toast.success("Success! Check your email for a reset link.");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="dot-pattern absolute inset-0 -z-10 opacity-40" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white border border-zinc-100 rounded-[3rem] p-10 text-center shadow-[0_40px_80px_rgba(0,0,0,0.03)]"
                >
                    <div className="h-20 w-20 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto mb-8 text-emerald-500">
                        <Mail className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black text-black mb-4 tracking-tight">Check your email</h1>
                    <p className="text-zinc-500 font-medium text-sm mb-10 leading-relaxed">
                        We've sent a password reset link to <span className="text-black font-bold">{email}</span>.
                        Please check your inbox (and spam folder) to reset your password.
                    </p>
                    <Link
                        href="/login"
                        className="w-full h-14 bg-zinc-50 text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all border border-zinc-100 flex items-center justify-center gap-2"
                    >
                        Return to Login
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
                    <Link href="/login" className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-black transition-colors group">
                        Back to Login
                    </Link>
                    <h1 className="text-3xl font-black text-black mb-3 tracking-tight">Forgot password?</h1>
                    <p className="text-zinc-500 font-medium text-sm max-w-sm px-6">
                        No problem. Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#1C4ED8] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
