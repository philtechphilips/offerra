"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, FileText, Trash2, CheckCircle2, Loader2, Sparkles,
    Briefcase, Eye, X, Copy, Zap, Linkedin, Twitter, Github,
    Mail, Plus, ShieldCheck, Clock, ExternalLink, ChevronRight,
    Search, Layout, Edit
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import { cn } from "@/app/lib/utils";

interface CVData {
    id: string;
    filename: string;
    profile_name: string;
    is_active: boolean;
    parsed_data: any;
    parsed_at: string;
    created_at: string;
}

// Premium Light Theme Classes
const GmailLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 6.75-9-6.75V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.41.17-.8.47-1.09.3-.29.69-.41 1.03-.41h.5l10 7.5 10-7.5h.5c.34 0 .73.12 1.03.41.3.29.47.68.47 1.09z" fill="#EA4335" />
    </svg>
);

const containerClasses = "rounded-3xl border border-zinc-200 bg-white transition-all duration-300";
const cardHeaderClasses = "flex items-center justify-between border-b border-zinc-100 p-6 sm:px-8";

const DynamicCVRenderer = ({ data, depth = 0 }: { data: any, depth?: number }) => {
    if (data === null || data === undefined) return null;

    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
        const strVal = data.toString();
        if (strVal.length > 80) {
            return (
                <p className="text-sm leading-relaxed text-zinc-600 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 mt-1">
                    {strVal}
                </p>
            );
        }
        return <span className="text-sm font-semibold text-zinc-900">{strVal}</span>;
    }

    if (Array.isArray(data)) {
        if (data.length === 0) return null;
        if (typeof data[0] === 'string' || typeof data[0] === 'number') {
            return (
                <div className="flex flex-wrap gap-2 mt-2">
                    {data.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                            {item}
                        </span>
                    ))}
                </div>
            );
        }
        return (
            <div className="space-y-4 mt-3">
                {data.map((item, idx) => (
                    <div key={idx} className="bg-white border border-zinc-100 p-5 rounded-2xl">
                        <DynamicCVRenderer data={item} depth={depth + 1} />
                    </div>
                ))}
            </div>
        );
    }

    if (typeof data === 'object') {
        return (
            <div className={cn(
                "grid grid-cols-1 gap-x-8 gap-y-6 mt-2",
                depth === 0 ? "md:grid-cols-2" : "md:grid-cols-1"
            )}>
                {Object.entries(data).map(([key, value]) => {
                    if (value === null || value === undefined || value === '') return null;
                    const isFullWidthText = typeof value === 'string' && value.length > 150;
                    const isComplex = typeof value === 'object';
                    const colSpan = (isFullWidthText || isComplex) && depth === 0 ? 'md:col-span-2' : '';
                    const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    return (
                        <div key={key} className={cn("space-y-1.5", colSpan)}>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{title}</div>
                            <DynamicCVRenderer data={value} depth={depth + 1} />
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [cvs, setCvs] = useState<CVData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [previewCv, setPreviewCv] = useState<CVData | null>(null);
    const [isGeneratingBios, setIsGeneratingBios] = useState(false);
    const [biosData, setBiosData] = useState<any>(null);
    const [isBiosModalOpen, setIsBiosModalOpen] = useState(false);
    const [isConnectingGmail, setIsConnectingGmail] = useState(false);
    const [cvToDelete, setCvToDelete] = useState<CVData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCVs = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/cv');
            setCvs(res.data.cvs || []);
        } catch (err: any) {
            toast.error("Failed to load your resumes.");
            setCvs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCVs();
        refreshUser();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (fileInputRef.current) fileInputRef.current.value = "";
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
            toast.error("Please upload a PDF, Word, or TXT file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB.");
            return;
        }
        const formData = new FormData();
        formData.append("cv", file);
        setIsUploading(true);
        const loadingId = toast.loading("Analyzing your resume...");
        try {
            const res = await api.post('/cv/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Resume uploaded successfully!", { id: loadingId });
            fetchCVs();
        } catch (err: any) {
            toast.error("Failed to upload. Please try again.", { id: loadingId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteCV = (cv: CVData) => {
        setCvToDelete(cv);
    };

    const confirmDelete = async () => {
        if (!cvToDelete) return;
        const id = cvToDelete.id;
        setIsDeleting(id);
        setCvToDelete(null);
        try {
            await api.delete(`/cv/${id}`);
            toast.success("Resume deleted!");
            fetchCVs();
        } catch (err: any) {
            toast.error("Failed to delete resume.");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleActivateCV = async (id: string) => {
        const loadingId = toast.loading("Updating your active resume...");
        try {
            await api.put(`/cv/${id}/activate`);
            toast.success("Resume activated!", { id: loadingId });
            fetchCVs();
        } catch (err: any) {
            toast.error("Failed to activate resume.", { id: loadingId });
        }
    };

    const handleGenerateBios = async () => {
        setIsGeneratingBios(true);
        const loadingId = toast.loading("Creating professional bios for you...");
        try {
            const res = await api.post('/cv/generate-bios');
            setBiosData(res.data);
            setIsBiosModalOpen(true);
            toast.success("Bios generated!", { id: loadingId });
        } catch (err: any) {
            toast.error("Failed to generate bios. Make sure you have an active resume.", { id: loadingId });
        } finally {
            setIsGeneratingBios(false);
        }
    };

    const handleConnectGmail = async () => {
        setIsConnectingGmail(true);
        try {
            const res = await api.get('/auth/google/redirect');
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            toast.error("Failed to initiate Google connection.");
            setIsConnectingGmail(false);
        }
    };

    const refreshUser = async () => {
        try {
            const res = await api.get('/user');
            if (res.data) {
                setUser(res.data);
            }
        } catch (err) {
            console.error("Failed to refresh user data", err);
        }
    };

    const handleSyncGmail = async () => {
        setIsConnectingGmail(true);
        try {
            await api.post('/auth/google/sync');
            toast.success("Sync started in the background!");
        } catch (err) {
            toast.error("Sync failed to start.");
        } finally {
            setIsConnectingGmail(false);
        }
    };

    const handleDisconnectGmail = async () => {
        if (!confirm("Are you sure you want to disconnect your Google account?")) return;
        setIsConnectingGmail(true);
        try {
            const res = await api.post('/auth/google/disconnect');
            setUser(res.data.user);
            toast.success("Google account disconnected and access revoked.");
        } catch (err) {
            toast.error("Failed to disconnect Gmail.");
        } finally {
            setIsConnectingGmail(false);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const error = urlParams.get('error');

        if (success === 'google_connected') {
            toast.success("Gmail connected successfully!");
            refreshUser();
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (error) {
            toast.error(`Connection failed: ${error.replace(/_/g, ' ')}`);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const activeCv = cvs.find((cv) => cv.is_active) || cvs[0] || null;
    const parsed = activeCv?.parsed_data;
    const skills = Array.isArray(parsed?.skills) ? parsed.skills.slice(0, 10) : [];
    const workExperience = Array.isArray(parsed?.work_experience) ? parsed.work_experience.slice(0, 3) : [];
    const currentTitle = parsed?.current_title || parsed?.headline || "Professional";
    const yearsOfExperience = parsed?.years_of_experience || parsed?.work_experience?.length || 0;
    const biosReadyCount = biosData ? Object.keys(biosData).length : 0;

    return (
        <div className="w-full pb-20 selection:bg-blue-100">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />

            {/* Main Wrapper with no max-width constraints for full width requirement */}
            <div className="w-full px-4 sm:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Profile Header Card */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(containerClasses, "relative overflow-hidden p-0 border-none bg-gradient-to-br from-white to-zinc-50")}
                >
                    <div className="flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center">
                        <div className="flex flex-1 items-start gap-8">
                            <div className="relative">
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2.5rem] bg-blue-600 text-3xl font-bold text-white">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                                </div>
                            </div>

                            <div className="min-w-0 pt-2">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                                        {user?.plan?.name || "Starter Pack"} • {user?.credits || 0} Credits
                                    </span>
                                    <span className="text-xs font-medium text-zinc-400">
                                        {cvs.length} Documents
                                    </span>
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                                    {user?.name || "Your Profile"}
                                </h1>
                                <div className="mt-5 flex flex-wrap items-center gap-8 text-sm text-zinc-500 font-medium">
                                    <span className="inline-flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-zinc-400" />
                                        {user?.email}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle2 className={cn("h-4 w-4", activeCv ? "text-emerald-500" : "text-zinc-300")} />
                                        {activeCv ? "Resume Verified" : "No resume yet"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row lg:flex-row">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="inline-flex items-center justify-center gap-2.5 h-14 rounded-2xl bg-blue-600 px-10 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                            >
                                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                                Upload Resume
                            </button>
                            <button
                                type="button"
                                onClick={() => biosData ? setIsBiosModalOpen(true) : handleGenerateBios()}
                                disabled={isGeneratingBios || cvs.length === 0}
                                className="inline-flex items-center justify-center gap-2.5 h-14 rounded-2xl bg-blue-600 px-10 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                            >
                                {isGeneratingBios ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-white" />}
                                {biosData ? "Open My Bios" : "Create Social Bios"}
                            </button>
                        </div>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-8 lg:col-span-8">
                        {/* Resume List Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={containerClasses}
                        >
                            <div className={cardHeaderClasses}>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">My Resumes</h2>
                                        <p className="text-sm text-zinc-500">Manage all versions of your CV</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-zinc-50 rounded-full text-xs font-bold text-zinc-500 border border-zinc-100">
                                    {cvs.length} Total
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
                                        <Loader2 className="h-12 w-12 animate-spin mb-4" />
                                        <p className="text-sm font-medium">Checking your files...</p>
                                    </div>
                                ) : cvs.length === 0 ? (
                                    <div className="text-center py-16 bg-zinc-50 rounded-[2.5rem] border border-dashed border-zinc-200 px-6">
                                        <div className="mx-auto h-20 w-20 bg-white flex items-center justify-center rounded-3xl text-zinc-300">
                                            <Upload className="h-8 w-8" />
                                        </div>
                                        <h3 className="mt-8 text-2xl font-bold text-zinc-900">Upload your first resume</h3>
                                        <p className="mx-auto mt-3 max-w-sm text-sm text-zinc-500 leading-relaxed">
                                            Start by adding a resume to unlock tailored job tips and social media bios.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-10 inline-flex h-14 items-center gap-3 rounded-2xl bg-blue-600 px-10 text-sm font-bold text-white transition-all hover:bg-blue-700"
                                        >
                                            <Plus className="h-5 w-5" />
                                            Select File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {activeCv && (
                                            <div className="relative rounded-[2.5rem] border-2 border-blue-500/10 bg-blue-50/10 p-8 transition-all hover:bg-blue-50/20">
                                                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="h-2 w-2 rounded-full bg-blue-600" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Active Resume</span>
                                                        </div>
                                                        <h3 className="truncate text-2xl font-bold tracking-tight text-zinc-900">
                                                            {activeCv.profile_name || activeCv.filename}
                                                        </h3>
                                                        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-500">
                                                            <span className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" />
                                                                Added {formatDate(activeCv.created_at)}
                                                            </span>
                                                            <span className="flex items-center gap-2">
                                                                <Briefcase className="h-4 w-4" />
                                                                {currentTitle}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setPreviewCv(activeCv)}
                                                        className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Preview
                                                    </button>
                                                    <a
                                                        href={`/dashboard/optimizer?edit=${activeCv.id}`}
                                                        className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-blue-600 text-sm font-bold text-white transition-all hover:bg-blue-700"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Architect
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-zinc-50">
                                            <div className="p-5 px-10 border-b border-zinc-100 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                                <Layout className="h-4 w-4" />
                                                Saved Versions
                                            </div>
                                            <div className="divide-y divide-zinc-100 bg-white">
                                                {cvs.filter((cv) => !cv.is_active).length > 0 ? (
                                                    cvs.filter((cv) => !cv.is_active).map((cvItem) => (
                                                        <div
                                                            key={cvItem.id}
                                                            className="flex flex-col gap-6 p-6 sm:px-10 md:flex-row md:items-center md:justify-between transition-colors hover:bg-zinc-50"
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="truncate text-lg font-bold text-zinc-900">
                                                                    {cvItem.profile_name || cvItem.filename}
                                                                </p>
                                                                <p className="mt-1 text-sm text-zinc-400">
                                                                    Uploaded {formatDate(cvItem.created_at)}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <a
                                                                    href={`/dashboard/optimizer?edit=${cvItem.id}`}
                                                                    className="h-10 px-4 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 flex items-center gap-2 hover:bg-blue-100"
                                                                >
                                                                    <Edit className="h-3.5 w-3.5" />
                                                                    Architect
                                                                </a>
                                                                <button
                                                                    onClick={() => setPreviewCv(cvItem)}
                                                                    className="h-10 px-4 rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-900"
                                                                >
                                                                    Preview
                                                                </button>
                                                                <button
                                                                    onClick={() => handleActivateCV(cvItem.id)}
                                                                    className="h-10 px-5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"
                                                                >
                                                                    Set as Active
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCV(cvItem)}
                                                                    disabled={isDeleting === cvItem.id}
                                                                    className="h-10 w-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-12 text-center">
                                                        <p className="text-sm font-medium text-zinc-400 italic">No other versions uploaded yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="group flex w-full items-center justify-between p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-100 bg-zinc-50 transition-all hover:bg-white hover:border-blue-500/20 disabled:opacity-50"
                                        >
                                            <div className="text-left">
                                                <p className="text-base font-bold text-zinc-900">Add another resume version</p>
                                                <p className="mt-1 text-sm text-zinc-500">Upload variations to see different insights.</p>
                                            </div>
                                            <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* Insights Card */}
                        {cvs.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className={containerClasses}
                            >
                                <div className={cardHeaderClasses}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                            <Zap className="h-5 w-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Resume Summary</h2>
                                            <p className="text-sm text-zinc-500">A quick look at your profile strengths</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-10 space-y-10">
                                    {!parsed ? (
                                        <div className="py-20 flex flex-col items-center justify-center text-zinc-300">
                                            <Loader2 className="h-10 w-12 animate-spin mb-4" />
                                            <p className="text-sm font-medium">Summarizing your skills...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Job Focus</p>
                                                    <p className="text-base font-bold text-zinc-900 leading-tight">{currentTitle}</p>
                                                </div>
                                                <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Skills Found</p>
                                                    <p className="text-3xl font-extrabold text-zinc-900">{skills.length}</p>
                                                </div>
                                                <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Experience</p>
                                                    <p className="text-3xl font-extrabold text-zinc-900">{yearsOfExperience} <span className="text-xs font-bold text-zinc-400">years</span></p>
                                                </div>
                                            </div>

                                            {parsed.summary && (
                                                <div className="space-y-4">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-4">About You</p>
                                                    <div className="p-8 rounded-[2.5rem] bg-zinc-50 border border-zinc-100">
                                                        <p className="text-sm font-medium leading-relaxed text-zinc-600">{parsed.summary}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                                                <div className="space-y-6">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-2">Top Skills</p>
                                                    <div className="flex flex-wrap gap-2.5">
                                                        {skills.length > 0 ? (
                                                            skills.map((skill: string, idx: number) => (
                                                                <span key={idx} className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-sm font-bold text-zinc-800">
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-zinc-400">No specific skills listed.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-2">Recent Experience</p>
                                                    <div className="space-y-4">
                                                        {workExperience.length > 0 ? (
                                                            workExperience.map((role: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-zinc-200">
                                                                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100">
                                                                        <Briefcase className="h-5 w-5 text-zinc-400" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-bold text-zinc-900 truncate">{role.title || role.position || "Untitled Position"}</p>
                                                                        <p className="text-xs font-medium text-zinc-500 mt-0.5">{role.company || role.organization || "Company"}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-zinc-400">No work history found.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Sidebar components */}
                    <div className="space-y-8 lg:col-span-4">
                        {/* Profile Status Card - Removed Black Background */}
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.12 }}
                            className={cn(containerClasses, "overflow-hidden border-none bg-blue-600 text-white")}
                        >
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                        <Zap className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">{user?.plan?.name || "Starter Pack"}</span>
                                </div>
                                <h3 className="text-3xl font-extrabold tracking-tight leading-tight">Social Profile<br />Automation</h3>
                                <div className="mt-10 grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-5 rounded-3xl">
                                        <p className="text-[10px] font-bold uppercase text-white/50 tracking-wider mb-1">Documents</p>
                                        <p className="text-3xl font-bold">{cvs.length}</p>
                                    </div>
                                    <div className="bg-white/10 p-5 rounded-3xl">
                                        <p className="text-[10px] font-bold uppercase text-white/50 tracking-wider mb-1">Generated</p>
                                        <p className="text-3xl font-bold">{biosReadyCount}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => biosData ? setIsBiosModalOpen(true) : handleGenerateBios()}
                                    disabled={isGeneratingBios || cvs.length === 0}
                                    className="w-full h-14 mt-10 bg-white text-blue-600 rounded-2xl text-sm font-bold transition-all hover:bg-blue-50 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isGeneratingBios ? "Working..." : biosData ? "Open My Bios" : "Create Social Bios"}
                                    {isGeneratingBios ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className={containerClasses}
                        >
                            <div className="p-10">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em]",
                                            user?.google_account
                                                ? user.google_account.status === 'disconnected'
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-emerald-50 text-emerald-600"
                                                : "bg-red-50 text-red-600"
                                        )}>
                                            {user?.google_account
                                                ? user.google_account.status === 'disconnected'
                                                    ? "Reconnect Needed"
                                                    : "Sync Enabled"
                                                : "Disconnected"}
                                        </span>
                                        {user?.google_account && (
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 mt-1">
                                                {user.google_account.email}
                                            </span>
                                        )}
                                    </div>
                                    {user?.google_account && (
                                        <button 
                                            onClick={handleDisconnectGmail}
                                            disabled={isConnectingGmail}
                                            className="h-8 w-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50"
                                            title="Disconnect"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-zinc-900 mb-3">Gmail Integration</h3>
                                <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-10">
                                    Allow Offerra to securely synchronize with your Gmail inbox to identify job applications, technical tests, and interview invitations automatically.
                                </p>

                                {user?.google_account && user.google_account.status === 'disconnected' ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-4">
                                            <p className="text-xs font-bold text-amber-700 leading-relaxed">
                                                ⚠️ Your Google session has expired. Please reconnect to resume email scanning.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleConnectGmail}
                                            disabled={isConnectingGmail}
                                            className="group w-full h-14 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 transition-all hover:shadow-lg hover:border-zinc-300 disabled:opacity-50 flex items-center justify-center gap-4 py-4 px-6"
                                        >
                                            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                            </svg>
                                            <span className="font-medium text-zinc-600 tracking-tight">Reconnect with Google</span>
                                        </button>
                                    </div>
                                ) : user?.google_account ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleSyncGmail}
                                            disabled={isConnectingGmail}
                                            className="group w-full h-14 rounded-2xl bg-zinc-900 text-white text-sm font-bold transition-all hover:bg-black disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-zinc-200"
                                        >
                                            {isConnectingGmail ? "Synchronizing..." : "Sync My Inbox"}
                                            <Zap className="h-4 w-4 text-emerald-400 group-hover:animate-pulse" />
                                        </button>
                                        <p className="text-[10px] font-bold text-zinc-300 text-center uppercase tracking-widest">
                                            Last scan: {user.google_account.last_synced_at ? formatDate(user.google_account.last_synced_at) : 'No recent sync'}
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleConnectGmail}
                                        disabled={isConnectingGmail}
                                        className="group w-full h-14 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 transition-all hover:shadow-lg hover:border-zinc-300 disabled:opacity-50 flex items-center justify-center gap-4 py-4 px-6 relative overflow-hidden"
                                    >
                                        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                        </svg>
                                        <span className="font-medium text-zinc-600 tracking-tight">Connect with Google</span>
                                    </button>
                                )}

                                <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Secure OAuth 2.0 Integration</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Tips Card */}
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className={cn(containerClasses, "bg-zinc-50 border-none")}
                        >
                            <div className="p-10">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">Quick Tips</h3>
                                <ul className="space-y-6">
                                    {[
                                        "Keep one resume active for best AI results.",
                                        "Refresh your social bios when you update your active resume.",
                                        "Upload different versions for different types of jobs."
                                    ].map((note, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                                            <p className="text-sm font-bold text-zinc-600 leading-relaxed">{note}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>

            {/* Bios Modal - Premium Redesign */}
            <AnimatePresence>
                {isBiosModalOpen && biosData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBiosModalOpen(false)}
                            className="absolute inset-0 bg-zinc-950/20 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-7xl rounded-[3rem] bg-white overflow-hidden flex flex-col max-h-[90vh] border border-zinc-100"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-zinc-100 p-8 sm:px-12 py-10 bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-blue-600 text-white">
                                        <Sparkles className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Social Profile Bios</h2>
                                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">Generated by AI based on your active resume</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleGenerateBios}
                                        disabled={isGeneratingBios}
                                        className="hidden sm:flex h-12 px-6 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-900 items-center gap-2"
                                    >
                                        {isGeneratingBios ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                                        Regenerate
                                    </button>
                                    <button
                                        onClick={() => setIsBiosModalOpen(false)}
                                        className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-900 transition-all"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 sm:p-12 overflow-y-auto bg-zinc-50/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                    {['linkedin', 'upwork', 'twitter', 'github'].map((platformKey) => {
                                        const data = biosData[platformKey];
                                        if (!data) return null;

                                        const platMeta: Record<string, any> = {
                                            'linkedin': { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'LinkedIn', desc: 'Professional Headline & About' },
                                            'twitter': { icon: Twitter, color: 'text-zinc-900', bg: 'bg-zinc-100', border: 'border-zinc-200', label: 'X / Twitter', desc: 'Short & Punchy Bio' },
                                            'github': { icon: Github, color: 'text-zinc-900', bg: 'bg-zinc-100', border: 'border-zinc-200', label: 'GitHub', desc: 'Developer Profile Bio' },
                                            'upwork': { icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Upwork', desc: 'Freelancer Overview' },
                                        };
                                        const meta = platMeta[platformKey] || { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', label: platformKey, desc: 'Profile Details' };
                                        const IconInfo = meta.icon;

                                        return (
                                            <motion.div
                                                key={platformKey}
                                                whileHover={{ y: -4 }}
                                                className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden transition-all"
                                            >
                                                {/* Card Header */}
                                                <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-white">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", meta.bg, meta.color)}>
                                                            <IconInfo className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold tracking-tight text-zinc-900">{meta.label}</h4>
                                                            <p className="text-xs font-medium text-zinc-400">{meta.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const text = typeof data === 'string' ? data : Object.entries(data).map(([k, v]) => `${k.toUpperCase()}:\n${v}`).join('\n\n');
                                                            navigator.clipboard.writeText(text);
                                                            toast.success(`${meta.label} bio copied!`);
                                                        }}
                                                        className="h-10 px-4 rounded-xl bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-blue-700 flex items-center gap-2"
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                        Copy All
                                                    </button>
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-8 space-y-6">
                                                    {typeof data === 'string' ? (
                                                        <div className="p-6 rounded-2xl bg-zinc-50/50 border border-zinc-100 relative group">
                                                            <p className="text-sm font-medium text-zinc-700 leading-relaxed italic">"{data}"</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6">
                                                            {Object.entries(data).map(([key, val]: [string, any]) => (
                                                                <div key={key} className="space-y-2">
                                                                    <div className="flex items-center justify-between px-1">
                                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{key}</span>
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(val);
                                                                                toast.success(`${key} copied!`);
                                                                            }}
                                                                            className="text-[9px] font-bold text-blue-500 uppercase tracking-wider hover:text-blue-700"
                                                                        >
                                                                            Copy only this
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100">
                                                                        <p className="text-sm font-medium text-zinc-700 leading-relaxed whitespace-pre-wrap">{val}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <div className="mt-16 text-center pb-8">
                                    <p className="text-sm font-medium text-zinc-400 mb-6">Want to try a different tone? Update your resume or click regenerate.</p>
                                    <button
                                        onClick={handleGenerateBios}
                                        disabled={isGeneratingBios}
                                        className="h-14 px-10 rounded-2xl bg-blue-600 text-sm font-bold text-white transition-all hover:bg-blue-700 flex items-center gap-3 mx-auto"
                                    >
                                        {isGeneratingBios ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-white" />}
                                        Regenerate All Profiles
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {previewCv && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewCv(null)}
                            className="absolute inset-0 bg-zinc-950/20 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-7xl rounded-[3rem] bg-white overflow-hidden flex flex-col max-h-[90vh] border border-zinc-100"
                        >
                            <div className="flex items-center justify-between border-b border-zinc-100 p-8 sm:px-12 py-10 bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-blue-600 text-white">
                                        <Search className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Resume Review</h2>
                                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">{previewCv.filename}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPreviewCv(null)}
                                    className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-900 transition-all"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-8 sm:p-12 overflow-y-auto bg-zinc-50/20">
                                <div className="max-w-6xl mx-auto">
                                    <div className="bg-white p-10 sm:p-16 rounded-[2.5rem] border border-zinc-100 mb-12">
                                        <div className="mb-10 flex items-center justify-between border-b border-zinc-100 pb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">Analysis Successful</span>
                                            </div>
                                        </div>
                                        <DynamicCVRenderer data={previewCv.parsed_data} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {cvToDelete && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCvToDelete(null)}
                            className="absolute inset-0 bg-zinc-950/20 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md rounded-[2.5rem] bg-white p-10 border border-zinc-100 shadow-2xl"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center mb-8">
                                    <Trash2 className="h-10 w-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-3">Delete Resume?</h3>
                                <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-10">
                                    Are you sure you want to delete <span className="font-bold text-zinc-900">"{cvToDelete.profile_name || cvToDelete.filename}"</span>? This action cannot be undone.
                                </p>
                                <div className="flex flex-col w-full gap-4">
                                    <button
                                        onClick={confirmDelete}
                                        className="h-14 w-full rounded-2xl bg-red-500 text-sm font-bold text-white transition-all hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-red-200"
                                    >
                                        Yes, Delete Permanent
                                    </button>
                                    <button
                                        onClick={() => setCvToDelete(null)}
                                        className="h-14 w-full rounded-2xl bg-zinc-50 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-100"
                                    >
                                        No, Keep It
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
