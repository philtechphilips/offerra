"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Command, CheckCircle2, Eye, EyeOff } from "lucide-react";

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
            toast.success("Account created successfully! Welcome to Offerra.");
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4">
            <div className="dot-pattern absolute inset-0 -z-10 opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[500px]"
            >
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="mb-8 group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden transition-transform group-hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20">
                            <img src="/logo.png" alt="Offerra" className="h-full w-full object-contain" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-black mb-3">Create your account</h1>
                    <p className="text-zinc-500 font-medium text-sm text-center max-w-sm">
                        Join over 10,000 users tracking their job search with AI.
                    </p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)] transition-all hover:border-blue-100">
                    <form onSubmit={handleSignup} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                                className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-14 px-5 pr-12 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm placeholder:text-zinc-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-[#1C4ED8] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="py-2 space-y-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                No credit card required
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Instant access to all features
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#1C4ED8] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>


                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-relaxed">
                            By signing up, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm font-bold text-zinc-400">
                        Already have an account? <Link href="/login" className="text-[#1C4ED8] hover:underline underline-offset-4">Log in here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
