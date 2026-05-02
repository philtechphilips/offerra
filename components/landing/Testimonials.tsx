"use client";

import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

const testimonials = [
    {
        name: "Adaeze Okonkwo",
        role: "Software Engineer",
        text: "I was tracking applications in a spreadsheet before this. Offerra keeps everything in one place and the AI resume tips actually helped me tighten up my CV for each role.",
        accent: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
    },
    {
        name: "Tunde Bakare",
        role: "Product Designer",
        text: "The interview prep section gave me good questions to practice with before my last two interviews. It's a solid way to organize your prep without overthinking it.",
        accent: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
    },
    {
        name: "Chinaza Eze",
        role: "DevOps Engineer",
        text: "I liked that it auto-fills job details from listings. Saves the copy-paste work and helps me stay on top of where I've applied without losing track.",
        accent: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
    },
];

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 lg:py-32 relative bg-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-100/60 to-transparent" />
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
                <div className="flex flex-col items-center text-center mb-24 max-w-2xl mx-auto">
                    <motion.div
                        className="mb-8 flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">The Social Proof</span>
                    </motion.div>
                    <motion.h2
                        className="text-[clamp(2rem,6vw,3.8rem)] font-black leading-[1.1] tracking-tighter mb-10 text-black text-gradient"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Master <span className="italic">the modern</span> job hunt.
                    </motion.h2>
                    <motion.p
                        className="text-lg sm:text-xl font-medium text-zinc-400 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        See what job seekers are saying about Offerra — and how it changed their search.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((test, idx) => (
                        <motion.div
                            key={idx}
                            className="group relative flex flex-col p-8 rounded-2xl border border-zinc-100 bg-white hover:bg-zinc-50/50 transition-all duration-500 hover:border-blue-100"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Quote className="h-10 w-10 text-blue-600/10 mb-8 transition-transform group-hover:scale-110 group-hover:text-blue-600/20" />
                            <p className="text-lg font-semibold text-black mb-10 leading-[1.3]  tracking-[0.03em]">&quot;{test.text}&quot;</p>
                            <div className="mt-auto flex items-center gap-5">
                                <div
                                    className={`h-12 w-12 rounded-2xl flex items-center justify-center ring-4 ring-white border border-zinc-100 ${test.accent.bg}`}
                                    aria-hidden="true"
                                >
                                    <span className={`text-sm font-black ${test.accent.text}`}>
                                        {getInitials(test.name)}
                                    </span>
                                </div>
                                <div className="leading-tight">
                                    <div className="text-sm font-black tracking-tight text-black uppercase tracking-[0.05em]">{test.name}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">{test.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

