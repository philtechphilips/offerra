"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, Zap, LayoutDashboard, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { setAuth, isLoggedIn, token, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (_hasHydrated && isLoggedIn && token) {
            router.push("/dashboard");
        }
    }, [_hasHydrated, isLoggedIn, token, router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: password
            });
            const data = response.data;
            setAuth(data.user, data.access_token);
            toast.success("Account created! Welcome to Offerra.");
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-[45%] bg-zinc-900 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(28,78,216,0.15)_0%,transparent_60%)]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />

                <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                        <img src="/logo.png" alt="Offerra" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-white">Offerra<span className="text-blue-500">.</span></span>
                </Link>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
                            Land your next role<br />
                            <span className="text-blue-500">faster.</span>
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                            Stop juggling spreadsheets. Offerra tracks every application, optimizes your resume, and coaches you for interviews.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: LayoutDashboard, text: "Visual kanban pipeline" },
                            { icon: Sparkles, text: "AI cover letters in seconds" },
                            { icon: Zap, text: "Predicted interview questions" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                                </div>
                                <span className="text-sm font-medium text-zinc-300">{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-medium text-zinc-400">Free to sign up — no credit card needed</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-xs text-zinc-600 font-medium">
                        Join job seekers already using Offerra.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white relative">
                <div className="dot-pattern absolute inset-0 -z-10 opacity-30" />

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                                <img src="/logo.png" alt="Offerra" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-lg font-black tracking-tighter text-black">Offerra<span className="text-blue-600">.</span></span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 mb-1.5">Create your account</h1>
                        <p className="text-sm text-zinc-400">Free forever. No credit card needed.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-all outline-none text-sm text-zinc-900 placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-all outline-none text-sm text-zinc-900 placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    className="w-full h-11 px-4 pr-11 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-all outline-none text-sm text-zinc-900 placeholder:text-zinc-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-2"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[10px] font-bold text-zinc-300 leading-relaxed">
                        By signing up, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-zinc-500">Terms</Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-zinc-500">Privacy Policy</Link>.
                    </p>

                    <p className="mt-6 text-center text-sm text-zinc-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
