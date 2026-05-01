"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, FileText, Trash2, CheckCircle2, Loader2, Sparkles,
    Briefcase, X, Copy, Zap, Linkedin, Twitter, Github,
    Mail, Plus, ShieldCheck, ExternalLink, Search,
    Globe, Link2, ToggleLeft, ToggleRight, MapPin
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import { cn } from "@/app/lib/utils";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface CVData {
    id: string;
    filename: string;
    profile_name: string;
    is_active: boolean;
    parsed_data: any;
    parsed_at: string;
    created_at: string;
}

const GmailLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 6.75-9-6.75V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.41.17-.8.47-1.09.3-.29.69-.41 1.03-.41h.5l10 7.5 10-7.5h.5c.34 0 .73.12 1.03.41.3.29.47.68.47 1.09z" fill="#EA4335" />
    </svg>
);

const GoogleIcon = () => (
    <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
);

const DynamicCVRenderer = ({ data, depth = 0 }: { data: any, depth?: number }) => {
    if (data === null || data === undefined) return null;

    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
        const strVal = data.toString();
        if (strVal.length > 80) {
            return (
                <p className="text-sm leading-relaxed text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-100 mt-1">
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
                    <div key={idx} className="bg-white border border-zinc-100 p-5 rounded-xl">
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
                            <div className="text-[11px] font-black text-zinc-400 mb-2">{title}</div>
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
    const [confirmModal, setConfirmModal] = useState<{ title: string; description: string; confirmLabel?: string; onConfirm: () => void } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileSettings, setProfileSettings] = useState({
        username: '',
        public_profile_enabled: false,
        location: '',
        linkedin_url: '',
        github_url: '',
        twitter_url: '',
        portfolio_url: '',
        professional_headline: '',
        profile_theme: 'modern',
    });
    const [isDeducing, setIsDeducing] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (user) {
            setProfileSettings({
                username: (user as any).username ?? '',
                public_profile_enabled: (user as any).public_profile_enabled ?? false,
                location: (user as any).location ?? '',
                linkedin_url: (user as any).linkedin_url ?? '',
                github_url: (user as any).github_url ?? '',
                twitter_url: (user as any).twitter_url ?? '',
                portfolio_url: (user as any).portfolio_url ?? '',
                professional_headline: (user as any).professional_headline ?? '',
                profile_theme: (user as any).profile_theme ?? 'modern',
            });
        }
    }, [user?.id]);

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

        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const error = urlParams.get('error');

        if (success || error) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        (async () => {
            await refreshUser();
            if (success === 'google_connected') {
                toast.success("Gmail connected successfully!");
            } else if (error) {
                toast.error(`Connection failed: ${error.replace(/_/g, ' ')}`);
            }
        })();
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
        setConfirmModal(null);
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


    const handleUsernameChange = (value: string) => {
        const sanitized = value.toLowerCase().replace(/[^a-z0-9\-]/g, '');
        setProfileSettings(prev => ({ ...prev, username: sanitized }));
        setUsernameAvailable(null);
        if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
        if (sanitized.length < 3) return;
        usernameDebounceRef.current = setTimeout(async () => {
            setIsCheckingUsername(true);
            try {
                const res = await api.get('/profile/check-username', { params: { username: sanitized } });
                setUsernameAvailable(res.data.available);
            } catch {
                setUsernameAvailable(null);
            } finally {
                setIsCheckingUsername(false);
            }
        }, 500);
    };

    const saveProfileSettings = async () => {
        setIsSavingProfile(true);
        try {
            const res = await api.put('/profile/settings', profileSettings);
            setUser(res.data.user);
            toast.success("Public profile saved!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save profile.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleDeduceFromCV = async () => {
        setIsDeducing(true);
        const loadingId = toast.loading("AI is analyzing your resume to deduce profile details...");
        try {
            const res = await api.post('/profile/deduce');
            const deduced = res.data.deduced;
            setProfileSettings(prev => ({
                ...prev,
                location: deduced.location || prev.location,
                linkedin_url: deduced.linkedin_url || prev.linkedin_url,
                github_url: deduced.github_url || prev.github_url,
                twitter_url: deduced.twitter_url || prev.twitter_url,
                portfolio_url: deduced.portfolio_url || prev.portfolio_url,
                professional_headline: deduced.professional_headline || prev.professional_headline,
            }));
            toast.success("Profile fields autofilled! Don't forget to save.", { id: loadingId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to deduce profile from CV.", { id: loadingId });
        } finally {
            setIsDeducing(false);
        }
    };

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

    const gmailStatus = user?.google_account?.status;
    const isGmailConnected = !!user?.google_account;
    const isGmailExpired = gmailStatus === 'disconnected';

    return (
        <div className="w-full min-h-screen pb-20">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />

            <div className="w-full px-4 sm:px-8 space-y-6">

                {/* Page header */}
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Profile</h1>
                        <p className="text-sm text-zinc-400 mt-0.5">Manage your resumes and account settings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => biosData ? setIsBiosModalOpen(true) : handleGenerateBios()}
                            disabled={isGeneratingBios || cvs.length === 0}
                            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-all disabled:opacity-40"
                        >
                            {isGeneratingBios ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                            {biosData ? "View bios" : "Generate bios"}
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all disabled:opacity-40"
                        >
                            {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            Upload resume
                        </button>
                    </div>
                </div>

                {/* Identity bar */}
                <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-white">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base font-black text-white">
                        {getInitials(user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-zinc-900 truncate">{user?.name || "Your Name"}</p>
                        <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                            <ShieldCheck className="h-3 w-3" />
                            {user?.plan?.name || "Starter Pack"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Free mode active
                        </span>
                        {activeCv ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <CheckCircle2 className="h-3 w-3" />
                                Resume active
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                No resume
                            </span>
                        )}
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Left col: resumes + insights */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Resumes card */}
                        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-black text-zinc-900">My Resumes</span>
                                    <span className="text-xs text-zinc-400">{cvs.length} {cvs.length === 1 ? 'file' : 'files'}</span>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-16 text-zinc-300">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : cvs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
                                        <Upload className="h-6 w-6 text-zinc-300" />
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900 mb-1">No resumes yet</p>
                                    <p className="text-xs text-zinc-400 mb-6 max-w-xs">Upload a resume to unlock AI-powered job matching, bio generation, and more.</p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Select File
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-50">
                                    {cvs.map((cv) => (
                                        <div key={cv.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 transition-colors">
                                            <div className={cn(
                                                "h-9 w-9 shrink-0 flex items-center justify-center rounded-lg",
                                                cv.is_active ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-400"
                                            )}>
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-zinc-900 truncate">
                                                        {cv.profile_name || cv.filename}
                                                    </p>
                                                    {cv.is_active && (
                                                        <span className="shrink-0 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-zinc-400 mt-0.5">Uploaded {formatDate(cv.created_at)}</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setPreviewCv(cv)}
                                                    className="h-8 px-3 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                                                >
                                                    View
                                                </button>
                                                {!cv.is_active && (
                                                    <button
                                                        onClick={() => handleActivateCV(cv.id)}
                                                        className="h-8 px-3 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-all"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                                {cv.is_active && (
                                                    <a
                                                        href={`/dashboard/optimizer?edit=${cv.id}`}
                                                        className="h-8 px-3 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-all inline-flex items-center"
                                                    >
                                                        Optimize
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteCV(cv)}
                                                    disabled={isDeleting === cv.id}
                                                    className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    {isDeleting === cv.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Upload row */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors text-left disabled:opacity-50"
                                    >
                                        <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 text-zinc-300">
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        </div>
                                        <span className="text-sm font-bold text-zinc-400">Upload new version</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Resume insights */}
                        {cvs.length > 0 && (
                            <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-50">
                                    <Zap className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-black text-zinc-900">Resume Insights</span>
                                    {activeCv && <span className="text-xs text-zinc-400 truncate">{activeCv.profile_name || activeCv.filename}</span>}
                                </div>

                                {!parsed ? (
                                    <div className="flex items-center justify-center py-12 text-zinc-300">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-6">
                                        {/* Stats row */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                                <p className="text-[10px] font-black text-zinc-400 mb-1.5">Focus</p>
                                                <p className="text-xs font-black text-zinc-900 leading-tight">{currentTitle}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                                <p className="text-[10px] font-black text-zinc-400 mb-1.5">Skills</p>
                                                <p className="text-2xl font-black text-zinc-900">{skills.length}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                                <p className="text-[10px] font-black text-zinc-400 mb-1.5">Experience</p>
                                                <p className="text-2xl font-black text-zinc-900">{yearsOfExperience}<span className="text-xs font-bold text-zinc-400 ml-1">yrs</span></p>
                                            </div>
                                        </div>

                                        {parsed.summary && (
                                            <div>
                                                <p className="text-[11px] font-black text-zinc-400 mb-2">Summary</p>
                                                <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">{parsed.summary}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <p className="text-[11px] font-black text-zinc-400 mb-3">Top Skills</p>
                                                {skills.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {skills.map((skill: string, idx: number) => (
                                                            <span key={idx} className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-700">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-zinc-400 italic">No skills listed.</p>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-[11px] font-black text-zinc-400 mb-3">Recent Experience</p>
                                                {workExperience.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {workExperience.map((role: any, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                                                <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-white border border-zinc-100">
                                                                    <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-zinc-900 truncate">{role.title || role.position || "Untitled"}</p>
                                                                    <p className="text-[10px] text-zinc-400 truncate">{role.company || role.organization || "Company"}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-zinc-400 italic">No work history found.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-6">

                        {/* Gmail sync card */}
                        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-50">
                                <GmailLogo className="h-4 w-4" />
                                <span className="text-sm font-black text-zinc-900">Gmail Sync</span>
                                <span className={cn(
                                    "ml-auto h-2 w-2 rounded-full",
                                    isGmailConnected && !isGmailExpired ? "bg-emerald-500" :
                                    isGmailExpired ? "bg-amber-400" : "bg-zinc-200"
                                )} />
                            </div>

                            <div className="p-5 space-y-4">
                                {isGmailConnected && (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-700 truncate">{user?.google_account?.email}</p>
                                            <p className="text-[11px] text-zinc-400 mt-0.5">
                                                {isGmailExpired ? "Session expired" : `Last sync: ${user?.google_account?.last_synced_at ? formatDate(user.google_account.last_synced_at) : 'Never'}`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setConfirmModal({
                                                title: "Disconnect Google",
                                                description: "Are you sure you want to disconnect your Google account? Email syncing will stop until you reconnect.",
                                                confirmLabel: "Disconnect",
                                                onConfirm: handleDisconnectGmail,
                                            })}
                                            disabled={isConnectingGmail}
                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40"
                                            title="Disconnect"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                )}

                                {isGmailExpired && (
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-xs font-bold text-amber-700">Your session has expired. Please reconnect to resume scanning.</p>
                                    </div>
                                )}

                                {!isGmailConnected || isGmailExpired ? (
                                    <button
                                        onClick={handleConnectGmail}
                                        disabled={isConnectingGmail}
                                        className="w-full h-10 rounded-lg bg-white flex items-center justify-center disabled:opacity-40 transition-opacity"
                                        style={{
                                            border: '1px solid #747775',
                                            fontFamily: 'Roboto, Arial, sans-serif',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: '#1F1F1F',
                                            paddingLeft: '12px',
                                            paddingRight: '12px',
                                            gap: '10px',
                                        }}
                                    >
                                        <GoogleIcon />
                                        {isConnectingGmail
                                            ? <><Loader2 className="h-4 w-4 animate-spin inline mr-1" />Connecting...</>
                                            : "Sign in with Google"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSyncGmail}
                                        disabled={isConnectingGmail}
                                        className="w-full h-10 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                                    >
                                        {isConnectingGmail ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                                        {isConnectingGmail ? "Syncing..." : "Sync inbox now"}
                                    </button>
                                )}

                                <p className="text-[11px] text-zinc-400 text-center">Secure OAuth 2.0 · read-only access</p>
                            </div>
                        </div>

                        {/* Social bios card */}
                        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-50">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-black text-zinc-900">Social Bios</span>
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Generate AI-written bios for LinkedIn, GitHub, Twitter, and Upwork from your active resume.
                                </p>
                                <button
                                    onClick={() => biosData ? setIsBiosModalOpen(true) : handleGenerateBios()}
                                    disabled={isGeneratingBios || cvs.length === 0}
                                    className="w-full h-10 rounded-lg bg-zinc-900 text-xs font-bold text-white hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    {isGeneratingBios ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                    {biosData ? "View generated bios" : "Generate bios"}
                                </button>
                            </div>
                        </div>

                        {/* Public Profile card */}
                        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-50">
                                <Globe className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-black text-zinc-900">Public Profile</span>
                                {profileSettings.public_profile_enabled && profileSettings.username && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                                )}
                                <button
                                    onClick={handleDeduceFromCV}
                                    disabled={isDeducing || cvs.length === 0}
                                    className={cn(
                                        "ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                        "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 disabled:opacity-50"
                                    )}
                                    title="Autofill from your active CV"
                                >
                                    {isDeducing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                    AI Deduced
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Toggle */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-700">Enable public page</p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">Share your profile with anyone</p>
                                    </div>
                                    <button
                                        onClick={() => setProfileSettings(prev => ({ ...prev, public_profile_enabled: !prev.public_profile_enabled }))}
                                        className="transition-colors"
                                    >
                                        {profileSettings.public_profile_enabled
                                            ? <ToggleRight className="h-7 w-7 text-blue-600" />
                                            : <ToggleLeft className="h-7 w-7 text-zinc-300" />}
                                    </button>
                                </div>

                                {/* Headline */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-zinc-400">Professional Headline</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <input
                                            type="text"
                                            value={profileSettings.professional_headline}
                                            onChange={(e) => setProfileSettings(prev => ({ ...prev, professional_headline: e.target.value }))}
                                            placeholder="Senior Software Engineer"
                                            className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-zinc-400">Username</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-bold select-none">@</span>
                                        <input
                                            type="text"
                                            value={profileSettings.username}
                                            onChange={(e) => handleUsernameChange(e.target.value)}
                                            placeholder="yourname"
                                            maxLength={30}
                                            className="w-full h-9 pl-7 pr-8 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isCheckingUsername ? (
                                                <Loader2 className="h-3 w-3 animate-spin text-zinc-300" />
                                            ) : usernameAvailable === true ? (
                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                            ) : usernameAvailable === false ? (
                                                <X className="h-3 w-3 text-red-400" />
                                            ) : null}
                                        </div>
                                    </div>
                                    {usernameAvailable === false && (
                                        <p className="text-[11px] text-red-500">Username is taken</p>
                                    )}
                                    {usernameAvailable === true && (
                                        <p className="text-[11px] text-emerald-500">Username is available!</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-zinc-400">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                                        <input
                                            type="text"
                                            value={profileSettings.location}
                                            onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
                                            placeholder="Lagos, Nigeria"
                                            className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Theme Selector */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Interface Theme</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'modern', label: 'Modern', desc: 'SaaS style' },
                                            { id: 'minimalist', label: 'Minimalist', desc: 'Reader' },
                                            { id: 'bento', label: 'Bento', desc: 'Elite Grid' },
                                        ].map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setProfileSettings(prev => ({ ...prev, profile_theme: theme.id as any }))}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all text-center",
                                                    profileSettings.profile_theme === theme.id
                                                        ? "border-blue-600 bg-blue-50/50"
                                                        : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-200"
                                                )}
                                            >
                                                <span className={cn(
                                                    "text-[10px] font-black",
                                                    profileSettings.profile_theme === theme.id ? "text-blue-700" : "text-zinc-600"
                                                )}>{theme.label}</span>
                                                <span className="text-[9px] text-zinc-400 font-bold">{theme.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Social links */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-zinc-400">Social Links</label>
                                    {([
                                        { key: 'linkedin_url', Icon: Linkedin, placeholder: 'linkedin.com/in/...' },
                                        { key: 'github_url', Icon: Github, placeholder: 'github.com/...' },
                                        { key: 'twitter_url', Icon: Twitter, placeholder: 'x.com/...' },
                                        { key: 'portfolio_url', Icon: Link2, placeholder: 'yourportfolio.com' },
                                    ] as const).map(({ key, Icon, placeholder }) => (
                                        <div key={key} className="relative">
                                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                                            <input
                                                type="url"
                                                value={profileSettings[key]}
                                                onChange={(e) => setProfileSettings(prev => ({ ...prev, [key]: e.target.value }))}
                                                placeholder={placeholder}
                                                className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-xs text-zinc-600 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Share link preview */}
                                {profileSettings.username && profileSettings.public_profile_enabled && (
                                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2">
                                        <Globe className="h-3 w-3 text-blue-500 shrink-0" />
                                        <a
                                            href={`/u/${profileSettings.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] font-bold text-blue-600 truncate hover:underline"
                                        >
                                            offerra.click/u/{profileSettings.username}
                                        </a>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`https://offerra.click/u/${profileSettings.username}`);
                                                toast.success("Link copied!");
                                            }}
                                            className="ml-auto shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={saveProfileSettings}
                                    disabled={isSavingProfile}
                                    className="w-full h-10 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    {isSavingProfile && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                    Save Profile
                                </button>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-100">
                                <span className="text-xs font-black text-zinc-400">Tips</span>
                            </div>
                            <ul className="p-5 space-y-3">
                                {[
                                    "Keep one resume active for best AI results.",
                                    "Refresh your bios whenever you update your resume.",
                                    "Upload targeted versions for specific industries."
                                ].map((note, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                                        <p className="text-xs text-zinc-500 leading-relaxed">{note}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bios Modal */}
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
                            <div className="flex items-center justify-between border-b border-zinc-100 p-8 sm:px-12 py-10 bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-blue-600 text-white">
                                        <Sparkles className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">Social intelligence</h2>
                                        <p className="text-[11px] font-black text-zinc-400 mt-2">Generated profile assets</p>
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
                                                <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-white">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", meta.bg, meta.color)}>
                                                            <IconInfo className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-black tracking-tight text-zinc-900">{meta.label}</h4>
                                                            <p className="text-[11px] font-black text-zinc-400 mt-1">{meta.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const text = typeof data === 'string' ? data : Object.entries(data).map(([k, v]) => `${k}:\n${v}`).join('\n\n');
                                                            navigator.clipboard.writeText(text);
                                                            toast.success(`${meta.label} bio copied!`);
                                                        }}
                                                        className="h-10 px-4 rounded-xl bg-blue-600 text-white text-[11px] font-bold transition-all hover:bg-blue-700 flex items-center gap-2"
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                        Copy all
                                                    </button>
                                                </div>

                                                <div className="p-8 space-y-6">
                                                    {typeof data === 'string' ? (
                                                        <div className="p-6 rounded-2xl bg-zinc-50/50 border border-zinc-100 relative group">
                                                            <p className="text-sm font-medium text-zinc-700 leading-relaxed italic">"{data}"</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6">
                                                            {Object.entries(data).map(([key, val]: [string, any]) => (
                                                                <div key={key} className="space-y-3">
                                                                    <div className="flex items-center justify-between px-1">
                                                                        <span className="text-[11px] font-black text-zinc-400">{key}</span>
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(val);
                                                                                toast.success(`${key} copied!`);
                                                                            }}
                                                                            className="text-[11px] font-black text-blue-500 hover:text-blue-700 transition-colors"
                                                                        >
                                                                            Copy
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                                                                        <p className="text-xs font-bold text-zinc-600 leading-relaxed whitespace-pre-wrap">{val}</p>
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

            {/* Preview Modal */}
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
                                        <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">Profile deep dive</h2>
                                        <p className="text-[11px] font-black text-zinc-400 mt-1">{previewCv.filename}</p>
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
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-[11px] font-black text-zinc-400">Analysis complete</span>
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

            <ConfirmModal
                isOpen={!!confirmModal}
                onClose={() => setConfirmModal(null)}
                onConfirm={() => confirmModal?.onConfirm()}
                title={confirmModal?.title ?? ""}
                description={confirmModal?.description ?? ""}
                confirmLabel={confirmModal?.confirmLabel}
                isLoading={isConnectingGmail}
            />
        </div>
    );
}
