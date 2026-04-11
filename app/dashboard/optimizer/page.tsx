"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, FileText, Zap, Loader2, ChevronRight,
    Brain, BrainCircuit, ArrowRight, Copy,
    PenTool, Download, Palette, Edit3, Save, X, FileJson,
    Type, Layout, Eye, ChevronLeft, Plus, Trash2, AlignLeft,
    ChevronUp, ChevronDown, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

interface OptimizerResult {
    optimized_summary: string;
    key_skills_to_highlight: string[];
    experience_optimization: {
        company: string;
        original_title: string;
        duration: string;
        tailored_bullets: string[];
    }[];
    additional_sections?: {
        title: string;
        content: string;
    }[];
    strategic_advice: string;
}

interface EditableResume {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    links: { label: string, value: string }[];
    summary: string;
    skills: string[];
    experience: {
        company: string;
        title: string;
        duration: string;
        bullets: string[];
    }[];
    customSections: {
        title: string;
        content: string;
    }[];
}

type TemplateType = 'classic' | 'modern' | 'creative' | 'minimal' | 'executive';

export default function ResumeOptimizerPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [cvs, setCvs] = useState<any[]>([]);
    const [selectedCvId, setSelectedCvId] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [resumeData, setResumeData] = useState<EditableResume | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
    const [cvName, setCvName] = useState("");
    const [savedCvId, setSavedCvId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const resumeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                const res = await api.get('/cv');
                const list = res.data.cvs || [];
                setCvs(list);
                const active = list.find((c: any) => c.is_active);
                if (active) setSelectedCvId(active.id);

                const urlParams = new URLSearchParams(window.location.search);
                const editId = urlParams.get('edit');
                if (editId) {
                    const toEdit = list.find((c: any) => c.id.toString() === editId);
                    if (toEdit) loadExistingIntoEditor(toEdit);
                }
            } catch (err) {
                console.error("Failed to load CVs");
            }
        };
        fetchCVs();
    }, []);

    const loadExistingIntoEditor = (cv: any) => {
        const parsed = cv.parsed_data || {};
        const editable: EditableResume = {
            fullName: parsed.full_name || "Your Name",
            email: parsed.email || "email@example.com",
            phone: parsed.phone || "",
            location: parsed.location || "",
            jobTitle: parsed.current_title || "",
            links: parsed.links || [],
            summary: parsed.summary || "",
            skills: parsed.skills || [],
            experience: (parsed.work_experience || []).map((exp: any) => ({
                company: exp.company || "",
                title: exp.title || "",
                duration: exp.duration || "",
                bullets: (exp.description || "").split('\n').filter((l: string) => l.trim())
            })),
            customSections: parsed.custom_sections || []
        };
        setResumeData(editable);
        setCvName(cv.profile_name || `Optimized: ${editable.fullName}`);
        setSavedCvId(cv.id);
        setIsEditing(true);
    };

    const handleOptimize = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please paste a job description first.");
            return;
        }
        setIsOptimizing(true);
        const loadingId = toast.loading("AI is refactoring your resume...");
        try {
            const res = await api.post('/cv/refactor', {
                job_description: jobDescription,
                cv_id: selectedCvId
            });
            const optimized: OptimizerResult = res.data;
            const sourceCv = cvs.find(c => c.id === selectedCvId);
            const parsed = sourceCv?.parsed_data || {};

            const extraLinks = [];
            if (parsed.linkedin) extraLinks.push({ label: "LinkedIn", value: parsed.linkedin });
            if (parsed.github) extraLinks.push({ label: "GitHub", value: parsed.github });
            if (parsed.portfolio) extraLinks.push({ label: "Portfolio", value: parsed.portfolio });

            const editable: EditableResume = {
                fullName: parsed.full_name || "Your Name",
                email: parsed.email || "email@example.com",
                phone: parsed.phone || "",
                location: parsed.location || "",
                jobTitle: parsed.current_title || (optimized.experience_optimization[0]?.original_title) || "",
                links: extraLinks,
                summary: optimized.optimized_summary,
                skills: optimized.key_skills_to_highlight,
                experience: optimized.experience_optimization.map(exp => ({
                    company: exp.company,
                    title: exp.original_title,
                    duration: exp.duration || "",
                    bullets: exp.tailored_bullets
                })),
                customSections: (optimized as any).additional_sections || []
            };

            setResumeData(editable);
            setCvName(`Optimized: ${editable.fullName}`);
            setSavedCvId(null);
            setIsEditing(true);
            toast.success("Resume optimized & ready for editing!", { id: loadingId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Optimization failed.", { id: loadingId });
        } finally {
            setIsOptimizing(false);
        }
    };

    const addExperience = () => {
        if (!resumeData) return;
        setResumeData({
            ...resumeData,
            experience: [...resumeData.experience, { company: "New Company", title: "Job Title", duration: "Jan 2024 - Present", bullets: ["Key achievement..."] }]
        });
    };

    const moveItem = (arrayKey: 'experience' | 'customSections' | 'links' | 'skills', index: number, direction: 'up' | 'down') => {
        setResumeData(prev => {
            if (!prev) return null;
            const newArray = [...(prev[arrayKey] as any[])];
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= newArray.length) return prev;
            [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
            return { ...prev, [arrayKey]: newArray };
        });
    };

    const moveBullet = (expIndex: number, bulletIndex: number, direction: 'up' | 'down') => {
        setResumeData(prev => {
            if (!prev) return null;
            const newExp = [...prev.experience];
            const bullets = [...newExp[expIndex].bullets];
            const newIndex = direction === 'up' ? bulletIndex - 1 : bulletIndex + 1;
            if (newIndex < 0 || newIndex >= bullets.length) return prev;
            [bullets[bulletIndex], bullets[newIndex]] = [bullets[newIndex], bullets[bulletIndex]];
            newExp[expIndex] = { ...newExp[expIndex], bullets };
            return { ...prev, experience: newExp };
        });
    };

    const addSkill = () => {
        if (!resumeData) return;
        setResumeData({ ...resumeData, skills: [...resumeData.skills, "New Skill"] });
    };

    const removeSkill = (index: number) => {
        if (!resumeData) return;
        const newSkills = [...resumeData.skills];
        newSkills.splice(index, 1);
        setResumeData({ ...resumeData, skills: newSkills });
    };

    const removeExperience = (index: number) => {
        if (!resumeData) return;
        const newExp = [...resumeData.experience];
        newExp.splice(index, 1);
        setResumeData({ ...resumeData, experience: newExp });
    };

    const addCustomSection = () => {
        if (!resumeData) return;
        setResumeData({ ...resumeData, customSections: [...resumeData.customSections, { title: "New Section", content: "Section content..." }] });
    };

    const removeCustomSection = (index: number) => {
        if (!resumeData) return;
        const newSections = [...resumeData.customSections];
        newSections.splice(index, 1);
        setResumeData({ ...resumeData, customSections: newSections });
    };

    const addLink = () => {
        if (!resumeData) return;
        setResumeData({ ...resumeData, links: [...resumeData.links, { label: "LinkedIn", value: "" }] });
    };

    const removeLink = (index: number) => {
        if (!resumeData) return;
        const newLinks = [...resumeData.links];
        newLinks.splice(index, 1);
        setResumeData({ ...resumeData, links: newLinks });
    };

    const addBullet = (expIndex: number) => {
        if (!resumeData) return;
        const newExp = [...resumeData.experience];
        newExp[expIndex].bullets.push("New bullet point...");
        setResumeData({ ...resumeData, experience: newExp });
    };

    const removeBullet = (expIndex: number, bulletIndex: number) => {
        if (!resumeData) return;
        const newExp = [...resumeData.experience];
        newExp[expIndex].bullets.splice(bulletIndex, 1);
        setResumeData({ ...resumeData, experience: newExp });
    };

    const downloadPDF = async () => {
        if (!resumeData || !resumeRef.current) return;
        const loadingId = toast.loading("Preparing high-quality selectable PDF...");

        try {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.style.visibility = 'hidden';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (!doc) throw new Error("Could not initialize print engine");

            const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
                .map(s => s.outerHTML).join('\n');

            const content = resumeRef.current.innerHTML;
            const resumeName = (resumeData.fullName || "Resume").replace(/\s+/g, '_');

            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>${resumeName}_Resume</title>
                        ${styles}
                        <style>
                            @page { size: A4; margin: 20mm 15mm; }
                            body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                            #print-container { width: 100%; }
                            #print-container > div { padding: 0 10mm !important; margin: 0 auto !important; width: 100% !important; min-height: auto !important; box-shadow: none !important; border: none !important; }
                            section { page-break-inside: auto !important; break-inside: auto !important; }
                            .group, li, h2, h3 { page-break-inside: avoid !important; break-inside: avoid !important; }
                            h2, h3 { break-after: avoid !important; page-break-after: avoid !important; }
                            :root { color-scheme: light !important; }
                            * { --color-zinc-900: #18181b !important; --color-blue-600: #2563eb !important; }
                        </style>
                    </head>
                    <body><div id="print-container">${content}</div></body>
                </html>
            `);
            doc.close();

            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    toast.success("CV Downloaded Successfully!", { id: loadingId, duration: 6000 });
                }, 1000);
            }, 500);
        } catch (err: any) {
            console.error("PDF generation failed:", err);
            toast.error("Format conversion failed.", { id: loadingId });
        }
    };

    const handleSave = async () => {
        if (!resumeData) return;
        setIsSaving(true);
        const loadingId = toast.loading(savedCvId ? "Updating resume..." : "Saving to dashboard...");
        try {
            const res = await api.post('/cv/save-optimized', {
                resume_data: resumeData,
                profile_name: cvName || `Optimized: ${resumeData.fullName}`,
                cv_id: savedCvId
            });
            if (res.data.profile?.id) setSavedCvId(res.data.profile.id);
            toast.success(savedCvId ? "Resume updated!" : "Resume saved successfully!", { id: loadingId });
            const cvListRes = await api.get('/cv');
            setCvs(cvListRes.data.cvs || []);
        } catch (err: any) {
            toast.error("Failed to save resume", { id: loadingId });
        } finally {
            setIsSaving(false);
        }
    };

    const docXProcessBold = (text: string) => {
        if (!text) return [];
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map(part => {
            if (part?.startsWith('**') && part?.endsWith('**')) return new TextRun({ text: part.slice(2, -2), bold: true });
            return new TextRun(part || "");
        });
    };

    const downloadWord = async () => {
        if (!resumeData) return;
        const loadingId = toast.loading("Generating Microsoft Word file...");
        try {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({ text: resumeData.fullName, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
                        new Paragraph({ children: [new TextRun(`${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`)], alignment: AlignmentType.CENTER }),
                        resumeData.jobTitle ? new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: resumeData.jobTitle.toUpperCase(), bold: true, color: "2563eb" })] }) : new Paragraph({ text: "" }),
                        new Paragraph({ text: "", spacing: { before: 200 } }),
                        new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2, border: { bottom: { color: "666666", size: 1, space: 1, style: "single" } } }),
                        new Paragraph({ children: docXProcessBold(resumeData.summary), spacing: { before: 100 } }),
                        new Paragraph({ text: "", spacing: { before: 200 } }),
                        new Paragraph({ text: "CORE SKILLS", heading: HeadingLevel.HEADING_2 }),
                        new Paragraph({ text: resumeData.skills.join(", "), spacing: { before: 100 } }),
                        new Paragraph({ text: "", spacing: { before: 200 } }),
                        new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
                        ...resumeData.experience.flatMap(exp => [
                            new Paragraph({ children: [new TextRun({ text: exp.company, bold: true }), new TextRun({ text: ` - ${exp.title}`, italics: true }), exp.duration ? new TextRun({ text: ` (${exp.duration})`, size: 18, color: "666666" }) : new TextRun({ text: "" })], spacing: { before: 150 } }),
                            ...exp.bullets.map(bullet => new Paragraph({ children: docXProcessBold(bullet), bullet: { level: 0 } }))
                        ]),
                        ...resumeData.customSections.flatMap(section => [
                            new Paragraph({ text: "", spacing: { before: 200 } }),
                            new Paragraph({ text: section.title.toUpperCase(), heading: HeadingLevel.HEADING_2, border: { bottom: { color: "666666", size: 1, space: 1, style: "single" } } }),
                            new Paragraph({ children: docXProcessBold(section.content), spacing: { before: 100 } }),
                        ])
                    ],
                }],
            });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.docx`);
            toast.success("Word file downloaded!", { id: loadingId });
        } catch (err) {
            toast.error("Failed to generate Word file", { id: loadingId });
        }
    };

    // ---- Template Components ----

    const processBold = (text: string) => {
        if (!text) return "";
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part?.startsWith('**') && part?.endsWith('**')) return <span key={i} className="font-bold">{part.slice(2, -2)}</span>;
            return part;
        });
    };

    const RenderCustomContent = ({ content, itemClassName, listClassName, bulletPrefix }: {
        content: string, itemClassName?: string, listClassName?: string, bulletPrefix?: React.ReactNode
    }) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const isList = lines.some(line => /^[\s]*([\u2022\u25CF\-\+]|\*[\s]+)/.test(line));
        if (isList) {
            return (
                <ul className={cn("space-y-1.5", listClassName)}>
                    {lines.map((line, i) => {
                        const cleanLine = line.trim().replace(/^([\u2022\u25CF\-\+]|\*[\s]+)\s*/, '');
                        return (
                            <li key={i} className={cn("flex gap-2", itemClassName)}>
                                {bulletPrefix || <span className="shrink-0">•</span>}
                                <span>{processBold(cleanLine)}</span>
                            </li>
                        );
                    })}
                </ul>
            );
        }
        return <p className={cn("whitespace-pre-wrap", itemClassName)}>{processBold(content)}</p>;
    };

    const ClassicTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-16 min-h-280.75 w-198.5 mx-auto text-[#18181b] border border-[#e4e4e7]" style={{ fontFamily: 'serif', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="text-center border-b-2 border-[#18181b] pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-widest">{data.fullName}</h1>
                {data.jobTitle && <p className="text-lg font-bold text-[#2563eb] mt-2 uppercase tracking-widest">{data.jobTitle}</p>}
                <div className="text-sm mt-3 text-[#52525b] font-sans flex flex-wrap justify-center gap-3">
                    <span>Email: <span className="lowercase">{data.email}</span></span><span>&bull;</span>
                    <span>Phone: {data.phone}</span><span>&bull;</span>
                    <span>Location: {data.location}</span>
                    {data.links.map((link, i) => (<Fragment key={i}><span>&bull;</span><span className="font-bold">{link.label}: <span className="lowercase">{link.value}</span></span></Fragment>))}
                </div>
            </div>
            <div className="space-y-10">
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">Professional Summary</h2>
                    <p className="text-[14px] leading-relaxed text-[#3f3f46]">{processBold(data.summary)}</p>
                </section>
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">Core Expertise</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">{data.skills.map((s, i) => <span key={i} className="text-[15px] font-semibold">{s}</span>)}</div>
                </section>
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-4">Professional Experience</h2>
                    <div className="space-y-8">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <div><h3 className="font-bold text-base">{exp.company}</h3><span className="text-[13px] italic">{exp.title}</span></div>
                                    <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">{exp.duration}</span>
                                </div>
                                <ul className="list-disc ml-4 space-y-1.5">{exp.bullets.map((b, j) => <li key={j} className="text-[14px] text-[#3f3f46] leading-snug">{processBold(b)}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                </section>
                {data.customSections?.map((section, idx) => (
                    <section key={idx}>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">{section.title}</h2>
                        <RenderCustomContent content={section.content} itemClassName="text-[14px] text-[#3f3f46] leading-snug" />
                    </section>
                ))}
            </div>
        </div>
    );

    const ModernTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-16 min-h-280.75 w-198.5 mx-auto text-[#18181b] flex flex-col font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="border-b-2 border-[#18181b] pb-10 mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-[#18181b]">{data.fullName}</h1>
                    <p className="text-[#2563eb] font-black uppercase tracking-[0.2em] text-xs mt-3">{data.jobTitle || data.experience[0]?.title || "Professional"}</p>
                </div>
                <div className="text-right space-y-1.5 text-[#71717a] text-[10px] font-bold tracking-tight">
                    <div className="flex justify-end gap-2 items-center"><span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">Email:</span><span className="text-[#18181b] lowercase font-semibold">{data.email}</span></div>
                    <div className="flex justify-end gap-2 items-center"><span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">Phone:</span><span className="text-[#18181b] font-semibold">{data.phone}</span></div>
                    <div className="flex justify-end gap-2 items-center"><span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">Location:</span><span className="text-[#18181b] font-semibold">{data.location}</span></div>
                    {data.links.map((link, i) => (<div key={i} className="flex justify-end gap-2 items-center"><span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">{link.label}:</span><span className="text-[#18181b] lowercase font-semibold">{link.value}</span></div>))}
                </div>
            </div>
            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-8 space-y-10">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb] mb-4">Profile</h2>
                        <p className="text-[14px] leading-relaxed text-[#52525b] font-medium">{processBold(data.summary)}</p>
                    </section>
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb] mb-6">Experience</h2>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l border-[#f4f4f5]">
                                    <div className="absolute top-0 left-[-4.5px] h-2 w-2 rounded-full bg-[#2563eb]" />
                                    <h3 className="font-extrabold text-base tracking-tight">{exp.company}</h3>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <p className="text-[13px] font-bold text-[#a1a1aa]">{exp.title}</p>
                                        <p className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest">{exp.duration}</p>
                                    </div>
                                    <ul className="space-y-3">
                                        {exp.bullets.map((b, j) => (<li key={j} className="text-[13px] text-[#52525b] font-medium leading-relaxed flex gap-3"><span className="text-[#3b82f6] mt-1">&bull;</span><span>{processBold(b)}</span></li>))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                    {data.customSections?.map((section, idx) => (
                        <section key={idx} className="mt-10">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb] mb-4">{section.title}</h2>
                            <RenderCustomContent content={section.content} itemClassName="text-[13px] text-[#52525b] font-medium leading-relaxed" bulletPrefix={<span className="text-[#3b82f6] mt-1 shrink-0">&bull;</span>} />
                        </section>
                    ))}
                </div>
                <div className="col-span-4 bg-[#fcfcfc] -my-12 p-10 pt-12 border-l border-[#f4f4f5]">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a1a1aa] mb-12 border-b border-[#f4f4f5] pb-3">Expertise</h2>
                        <div className="space-y-5">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[rgba(37,99,235,0.2)] flex items-center justify-center"><div className="h-0.5 w-0.5 rounded-full bg-[#2563eb]" /></div>
                                    <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest leading-none">{s}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );

    const MinimalTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-16 min-h-280.75 w-198.5 mx-auto text-[#27272a] font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="mb-12">
                <h1 className="text-3xl font-light tracking-tighter text-[#18181b]">{data.fullName}</h1>
                {data.jobTitle && <p className="text-xs font-bold text-[#18181b] mt-2 uppercase tracking-[0.3em]">{data.jobTitle}</p>}
                <div className="flex flex-wrap gap-4 mt-3 text-[10px] font-medium text-[#71717a] tracking-widest">
                    <span>Email: <span className="lowercase">{data.email}</span></span><span>/</span>
                    <span>Phone: {data.phone}</span><span>/</span>
                    <span>Location: {data.location}</span>
                    {data.links.map((link, i) => (<Fragment key={i}><span>/</span><span>{link.label}: <span className="lowercase">{link.value}</span></span></Fragment>))}
                </div>
            </div>
            <div className="space-y-12">
                <section><p className="text-[15px] leading-relaxed text-[#52525b] lowercase first-letter:uppercase">{processBold(data.summary)}</p></section>
                <div className="space-y-10">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a1a1aa] border-b border-[#f4f4f5] pb-2">Experience</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="grid grid-cols-4 gap-8">
                            <div className="text-[10px] font-bold text-[#a1a1aa] uppercase pt-1">{exp.company}{exp.duration && <div className="mt-1 font-medium lowercase tracking-normal">{exp.duration}</div>}</div>
                            <div className="col-span-3 space-y-3">
                                <h3 className="text-[15px] font-bold text-[#18181b]">{exp.title}</h3>
                                <ul className="space-y-2">{exp.bullets.map((b, j) => (<li key={j} className="text-[13px] text-[#52525b] leading-relaxed">{processBold(b)}</li>))}</ul>
                            </div>
                        </div>
                    ))}
                </div>
                {data.customSections?.map((section, idx) => (
                    <div key={idx} className="space-y-6">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a1a1aa] border-b border-[#f4f4f5] pb-2">{section.title}</h2>
                        <RenderCustomContent content={section.content} itemClassName="text-[13px] text-[#52525b] leading-relaxed" />
                    </div>
                ))}
            </div>
        </div>
    );

    const ExecutiveTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-16 min-h-280.75 w-198.5 mx-auto text-[#1c1917] font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="border-l-8 border-[#44403c] pl-8 mb-16">
                <h1 className="text-5xl font-black tracking-tight uppercase text-[#1c1917]">{data.fullName}</h1>
                <p className="text-sm font-bold text-[#78716c] mt-2 tracking-widest uppercase">{data.jobTitle || data.experience[0]?.title || "Executive"}</p>
                <div className="flex flex-wrap gap-6 mt-6 text-[11px] font-bold text-[#a8a29e]">
                    <span>Email: <span className="lowercase">{data.email}</span></span>
                    <span>Phone: {data.phone}</span><span>Location: {data.location}</span>
                    {data.links.map((link, i) => (<span key={i}>{link.label}: <span className="lowercase">{link.value}</span></span>))}
                </div>
            </div>
            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-8 space-y-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">Management Profile</h2>
                        <p className="text-[15px] leading-relaxed text-[#44403c] font-medium italic">"{processBold(data.summary)}"</p>
                    </section>
                    <section className="space-y-10">
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">Professional Career</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <div><h3 className="text-[16px] font-black text-[#1c1917]">{exp.company}</h3><p className="text-[11px] font-black text-[#78716c] uppercase">{exp.title}</p></div>
                                    <span className="text-[10px] font-black text-[#44403c] tracking-widest uppercase">{exp.duration}</span>
                                </div>
                                <ul className="list-square ml-4 space-y-2">{exp.bullets.map((b, j) => (<li key={j} className="text-[13px] text-[#44403c] leading-relaxed">{processBold(b)}</li>))}</ul>
                            </div>
                        ))}
                    </section>
                </div>
                <div className="col-span-4 space-y-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">Core Assets</h2>
                        <div className="flex flex-col gap-3">
                            {data.skills.map((s, i) => (<div key={i} className="text-[12px] font-bold text-[#57534e] flex items-center gap-2"><div className="h-1 w-1 bg-[#44403c] rotate-45" />{s}</div>))}
                        </div>
                    </section>
                    {data.customSections?.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">{section.title}</h2>
                            <RenderCustomContent content={section.content} itemClassName="text-[13px] text-[#44403c] leading-relaxed" bulletPrefix={<div className="h-1 w-1 bg-[#44403c] rotate-45 mt-1.5 shrink-0" />} />
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );

    const CreativeTemplate = ({ data }: { data: EditableResume }) => (
        <div className="creative-template-root bg-[#fafafa] min-h-280.75 w-198.5 mx-auto text-[#18181b] flex" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="w-1/3 bg-[#18181b] text-white p-12 flex flex-col justify-between">
                <div>
                    <div className="h-16 w-16 bg-[#3b82f6] rounded-full mb-8 flex items-center justify-center text-3xl font-black">{data.fullName.charAt(0)}</div>
                    <h1 className="text-3xl font-black leading-tight mb-4 uppercase">{data.fullName.split(' ').join('\n')}</h1>
                    <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.3em] mb-12">{data.jobTitle || data.experience[0]?.title || "Creative"}</p>
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#52525b] mb-4">Contact</h2>
                            <div className="space-y-2 text-[10px] font-medium text-[#a1a1aa]">
                                <p>Email: <span className="lowercase">{data.email}</span></p>
                                <p>Phone: {data.phone}</p><p>Location: {data.location}</p>
                                {data.links.map((link, i) => (<p key={i}>{link.label}: <span className="lowercase">{link.value}</span></p>))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#52525b] mb-4">Expertise</h2>
                            <div className="flex flex-wrap gap-2">{data.skills.map((s, i) => (<span key={i} className="px-2 py-1 bg-[#27272a] rounded text-[9px] font-bold text-[#fafafa] border border-[#3f3f46]">{s}</span>))}</div>
                        </section>
                    </div>
                </div>
                <div className="text-[8px] font-bold text-[#52525b] uppercase tracking-tighter">Generated by CV Optimizer &bull; 2026</div>
            </div>
            <div className="flex-1 p-16 bg-white flex flex-col">
                <div className="space-y-16">
                    <section>
                        <h2 className="text-4xl font-black text-[#18181b] mb-6 tracking-tighter">Hello.</h2>
                        <p className="text-[15px] border-l-4 border-[#3b82f6] pl-6 leading-relaxed font-medium text-[#3f3f46] italic">{processBold(data.summary)}</p>
                    </section>
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6] mb-8">Work History</h2>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-black group-hover:text-[#3b82f6] transition-colors">{exp.company}</h3>
                                        <span className="text-[10px] font-black text-[#3b82f6] uppercase tracking-widest">{exp.duration}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-[#52525b] uppercase tracking-widest mb-4">{exp.title}</p>
                                    <ul className="space-y-2 pl-2">{exp.bullets.map((b, j) => (<li key={j} className="text-[13px] text-[#52525b] font-medium leading-relaxed">&rarr; {processBold(b)}</li>))}</ul>
                                </div>
                            ))}
                        </div>
                    </section>
                    {data.customSections?.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6] mb-4">{section.title}</h2>
                            <RenderCustomContent content={section.content} itemClassName="text-[13px] text-[#52525b] font-medium leading-relaxed" bulletPrefix={<span className="shrink-0">&rarr;</span>} />
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );

    // ---- Editor View ----
    if (isEditing && resumeData) {
        return (
            <div className="w-full flex flex-col h-screen overflow-hidden -m-4 sm:-m-6 lg:-m-10">
                {/* Top bar */}
                <div className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="hidden sm:block">
                            <p className="text-sm font-black text-zinc-900 leading-none">Resume Architect</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{cvName || "Untitled"}</p>
                        </div>
                    </div>

                    {/* Template picker */}
                    <div className="flex items-center bg-zinc-50 border border-zinc-100 rounded-xl p-1 gap-0.5">
                        {(['modern', 'classic', 'creative', 'minimal', 'executive'] as TemplateType[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedTemplate(t)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all",
                                    selectedTemplate === t
                                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                                        : "text-zinc-400 hover:text-zinc-700"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={downloadWord} className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 bg-white text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                            <FileJson className="h-3.5 w-3.5" />
                            Word
                        </button>
                        <button onClick={downloadPDF} className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 bg-white text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                            <Download className="h-3.5 w-3.5" />
                            PDF
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-blue-600 text-white text-[10px] font-black hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            Save
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left panel: editing controls */}
                    <div className="w-100 shrink-0 bg-white border-r border-zinc-100 overflow-y-auto">
                        <div className="p-6 space-y-8">

                            {/* Resume name */}
                            <section className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Resume Label</label>
                                <input
                                    value={cvName}
                                    onChange={e => setCvName(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-100 px-3 py-2.5 rounded-lg text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="e.g. Senior Frontend Dev - Google"
                                />
                            </section>

                            {/* Personal info */}
                            <section className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Personal Info</label>
                                <div className="space-y-2">
                                    <input value={resumeData.fullName} onChange={e => setResumeData(prev => prev ? { ...prev, fullName: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-100 px-3 py-2.5 rounded-lg text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Full Name" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input value={resumeData.email} onChange={e => setResumeData(prev => prev ? { ...prev, email: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-100 px-3 py-2.5 rounded-lg text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Email" />
                                        <input value={resumeData.phone} onChange={e => setResumeData(prev => prev ? { ...prev, phone: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-100 px-3 py-2.5 rounded-lg text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Phone" />
                                    </div>
                                    <input value={resumeData.jobTitle} onChange={e => setResumeData(prev => prev ? { ...prev, jobTitle: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-100 px-3 py-2.5 rounded-lg text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Professional Headline" />
                                    <input value={resumeData.location} onChange={e => setResumeData(prev => prev ? { ...prev, location: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-100 px-3 py-2.5 rounded-lg text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Location" />
                                    <div className="space-y-2">
                                        {resumeData.links.map((link, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input value={link.label} onChange={e => setResumeData(prev => prev ? ({ ...prev, links: prev.links.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l) }) : null)} className="w-1/3 bg-zinc-50 border border-zinc-100 px-3 py-2 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Label" />
                                                <input value={link.value} onChange={e => setResumeData(prev => prev ? ({ ...prev, links: prev.links.map((l, idx) => idx === i ? { ...l, value: e.target.value } : l) }) : null)} className="flex-1 bg-zinc-50 border border-zinc-100 px-3 py-2 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Link / Value" />
                                                <button onClick={() => removeLink(i)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors"><X className="h-3.5 w-3.5" /></button>
                                            </div>
                                        ))}
                                        <button onClick={addLink} className="w-full py-2 border border-dashed border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-400 hover:bg-zinc-50 hover:text-blue-600 transition-all flex items-center justify-center gap-1.5">
                                            <Plus className="h-3 w-3" /> Add Link
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Summary */}
                            <section className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Professional Summary</label>
                                <textarea value={resumeData.summary} onChange={e => setResumeData(prev => prev ? { ...prev, summary: e.target.value } : null)} className="w-full h-32 bg-zinc-50 border border-zinc-100 px-3 py-2.5 rounded-lg text-xs font-medium leading-relaxed outline-none focus:border-blue-500 focus:bg-white transition-all resize-none" />
                            </section>

                            {/* Skills */}
                            <section className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-1 bg-zinc-50 border border-zinc-100 px-2.5 py-1.5 rounded-lg">
                                            <input value={skill} onChange={e => setResumeData(prev => prev ? ({ ...prev, skills: prev.skills.map((s, idx) => idx === i ? e.target.value : s) }) : null)} className="text-[10px] font-bold text-zinc-700 outline-none w-16 bg-transparent" />
                                            <button onClick={() => removeSkill(i)} className="text-zinc-300 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={addSkill} className="h-8 px-3 border border-dashed border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-400 hover:bg-zinc-50 hover:text-blue-600 transition-all flex items-center gap-1">
                                        <Plus className="h-3 w-3" /> Add
                                    </button>
                                </div>
                            </section>

                            {/* Experience */}
                            <section className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Work Experience</label>
                                <div className="space-y-4">
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <button onClick={() => moveItem('experience', i, 'up')} disabled={i === 0} className="p-0.5 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all"><ChevronUp className="h-3.5 w-3.5" /></button>
                                                    <button onClick={() => moveItem('experience', i, 'down')} disabled={i === resumeData.experience.length - 1} className="p-0.5 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all"><ChevronDown className="h-3.5 w-3.5" /></button>
                                                </div>
                                                <input value={exp.company} onChange={e => setResumeData(prev => prev ? ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, company: e.target.value } : ex) }) : null)} className="flex-1 text-xs font-black text-zinc-900 outline-none bg-transparent" placeholder="Company Name" />
                                                <button onClick={() => removeExperience(i)} className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input value={exp.title} onChange={e => setResumeData(prev => prev ? ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, title: e.target.value } : ex) }) : null)} className="text-[10px] font-bold text-zinc-500 outline-none bg-transparent" placeholder="Role Title" />
                                                <input value={exp.duration} onChange={e => setResumeData(prev => prev ? ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, duration: e.target.value } : ex) }) : null)} className="text-[10px] font-bold text-blue-500 outline-none bg-transparent text-right" placeholder="Dates" />
                                            </div>
                                            <div className="space-y-2 pt-2 border-t border-zinc-100">
                                                {exp.bullets.map((b, j) => (
                                                    <div key={j} className="flex gap-1.5 group items-start">
                                                        <div className="flex flex-col mt-1 shrink-0">
                                                            <button onClick={() => moveBullet(i, j, 'up')} disabled={j === 0} className="p-0.5 text-zinc-200 hover:text-blue-500 disabled:opacity-0 transition-all"><ChevronUp className="h-3 w-3" /></button>
                                                            <button onClick={() => moveBullet(i, j, 'down')} disabled={j === exp.bullets.length - 1} className="p-0.5 text-zinc-200 hover:text-blue-500 disabled:opacity-0 transition-all"><ChevronDown className="h-3 w-3" /></button>
                                                        </div>
                                                        <textarea value={b} onChange={e => setResumeData(prev => prev ? ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, bullets: ex.bullets.map((bull, bIdx) => bIdx === j ? e.target.value : bull) } : ex) }) : null)} className="flex-1 bg-white border border-zinc-100 px-2.5 py-2 rounded-lg text-[11px] text-zinc-600 outline-none focus:ring-1 focus:ring-blue-100 transition-all resize-none min-h-12.5" />
                                                        <button onClick={() => removeBullet(i, j)} className="p-1 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all shrink-0"><X className="h-3 w-3" /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addBullet(i)} className="w-full py-1.5 border border-dashed border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-400 hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-1">
                                                    <Plus className="h-3 w-3" /> Add Bullet
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addExperience} className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-xs font-bold text-zinc-400 hover:border-blue-200 hover:text-blue-500 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                                        <Plus className="h-3.5 w-3.5" /> Add Experience
                                    </button>
                                </div>
                            </section>

                            {/* Custom Sections */}
                            <section className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Custom Sections</label>
                                <div className="space-y-4">
                                    {resumeData.customSections.map((sec, i) => (
                                        <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <button onClick={() => moveItem('customSections', i, 'up')} disabled={i === 0} className="p-0.5 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all"><ChevronUp className="h-3.5 w-3.5" /></button>
                                                    <button onClick={() => moveItem('customSections', i, 'down')} disabled={i === resumeData.customSections.length - 1} className="p-0.5 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all"><ChevronDown className="h-3.5 w-3.5" /></button>
                                                </div>
                                                <input value={sec.title} onChange={e => setResumeData(prev => prev ? ({ ...prev, customSections: prev.customSections.map((s, idx) => idx === i ? { ...s, title: e.target.value } : s) }) : null)} className="flex-1 text-xs font-black text-zinc-900 outline-none bg-transparent" placeholder="Section Title" />
                                                <button onClick={() => removeCustomSection(i)} className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                            </div>
                                            <textarea value={sec.content} onChange={e => setResumeData(prev => prev ? ({ ...prev, customSections: prev.customSections.map((s, idx) => idx === i ? { ...s, content: e.target.value } : s) }) : null)} className="w-full bg-white border border-zinc-100 px-3 py-2 rounded-lg text-[11px] text-zinc-600 outline-none focus:ring-1 focus:ring-blue-100 transition-all resize-none min-h-20" placeholder="Write content here..." />
                                        </div>
                                    ))}
                                    <button onClick={addCustomSection} className="w-full py-2.5 border border-dashed border-zinc-200 rounded-xl text-xs font-bold text-zinc-400 hover:border-blue-200 hover:text-blue-500 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                                        <Plus className="h-3.5 w-3.5" /> Add Section
                                    </button>
                                </div>
                            </section>

                            {/* Download actions (mobile) */}
                            <div className="flex sm:hidden gap-2 pt-2">
                                <button onClick={downloadWord} className="flex-1 h-10 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 flex items-center justify-center gap-2"><FileJson className="h-3.5 w-3.5" /> Word</button>
                                <button onClick={downloadPDF} className="flex-1 h-10 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 flex items-center justify-center gap-2"><Download className="h-3.5 w-3.5" /> PDF</button>
                            </div>

                        </div>
                    </div>

                    {/* Right panel: live preview */}
                    <div className="flex-1 bg-zinc-100/60 overflow-y-auto flex items-start justify-center py-10 px-6">
                        <div ref={resumeRef} className="origin-top scale-[0.75] xl:scale-[0.85] 2xl:scale-100 transition-all duration-300">
                            {selectedTemplate === 'modern' && <ModernTemplate data={resumeData} />}
                            {selectedTemplate === 'classic' && <ClassicTemplate data={resumeData} />}
                            {selectedTemplate === 'creative' && <CreativeTemplate data={resumeData} />}
                            {selectedTemplate === 'minimal' && <MinimalTemplate data={resumeData} />}
                            {selectedTemplate === 'executive' && <ExecutiveTemplate data={resumeData} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---- Landing View ----
    return (
        <div className="w-full min-h-full pb-20">

            {/* Page header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">AI-Powered</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                    Resume Architect
                </h1>
                <p className="text-sm text-zinc-400 mt-1.5 max-w-xl">
                    Paste a job description and AI will rewrite your resume to match — then edit and download it.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Step 1: Select resume */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden h-full">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-50">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shrink-0">1</span>
                            <span className="text-sm font-black text-zinc-900">Select Resume</span>
                        </div>

                        <div className="p-5">
                            {cvs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="h-12 w-12 rounded-xl bg-zinc-50 flex items-center justify-center mb-3">
                                        <FileText className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <p className="text-sm font-bold text-zinc-400 mb-1">No resumes found</p>
                                    <p className="text-xs text-zinc-400 mb-4">Upload a resume in your profile first.</p>
                                    <a href="/dashboard/profile" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-all">
                                        Go to Profile
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {cvs.map((cv) => (
                                        <button
                                            key={cv.id}
                                            onClick={() => setSelectedCvId(cv.id)}
                                            className={cn(
                                                "w-full text-left flex items-center gap-3 p-3 rounded-xl text-sm transition-all border",
                                                selectedCvId === cv.id
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-zinc-50 text-zinc-700 border-transparent hover:border-zinc-200 hover:bg-white"
                                            )}
                                        >
                                            <div className={cn("h-8 w-8 shrink-0 rounded-lg flex items-center justify-center", selectedCvId === cv.id ? "bg-white/20" : "bg-white border border-zinc-100")}>
                                                <FileText className={cn("h-4 w-4", selectedCvId === cv.id ? "text-white" : "text-blue-600")} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold truncate">{cv.profile_name || cv.filename}</p>
                                                {cv.is_active && <p className={cn("text-[10px]", selectedCvId === cv.id ? "text-blue-200" : "text-blue-500")}>Active</p>}
                                            </div>
                                            {selectedCvId === cv.id && <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Feature hints */}
                        <div className="mx-5 mb-5 p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2.5">
                            {[
                                { icon: BrainCircuit, text: "AI rewrites bullets for the specific role" },
                                { icon: Palette, text: "5 professional templates to choose from" },
                                { icon: Download, text: "Download as PDF or Word document" },
                            ].map(({ icon: Icon, text }, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="h-6 w-6 shrink-0 rounded-lg bg-white border border-zinc-100 flex items-center justify-center">
                                        <Icon className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <p className="text-[11px] text-zinc-500">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 2: Job description + optimize */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden h-full flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
                            <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shrink-0">2</span>
                                <span className="text-sm font-black text-zinc-900">Paste Job Description</span>
                            </div>
                            <span className="text-[10px] text-zinc-300 font-bold">{jobDescription.length} chars</span>
                        </div>

                        <div className="flex-1 p-5 flex flex-col gap-4">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here — the more detail, the better the optimization..."
                                className="flex-1 min-h-80 w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm text-zinc-700 leading-relaxed resize-none"
                            />

                            <button
                                onClick={handleOptimize}
                                disabled={isOptimizing || !jobDescription.trim() || !selectedCvId}
                                className="w-full h-12 rounded-xl bg-blue-600 text-white text-sm font-black flex items-center justify-center gap-2.5 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40"
                            >
                                {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                {isOptimizing ? "AI is optimizing your resume..." : "Optimize & Open Editor"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
