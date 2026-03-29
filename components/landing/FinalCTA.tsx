"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { ExtensionModal } from "./ExtensionModal";

export function FinalCTA() {
    const [showMenu, setShowMenu] = useState(false);
    
    return (
        <section className="py-24 lg:py-32 px-4 relative overflow-hidden bg-white">
            
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 relative">
                <div className="rounded-[3rem] bg-black p-12 lg:p-24 text-center text-white relative z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(28,78,216,0.1)_0%,transparent_50%)]" />
                    
                    <motion.div
                        className="mb-12 flex items-center justify-center gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Ready to find your next job?</span>
                        <Sparkles className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    </motion.div>
                    
                    <motion.h2
                        className="text-[clamp(2rem,5vw,4.2rem)] font-black leading-[1.1] tracking-tighter mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Ready to reach <br />
                        <span className="text-blue-500">your dream job?</span>
                    </motion.h2>

                    <motion.p
                        className="text-lg text-zinc-400 font-medium max-w-xl mx-auto mb-12 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Start tracking your jobs for free. No credit card needed.
                    </motion.p>
                    
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                             href="/signup"
                             className="btn-premium group px-12 py-6 text-base font-bold tracking-widest uppercase"
                         >
                             Get Started for Free
                         </Link>
                        <div className="flex flex-col items-center sm:items-start gap-4">
                            <button 
                                onClick={() => setShowMenu(true)}
                                className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-white/5 px-8 h-16 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10 hover:border-blue-500/50 backdrop-blur-sm active:scale-95 group/btn"
                            >
                                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                                    <Download className="h-4 w-4 text-white" />
                                </div>
                                Download Extension
                            </button>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                                No Credit Card <span className="text-blue-400 italic">Required.</span>
                            </p>
                         </div>
                    </motion.div>

                </div>
            </div>
            <ExtensionModal 
                isOpen={showMenu} 
                onClose={() => setShowMenu(false)} 
            />
        </section>
    );
}

