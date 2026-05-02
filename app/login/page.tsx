"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";
import {
    AuthShell,
    BrandMark,
    Field,
    PasswordField,
    GoogleButton,
    OrDivider,
} from "@/components/auth/AuthShell";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
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
            const data = response.data ?? {};
            if (!data.user || !data.access_token) {
                throw new Error("Unexpected sign-in response.");
            }
            setAuth(data.user, data.access_token);
            toast.success("Signed in successfully.");
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = () => {
        toast.info("Google sign-in is coming soon.");
    };

    return (
        <AuthShell mode="signin">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
            >
                <BrandMark className="mb-10 lg:mb-14" />

                <h1 className="text-[34px] sm:text-4xl font-black tracking-tight text-zinc-900 mb-1">
                    Sign in
                </h1>
                <p className="text-sm text-zinc-400 mb-8">Welcome back. Pick up where you left off.</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <Field
                        label="Email Address"
                        icon={<Mail className="h-4 w-4" />}
                        type="email"
                        placeholder="johndoe@gmail.com"
                        value={email}
                        onChange={setEmail}
                        autoComplete="email"
                        required
                    />

                    <PasswordField
                        label="Password"
                        value={password}
                        onChange={setPassword}
                        show={showPassword}
                        onToggle={() => setShowPassword((s) => !s)}
                        autoComplete="current-password"
                        rightLabel={
                            <Link
                                href="/forgot-password"
                                className="text-xs font-bold text-[#1C4ED8] hover:underline underline-offset-4"
                            >
                                Forgot password?
                            </Link>
                        }
                    />

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none group">
                            <span
                                className={`flex h-4 w-4 items-center justify-center rounded-[5px] border transition-colors ${
                                    rememberMe
                                        ? "bg-[#1C4ED8] border-[#1C4ED8]"
                                        : "bg-white border-zinc-300 group-hover:border-zinc-400"
                                }`}
                            >
                                {rememberMe && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                            </span>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="sr-only"
                            />
                            <span className="text-xs font-semibold text-zinc-600">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-[#1C4ED8] text-white rounded-xl font-bold text-sm hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 shadow-sm shadow-[#1C4ED8]/20"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <OrDivider />

                <GoogleButton onClick={handleGoogle} />

                <div className="mt-6">
                    <p className="text-sm text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-[#1C4ED8] font-bold hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </AuthShell>
    );
}
