"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Mail, DollarSign } from "lucide-react";

interface FloatingBadgeProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
}

function FloatingBadge({ icon, label, value, className, delay = 0, duration = 6, yOffset = 10 }: FloatingBadgeProps) {
    return (
        <motion.div
            className={`absolute hidden lg:flex items-center gap-3 rounded-2xl border border-blue-50 bg-white p-3 shadow-[0_20px_50px_rgba(28,78,216,0.08)] z-20 ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -yOffset, 0]
            }}
            transition={{
                delay,
                y: { duration, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
            }}
        >
            <div className="h-10 w-10 rounded-xl bg-blue-50 p-2.5 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="text-left leading-tight pr-2">
                <div className="text-[9px] font-black uppercase text-blue-400 tracking-wider whitespace-nowrap">{label}</div>
                <div className="text-xs font-bold text-black whitespace-nowrap">{value}</div>
            </div>
        </motion.div>
    );
}

export function Hero() {
    return (
        <section className="relative pt-40 pb-20 lg:pt-56 overflow-hidden bg-white">
            <div className="dot-pattern absolute inset-0 -z-10 opacity-60" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                {/* Floating Badges - Positioned to avoid text overlap */}
                <FloatingBadge
                    icon={<CheckCircle2 className="h-5 w-5 text-[#1C4ED8]" />}
                    label="Update Detected"
                    value="Interview @ Tesla"
                    className="top-0 -left-12"
                    delay={0.2}
                    duration={5}
                    yOffset={12}
                />

                <FloatingBadge
                    icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
                    label="Offer Received"
                    value="$165k @ Scale AI"
                    className="top-20 -right-8"
                    delay={0.5}
                    duration={7}
                    yOffset={15}
                />

                <FloatingBadge
                    icon={<TrendingUp className="h-5 w-5 text-[#1C4ED8]" />}
                    label="Profile Optimized"
                    value="Match Rate +42%"
                    className="bottom-40 -left-20"
                    delay={0.8}
                    duration={6.5}
                    yOffset={10}
                />

                <FloatingBadge
                    icon={<Mail className="h-5 w-5 text-blue-400" />}
                    label="Email Synced"
                    value="24 New Activities"
                    className="bottom-10 -right-16"
                    delay={1.1}
                    duration={8}
                    yOffset={18}
                />

                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 shadow-sm"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-[#1C4ED8]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C4ED8]">Intelligent Career Tracking</span>
                    </motion.div>

                    <motion.h1
                        className="mt-8 text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.95] tracking-[-0.04em] text-black relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Apply Everywhere.<br />
                        Track <span className="text-[#1C4ED8] italic">Automatically.</span>
                    </motion.h1>

                    <motion.p
                        className="mt-10 max-w-2xl text-base font-medium text-zinc-500 sm:text-lg lg:text-xl leading-relaxed relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        The silent career assistant for modern professionals. <br className="hidden md:block" />
                        No manual entry—just a high-performance tracking engine.
                    </motion.p>

                    <motion.div
                        className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/signup"
                            className="group relative flex items-center gap-3 rounded-2xl bg-[#1C4ED8] px-10 py-5 text-sm font-bold text-white transition-all hover:bg-[#1e40af] active:scale-95 shadow-2xl shadow-blue-600/20"
                        >
                            Maximize My Search
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <button className="rounded-2xl border border-zinc-200 bg-white px-10 py-5 text-sm font-bold text-black transition-all hover:bg-zinc-50 active:scale-95">
                            Live Demo
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
