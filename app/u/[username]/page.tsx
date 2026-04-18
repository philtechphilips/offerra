"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    MapPin, Linkedin, Github, Twitter, Globe, Briefcase,
    GraduationCap, Award, Code2, BarChart3, Loader2,
    CheckCircle2, TrendingUp, Star, FolderOpen, ExternalLink
} from "lucide-react";
import { cn } from "@/app/lib/utils";

interface PublicProfile {
    user: {
        name: string;
        username: string;
        professional_headline: string | null;
        location: string | null;
        linkedin_url: string | null;
        github_url: string | null;
        twitter_url: string | null;
        portfolio_url: string | null;
    };
    cv: {
        summary: string | null;
        skills: string[];
        work_experience: any[];
        education: any[];
        projects: any[];
        certifications: any[];
    };
    stats: {
        total_applications: number;
        interviews: number;
        offers: number;
        success_rate: number;
    };
    tech_stack: string[];
}

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
};

function initials(name: string) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    if (!href) return null;
    const fullHref = href.startsWith('http') ? href : `https://${href}`;
    return (
        <a
            href={fullHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 transition-all hover:-translate-y-0.5"
            aria-label={label}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </a>
    );
}

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? '';
        fetch(`${backendUrl}/api/u/${username}`)
            .then(res => {
                if (!res.ok) throw new Error('not found');
                return res.json();
            })
            .then(data => setProfile(data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
            </div>
        );
    }

    if (notFound || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 text-center">
                <div className="h-20 w-20 rounded-3xl bg-zinc-100 flex items-center justify-center mb-6">
                    <Globe className="h-10 w-10 text-zinc-300" />
                </div>
                <h1 className="text-2xl font-black text-zinc-900 mb-2">Profile not found</h1>
                <p className="text-sm text-zinc-400">This profile doesn't exist or has been set to private.</p>
                <a href="/" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition-all">
                    Go to Offerra
                </a>
            </div>
        );
    }

    const { user, cv, stats, tech_stack } = profile;

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Header / Hero */}
            <div className="bg-white border-b border-zinc-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
                    <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Avatar */}
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-blue-200">
                            {initials(user.name)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{user.name}</h1>
                            {user.professional_headline && (
                                <p className="text-sm font-semibold text-zinc-500 mt-1">{user.professional_headline}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                {user.location && (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                                        <MapPin className="h-3 w-3" />
                                        {user.location}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Open to opportunities
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3 sm:gap-4 shrink-0">
                            {[
                                { label: 'Applied', value: stats.total_applications },
                                { label: 'Interviews', value: stats.interviews },
                                { label: 'Offers', value: stats.offers },
                            ].map(({ label, value }) => (
                                <div key={label} className="text-center">
                                    <p className="text-xl sm:text-2xl font-black text-zinc-900">{value}</p>
                                    <p className="text-[10px] font-black text-zinc-400 mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Social links */}
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.1 }}
                        className="flex flex-wrap gap-2 mt-6"
                    >
                        {user.linkedin_url && <SocialLink href={user.linkedin_url} icon={Linkedin} label="LinkedIn" />}
                        {user.github_url && <SocialLink href={user.github_url} icon={Github} label="GitHub" />}
                        {user.twitter_url && <SocialLink href={user.twitter_url} icon={Twitter} label="Twitter" />}
                        {user.portfolio_url && <SocialLink href={user.portfolio_url} icon={ExternalLink} label="Portfolio" />}
                    </motion.div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">

                {/* Job stats banner */}
                {stats.success_rate > 0 && (
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.15 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                        {[
                            { label: 'Applications', value: stats.total_applications, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                            { label: 'Interviews', value: stats.interviews, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                            { label: 'Offers', value: stats.offers, icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                            { label: 'Success Rate', value: `${stats.success_rate}%`, icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                        ].map(({ label, value, icon: Icon, color, bg, border }) => (
                            <div key={label} className={cn("p-4 rounded-2xl bg-white border", border)}>
                                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-3", bg)}>
                                    <Icon className={cn("h-4 w-4", color)} />
                                </div>
                                <p className={cn("text-2xl font-black", color)}>{value}</p>
                                <p className="text-[11px] font-black text-zinc-400 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Summary */}
                {cv.summary && (
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.2 }}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8"
                    >
                        <h2 className="text-sm font-black text-zinc-900 mb-4 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            About
                        </h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">{cv.summary}</p>
                    </motion.div>
                )}

                {/* Skills */}
                {cv.skills.length > 0 && (
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.25 }}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8"
                    >
                        <h2 className="text-sm font-black text-zinc-900 mb-4 flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-blue-600" />
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {cv.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-700 hover:border-zinc-300 transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Work Experience */}
                {cv.work_experience.length > 0 && (
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.3 }}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8"
                    >
                        <h2 className="text-sm font-black text-zinc-900 mb-6 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {cv.work_experience.map((job: any, i: number) => (
                                <div key={i} className={cn("relative pl-6", i < cv.work_experience.length - 1 && "pb-6 border-l border-zinc-100")}>
                                    <div className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-blue-100 border-2 border-blue-400 -translate-x-1/2" />
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-black text-zinc-900">
                                                {job.title || job.position || job.role || "Role"}
                                            </p>
                                            <p className="text-xs font-bold text-blue-600 mt-0.5">
                                                {job.company || job.organization || "Company"}
                                            </p>
                                        </div>
                                        {(job.start_date || job.duration || job.dates) && (
                                            <span className="text-[11px] font-bold text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                                                {job.start_date || job.duration || job.dates}
                                                {job.end_date ? ` – ${job.end_date}` : ''}
                                            </span>
                                        )}
                                    </div>
                                    {(job.description || job.summary || job.responsibilities) && (
                                        <p className="text-xs text-zinc-500 leading-relaxed mt-2 line-clamp-3">
                                            {job.description || job.summary || (Array.isArray(job.responsibilities) ? job.responsibilities.join(' ') : job.responsibilities)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Two column: Education + Projects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Education */}
                    {cv.education.length > 0 && (
                        <motion.div
                            {...fadeUp}
                            transition={{ ...fadeUp.transition, delay: 0.35 }}
                            className="bg-white rounded-2xl border border-zinc-100 p-6"
                        >
                            <h2 className="text-sm font-black text-zinc-900 mb-5 flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-blue-600" />
                                Education
                            </h2>
                            <div className="space-y-4">
                                {cv.education.map((edu: any, i: number) => (
                                    <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <p className="text-xs font-black text-zinc-900">{edu.degree || edu.qualification || edu.title || "Degree"}</p>
                                        <p className="text-[11px] font-bold text-blue-600 mt-0.5">{edu.institution || edu.school || edu.university || "Institution"}</p>
                                        {(edu.year || edu.graduation_year || edu.end_date) && (
                                            <p className="text-[10px] text-zinc-400 mt-1">{edu.year || edu.graduation_year || edu.end_date}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Projects */}
                    {cv.projects.length > 0 && (
                        <motion.div
                            {...fadeUp}
                            transition={{ ...fadeUp.transition, delay: 0.4 }}
                            className="bg-white rounded-2xl border border-zinc-100 p-6"
                        >
                            <h2 className="text-sm font-black text-zinc-900 mb-5 flex items-center gap-2">
                                <FolderOpen className="h-4 w-4 text-blue-600" />
                                Projects
                            </h2>
                            <div className="space-y-4">
                                {cv.projects.map((proj: any, i: number) => (
                                    <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-xs font-black text-zinc-900">{proj.name || proj.title || "Project"}</p>
                                            {proj.url && (
                                                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors shrink-0">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                        {proj.description && (
                                            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed line-clamp-2">{proj.description}</p>
                                        )}
                                        {proj.technologies && Array.isArray(proj.technologies) && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {proj.technologies.slice(0, 4).map((t: string, ti: number) => (
                                                    <span key={ti} className="text-[10px] font-bold text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.5 rounded-md">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Certifications */}
                {cv.certifications.length > 0 && (
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.45 }}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8"
                    >
                        <h2 className="text-sm font-black text-zinc-900 mb-5 flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            Certifications
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {cv.certifications.map((cert: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
                                        <Award className="h-4 w-4 text-amber-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-zinc-900 truncate">{cert.name || cert.title || "Certification"}</p>
                                        {(cert.issuer || cert.organization) && (
                                            <p className="text-[10px] text-zinc-400 truncate">{cert.issuer || cert.organization}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Tech Stack from applications */}
                {tech_stack.length > 0 && (
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.5 }}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8"
                    >
                        <h2 className="text-sm font-black text-zinc-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            Tech Stack Applied For
                            <span className="text-[11px] font-bold text-zinc-400 ml-auto">From job applications</span>
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {tech_stack.map((tech: string, i: number) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                                        i < 3
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : i < 7
                                            ? "bg-blue-50 text-blue-700 border-blue-100"
                                            : "bg-zinc-50 text-zinc-700 border-zinc-100"
                                    )}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 text-center">
                <p className="text-xs text-zinc-400">
                    Profile powered by{" "}
                    <a href="/" className="font-bold text-zinc-600 hover:text-zinc-900 transition-colors">Offerra</a>
                    {" "}· Track your job search journey
                </p>
            </div>
        </div>
    );
}
