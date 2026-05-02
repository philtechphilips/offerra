"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(true);
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
        if (!agree) {
            setError("Please accept the Terms and Privacy Policy to continue.");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: password,
            });
            const data = response.data ?? {};
            if (!data.user || !data.access_token) {
                throw new Error("Unexpected sign-up response.");
            }
            setAuth(data.user, data.access_token);
            toast.success("Account created! Welcome to Offerra.");
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = () => {
        toast.info("Google sign-up is coming soon.");
    };

    return (
        <AuthShell mode="signup">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
            >
                <BrandMark className="mb-10 lg:mb-14" />

                <h1 className="text-[34px] sm:text-4xl font-black tracking-tight text-zinc-900 mb-1">
                    Sign up
                </h1>
                <p className="text-sm text-zinc-400 mb-8">Create your free account in seconds.</p>

                <form onSubmit={handleSignup} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <Field
                        label="Full Name"
                        icon={<User className="h-4 w-4" />}
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={setName}
                        autoComplete="name"
                        required
                    />

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
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                    />

                    <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 accent-zinc-900"
                        />
                        <span className="text-[11px] text-zinc-500 leading-relaxed">
                            I agree to the{" "}
                            <Link href="/terms" className="text-zinc-900 font-bold underline underline-offset-2">
                                Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-zinc-900 font-bold underline underline-offset-2">
                                Privacy Policy
                            </Link>
                            .
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-[#1C4ED8] text-white rounded-xl font-bold text-sm hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 shadow-sm shadow-[#1C4ED8]/20"
                    >
                        {isLoading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <OrDivider />

                <GoogleButton onClick={handleGoogle} label="Sign up with Google" />

                <div className="mt-6">
                    <p className="text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#1C4ED8] font-bold hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </AuthShell>
    );
}
