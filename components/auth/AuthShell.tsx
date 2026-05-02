"use client";

import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode; mode?: "signin" | "signup" }) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {children}
        </div>
    );
}

export function BrandMark({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2 w-fit ${className}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                <img src="/logo.png" alt="Offerra" className="h-full w-full object-contain" />
            </div>
            <span className="text-[15px] font-black tracking-tighter text-zinc-900">
                Offerra<span className="text-blue-600">.</span>
            </span>
        </Link>
    );
}

export function Field({
    label,
    icon,
    type = "text",
    placeholder,
    value,
    onChange,
    autoComplete,
    required = false,
}: {
    label: string;
    icon: React.ReactNode;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
    autoComplete?: string;
    required?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">{label}</label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    {icon}
                </span>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
                />
            </div>
        </div>
    );
}

export function PasswordField({
    label = "Password",
    value,
    onChange,
    show,
    onToggle,
    autoComplete,
    placeholder = "••••••",
    rightLabel,
}: {
    label?: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    autoComplete?: string;
    placeholder?: string;
    rightLabel?: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">{label}</label>
                {rightLabel}
            </div>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <Lock className="h-4 w-4" />
                </span>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    className="w-full h-12 pl-10 pr-12 rounded-xl bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
}

export function GoogleButton({
    onClick,
    label = "Continue with Google",
}: {
    onClick: () => void;
    label?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative w-full h-12 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
        >
            <span className="flex h-6 w-6 items-center justify-center">
                <GoogleIcon />
            </span>
            <span className="text-sm font-bold text-zinc-800 group-hover:text-zinc-900">
                {label}
            </span>
        </button>
    );
}

export function OrDivider({ label = "or" }: { label?: string }) {
    return (
        <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {label}
            </span>
            <div className="flex-1 h-px bg-zinc-200" />
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.1z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.2 0-9.6-3.4-11.2-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C40.9 35.4 44 30.1 44 24c0-1.2-.1-2.4-.4-3.5z" />
        </svg>
    );
}
