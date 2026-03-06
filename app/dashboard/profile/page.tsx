"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Trash2, CheckCircle2, Loader2, Sparkles, Briefcase, Eye, X, Copy, Zap, Linkedin, Twitter, Github, Mail } from "lucide-react";
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
        return <span className="text-sm font-medium text-black">{strVal}</span>;
    }

    if (Array.isArray(data)) {
        if (data.length === 0) return null;

        // If it's an array of strings (e.g., skills, highlights)
        if (typeof data[0] === 'string' || typeof data[0] === 'number') {
            return (
                <div className="flex flex-wrap gap-2 mt-2">
                    {data.map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-[#1C4ED8]/10 text-[#1C4ED8] rounded-lg text-xs font-medium border border-[#1C4ED8]/20">
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
                            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400 mb-1">{title}</div>
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
    const [isConnectingGmail, setIsConnectingGmail] = useState(false);
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

    const handleConnectGmail = () => {
        setIsConnectingGmail(true);
        // Integrate real auth flow later
        setTimeout(() => {
            setIsConnectingGmail(false);
            toast.success("Gmail Auto-Sync initiated.");
        }, 1500);
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

    const activeCv = cvs.find((cv) => cv.is_active) || cvs[0] || null;
    const parsed = activeCv?.parsed_data;
    const skills = Array.isArray(parsed?.skills) ? parsed.skills.slice(0, 10) : [];
    const workExperience = Array.isArray(parsed?.work_experience) ? parsed.work_experience.slice(0, 3) : [];
    const currentTitle = parsed?.current_title || parsed?.headline || "Professional";
    const yearsOfExperience = parsed?.years_of_experience || parsed?.work_experience?.length || 0;
    const biosReadyCount = biosData ? Object.keys(biosData).length : 0;

    return (
        <div className="w-full bg-[#fafaf8] pb-24 font-medium">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />

            <div className="mx-auto max-w-6xl space-y-5">
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm md:p-8"
                >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4 md:gap-5">
                            <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-bold uppercase text-white">
                                {getInitials(user?.name)}
                            </div>

                            <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium text-[#1C4ED8]">
                                        {user?.role || "Basic"} tier
                                    </span>
                                    <span className="text-sm text-zinc-400">/</span>
                                    <span className="text-sm text-zinc-500">
                                        {cvs.length} resume{cvs.length === 1 ? "" : "s"}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
                                    {user?.name || "Your profile"}
                                </h1>
                                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-zinc-600">
                                    Manage your active resume, generated bios, and profile insights from one clean workspace.
                                </p>
                                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                                    <span className="inline-flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-[#1C4ED8]" />
                                        {user?.email}
                                    </span>
                                    <span className="hidden text-zinc-300 sm:inline">•</span>
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-[#1C4ED8]" />
                                        {activeCv ? "Active resume selected" : "No active resume yet"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C4ED8] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#1e40af] active:scale-[0.98] disabled:opacity-60"
                            >
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                Upload resume
                            </button>
                            <button
                                type="button"
                                onClick={() => biosData ? setIsBiosModalOpen(true) : handleGenerateBios()}
                                disabled={isGeneratingBios || cvs.length === 0}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 transition-all hover:border-zinc-300 hover:text-zinc-950 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isGeneratingBios ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                {biosData ? "Open bios" : "Generate bios"}
                            </button>
                        </div>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <motion.section
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm md:p-8"
                        >
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Resume library</h2>
                                    <p className="mt-1 text-sm text-zinc-500">Keep one resume active and store tailored versions for different roles.</p>
                                </div>
                                <div className="rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700">
                                    {cvs.length} total
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-16 text-center">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1C4ED8]" />
                                    <p className="mt-4 text-sm font-medium text-zinc-600">Loading your resumes...</p>
                                </div>
                            ) : cvs.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-14 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#1C4ED8] shadow-sm">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-5 text-xl font-semibold text-zinc-950">Upload your first resume</h3>
                                    <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-zinc-600">
                                        Start by adding a resume. Once uploaded, you can activate it, preview parsed details, and generate profile bios from it.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1C4ED8] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#1e40af]"
                                    >
                                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        Upload resume
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activeCv && (
                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
                                            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                                <div className="min-w-0">
                                                    <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#1C4ED8]">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Active resume
                                                    </div>
                                                    <h3 className="truncate text-2xl font-semibold tracking-tight text-zinc-950">
                                                        {activeCv.profile_name || activeCv.filename}
                                                    </h3>
                                                    <p className="mt-2 text-sm text-zinc-600">
                                                        This version is currently being used for AI analysis and social bio generation.
                                                    </p>
                                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
                                                        <span>Uploaded {formatDate(activeCv.created_at)}</span>
                                                        <span className="text-zinc-300">•</span>
                                                        <span>{currentTitle}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setPreviewCv(activeCv)}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition-all hover:border-zinc-300 hover:text-zinc-950"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Preview
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="overflow-hidden rounded-2xl border border-zinc-200">
                                        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-semibold text-zinc-700">
                                            Saved versions
                                        </div>
                                        <div className="divide-y divide-zinc-200 bg-white">
                                            {cvs.filter((cv) => !cv.is_active).length > 0 ? (
                                                cvs.filter((cv) => !cv.is_active).map((cvItem, index) => (
                                                    <motion.div
                                                        key={cvItem.id}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                                        className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate text-base font-medium text-zinc-900">
                                                                {cvItem.profile_name || cvItem.filename}
                                                            </p>
                                                            <p className="mt-1 text-sm text-zinc-500">
                                                                Uploaded on {formatDate(cvItem.created_at)}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => setPreviewCv(cvItem)}
                                                                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950"
                                                            >
                                                                Preview
                                                            </button>
                                                            <button
                                                                onClick={() => handleActivateCV(cvItem.id)}
                                                                className="rounded-lg bg-[#1C4ED8] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-[#1e40af]"
                                                            >
                                                                Make active
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCV(cvItem.id)}
                                                                disabled={isDeleting === cvItem.id}
                                                                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                                            >
                                                                {isDeleting === cvItem.id ? "Removing..." : "Delete"}
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="px-5 py-8 text-sm text-zinc-500">
                                                    No alternate resume versions yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    className="flex w-full items-center justify-between rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-5 text-left transition-all hover:border-zinc-300 hover:bg-white disabled:opacity-60"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900">Add another resume version</p>
                                            <p className="mt-1 text-sm text-zinc-500">PDF, DOCX, or TXT up to 5MB.</p>
                                        </div>
                                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-[#1C4ED8]" /> : <Plus className="h-5 w-5 text-zinc-400" />}
                                    </button>
                                </div>
                            )}
                        </motion.section>

                        {cvs.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.08 }}
                            className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm md:p-8"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Resume insights</h2>
                                    <p className="mt-1 text-sm text-zinc-500">A quick summary of what the currently active resume is communicating.</p>
                                </div>

                                {!parsed ? (
                                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-12 text-center">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1C4ED8]" />
                                        <p className="mt-4 text-sm text-zinc-600">Parsing your active resume...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div className="rounded-2xl bg-zinc-50 p-5">
                                                <p className="text-sm text-zinc-500">Current focus</p>
                                                <p className="mt-2 text-lg font-semibold text-zinc-950">{currentTitle}</p>
                                            </div>
                                            <div className="rounded-2xl bg-zinc-50 p-5">
                                                <p className="text-sm text-zinc-500">Skills detected</p>
                                                <p className="mt-2 text-lg font-semibold text-zinc-950">{skills.length}</p>
                                            </div>
                                            <div className="rounded-2xl bg-zinc-50 p-5">
                                                <p className="text-sm text-zinc-500">Experience signal</p>
                                                <p className="mt-2 text-lg font-semibold text-zinc-950">{yearsOfExperience}</p>
                                            </div>
                                        </div>

                                        {parsed.summary && (
                                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
                                                <p className="text-sm font-semibold text-zinc-900">Summary</p>
                                                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{parsed.summary}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div className="rounded-2xl border border-zinc-200 p-5">
                                                <p className="text-sm font-semibold text-zinc-900">Top skills</p>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {skills.length > 0 ? (
                                                        skills.map((skill: string, idx: number) => (
                                                            <span key={`${skill}-${idx}`} className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700">
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-zinc-500">No structured skills were detected yet.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-zinc-200 p-5">
                                                <p className="text-sm font-semibold text-zinc-900">Recent experience</p>
                                                <div className="mt-4 space-y-3">
                                                    {workExperience.length > 0 ? (
                                                        workExperience.map((role: any, idx: number) => (
                                                            <div key={idx} className="rounded-xl bg-zinc-50 px-4 py-4">
                                                                <p className="font-medium text-zinc-900">{role.title || role.position || "Role"}</p>
                                                                <p className="mt-1 text-sm text-zinc-500">{role.company || role.organization || "Company"}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-zinc-500">Work experience was not parsed into a structured list.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </div>

                    <div className="space-y-6 xl:col-span-4">
                        <motion.section
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.06 }}
                            className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold tracking-tight text-zinc-950">Social bios</h3>
                                    <p className="mt-1 text-sm text-zinc-500">Create profile bios that match your active resume.</p>
                                </div>
                                <div className="rounded-xl bg-zinc-100 p-3 text-[#1C4ED8]">
                                    <Zap className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-zinc-50 p-4">
                                    <p className="text-sm text-zinc-500">Platforms</p>
                                    <p className="mt-1 text-xl font-semibold text-zinc-950">4</p>
                                </div>
                                <div className="rounded-xl bg-zinc-50 p-4">
                                    <p className="text-sm text-zinc-500">Ready</p>
                                    <p className="mt-1 text-xl font-semibold text-zinc-950">{biosReadyCount}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => biosData ? setIsBiosModalOpen(true) : handleGenerateBios()}
                                disabled={isGeneratingBios || cvs.length === 0}
                                className="mt-5 w-full rounded-xl bg-[#1C4ED8] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-[#1e40af] disabled:opacity-50"
                            >
                                {isGeneratingBios ? "Generating..." : biosData ? "View bios" : "Generate bios"}
                            </button>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold tracking-tight text-zinc-950">Gmail auto-track</h3>
                                    <p className="mt-1 text-sm text-zinc-500">Connect Gmail to pull job updates automatically.</p>
                                </div>
                                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-500">Beta</span>
                            </div>

                            <div className="mt-5 rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600">
                                Great for keeping interview invites and application replies synced without manual logging.
                            </div>

                            <button
                                onClick={handleConnectGmail}
                                disabled={isConnectingGmail}
                                className="mt-5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition-all hover:border-zinc-300 hover:text-zinc-950 disabled:opacity-50"
                            >
                                {isConnectingGmail ? "Connecting..." : "Sign in with Google"}
                            </button>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.14 }}
                            className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm"
                        >
                            <h3 className="text-xl font-semibold tracking-tight text-zinc-950">Quick notes</h3>
                            <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-600">
                                <p>Use one active resume for the roles you are applying to right now.</p>
                                <p>Upload alternate versions when you want to test a different positioning.</p>
                                <p>Generate bios after activating the resume you want reflected publicly.</p>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>

            {/* Premium Bios Modal */}
            {isBiosModalOpen && biosData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-zinc-200"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-200 p-8 bg-white shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-zinc-100 text-[#1C4ED8]">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-black tracking-tight">Social branding bios</h2>
                                    <p className="text-sm text-zinc-500 mt-1">Generated from your active resume for each platform.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsBiosModalOpen(false)}
                                className="rounded-xl p-3 text-zinc-400 hover:bg-zinc-100 hover:text-black transition-all bg-white border border-zinc-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4ED8]"
                                aria-label="Close modal"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto w-full flex-1 bg-[#fafaf8]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pb-8">
                                {['linkedin', 'upwork', 'twitter', 'github'].map((platformKey) => {
                                    const data = biosData[platformKey];
                                    if (!data) return null;

                                    const platMeta: Record<string, any> = {
                                        'linkedin': { icon: Linkedin, color: 'text-[#1C4ED8]', bg: 'bg-[#1C4ED8]/10', border: 'border-[#1C4ED8]/20', label: 'LinkedIn' },
                                        'twitter': { icon: Twitter, color: 'text-zinc-900', bg: 'bg-zinc-100', border: 'border-zinc-200', label: 'X (Twitter)' },
                                        'github': { icon: Github, color: 'text-zinc-800', bg: 'bg-zinc-100', border: 'border-zinc-200', label: 'GitHub' },
                                        'upwork': { icon: Briefcase, color: 'text-[#1C4ED8]', bg: 'bg-[#1C4ED8]/10', border: 'border-[#1C4ED8]/20', label: 'Upwork' },
                                    };

                                    const meta = platMeta[platformKey] || { icon: Zap, color: 'text-[#1C4ED8]', bg: 'bg-[#1C4ED8]/10', border: 'border-[#1C4ED8]/20', label: platformKey };
                                    const IconInfo = meta.icon;

                                    return (
                                        <div key={platformKey} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color} border border-black/5`}>
                                                    <IconInfo className="h-6 w-6" />
                                                </div>
                                                <h4 className="text-lg font-semibold text-zinc-800">{meta.label}</h4>
                                            </div>

                                            <div className="flex-1">
                                                {typeof data === 'string' ? (
                                                    <p className="text-sm font-medium text-zinc-600 leading-relaxed bg-zinc-50 p-6 rounded-2xl border border-zinc-200 italic">"{data}"</p>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {Object.entries(data).map(([key, val]: [string, any]) => (
                                                            <div key={key} className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                                                                <span className="text-[11px] font-medium text-zinc-500 block mb-2 capitalize">{key}</span>
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
                                                    toast.success(`${meta.label} assets copied!`);
                                                }}
                                                className="w-full mt-8 bg-[#1C4ED8] hover:bg-[#1e40af] text-white text-sm font-medium py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4ED8] focus-visible:ring-offset-2"
                                            >
                                                <Copy className="h-4 w-4" /> Copy to clipboard
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-center pt-4 pb-8">
                                <button
                                    onClick={handleGenerateBios}
                                    disabled={isGeneratingBios}
                                    className="bg-white border border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:text-zinc-950 text-sm font-medium py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4ED8]"
                                >
                                    {isGeneratingBios ? <Loader2 className="h-5 w-5 animate-spin text-[#1C4ED8]" /> : <Sparkles className="h-5 w-5 text-[#1C4ED8]" />}
                                    {isGeneratingBios ? "Generating…" : "Regenerate bios"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Neural Scan Modal */}
            {previewCv && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-zinc-200"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-200 p-8 bg-white shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-zinc-100 text-[#1C4ED8] border border-zinc-200">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-black tracking-tight">Resume review</h2>
                                    <p className="text-sm text-zinc-500 mt-1">{previewCv.profile_name || previewCv.filename}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewCv(null)}
                                className="rounded-xl p-3 text-zinc-400 hover:bg-zinc-100 hover:text-black transition-all bg-white border border-zinc-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4ED8]"
                                aria-label="Close resume preview"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto w-full flex-1 bg-[#fafaf8]">
                            <div className="max-w-4xl mx-auto pb-8">
                                <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
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

function Plus(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
