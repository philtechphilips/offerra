"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    MoreVertical,
    ExternalLink,
    MapPin,
    Building2,
    Loader2,
    X,
    Link2,
    Briefcase,
    Globe,
    Pencil,
    Trash2
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { useJobStore } from "@/app/store/jobStore";

interface JobApplication {
    id: number;
    title: string;
    company: string;
    location: string;
    status: 'applied' | 'tracking' | 'interview' | 'rejected' | 'offer';
    job_url: string;
    company_url: string | null;
    salary: string | null;
    type: string;
    is_remote: boolean;
    cv_match_score: number | null;
    cv_match_details: { strengths?: string[]; gaps?: string[]; tip?: string } | null;
    created_at: string;
    description: string | null;
}

const statusColors: Record<JobApplication['status'], string> = {
    tracking: "bg-zinc-100 text-zinc-500",
    applied: "bg-blue-50 text-blue-600",
    interview: "bg-amber-50 text-amber-600",
    rejected: "bg-red-50 text-red-500",
    offer: "bg-emerald-50 text-emerald-600",
};

const emptyForm = {
    title: "",
    company: "",
    location: "",
    url: "",
    salary: "",
    type: "Full-time",
    is_remote: false,
    status: "applied" as JobApplication['status'],
};

export default function ApplicationsPage() {
    const {
        jobs, meta, isLoading, isLoadingMore,
        search, statusFilter,
        fetchJobs, loadMore, setSearch, setStatusFilter
    } = useJobStore();

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown state
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Delete confirmation
    const [deletingJob, setDeletingJob] = useState<JobApplication | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showUrlField, setShowUrlField] = useState(false);

    const observerTarget = useRef<HTMLTableRowElement>(null);
    const searchParams = useSearchParams();

    // Sync status from URL if present
    useEffect(() => {
        const status = searchParams.get('status');
        if (status) {
            setStatusFilter(status);
        }
    }, [searchParams, setStatusFilter]);

    // Debounced fetch when search or filter changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchJobs();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, statusFilter, fetchJobs]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && meta?.has_more && !isLoadingMore) {
                    loadMore();
                }
            },
            { rootMargin: "100px", threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [meta?.has_more, isLoadingMore, loadMore]);

    const resetForm = () => {
        setFormData({ ...emptyForm });
        setEditingJob(null);
        setShowUrlField(false);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (job: JobApplication) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            company: job.company,
            location: job.location,
            url: job.job_url,
            salary: job.salary || "",
            type: job.type,
            is_remote: job.is_remote,
            status: job.status,
        });
        setOpenDropdownId(null);
        setShowModal(true);
    };

    const openDeleteConfirm = (job: JobApplication) => {
        setDeletingJob(job);
        setOpenDropdownId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.company) {
            toast.error("Please fill in the required fields.");
            return;
        }

        let jobUrl = formData.url;
        if (jobUrl && !jobUrl.startsWith("http://") && !jobUrl.startsWith("https://")) {
            jobUrl = "https://" + jobUrl;
        }

        setIsSubmitting(true);
        try {
            if (editingJob) {
                // UPDATE
                await api.put(`/jobs/${editingJob.id}`, {
                    title: formData.title,
                    company: formData.company,
                    location: formData.location || "Not specified",
                    url: jobUrl,
                    salary: formData.salary || null,
                    type: formData.type,
                    is_remote: formData.is_remote,
                    status: formData.status,
                });
                toast.success("Application updated successfully!");
            } else {
                // CREATE
                await api.post("/jobs", {
                    title: formData.title,
                    company: formData.company,
                    location: formData.location || "Not specified",
                    url: jobUrl,
                    salary: formData.salary || null,
                    type: formData.type,
                    is_remote: formData.is_remote,
                    status: formData.status,
                });
                toast.success("Application added successfully!");
            }
            resetForm();
            setShowModal(false);
            fetchJobs();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingJob) return;
        setIsDeleting(true);
        try {
            await api.delete(`/jobs/${deletingJob.id}`);
            toast.success(`${deletingJob.company} — ${deletingJob.title} removed.`);
            setDeletingJob(null);
            fetchJobs();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete application.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-brand-blue-black">Applications</h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">
                        {meta ? `Total of ${meta.total} tracked opportunities in your pipeline.` : 'Loading your pipeline...'}
                    </p>
                </div>
                <button
                    className="btn-primary h-12 px-6"
                    onClick={openAddModal}
                >
                    <Plus className="h-4 w-4 shrink-0" />
                    New Application
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-zinc-100 p-4 rounded-2xl">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300" />
                    <input
                        type="text"
                        placeholder="Search by company or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 w-full rounded-xl bg-zinc-50 pl-11 pr-4 text-xs font-bold border border-transparent focus:border-zinc-200 focus:bg-white focus:outline-none transition-all placeholder:text-zinc-300"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    {["all", "tracking", "applied", "interview", "offer", "rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                statusFilter === status
                                    ? "bg-[#1C4ED8] text-white"
                                    : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 hover:scale-105"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden transition-all hover:border-blue-100/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-50 bg-zinc-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 w-[200px] min-w-[200px]">Company & Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">Location</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">Match</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">Salary</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading your pipeline...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : jobs.length > 0 ? (
                                <>
                                    {jobs.map((job) => (
                                        <motion.tr
                                            key={job.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="group hover:bg-blue-50/10 transition-colors"
                                        >
                                            <td className="px-8 py-6 w-[200px] min-w-[200px]">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:border-blue-200 transition-all shrink-0">
                                                        <Building2 className="h-6 w-6 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-black text-brand-blue-black truncate group-hover:text-brand-blue transition-colors">{job.title}</span>
                                                        <span className="text-xs font-bold text-zinc-400 mt-0.5">{job.company}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <MapPin className="h-3.5 w-3.5 opacity-50" />
                                                    <span className="text-xs font-bold leading-none">{job.location}</span>
                                                    {job.is_remote && (
                                                        <span className="ml-1 px-1.5 py-0.5 rounded bg-zinc-100 text-[8px] font-black uppercase text-zinc-400">Remote</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
                                                    statusColors[job.status]
                                                )}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {job.cv_match_score != null ? (
                                                    <div className="group/match relative inline-flex">
                                                        <span className={cn(
                                                            "px-2.5 py-1 rounded-lg text-[10px] font-black tabular-nums cursor-default",
                                                            job.cv_match_score >= 70 ? "bg-emerald-50 text-emerald-600" :
                                                                job.cv_match_score >= 40 ? "bg-amber-50 text-amber-600" :
                                                                    "bg-red-50 text-red-500"
                                                        )}>
                                                            {job.cv_match_score}%
                                                        </span>
                                                        {job.cv_match_details && (
                                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white rounded-xl border border-zinc-100 p-3 opacity-0 invisible group-hover/match:opacity-100 group-hover/match:visible transition-all z-20 pointer-events-none">
                                                                {(job.cv_match_details.strengths || []).slice(0, 2).map((s, i) => (
                                                                    <p key={`s-${i}`} className="text-[10px] text-emerald-600 font-semibold leading-relaxed">✓ {s}</p>
                                                                ))}
                                                                {(job.cv_match_details.gaps || []).slice(0, 2).map((g, i) => (
                                                                    <p key={`g-${i}`} className="text-[10px] text-red-400 font-semibold leading-relaxed">✗ {g}</p>
                                                                ))}
                                                                {job.cv_match_details.tip && (
                                                                    <p className="text-[10px] text-blue-600 font-semibold mt-1 leading-relaxed">💡 {job.cv_match_details.tip}</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-zinc-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-bold text-zinc-600">
                                                    {job.salary || "—"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={job.job_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 rounded-xl bg-white border border-zinc-100 text-zinc-400 hover:text-blue-600 hover:border-blue-100 transition-all"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>

                                                    {/* Actions Dropdown Trigger */}
                                                    <button
                                                        onClick={(e) => {
                                                            if (openDropdownId === job.id) {
                                                                setOpenDropdownId(null);
                                                            } else {
                                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                                setDropdownPos({ top: rect.bottom + 8, left: rect.right - 176 });
                                                                setOpenDropdownId(job.id);
                                                            }
                                                        }}
                                                        className="p-2.5 rounded-xl bg-white border border-zinc-100 text-zinc-400 hover:text-blue-600 hover:border-blue-300 transition-all"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}

                                    {/* Loading / End of list indicator */}
                                    {(meta?.has_more || isLoadingMore) && (
                                        <tr ref={observerTarget}>
                                            <td colSpan={6} className="px-8 py-8 text-center text-zinc-400">
                                                {isLoadingMore ? (
                                                    <div className="flex justify-center items-center gap-3">
                                                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">Loading more...</span>
                                                    </div>
                                                ) : (
                                                    <div className="h-10"></div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-40">
                                            <Building2 className="h-12 w-12" />
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-widest">No applications found</p>
                                                <p className="text-xs font-medium text-zinc-400 mt-2">Click "New Application" to add your first one.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fixed-Position Actions Dropdown (rendered outside table to avoid overflow clipping) */}
            <AnimatePresence>
                {openDropdownId !== null && (() => {
                    const targetJob = jobs.find(j => j.id === openDropdownId);
                    if (!targetJob) return null;
                    return (
                        <>
                            {/* Invisible backdrop to close dropdown */}
                            <div className="fixed inset-0 z-[60]" onClick={() => setOpenDropdownId(null)} />
                            <motion.div
                                ref={dropdownRef}
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                transition={{ duration: 0.15 }}
                                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                                className="fixed z-[70] w-44 bg-white rounded-2xl border border-zinc-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => openEditModal(targetJob)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-600 hover:bg-blue-50 hover:text-[#1C4ED8] transition-all"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit Application
                                </button>
                                <div className="border-t border-zinc-50" />
                                <button
                                    onClick={() => openDeleteConfirm(targetJob)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            </motion.div>
                        </>
                    );
                })()}
            </AnimatePresence>

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
                            onClick={() => { setShowModal(false); resetForm(); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl border border-zinc-100 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-8 pb-0">
                                <div>
                                    <h2 className="text-xl font-black tracking-tight text-brand-blue-black">
                                        {editingJob ? "Edit Application" : "Add Application"}
                                    </h2>
                                    <p className="text-xs font-medium text-zinc-400 mt-1">
                                        {editingJob ? `Editing ${editingJob.company} — ${editingJob.title}` : "Manually track a new opportunity in your pipeline."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
                                            Job Title <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Frontend Engineer"
                                                required
                                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-xs placeholder:text-zinc-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
                                            Company <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                placeholder="Google"
                                                required
                                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-xs placeholder:text-zinc-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* URL — hidden by default, toggle to show */}
                                {(formData.url || showUrlField) ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
                                            Job Posting URL
                                        </label>
                                        <div className="relative">
                                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                            <input
                                                type="text"
                                                value={formData.url}
                                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                placeholder="https://careers.google.com/jobs/123"
                                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-xs placeholder:text-zinc-300"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowUrlField(true)}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-[#1C4ED8] transition-colors ml-1"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add job posting URL
                                    </button>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="San Francisco, CA"
                                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-xs placeholder:text-zinc-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Salary</label>
                                        <input
                                            type="text"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                            placeholder="$120k - $180k"
                                            className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-xs placeholder:text-zinc-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Job Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-xs text-zinc-700 appearance-none cursor-pointer"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as JobApplication['status'] })}
                                            className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-[#1C4ED8] focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-xs text-zinc-700 appearance-none cursor-pointer"
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="tracking">Tracking</option>
                                            <option value="interview">Interview</option>
                                            <option value="offer">Offer</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-1 py-2">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-zinc-400" />
                                        <span className="text-xs font-bold text-zinc-600">Remote position</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_remote: !formData.is_remote })}
                                        className={cn(
                                            "relative h-7 w-12 rounded-full transition-colors duration-200",
                                            formData.is_remote ? "bg-[#1C4ED8]" : "bg-zinc-200"
                                        )}
                                    >
                                        <span className={cn(
                                            "absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform duration-200",
                                            formData.is_remote && "translate-x-5"
                                        )} />
                                    </button>
                                </div>

                                <div className="border-t border-zinc-100" />

                                <div className="flex items-center justify-end gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => { setShowModal(false); resetForm(); }}
                                        className="btn-secondary h-12 px-6 border-none hover:bg-zinc-50 text-zinc-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary h-12 px-8"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                                                {editingJob ? "Saving..." : "Adding..."}
                                            </>
                                        ) : (
                                            <>
                                                {editingJob ? <Pencil className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
                                                {editingJob ? "Save Changes" : "Add Application"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setDeletingJob(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl border border-zinc-100 p-8 text-center"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight text-brand-blue-black mb-2">Delete Application?</h3>
                            <p className="text-xs font-medium text-zinc-400 mb-8 leading-relaxed">
                                This will permanently remove <span className="text-brand-blue-black font-bold">{deletingJob.company} — {deletingJob.title}</span> from your pipeline. This action cannot be undone.
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDeletingJob(null)}
                                    className="btn-secondary flex-1 h-12 text-zinc-400 border-zinc-100 hover:bg-zinc-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 h-12 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
