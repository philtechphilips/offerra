"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
    return (
        <section className="py-24 lg:py-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
            <div className="dot-pattern absolute inset-0 opacity-40" />
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="rounded-[3rem] lg:rounded-[5rem] bg-black border border-zinc-800 p-12 lg:p-32 text-center text-white relative z-10 overflow-hidden group shadow-[0_64px_128px_-32px_rgba(28,78,216,0.3)] shimmer">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-900/10 to-transparent pointer-events-none" />
                    
                    <motion.div
                        className="mb-12 flex items-center justify-center gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Join the movement</span>
                        <Sparkles className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    </motion.div>
                    
                    <motion.h2
                        className="text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.9] tracking-tighter mb-16 uppercase italic"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        Ready <br />
                        <span className="text-blue-500">to win?</span>
                    </motion.h2>
                    
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                       <Link
                            href="/signup"
                            className="btn-premium group"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Get Started for Free
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                        <p className="text-sm font-black text-zinc-400 uppercase tracking-widest leading-none">
                            No Credit Card <span className="text-blue-400">Required.</span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

