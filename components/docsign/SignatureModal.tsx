"use client";

import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { X, RotateCcw, Check, PenTool, Upload, Image as ImageIcon, Trash2, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/lib/api";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (signatureDataUrl: string) => void;
    title?: string;
}

interface SavedSignature {
    id: string;
    signature_data: string;
    type: string;
}

export default function SignatureModal({ isOpen, onClose, onSave, title = "Adopt your Signature" }: SignatureModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);
    
    const [activeTab, setActiveTab] = useState<'draw' | 'upload' | 'gallery'>('draw');
    const [isEmpty, setIsEmpty] = useState(true);
    const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Fetch saved signatures
    useEffect(() => {
        if (isOpen) {
            fetchSignatures();
        }
    }, [isOpen]);

    const fetchSignatures = async () => {
        try {
            const res = await api.get('/signatures');
            setSavedSignatures(res.data);
            if (res.data.length > 0 && activeTab === 'draw') {
                // Keep it on draw, but could switch to gallery
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Initialize Signature Pad
    useEffect(() => {
        if (isOpen && activeTab === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current;
            const setupCanvas = () => {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d")?.scale(ratio, ratio);

                const pad = new SignaturePad(canvas, {
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    penColor: 'rgb(0, 0, 0)'
                });

                pad.addEventListener("endStroke", () => setIsEmpty(pad.isEmpty()));
                signaturePadRef.current = pad;
            };

            const timer = setTimeout(setupCanvas, 100);
            return () => {
                clearTimeout(timer);
                if (signaturePadRef.current) {
                    signaturePadRef.current.off();
                    signaturePadRef.current = null;
                }
            };
        }
    }, [isOpen, activeTab]);

    const handleClear = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
            setIsEmpty(true);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setIsEmpty(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFinalSave = async () => {
        let finalDataUrl = "";
        let type = activeTab;

        if (activeTab === 'draw' && signaturePadRef.current) {
            finalDataUrl = signaturePadRef.current.toDataURL("image/png");
        } else if (activeTab === 'upload' && previewImage) {
            finalDataUrl = previewImage;
        } else if (activeTab === 'gallery' && previewImage) {
            finalDataUrl = previewImage;
        }

        if (!finalDataUrl) return;

        setIsLoading(true);
        try {
            // Save to backend for reuse if it's new
            if (activeTab !== 'gallery') {
                await api.post('/signatures', {
                    signature_data: finalDataUrl,
                    type: activeTab === 'draw' ? 'drawn' : 'uploaded'
                });
            }
            
            onSave(finalDataUrl);
            onClose();
        } catch (error) {
            toast.error("Failed to save signature to gallery.");
            // Still proceed to use it in the document
            onSave(finalDataUrl);
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSavedSignature = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.delete(`/signatures/${id}`);
            setSavedSignatures(prev => prev.filter(s => s.id !== id));
            if (previewImage === savedSignatures.find(s => s.id === id)?.signature_data) {
                setPreviewImage(null);
                setIsEmpty(true);
            }
        } catch (error) {
            toast.error("Delete failed.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-zinc-100 flex flex-col"
                    >
                        {/* Header & Tabs */}
                        <div className="bg-zinc-50/50 px-8 pt-8 pb-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <PenTool className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <PenTool className="h-4 w-4 text-zinc-400" />
                                            <h2 className="text-sm font-black text-zinc-900">{title}</h2>
                                        </div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                            <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" /> Professional & Valid
                                        </p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-all">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex p-1 bg-zinc-200/50 rounded-2xl gap-1">
                                {[
                                    { id: 'draw', label: 'Draw', icon: PenTool },
                                    { id: 'upload', label: 'Upload', icon: Upload },
                                    { id: 'gallery', label: 'My Gallery', icon: ImageIcon }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id as any);
                                            setIsEmpty(tab.id === 'gallery' ? !previewImage : true);
                                        }}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
                                            activeTab === tab.id 
                                                ? "bg-white text-zinc-900 shadow-sm" 
                                                : "text-zinc-500 hover:text-zinc-700"
                                        )}
                                    >
                                        <tab.icon className="h-3.5 w-3.5" />
                                        {tab.label}
                                        {tab.id === 'gallery' && savedSignatures.length > 0 && (
                                            <span className="bg-blue-600 text-white px-1.5 rounded-full text-[8px] h-4 min-w-[16px] flex items-center justify-center">
                                                {savedSignatures.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'draw' && (
                                    <motion.div 
                                        key="draw"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="relative"
                                    >
                                        <canvas
                                            ref={canvasRef}
                                            className="w-full h-64 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 cursor-crosshair hover:border-blue-200 transition-colors"
                                        />
                                        {isEmpty && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <p className="text-xs font-black text-zinc-300 uppercase tracking-widest">Sign your name here</p>
                                            </div>
                                        )}
                                        <button onClick={handleClear} className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-[10px] font-black text-zinc-500 hover:text-zinc-900 shadow-sm transition-all">
                                            <RotateCcw className="h-3.5 w-3.5" /> Clear
                                        </button>
                                    </motion.div>
                                )}

                                {activeTab === 'upload' && (
                                    <motion.div 
                                        key="upload"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="w-full"
                                    >
                                        {previewImage ? (
                                            <div className="relative w-full h-64 border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50/10 flex items-center justify-center p-8 group">
                                                <img src={previewImage} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                                                <button onClick={() => { setPreviewImage(null); setIsEmpty(true); }} className="absolute -top-3 -right-3 h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full h-64 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                                            >
                                                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <Upload className="h-6 w-6 text-zinc-400 group-hover:text-blue-500" />
                                                </div>
                                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Drag or Click to Upload Image</p>
                                            </div>
                                        )}
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </motion.div>
                                )}

                                {activeTab === 'gallery' && (
                                    <motion.div 
                                        key="gallery"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="w-full"
                                    >
                                        {savedSignatures.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-4 max-h-64 overflow-auto pr-2 custom-scrollbar">
                                                {savedSignatures.map(sig => (
                                                    <div 
                                                        key={sig.id}
                                                        onClick={() => { setPreviewImage(sig.signature_data); setIsEmpty(false); }}
                                                        className={cn(
                                                            "relative h-32 p-4 bg-zinc-50 border-2 rounded-2xl flex items-center justify-center cursor-pointer transition-all group",
                                                            previewImage === sig.signature_data ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-500/10" : "border-zinc-200 hover:border-zinc-300"
                                                        )}
                                                    >
                                                        <img src={sig.signature_data} className="max-w-full max-h-full object-contain" />
                                                        <button 
                                                            onClick={(e) => deleteSavedSignature(sig.id, e)}
                                                            className="absolute top-2 right-2 h-7 w-7 bg-white/80 backdrop-blur-sm text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
                                                <ImageIcon className="h-8 w-8 opacity-20" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">No saved signatures yet</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-8 flex items-center justify-between gap-4">
                                <button
                                    onClick={onClose}
                                    className="h-12 px-8 rounded-2xl text-[11px] font-black text-zinc-500 hover:bg-zinc-100 transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFinalSave}
                                    disabled={isEmpty || isLoading}
                                    className="h-12 px-10 rounded-2xl bg-blue-600 text-white text-[11px] font-black flex items-center gap-2 hover:bg-blue-700 disabled:opacity-40 shadow-xl shadow-blue-500/30 transition-all uppercase tracking-widest"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Use Signature
                                </button>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold text-zinc-400 tracking-tight tracking-widest uppercase">Encrypted Session Secure</p>
                            </div>
                            <span className="text-[10px] font-black text-zinc-300">v2.1</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
