"use client";

import Link from "next/link";
import { Command } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
            <div className="flex h-12 items-center justify-between rounded-2xl border border-zinc-200 bg-white/90 px-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C4ED8]">
                        <Command className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-tight text-black">ApplyTrack</span>
                </div>

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

                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-[0.2em]">
                        Log In
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-xl bg-[#1C4ED8] px-4 py-1.5 text-[10px] font-black text-white transition-all hover:bg-[#1e3a8a] shadow-lg shadow-blue-600/20 uppercase tracking-widest"
                    >
                        Join Pro
                    </Link>
                </div>
            </div>
        </nav>
    );
}
