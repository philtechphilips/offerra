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
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 lg:px-8">
            <div className="flex h-14 items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0 bg-blue-50 group-hover:scale-110 transition-transform">
                        <img src="/logo.png" alt="Offerra Logo" className="h-full w-full object-contain p-1.5" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-black">Offerra<span className="text-blue-600">.</span></span>
                </div>

                {/* Desktop nav links */}
                <div className="hidden items-center gap-10 md:flex">
                    {[
                        { label: 'Features', href: '#features' },
                        { label: 'Process', href: '#how-it-works' },
                        { label: 'Pricing', href: '#pricing' }
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
                            className="rounded-xl bg-[#1C4ED8] px-5 py-2 text-[10px] font-black text-white transition-all hover:bg-[#1e3a8a] hover:shadow-lg hover:shadow-blue-200 uppercase tracking-widest active:scale-95"
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
                                className="rounded-xl bg-blue-600 px-5 py-2 text-[10px] font-black text-white transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 uppercase tracking-widest active:scale-95"
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
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden mt-3 rounded-2xl border border-white/20 bg-white/90 backdrop-blur-2xl p-6 shadow-2xl space-y-4"
                >
                    <Link href="#features" onClick={() => setMobileOpen(false)} className="block text-sm font-black text-zinc-500 hover:text-blue-600 uppercase tracking-widest py-2">
                        Features
                    </Link>
                    <Link href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-black text-zinc-500 hover:text-blue-600 uppercase tracking-widest py-2">
                        Process
                    </Link>
                    <Link href="#pricing" onClick={() => setMobileOpen(false)} className="block text-sm font-black text-zinc-500 hover:text-blue-600 uppercase tracking-widest py-2">
                        Pricing
                    </Link>
                    <div className="border-t border-zinc-100 pt-5 flex flex-col gap-3">
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="w-full text-center rounded-xl bg-blue-600 px-4 py-3.5 text-[10px] font-black text-white uppercase tracking-widest"
                            >
                                Open Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-3.5 text-[10px] font-black text-zinc-400 hover:text-black uppercase tracking-widest border border-zinc-100 rounded-xl bg-zinc-50">
                                    Sign In
                                </Link>
                                <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full text-center rounded-xl bg-blue-600 px-4 py-3.5 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-blue-200">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
