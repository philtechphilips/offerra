"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Trash2, CheckCircle2, Loader2, Sparkles, AlertCircle, Briefcase, Settings, Star, Eye, X, Copy, Zap, Linkedin, Twitter, Github } from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

interface CVData {
    id: number;
    filename: string;
    profile_name: string;
    is_active: boolean;
    parsed_data: any;
    parsed_at: string;
    created_at: string;
}

const DynamicCVRenderer = ({ data }: { data: any }) => {
    if (data === null || data === undefined) return null;

    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
        const strVal = data.toString();
        // If it's a long string, display it as a paragraph card
        if (strVal.length > 80) {
            return (
                <p className="text-sm font-medium leading-relaxed text-zinc-600 bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm mt-1">
                    {strVal}
                </p>
            );
        }
        return <span className="text-sm font-black text-black">{strVal}</span>;
    }

    if (Array.isArray(data)) {
        if (data.length === 0) return null;

        // If it's an array of strings (e.g., skills, highlights)
        if (typeof data[0] === 'string' || typeof data[0] === 'number') {
            return (
                <div className="flex flex-wrap gap-2 mt-2">
                    {data.map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                            {item}
                        </span>
                    ))}
                </div>
            );
        }

        // If it's an array of objects (e.g., work, education)
        return (
            <div className="space-y-4 mt-3">
                {data.map((item, idx) => (
                    <div key={idx} className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl">
                        <DynamicCVRenderer data={item} />
                    </div>
                ))}
            </div>
        );
    }

    if (typeof data === 'object') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-2">
                {Object.entries(data).map(([key, value]) => {
                    if (value === null || value === undefined || value === '') return null;

                    const isFullWidthText = typeof value === 'string' && value.length > 80;
                    const isObjectOrArray = typeof value === 'object';
                    const colSpan = isFullWidthText || isObjectOrArray ? 'md:col-span-2' : '';
                    const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    return (
                        <div key={key} className={colSpan}>
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{title}</div>
                            <DynamicCVRenderer data={value} />
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
};

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [cvs, setCvs] = useState<CVData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [previewCv, setPreviewCv] = useState<CVData | null>(null);
    const [isGeneratingBios, setIsGeneratingBios] = useState(false);
    const [biosData, setBiosData] = useState<any>(null);
    const [isBiosModalOpen, setIsBiosModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCVs = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/cv');
            setCvs(res.data.cvs || []);
        } catch (err: any) {
            toast.error("Failed to load CV data.");
            setCvs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCVs();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so the same file could be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";

        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
            toast.error("Please upload a PDF, DOCX, or TXT file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("cv", file);

        setIsUploading(true);
        toast.loading("Analyzing your CV. This might take a moment...", { id: "cv-upload" });

        try {
            const res = await api.post('/cv/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("CV uploaded and analyzed successfully!", { id: "cv-upload" });
            fetchCVs(); // Refresh the data
        } catch (err: any) {
            toast.error("Failed to upload CV. Please try again.", { id: "cv-upload" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteCV = async (id: number) => {
        if (!confirm("Are you sure you want to delete this CV?")) return;

        setIsDeleting(id);
        try {
            await api.delete(`/cv/${id}`);
            toast.success("CV deleted successfully!");
            fetchCVs();
        } catch (err: any) {
            toast.error("Failed to delete CV.");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleActivateCV = async (id: number) => {
        toast.loading("Activating CV...", { id: "cv-activate" });
        try {
            await api.put(`/cv/${id}/activate`);
            toast.success("CV activated successfully!", { id: "cv-activate" });
            fetchCVs();
        } catch (err: any) {
            toast.error("Failed to activate CV.", { id: "cv-activate" });
        }
    };

    const handleGenerateBios = async () => {
        setIsGeneratingBios(true);
        toast.loading("Engine analyzing CV and writing tailored bios...", { id: "bio-gen" });
        try {
            const res = await api.post('/cv/generate-bios');
            setBiosData(res.data);
            setIsBiosModalOpen(true);
            toast.success("Social branding bios generated successfully!", { id: "bio-gen" });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to generate bios. Ensure you have an active CV.", { id: "bio-gen" });
        } finally {
            setIsGeneratingBios(false);
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-black">Profile & CV</h1>
                <p className="mt-2 text-sm font-medium text-zinc-400">Manage your resume and personal details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: CV Management */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Upload / Status Card */}
                    <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-black mb-1">Your Resume Engine</h2>
                                <p className="text-sm font-bold text-zinc-400">
                                    Offerra AI uses your CV to match you with jobs and autofill applications with superhuman speed.
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <FileText className="h-6 w-6" />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="mt-8 flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/50">
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading CV Data...</p>
                            </div>
                        ) : cvs.length > 0 ? (
                            <div className="mt-8 space-y-4">
                                {cvs.map((cvItem) => (
                                    <div key={cvItem.id} className={`p-5 rounded-2xl border transition-all ${cvItem.is_active ? 'border-emerald-200 bg-emerald-50/30' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-xl ${cvItem.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-black">{cvItem.profile_name || cvItem.filename}</h3>
                                                    <p className="text-xs font-bold text-zinc-400 mt-1">Uploaded {formatDate(cvItem.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {cvItem.is_active ? (
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                                                        <CheckCircle2 className="h-3 w-3" /> Active
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleActivateCV(cvItem.id)}
                                                        className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Star className="h-3 w-3" /> Make Active
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setPreviewCv(cvItem)}
                                                    className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Preview Extracted Data"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCV(cvItem.id)}
                                                    disabled={isDeleting === cvItem.id}
                                                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isDeleting === cvItem.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 mt-4 border-t border-zinc-100">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="w-full border-2 border-dashed border-zinc-200 hover:border-[#1C4ED8] hover:bg-blue-50/30 text-zinc-500 hover:text-[#1C4ED8] py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        Upload Additional CV
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-zinc-200 hover:border-[#1C4ED8] hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-all group"
                                >
                                    <div className="h-16 w-16 mb-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-base font-black text-black tracking-tight mb-2">Upload your resume to activate AI</h3>
                                    <p className="text-sm font-bold text-zinc-400 text-center max-w-sm">
                                        We support PDF, DOCX, and TXT files up to 5MB. We'll extract and parse your data immediately.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview of Parsed Data (if available) */}
                    {cvs.length > 0 && (
                        <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-black tracking-tight text-black mb-6 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-500" />
                                Insights from Active CV
                            </h2>

                            {(() => {
                                const activeCv = cvs.find(c => c.is_active) || cvs[0];
                                if (!activeCv || !activeCv.parsed_data) return <p className="text-sm text-zinc-500 font-medium">No valid insights found for this CV.</p>;

                                const parsedCv = activeCv.parsed_data;

                                return (
                                    <div className="space-y-8">
                                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Extracted Name</div>
                                                    <div className="text-sm font-black text-black truncate">{parsedCv.basics?.name || "—"}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Designation</div>
                                                    <div className="text-sm font-black text-black truncate">{parsedCv.basics?.title || "—"}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Skills Mapped</div>
                                                    <div className="text-sm font-black text-black">{parsedCv.skills?.length || 0} domains</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Role Match Info</div>
                                                    <div className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Active</div>
                                                </div>
                                            </div>
                                        </div>

                                        {parsedCv.basics?.summary && (
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">Professional Summary</h3>
                                                <p className="text-sm font-medium leading-relaxed text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                                    {parsedCv.basics.summary}
                                                </p>
                                            </div>
                                        )}

                                        {parsedCv.skills && parsedCv.skills.length > 0 && (
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">Technical Artillery</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {parsedCv.skills.map((skillGroup: any, idx: number) => (
                                                        skillGroup.keywords?.map((keyword: string, kIdx: number) => (
                                                            <span key={`${idx}-${kIdx}`} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                                                                {keyword}
                                                            </span>
                                                        ))
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {parsedCv.work && parsedCv.work.length > 0 && (
                                            <div className="pt-4 border-t border-zinc-50">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 text-center">Experience Timeline</h3>
                                                <div className="relative border-l-2 border-zinc-100 ml-4 space-y-6">
                                                    {parsedCv.work.slice(0, 3).map((job: any, idx: number) => (
                                                        <div key={idx} className="relative pl-8">
                                                            <div className="absolute top-1 -left-[21px] flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-white">
                                                                <Briefcase className="h-4 w-4" />
                                                            </div>
                                                            <div className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-blue-100 hover:shadow-sm transition-all group">
                                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                                                    <div className="text-sm font-black text-black group-hover:text-blue-600 transition-colors">{job.position}</div>
                                                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg mt-2 md:mt-0">
                                                                        {job.startDate ? job.startDate.substring(0, 7) : ''} - {job.endDate ? job.endDate.substring(0, 7) : 'Present'}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs font-bold text-zinc-500 mb-4">{job.name}</div>
                                                                {job.summary && <p className="text-xs font-medium leading-relaxed text-zinc-600">{job.summary}</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* Right Column: Account Setup */}
                <div className="space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex flex-col items-center pb-8 border-b border-zinc-100 text-center">
                            <div className="h-24 w-24 rounded-full bg-[#1C4ED8] flex items-center justify-center font-black text-white text-3xl uppercase shadow-xl shadow-blue-600/20 mb-4 ring-8 ring-blue-50">
                                {getInitials(user?.name)}
                            </div>
                            <h3 className="text-xl font-black text-black tracking-tight">{user?.name}</h3>
                            <p className="text-sm font-bold text-zinc-400 mt-1">{user?.email}</p>
                            <span className="mt-4 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                {user?.role || "Basic"} Tier
                            </span>
                        </div>
                        <div className="pt-8">
                            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                                    Account settings and subscription upgrades are managed centrally.
                                </p>
                            </div>
                            <button disabled className="mt-4 w-full bg-zinc-900 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                                <Settings className="h-3 w-3" /> Manage Account
                            </button>
                        </div>
                    </div>

                    {/* Brand & SEO Bios UI */}
                    <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black text-black tracking-tight mb-1">Brand & SEO</h3>
                                <p className="text-sm font-bold text-zinc-400">Optimize for X, LinkedIn & Upwork</p>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
                                <Zap className="h-5 w-5" />
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (biosData) setIsBiosModalOpen(true);
                                else handleGenerateBios();
                            }}
                            disabled={isGeneratingBios || cvs.length === 0}
                            className={`w-full ${biosData ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' : 'bg-zinc-900 text-white hover:bg-zinc-800'} font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                            {isGeneratingBios ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            {biosData ? "View Generated Bios" : "Generate AI Bios"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bios Modal */}
            {isBiosModalOpen && biosData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 bg-zinc-50/50 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-black tracking-tight">AI Generated Brand Bios</h2>
                                    <p className="text-xs font-bold text-zinc-400 mt-0.5">Optimized for search indexing</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsBiosModalOpen(false)}
                                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-black transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto w-full flex-1 bg-zinc-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pb-8 relative">
                                {['linkedin', 'upwork', 'twitter', 'github'].map((platformKey) => {
                                    const data = biosData[platformKey];
                                    if (!data) return null;
                                    const platform = platformKey;
                                    const platMeta: Record<string, any> = {
                                        'linkedin': { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'LinkedIn' },
                                        'twitter': { icon: Twitter, color: 'text-black', bg: 'bg-zinc-100', border: 'border-zinc-200', label: 'X (Twitter)' },
                                        'github': { icon: Github, color: 'text-zinc-800', bg: 'bg-zinc-100', border: 'border-zinc-200', label: 'GitHub' },
                                        'upwork': { icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Upwork' },
                                    };

                                    const meta = platMeta[platform.toLowerCase()] || { icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: platform };
                                    const IconInfo = meta.icon;

                                    return (
                                        <div key={platform} className={`bg-white border ${meta.border} rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full`}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
                                                    <IconInfo className="h-5 w-5" />
                                                </div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-800">{meta.label}</h4>
                                            </div>

                                            <div className="flex-1">
                                                {typeof data === 'string' ? (
                                                    <p className="text-sm font-medium text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">{data}</p>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {Object.entries(data).map(([key, val]: [string, any]) => (
                                                            <div key={key} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">{key}</span>
                                                                <p className="text-sm font-medium text-zinc-700 leading-relaxed whitespace-pre-wrap">{val}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const text = typeof data === 'string' ? data : Object.entries(data).map(([k, v]) => `${k.toUpperCase()}:\n${v}`).join('\n\n');
                                                    navigator.clipboard.writeText(text);
                                                    toast.success(`${meta.label} bio copied!`);
                                                }}
                                                className={`w-full mt-6 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 ${meta.color} font-black text-[11px] uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2`}
                                            >
                                                <Copy className="h-4 w-4" /> Copy to Clipboard
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-center -mt-4 pb-8">
                                <button
                                    onClick={handleGenerateBios}
                                    disabled={isGeneratingBios}
                                    className="bg-white border border-zinc-200 text-zinc-600 hover:text-black hover:border-zinc-300 font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-full shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isGeneratingBios ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    {isGeneratingBios ? "Regenerating..." : "Regenerate Bios"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {previewCv && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 bg-zinc-50/50 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-black tracking-tight">Extracted Intelligence</h2>
                                    <p className="text-xs font-bold text-zinc-400 mt-0.5">{previewCv.profile_name || previewCv.filename}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewCv(null)}
                                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-black transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto w-full flex-1 bg-zinc-50/30">
                            <div className="space-y-8 max-w-3xl mx-auto pb-8">
                                <div className="space-y-8 max-w-4xl mx-auto pb-8 bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                                    <DynamicCVRenderer data={previewCv.parsed_data} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
