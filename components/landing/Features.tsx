"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Zap, Sparkles, Briefcase } from "lucide-react";
import { cn } from "@/app/lib/utils";

const features = [
    {
        title: "No More Spreadsheets",
        description: "Everything you apply for is in one easy place. No more messy lists.",
        icon: LayoutDashboard,
        color: "blue"
    },
    {
        title: "AI Smart Resume",
        description: "Our AI helps you fix your resume to match exactly what jobs are looking for.",
        icon: Sparkles,
        color: "emerald"
    },
    {
        title: "Ready for Interviews",
        description: "We help you practice for your interviews with tips for exactly who you're meeting.",
        icon: Zap,
        color: "amber"
    },
    {
        title: "Track Everything",
        description: "See exactly which version of your resume you sent where, so you're always organized.",
        icon: Briefcase,
        color: "blue"
    },
    {
        title: "Smart Gmail Sync",
        description: "Automatically track application status directly from your official Gmail inbox.",
        icon: () => (
            <svg viewBox="0 0 24 24" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 6.75-9-6.75V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.41.17-.8.47-1.09.3-.29.69-.41 1.03-.41h.5l10 7.5 10-7.5h.5c.34 0 .73.12 1.03.41.3.29.47.68.47 1.09z" fill="currentColor" />
            </svg>
        ),
        color: "red"
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 lg:py-32 relative bg-white overflow-hidden">
            {/* Minimalist Top/Bottom Accents */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200/60 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200/60 to-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col items-start mb-32 max-w-3xl">
                    <motion.div
                        className="mb-8 flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="h-0.5 w-8 bg-blue-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-600">Why use us</span>
                    </motion.div>

                    <motion.h2
                        className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.9] tracking-tighter mb-10 text-black text-gradient"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Built to <br />
                        <span className="italic">save you</span> time.
                    </motion.h2>

                    <motion.p
                        className="text-lg sm:text-xl font-medium text-zinc-400 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        We built this to make job hunting easy. No more manual data entry or messy spreadsheets. Just a clean, fast way to find your next role.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            className="group relative flex flex-col p-10 rounded-[2rem] border border-zinc-100 bg-white hover:bg-zinc-50/50 transition-all duration-500 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                        >
                            {/* Card Spotlight Background Glow */}
                            <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className={cn(
                                "mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-zinc-100 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl",
                                feature.color === 'red' ? "text-[#EA4335] group-hover:bg-[#EA4335] group-hover:text-white" : "group-hover:bg-[#1C4ED8] group-hover:text-white"
                            )}>
                                <feature.icon className="h-6 w-6" />
                            </div>

                            <h3 className="text-xl font-black mb-4 tracking-tight text-black group-hover:text-blue-600 transition-colors uppercase tracking-[0.05em]">{feature.title}</h3>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed group-hover:text-zinc-600 transition-colors">
                                {feature.description}
                            </p>

                            {/* Subtle Indicator */}
                            <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">Active Module</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
