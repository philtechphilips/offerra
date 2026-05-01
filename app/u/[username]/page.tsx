"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    MapPin, Linkedin, Github, Twitter, Globe, Briefcase,
    GraduationCap, Award, Code2, BarChart3, Loader2,
    CheckCircle2, TrendingUp, Star, FolderOpen, ExternalLink,
    Mail, Link2, Sparkles, User, Cpu
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { apiAbsoluteUrl } from "@/app/lib/apiOrigin";

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
        profile_theme: 'modern' | 'minimalist' | 'bento';
    };
    cv: {
        summary: string | null;
        skills: string[];
        work_experience: any[];
        education: any[];
        projects: any[];
        certifications: any[];
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

function SocialLink({ href, icon: Icon, label, minimalist = false }: { href: string; icon: any; label: string; minimalist?: boolean }) {
    if (!href) return null;
    const fullHref = href.startsWith('http') ? href : `https://${href}`;
    
    if (minimalist) {
        return (
            <a href={fullHref} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors" title={label}>
                <Icon className="h-5 w-5" />
            </a>
        );
    }

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

// ===============================================
// MODERN THEME (Refactored original)
// ===============================================
const ModernLayout = ({ profile }: { profile: PublicProfile }) => {
    const { user, cv, tech_stack } = profile;
    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="bg-white border-b border-zinc-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
                    <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-blue-200">
                            {initials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{user.name}</h1>
                            {user.professional_headline && <p className="text-sm font-semibold text-zinc-500 mt-1">{user.professional_headline}</p>}
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                {user.location && <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium"><MapPin className="h-3 w-3" />{user.location}</span>}
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100"><CheckCircle2 className="h-3 w-3" />Open to opportunities</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="flex flex-wrap gap-2 mt-6">
                        {user.linkedin_url && <SocialLink href={user.linkedin_url} icon={Linkedin} label="LinkedIn" />}
                        {user.github_url && <SocialLink href={user.github_url} icon={Github} label="GitHub" />}
                        {user.twitter_url && <SocialLink href={user.twitter_url} icon={Twitter} label="Twitter" />}
                        {user.portfolio_url && <SocialLink href={user.portfolio_url} icon={ExternalLink} label="Portfolio" />}
                    </motion.div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
                {cv.summary && (
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8">
                        <h2 className="text-sm font-black text-zinc-900 mb-4 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />About</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">{cv.summary}</p>
                    </motion.div>
                )}
                {cv.skills.length > 0 && (
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }} className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8">
                        <h2 className="text-sm font-black text-zinc-900 mb-4 flex items-center gap-2"><Code2 className="h-4 w-4 text-blue-600" />Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {cv.skills.map((skill, i) => <span key={i} className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-700 hover:border-zinc-300 transition-colors">{skill}</span>)}
                        </div>
                    </motion.div>
                )}
                {cv.work_experience.length > 0 && (
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8">
                        <h2 className="text-sm font-black text-zinc-900 mb-6 flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" />Work Experience</h2>
                        <div className="space-y-6">
                            {cv.work_experience.map((job, i) => (
                                <div key={i} className={cn("relative pl-6", i < cv.work_experience.length - 1 && "pb-6 border-l border-zinc-100")}>
                                    <div className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-blue-100 border-2 border-blue-400 -translate-x-1/2" />
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-black text-zinc-900">{job.title || "Role"}</p>
                                            <p className="text-xs font-bold text-blue-600 mt-0.5">{job.company || "Company"}</p>
                                        </div>
                                        {job.duration && <span className="text-[11px] font-bold text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">{job.duration}</span>}
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-relaxed mt-2 line-clamp-3">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {cv.education.length > 0 && (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                            <h2 className="text-sm font-black text-zinc-900 mb-5 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-blue-600" />Education</h2>
                            <div className="space-y-4">
                                {cv.education.map((edu, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <p className="text-xs font-black text-zinc-900">{edu.degree || "Degree"}</p>
                                        <p className="text-[11px] font-bold text-blue-600 mt-0.5">{edu.institution || "Institution"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {cv.projects.length > 0 && (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                            <h2 className="text-sm font-black text-zinc-900 mb-5 flex items-center gap-2"><FolderOpen className="h-4 w-4 text-blue-600" />Projects</h2>
                            <div className="space-y-4">
                                {cv.projects.map((proj, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-xs font-black text-zinc-900">{proj.name || "Project"}</p>
                                            {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors shrink-0"><ExternalLink className="h-3 w-3" /></a>}
                                        </div>
                                        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 text-center">
                <p className="text-xs text-zinc-400">Portfolio powered by <a href="/" className="font-bold text-zinc-600 hover:text-zinc-900 transition-colors">Offerra</a> · Built for professional impact</p>
            </div>
        </div>
    );
};

// ===============================================
// MINIMALIST THEME (Reader focused)
// ===============================================
const MinimalistLayout = ({ profile }: { profile: PublicProfile }) => {
    const { user, cv, tech_stack } = profile;
    return (
        <div className="min-h-screen bg-white font-serif selection:bg-zinc-100 text-zinc-900">
            <div className="max-w-2xl mx-auto px-6 py-20 sm:py-32">
                <header className="mb-20">
                    <h1 className="text-4xl font-black tracking-tight mb-4">{user.name}</h1>
                    <p className="text-lg text-zinc-500 font-sans">{user.professional_headline || "Professional"}</p>
                    <div className="mt-8 flex items-center gap-6 font-sans">
                        {user.linkedin_url && <SocialLink href={user.linkedin_url} icon={Linkedin} label="LinkedIn" minimalist />}
                        {user.github_url && <SocialLink href={user.github_url} icon={Github} label="GitHub" minimalist />}
                        {user.twitter_url && <SocialLink href={user.twitter_url} icon={Twitter} label="Twitter" minimalist />}
                        {user.portfolio_url && <SocialLink href={user.portfolio_url} icon={Link2} label="Portfolio" minimalist />}
                        {user.location && <span className="text-xs text-zinc-400 ml-auto flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{user.location}</span>}
                    </div>
                </header>

                <main className="space-y-16">
                    {cv.summary && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 font-sans">Biography</h2>
                            <p className="text-lg leading-relaxed text-zinc-700">{cv.summary}</p>
                        </section>
                    )}

                    {cv.work_experience.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8 font-sans">Experience</h2>
                            <div className="space-y-12">
                                {cv.work_experience.map((job, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-bold">{job.title || "Role"}</h3>
                                            <span className="text-xs text-zinc-400 font-sans font-medium">{job.duration}</span>
                                        </div>
                                        <p className="text-zinc-500 font-sans mb-4">{job.company}</p>
                                        <p className="text-base text-zinc-600 leading-relaxed italic">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {cv.skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 font-sans">Expertise</h2>
                            <div className="flex flex-wrap gap-x-8 gap-y-4 font-sans">
                                {cv.skills.map((skill, i) => (
                                    <span key={i} className="text-sm font-bold text-zinc-800 border-b border-zinc-100 pb-1">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    <footer className="pt-20 border-t border-zinc-100 text-center font-sans">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-300">Powered by Offerra · 2026</p>
                    </footer>
                </main>
            </div>
        </div>
    );
};

// ===============================================
// BENTO LAYOUT (THE ELITE THEME)
// ===============================================
const BentoLayout = ({ profile }: { profile: PublicProfile }) => {
    const { user, cv, tech_stack } = profile;

    return (
        <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-blue-100 p-4 sm:p-8 lg:p-12">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-fr">
                
                {/* 1. Header Card (Hero) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-4 lg:col-span-8 bg-white rounded-[2.5rem] p-8 lg:p-12 border border-zinc-100 flex flex-col justify-between group overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Sparkles className="h-64 w-64 text-blue-600 -rotate-12" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start lg:items-center gap-6 relative z-10">
                        <div className="h-24 w-24 lg:h-32 lg:w-32 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-blue-100 shrink-0">
                            {initials(user.name)}
                        </div>
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900">{user.name}</h1>
                            <p className="text-xl font-bold text-zinc-400 mt-2 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                {user.professional_headline || "Ready to ship"}
                            </p>
                        </div>
                    </div>
                    <div className="mt-12 flex flex-wrap items-center gap-2 relative z-10">
                        {user.location && (
                            <div className="px-4 py-2 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500 flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                {user.location}
                            </div>
                        )}
                        <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-black text-emerald-600 flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Open to hire
                        </div>
                    </div>
                </motion.div>

                {/* 2. Socials / Contact Box */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-4 lg:col-span-4 bg-zinc-900 rounded-[2.5rem] p-8 flex flex-col justify-between text-white overflow-hidden relative border border-black shadow-2xl shadow-zinc-200"
                >
                    <h2 className="text-lg font-black tracking-tight mb-8">Reach out</h2>
                    <div className="space-y-3">
                        {user.linkedin_url && (
                            <a href={user.linkedin_url} target="_blank" className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-between group">
                                <span className="font-bold text-sm">LinkedIn</span>
                                <Linkedin className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                            </a>
                        )}
                        {user.github_url && (
                            <a href={user.github_url} target="_blank" className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-between group">
                                <span className="font-bold text-sm">GitHub</span>
                                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            </a>
                        )}
                        {user.portfolio_url && (
                             <a href={user.portfolio_url} target="_blank" className="w-full p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-between group shadow-lg shadow-blue-900/40">
                                <span className="font-black text-sm uppercase tracking-wider">Portfolio</span>
                                <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* 3. Summary (The Plot) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-4 lg:col-span-5 bg-white rounded-[2.5rem] p-8 lg:p-10 border border-zinc-100 flex flex-col h-full"
                >
                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight mb-4">The Narrative</h2>
                    <p className="text-base text-zinc-500 leading-relaxed font-medium">
                        {cv.summary || "No summary provided. I focus on delivering high-quality results and solving complex problems with efficient solutions."}
                    </p>
                </motion.div>

                {/* 4. Tech Stack (The Toolkit) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-4 lg:col-span-7 bg-white rounded-[2.5rem] p-8 lg:p-10 border border-zinc-100"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-black tracking-tight">Tech Toolkit</h2>
                        <Cpu className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tech_stack.length > 0 ? tech_stack.map((tech, i) => (
                            <span 
                                key={i}
                                className={cn(
                                    "px-4 py-2.5 rounded-2xl text-xs font-black border transition-all hover:scale-105 cursor-default",
                                    i % 3 === 0 ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white text-zinc-700 border-zinc-100"
                                )}
                            >
                                {tech}
                            </span>
                        )) : cv.skills.map((skill, i) => (
                             <span key={i} className="px-4 py-2.5 rounded-2xl text-xs font-black bg-white text-zinc-700 border border-zinc-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* 5. Work Experience (Legacy) - Scrollable or Large Grid */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-4 lg:col-span-12 bg-white rounded-[2.5rem] p-8 lg:p-12 border border-zinc-100"
                >
                    <h2 className="text-2xl font-black tracking-tight mb-12 flex items-center gap-3">
                        Professional Journey
                        <span className="h-1 flex-1 bg-zinc-50 rounded-full" />
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cv.work_experience.map((job, i) => (
                            <div key={i} className="group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                        <Briefcase className="h-5 w-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-zinc-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">{job.title || "Elite Specialist"}</h3>
                                        <p className="text-xs font-bold text-zinc-400">{job.company}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-4 line-clamp-3 italic">
                                    {job.description}
                                </p>
                                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{job.duration || "Present"}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 6. Footer (Tiny) */}
                <div className="lg:col-span-12 flex justify-center py-12">
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">
                         OFFERRA ELITE · 2026
                     </p>
                </div>
            </div>
        </div>
    );
};

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const url = apiAbsoluteUrl(`/api/u/${encodeURIComponent(username)}`);

        fetch(url, { credentials: "omit" })
            .then((res) => {
                if (!res.ok) throw new Error("not found");
                return res.json();
            })
            .then((data) => setProfile(data))
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

    const theme = profile.user.profile_theme || 'modern';

    if (theme === 'minimalist') {
        return <MinimalistLayout profile={profile} />;
    }

    if (theme === 'bento') {
        return <BentoLayout profile={profile} />;
    }

    return <ModernLayout profile={profile} />;
}
