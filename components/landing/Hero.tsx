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
            className={`absolute hidden lg:flex items-center gap-3 rounded-2xl border border-white/40 bg-white/40 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl z-20 ${className}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
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
            <div className="h-10 w-10 rounded-xl bg-white/50 p-2.5 flex items-center justify-center shrink-0 shadow-inner">
                {icon}
            </div>
            <div className="text-left leading-tight pr-2">
                <div className="text-[9px] font-black uppercase text-zinc-400 tracking-wider whitespace-nowrap">{label}</div>
                <div className="text-xs font-black text-black whitespace-nowrap tracking-tight">{value}</div>
            </div>
        </motion.div>
    );
}

export function Hero() {
    return (
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden mesh-gradient">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(28,78,216,0.05)_0%,transparent_50%)]" />
            <div className="dot-pattern absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                {/* Floating Badges */}
                <FloatingBadge
                    icon={<CheckCircle2 className="h-5 w-5 text-blue-600" />}
                    label="Application status"
                    value="Interview coming up!"
                    className="top-12 left-0"
                    delay={0.2}
                    yOffset={15}
                />

                <FloatingBadge
                    icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
                    label="Perfect Match"
                    value="Resume Updated"
                    className="top-32 right-0"
                    delay={0.5}
                    yOffset={20}
                />

                <FloatingBadge
                    icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
                    label="New Job"
                    value="Offer Received!"
                    className="bottom-40 left-[10%]"
                    delay={0.8}
                    yOffset={12}
                />

                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/50 backdrop-blur-sm px-4 py-1.5 shadow-[0_4px_20px_rgba(28,78,216,0.05)] mb-10"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">The easiest way to find a job</span>
                    </motion.div>

                    <motion.h1
                        className="text-[clamp(2.5rem,9vw,6.5rem)] font-black leading-[1.05] tracking-[-0.045em] text-black relative z-10 text-gradient text-center max-w-6xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Apply Faster. <br />
                        Track <span className="text-blue-600 italic">Everything.</span>
                    </motion.h1>

                    <motion.p
                        className="mt-12 max-w-2xl text-lg font-medium text-zinc-500 sm:text-xl lg:text-2xl leading-relaxed relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Find your next job in half the time. We track your applications automatically, optimize your resume with AI, and help you master your interviews with elite coaching.
                    </motion.p>

                    <motion.div
                        className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/signup"
                            className="btn-premium group"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Start Your Pro Track
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                        <button className="rounded-2xl border border-white bg-white/60 px-10 py-5 text-sm font-bold text-black transition-all hover:bg-white hover:shadow-xl backdrop-blur-sm active:scale-95">
                            Watch Video
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-20 flex flex-col items-center gap-6"
                    >
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300">Powering Talent At</span>
                        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-30 grayscale hover:opacity-100 transition-all duration-700">
                            {['Tesla', 'Stripe', 'OpenAI', 'Anthropic', 'Scale AI'].map((company) => (
                                <span key={company} className="text-xl font-black tracking-tighter text-black select-none">
                                    {company}<span className="text-blue-600">.</span>
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
