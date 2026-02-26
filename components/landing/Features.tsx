"use client";

import { motion } from "framer-motion";
import { MousePointer2, Mail, LayoutDashboard, Zap, Shield, Globe } from "lucide-react";

const features = [
    {
        title: "Instant Capture",
        description: "Our high-speed content script detects successful applications on 200+ job boards. No data entry required.",
        icon: MousePointer2,
    },
    {
        title: "Email Synchronization",
        description: "Secure OAuth for Gmail & Outlook. We track every thread and update your application states automatically.",
        icon: Mail,
    },
    {
        title: "Strategic Pipeline",
        description: "A centralized career command center. Manage every lead, interview, and offer in one polished interface.",
        icon: LayoutDashboard,
    },
    {
        title: "Performance AI",
        description: "Weekly executive summaries on your response rates with actionable suggestions to increase conversion.",
        icon: Zap,
    },
    {
        title: "Encrypted Privacy",
        description: "Your data is strictly yours. We use high-grade encryption and locally-hosted models for text processing.",
        icon: Shield,
    },
    {
        title: "Omni-Channel Sync",
        description: "Your workspace stays in sync across all devices. Capture on desktop, monitor on mobile.",
        icon: Globe,
    },
];

export function Features() {
    return (
        <section id="features" className="py-32 lg:py-48 relative overflow-hidden bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col mb-24 max-w-2xl">
                    <motion.h2
                        className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.9] tracking-tight mb-8 text-black"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Engineered for <br /><span className="text-[#1C4ED8]">unmatched</span> clarity.
                    </motion.h2>
                    <p className="text-lg font-medium text-zinc-400 leading-relaxed">
                        We rebuilt the job tracking experience with a focus on speed and intelligence.
                        Stop managing data and start managing your career.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="group flex flex-col items-start"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="mb-8 h-14 w-14 rounded-2xl border border-zinc-100 flex items-center justify-center transition-all group-hover:bg-[#1C4ED8] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(28,78,216,0.2)] shadow-sm">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight text-black">{feature.title}</h3>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
