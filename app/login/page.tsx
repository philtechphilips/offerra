"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, Zap, LayoutDashboard, Sparkles } from "lucide-react";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";

export default function LoginPage() {
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const response = await api.post("/login", { email, password });
            const data = response.data;
            setAuth(data.user, data.access_token);
            toast.success("Signed in successfully.");
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
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

                {/* Logo */}
                <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                        <img src="/logo.png" alt="Offerra" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-white">Offerra<span className="text-blue-500">.</span></span>
                </Link>

                {/* Main copy */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
                            Your job search,<br />
                            <span className="text-blue-500">supercharged.</span>
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                            Track applications, optimize your resume with AI, and ace every interview — all in one place.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: LayoutDashboard, text: "Auto-track every application" },
                            { icon: Sparkles, text: "AI-optimized resumes & cover letters" },
                            { icon: Zap, text: "Interview prep with STAR answers" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                                </div>
                                <span className="text-sm font-medium text-zinc-300">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10">
                    <p className="text-xs text-zinc-600 font-medium">
                        Trusted by job seekers worldwide. Free to get started.
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
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 mb-1.5">Welcome back</h1>
                        <p className="text-sm text-zinc-400">Enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-all outline-none text-sm text-zinc-900 placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Password</label>
                                <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:opacity-70 transition-opacity">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
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
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-600 font-bold hover:underline underline-offset-4">
                            Create one free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
