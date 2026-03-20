"use client";

import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

const testimonials = [
    {
        name: "Alex Rivera",
        role: "Senior Frontend Engineer",
        image: "https://api.uifaces.co/our-content/donated/x18pUX9Q.jpg",
        text: "Offerra saved me at least 10 hours a week in tracking and re-tailoring my CV. I got 4 interviews in my first month using the AI Refactor tool alone."
    },
    {
        name: "Sarah Kim",
        role: "Product Designer @ Stripe",
        image: "https://api.uifaces.co/our-content/donated/vY_H-H6A.jpg",
        text: "The interview practice module is a game-changer. It predicted the exact STAR questions I faced in my design lead role at Stripe."
    },
    {
        name: "Jameson Ward",
        role: "DevOps specialist",
        image: "https://api.uifaces.co/our-content/donated/uk99-m-P.jpg",
        text: "Finally, a job-tracking tool that actually works in the background. No more messy spreadsheets or forgotten applications."
    }
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 lg:py-32 relative bg-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-100/60 to-transparent" />
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
                <div className="flex flex-col items-center text-center mb-24 max-w-2xl mx-auto">
                    <motion.div
                        className="mb-8 flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 shadow-[0_4px_20px_rgba(28,78,216,0.05)]"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">The Social Proof</span>
                    </motion.div>
                    <motion.h2
                        className="text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[1.1] tracking-tighter mb-10 text-black text-gradient uppercase"
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
                        Join 20,000+ professionals who land high-paying roles with Offerra's elite AI command center.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((test, idx) => (
                        <motion.div
                            key={idx}
                            className="group relative flex flex-col p-10 rounded-[2.5rem] border border-zinc-100 bg-white hover:bg-zinc-50/50 transition-all duration-500 hover:border-blue-100 shadow-sm hover:shadow-xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Quote className="h-10 w-10 text-blue-600/10 mb-8 transition-transform group-hover:scale-110 group-hover:text-blue-600/20" />
                            <p className="text-lg font-black tracking-tight text-black mb-10 leading-[1.3] uppercase tracking-[0.03em]">&quot;{test.text}&quot;</p>
                            <div className="mt-auto flex items-center gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-100 overflow-hidden ring-4 ring-white border border-zinc-100">
                                    <img src={test.image} alt={test.name} className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
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

