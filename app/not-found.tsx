"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Home, ArrowLeft, Search, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Soft Background Accents */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-50/40 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-50/20 rounded-full blur-[120px] -z-10" />

            <div className="text-center space-y-8 max-w-2xl relative">
                {/* The "Lost" Icon Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative inline-block"
                >
                    <div className="h-40 w-40 rounded-[3rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto shadow-2xl shadow-blue-100 relative overflow-hidden">
                        <motion.div
                            animate={{
                                rotate: [0, 90, 180, 270, 360],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 opacity-5"
                        >
                            <Compass className="h-full w-full text-blue-600 p-4" />
                        </motion.div>
                        <Search className="h-16 w-16 text-blue-600 relative z-10" />
                    </div>

                    {/* Floating Sparkles */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shadow-lg"
                    >
                        <Sparkles className="h-5 w-5 text-blue-500" />
                    </motion.div>
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[clamp(4rem,10vw,8rem)] font-black tracking-tighter leading-none text-brand-blue-black"
                    >
                        4<span className="text-blue-600">0</span>4
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900"
                    >
                        Destination <span className="text-blue-600">Not Found.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm md:text-base font-medium text-zinc-400 max-w-md mx-auto leading-relaxed"
                    >
                        Looks like the AI couldn't find a match for this path. Let's get you back to your pipeline.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                >
                    <Link
                        href="/dashboard"
                        className="group flex h-16 items-center justify-center gap-4 rounded-2xl bg-zinc-900 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-black transition-all hover:scale-[1.02] shadow-xl shadow-zinc-200"
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="group flex h-16 items-center justify-center gap-4 rounded-2xl bg-white border border-zinc-100 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-blue-600 hover:border-blue-100 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Home
                    </Link>
                </motion.div>
            </div>

            {/* Subtle Footer Code Aesthetic */}
            <div className="mt-20 flex items-center gap-3 opacity-20 select-none">
                <div className="h-[1px] w-20 bg-zinc-200" />
                <span className="text-[10px] font-mono tracking-widest uppercase">System Error Code: 0x404_NULL_MATCH</span>
                <div className="h-[1px] w-20 bg-zinc-200" />
            </div>
        </div>
    );
}
