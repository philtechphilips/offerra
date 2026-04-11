"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Chrome, ArrowRight, Download, Sparkles } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ExtensionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const browsers = [
    { 
        name: "Google Chrome", 
        icon: <Chrome className="h-6 w-6" />, 
        href: "https://chrome.google.com/webstore",
        desc: "The #1 recommended experience for Offerra power users.",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
    },
    { 
        name: "Microsoft Edge", 
        icon: <div className="h-6 w-6 rounded-full bg-emerald-500" />, 
        href: "https://microsoftedge.microsoft.com/addons",
        desc: "Optimized for speed and productivity on Windows.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    { 
        name: "Mozilla Firefox", 
        icon: <div className="h-6 w-6 rounded-full bg-orange-500" />, 
        href: "https://addons.mozilla.org",
        desc: "Privacy-focused monitoring for your career search.",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-100"
    }
];

export function ExtensionModal({ isOpen, onClose }: ExtensionModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden border border-zinc-100"
                    >
                        {/* Header Area */}
                        <div className="p-8 pb-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                                    <Download className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-black uppercase">Get the Companion</h3>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select your browser to begin</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* List Area */}
                        <div className="p-8 space-y-3">
                            {browsers.map((browser, idx) => (
                                <motion.a
                                    key={browser.name}
                                    href={browser.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "group block p-6 rounded-3xl border transition-all duration-300",
                                        "bg-white border-zinc-100 hover:border-blue-200",
                                        "hover:-translate-y-1"
                                    )}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0", browser.bg, browser.color)}>
                                                {browser.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-black uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                                                    {browser.name}
                                                </h4>
                                                <p className="text-sm font-medium text-zinc-400 leading-none">
                                                    {browser.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-blue-600 group-hover:text-white transition-all" />
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* Footer Area */}
                        <div className="px-8 py-6 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-center gap-4">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">
                                Used by job seekers <span className="text-black">worldwide.</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

