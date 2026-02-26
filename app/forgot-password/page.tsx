"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Command, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            {/* Background decoration */}
            <div className="dot-pattern absolute inset-0 -z-10 opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[440px]"
            >
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="mb-8 group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1C4ED8] transition-transform group-hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20">
                            <Command className="h-6 w-6 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-black mb-3">Reset credentials</h1>
                    <p className="text-zinc-500 font-medium text-sm text-center">
                        Enter your email and we'll send you a secure link to reset your account access.
                    </p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)] transition-all hover:border-blue-100">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                            />
                        </div>

                        <button className="w-full h-14 bg-[#1C4ED8] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
                            Send Reset Link
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm font-bold text-zinc-400">
                        Remembered your password? <Link href="/login" className="text-[#1C4ED8] hover:underline underline-offset-4">Log in here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
