"use client";

import { useAuthStore } from "@/app/store/authStore";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const { isLoggedIn } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl px-0">
            <div className="flex h-14 items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-6 backdrop-blur-2xl transition-all">
                <Link href="/" className="flex items-center gap-1.5 group cursor-pointer">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                        <img src="/logo.png" alt="Offerra Logo" className="h-full w-full object-contain p-1.5" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-black">Offerra<span className="text-blue-600">.</span></span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden items-center gap-10 md:flex">
                    {[
                        { label: 'Features', href: '/#features' },
                        { label: 'Extension', href: '/#extension' },
                        { label: 'Process', href: '/#how-it-works' },
                        { label: 'Pricing', href: '/#pricing' },
                        { label: 'FAQ', href: '/#faq' }
                    ].map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="relative text-[10px] font-black text-zinc-400 transition-colors hover:text-black uppercase tracking-[0.2em] group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-blue-600 transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-6">
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="rounded-xl bg-[#1C4ED8] px-5 py-2 text-[10px] font-black text-white transition-all hover:bg-[#1e3a8a] uppercase tracking-widest active:scale-95"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-[10px] font-black text-zinc-400 hover:text-black transition-colors uppercase tracking-[0.2em]">
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-xl bg-blue-600 px-5 py-2 text-[10px] font-black text-white transition-all hover:bg-blue-700 uppercase tracking-widest active:scale-95"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-500 hover:text-black transition-colors"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden mt-4 rounded-3xl border border-white/20 bg-white/95 backdrop-blur-3xl p-8 flex flex-col gap-2 relative z-50 overflow-hidden"
                    >
                        {/* Decorative background element for mobile menu */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                        
                        {[
                            { label: 'Features', href: '/#features' },
                            { label: 'Extension', href: '/#extension' },
                            { label: 'Process', href: '/#how-it-works' },
                            { label: 'Pricing', href: '/#pricing' },
                            { label: 'FAQ', href: '/#faq' }
                        ].map((link, idx) => (
                            <motion.div
                                key={link.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.05) }}
                            >
                                <Link 
                                    href={link.href} 
                                    onClick={() => setMobileOpen(false)} 
                                    className="block text-center text-[10px] font-black text-zinc-400 hover:text-blue-600 transition-all uppercase tracking-[0.3em] py-4 rounded-2xl hover:bg-blue-50/50"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                        
                        <motion.div 
                            className="mt-4 pt-8 border-t border-zinc-100 flex flex-col gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center rounded-2xl bg-blue-600 px-4 py-5 text-[10px] font-black text-white hover:bg-blue-700 transition-all uppercase tracking-[0.25em] active:scale-95"
                                >
                                    Open Dashboard
                                </Link>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link 
                                            href="/login" 
                                            onClick={() => setMobileOpen(false)} 
                                            className="w-full text-center py-5 text-[10px] font-black text-zinc-500 hover:text-black uppercase tracking-[0.2em] border border-zinc-100 rounded-2xl bg-zinc-50 active:scale-95 transition-all"
                                        >
                                            Sign In
                                        </Link>
                                        <Link 
                                            href="/signup" 
                                            onClick={() => setMobileOpen(false)} 
                                            className="w-full text-center rounded-2xl bg-blue-600 px-4 py-5 text-[10px] font-black text-white hover:bg-blue-700 uppercase tracking-[0.2em] active:scale-95 transition-all"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                    <p className="text-[9px] font-black text-zinc-300 text-center uppercase tracking-widest mt-2">
                                        Free to use. No Credit Card Needed.
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
