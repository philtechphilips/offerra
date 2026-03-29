"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Mail, DollarSign, Play, X, Chrome, Download } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ExtensionModal } from "./ExtensionModal";

interface FloatingBadgeProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    className?: string;
    delay?: number;
    yOffset?: number;
}

function FloatingBadge({ icon, label, value, className, delay = 0, yOffset = 10 }: FloatingBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
                opacity: 1, 
                y: [0, -yOffset, 0],
            }}
            transition={{ 
                opacity: { duration: 0.5, delay },
                y: { 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: delay
                }
            }}
            className={cn(
                "absolute hidden lg:flex items-center gap-4 rounded-2xl border border-white bg-white/60 p-4 backdrop-blur-xl z-20",
                className
            )}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{label}</p>
                <p className="text-xs font-black text-black whitespace-nowrap">{value}</p>
            </div>
        </motion.div>
    );
}

export function Hero() {
    const [showVideo, setShowVideo] = useState(false);
    const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

    return (
        <>
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden mesh-gradient">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(28,78,216,0.05)_0%,transparent_50%)]" />
            <div className="dot-pattern absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
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
                        className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/50 backdrop-blur-sm px-4 py-1.5 mb-10"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">The easiest way to find a job</span>
                    </motion.div>

                    <motion.h1
                        className="text-[clamp(2.2rem,8vw,5.5rem)] font-black leading-[1.2] tracking-[-0.045em] text-black relative z-10 text-gradient text-center max-w-6xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Apply faster. <br />
                        Track <span className="text-blue-600 italic">everything.</span>
                    </motion.h1>

                    <motion.p
                        className="mt-12 max-w-3xl text-lg font-medium text-zinc-500 sm:text-xl lg:text-2xl leading-relaxed relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Find your next job, faster. Track all your applications automatically and use AI to build perfect resumes and practice for interviews.
                    </motion.p>

                    <motion.div
                        className="mt-16 flex flex-wrap items-center justify-center gap-4 relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/signup"
                            className="btn-premium group px-10 h-16 flex items-center justify-center font-bold text-sm tracking-widest uppercase"
                        >
                            Get Started for Free
                        </Link>
                        
                        <div className="relative group">
                            <button 
                                onClick={() => setIsExtensionModalOpen(true)}
                                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/50 px-8 h-16 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-white hover:border-blue-200 backdrop-blur-sm active:scale-95 group/btn"
                            >
                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                                    <Download className="h-4 w-4 text-blue-600" />
                                </div>
                                Download Extension
                            </button>
                        </div>

                        <button
                            onClick={() => setShowVideo(true)}
                            className="flex items-center gap-2 px-8 h-16 text-sm font-bold text-zinc-400 hover:text-black transition-colors"
                        >
                            <Play className="h-4 w-4 fill-current" />
                            Watch Demo
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Video Modal */}
        <AnimatePresence>
            {showVideo && (
                <motion.div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button 
                        onClick={() => setShowVideo(false)}
                        className="absolute top-8 right-8 text-white/40 hover:text-white"
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <div className="w-full max-w-5xl aspect-video bg-zinc-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-zinc-600 font-black tracking-widest uppercase">Video Placeholder</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Extension Download Modal */}
        <ExtensionModal 
            isOpen={isExtensionModalOpen} 
            onClose={() => setIsExtensionModalOpen(false)} 
        />
        </>
    );
}
