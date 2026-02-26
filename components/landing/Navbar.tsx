"use client";

import { useAuthStore } from "@/app/store/authStore";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const { isLoggedIn } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
            <div className="flex h-12 items-center justify-between rounded-2xl border border-zinc-200 bg-white/90 px-4 sm:px-6 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden shrink-0">
                        <img src="/logo.png" alt="Offerra Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-base font-black tracking-tight text-black">Offerra</span>
                </div>

                {/* Desktop nav links */}
                <div className="hidden items-center gap-10 md:flex">
                    <Link href="#features" className="text-[10px] font-bold text-zinc-500 transition-colors hover:text-[#1C4ED8] uppercase tracking-[0.2em]">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-[10px] font-bold text-zinc-500 transition-colors hover:text-[#1C4ED8] uppercase tracking-[0.2em]">
                        Process
                    </Link>
                    <Link href="#pricing" className="text-[10px] font-bold text-zinc-500 transition-colors hover:text-[#1C4ED8] uppercase tracking-[0.2em]">
                        Pricing
                    </Link>
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="rounded-xl bg-[#1C4ED8] px-4 py-1.5 text-[10px] font-black text-white transition-all hover:bg-[#1e3a8a] uppercase tracking-widest"
                        >
                            Open Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-[0.2em]">
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-xl bg-[#1C4ED8] px-4 py-1.5 text-[10px] font-black text-white transition-all hover:bg-[#1e3a8a] uppercase tracking-widest"
                            >
                                Join Pro
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-black transition-colors"
                >
                    {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden mt-2 rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl p-4 space-y-3">
                    <Link href="#features" onClick={() => setMobileOpen(false)} className="block text-xs font-bold text-zinc-500 hover:text-[#1C4ED8] uppercase tracking-[0.15em] py-2 px-3 rounded-lg hover:bg-zinc-50 transition-all">
                        Features
                    </Link>
                    <Link href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-xs font-bold text-zinc-500 hover:text-[#1C4ED8] uppercase tracking-[0.15em] py-2 px-3 rounded-lg hover:bg-zinc-50 transition-all">
                        Process
                    </Link>
                    <Link href="#pricing" onClick={() => setMobileOpen(false)} className="block text-xs font-bold text-zinc-500 hover:text-[#1C4ED8] uppercase tracking-[0.15em] py-2 px-3 rounded-lg hover:bg-zinc-50 transition-all">
                        Pricing
                    </Link>
                    <div className="border-t border-zinc-100 pt-3 flex items-center gap-3">
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="w-full text-center rounded-xl bg-[#1C4ED8] px-4 py-2.5 text-[10px] font-black text-white uppercase tracking-widest"
                            >
                                Open Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-[0.15em] border border-zinc-100 rounded-xl">
                                    Log In
                                </Link>
                                <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-xl bg-[#1C4ED8] px-4 py-2.5 text-[10px] font-black text-white uppercase tracking-widest">
                                    Join Pro
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
