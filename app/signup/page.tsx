"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Command, ArrowRight, Github, Mail, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4">
            {/* Background decoration */}
            <div className="dot-pattern absolute inset-0 -z-10 opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[500px]"
            >
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="mb-8 group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1C4ED8] transition-transform group-hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20">
                            <Command className="h-6 w-6 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-black mb-3">Initialize your career engine</h1>
                    <p className="text-zinc-500 font-medium text-sm text-center max-w-sm">
                        Join 10,000+ high-performance candidates tracking their search with AI.
                    </p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)] transition-all hover:border-blue-100">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">First Name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Work Email</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Choose Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="py-2 space-y-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                No credit card required for free tier
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Instant browser extension access
                            </div>
                        </div>

                        <button className="w-full h-14 bg-[#1C4ED8] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
                            Start Free Deployment
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-50"></div>
                        </div>
                        <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Or expedite with</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-zinc-100 bg-white hover:bg-zinc-50 transition-colors active:scale-[0.98]">
                            <Github className="h-5 w-5" />
                            <span className="text-sm font-bold">Github</span>
                        </button>
                        <button className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-zinc-100 bg-white hover:bg-zinc-50 transition-colors active:scale-[0.98]">
                            <Mail className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-bold">Google</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-relaxed">
                            By deploying, you agree to our <Link href="#" className="underline">Terms of Protocol</Link> and <Link href="#" className="underline">Data Privacy</Link>.
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm font-bold text-zinc-400">
                        Already have an account? <Link href="/login" className="text-[#1C4ED8] hover:underline underline-offset-4">Log in here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
