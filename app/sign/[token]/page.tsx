"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Loader2,
    ShieldCheck,
    CheckCircle2,
    ChevronLeft,
    User,
    ArrowRight,
    Lock,
    FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const PdfEditor = dynamic(() => import("@/components/docsign/PdfEditor"), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center bg-zinc-100">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    ),
});

interface SignRequest {
    id: string;
    receiver_name: string;
    receiver_email: string;
    status: string;
    user: {
        id: string;
        name: string;
    };
    document: {
        id: string;
        name: string;
        metadata?: {
            html_content?: string;
            fields?: any[];
        };
    };
}

export default function GuestSignPage() {
    const params = useParams();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [signRequest, setSignRequest] = useState<SignRequest | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [hasSigned, setHasSigned] = useState(false);
    const [view, setView] = useState<"welcome" | "sign">("welcome");
    const [pdfFields, setPdfFields] = useState<any[]>([]);
    const [legacyVirtual, setLegacyVirtual] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
                const response = await fetch(`${backendUrl}/api/sign/${token}`);
                if (!response.ok) throw new Error("Request invalid or expired.");

                const data = await response.json();
                setSignRequest(data.sign_request);
                setPdfFields(data.sign_request.document.metadata?.fields || []);

                if (data.sign_request.document.metadata?.html_content) {
                    setLegacyVirtual(true);
                    setFileUrl(null);
                } else {
                    setLegacyVirtual(false);
                    setFileUrl(`${backendUrl}/api/sign/${token}/file`);
                }
            } catch (err: any) {
                console.error(err);
                toast.error("Invalid or expired sign request.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [token]);

    const handleSignComplete = async () => {
        setHasSigned(true);
        setView("welcome");
        toast.success("Document signed successfully!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
                <div className="h-16 w-16 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center shadow-xl animate-pulse">
                    <img src="/logo.png" alt="Offerra" className="h-8 w-8 grayscale" />
                </div>
                <p className="mt-8 text-xs font-black text-zinc-400 uppercase tracking-[0.3em] animate-pulse">Secure Signing Room</p>
            </div>
        );
    }

    if (!signRequest) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
                <div className="h-20 w-20 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-sm">
                    <ShieldCheck className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-black text-zinc-900 mb-2">Access Denied</h2>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">This sign request either doesn&apos;t exist or has expired for security reasons.</p>
            </div>
        );
    }

    if (legacyVirtual) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
                <div className="h-20 w-20 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-sm">
                    <FileText className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-xl font-black text-zinc-900 mb-2">Unsupported document format</h2>
                <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                    This link points to an old HTML-based contract that is no longer supported. Ask{" "}
                    <span className="font-bold text-zinc-800">{signRequest.user.name}</span> to create a PDF in DocSign and send a new signing link.
                </p>
            </div>
        );
    }

    if (hasSigned) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-zinc-900">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center">
                    <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tight">Successfully Signed!</h1>
                    <p className="text-zinc-500 font-medium leading-relaxed mb-10">
                        You have successfully signed the document. {signRequest.user.name} has been notified and will receive the final copy.
                    </p>
                    <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 flex items-center gap-4 group cursor-pointer hover:bg-zinc-100 transition-all">
                        <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                            <img src="/logo.png" alt="Offerra" className="h-6 w-6" />
                        </div>
                        <div className="text-left leading-tight">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Signed with</p>
                            <p className="text-sm font-black">Offerra DocSign Pro</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-300 ml-auto group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                </motion.div>
                <p className="mt-12 text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em]">Powered by Offerra · 2026</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">
            <AnimatePresence mode="wait">
                {view === "welcome" ? (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex items-center justify-center p-6"
                    >
                        <div className="max-w-2xl w-full">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                                        <img src="/logo.png" alt="Offerra" className="h-5 w-5" />
                                    </div>
                                    <span className="text-lg font-black tracking-tight uppercase">
                                        Offerra<span className="text-blue-600">.</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                                    <Lock className="h-3 w-3" />
                                    End-to-End Encrypted
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-zinc-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] relative">
                                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 block">Signature Request</span>
                                <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-8 leading-[1.1]">
                                    Hello {signRequest.receiver_name || "there"}, <br />
                                    Please review & sign.
                                </h1>

                                <div className="space-y-6 mb-12">
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center shrink-0">
                                            <User className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Sender</p>
                                            <p className="text-sm font-black">{signRequest.user.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center shrink-0">
                                            <FileText className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Document</p>
                                            <p className="text-sm font-black">{signRequest.document.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setView("sign")}
                                    className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    Review Document
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="sign"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col h-screen"
                    >
                        <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-zinc-100 shrink-0 shadow-sm z-50">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setView("welcome")} className="p-2 rounded-full hover:bg-zinc-50 transition-colors">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2 py-1 bg-zinc-50 rounded">
                                    Signing for {signRequest.user.name}
                                </span>
                            </div>

                            <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                                Secure Room
                            </div>
                        </div>

                        {fileUrl ? (
                            <PdfEditor
                                guestToken={token}
                                documentId={signRequest.document.id}
                                pdfUrl={fileUrl}
                                initialFields={pdfFields}
                                onSaved={() => {}}
                                onGuestSubmitted={handleSignComplete}
                                onClose={() => setView("welcome")}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-zinc-100">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
