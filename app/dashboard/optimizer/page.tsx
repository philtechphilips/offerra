"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, FileText, Zap, CheckCircle2, Loader2, ChevronRight,
    Search, Brain, Rocket, BrainCircuit, ArrowRight, Copy,
    PenTool, Download, Palette, Edit3, Save, X, FileJson,
    Type, Layout, Eye, ChevronLeft, Plus, Trash2, AlignLeft,
    ChevronUp, ChevronDown
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

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [resumeData, setResumeData] = useState<EditableResume | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

                // Check if we are continuing an edit
                const urlParams = new URLSearchParams(window.location.search);
                const editId = urlParams.get('edit');
                if (editId) {
                    const toEdit = list.find((c: any) => c.id.toString() === editId);
                    if (toEdit) {
                        loadExistingIntoEditor(toEdit);
                    }
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

            // Transform personal links
            const extraLinks = [];
            if (parsed.linkedin) extraLinks.push({ label: "LinkedIn", value: parsed.linkedin });
            if (parsed.github) extraLinks.push({ label: "GitHub", value: parsed.github });
            if (parsed.portfolio) extraLinks.push({ label: "Portfolio", value: parsed.portfolio });

            // Transform into editable format
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
            experience: [
                ...resumeData.experience,
                { company: "New Company", title: "Job Title", duration: "Jan 2024 - Present", bullets: ["Key achievement..."] }
            ]
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
        setResumeData({
            ...resumeData,
            skills: [...resumeData.skills, "New Skill"]
        });
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
        setResumeData({
            ...resumeData,
            customSections: [
                ...resumeData.customSections,
                { title: "New Section", content: "Section content..." }
            ]
        });
    };

    const removeCustomSection = (index: number) => {
        if (!resumeData) return;
        const newSections = [...resumeData.customSections];
        newSections.splice(index, 1);
        setResumeData({ ...resumeData, customSections: newSections });
    };

    const addLink = () => {
        if (!resumeData) return;
        setResumeData({
            ...resumeData,
            links: [...resumeData.links, { label: "LinkedIn", value: "" }]
        });
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
            // Create a hidden iframe for clean printing
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

            // Copy all styles from the main document
            const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
                .map(s => s.outerHTML)
                .join('\n');

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
                            @page {
                                size: A4;
                                margin: 20mm 15mm; /* Apply margins to EVERY page */
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                background: white;
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            #print-container {
                                width: 100%;
                            }
                            /* Standardize all templates for multi-page printing */
                            #print-container > div {
                                padding: 0 10mm !important; /* Add horizontal buffer for design elements */
                                margin: 0 auto !important;
                                width: 100% !important;
                                min-height: auto !important;
                                box-shadow: none !important;
                                border: none !important;
                            }
                            /* Prevent splitting individual items or headings across pages */
                            section {
                                page-break-inside: auto !important;
                                break-inside: auto !important;
                            }
                            .group, li, h2, h3 {
                                page-break-inside: avoid !important;
                                break-inside: avoid !important;
                            }
                            h2, h3 {
                                break-after: avoid !important;
                                page-break-after: avoid !important;
                            }
                            /* Force light mode variables for printing */
                            :root {
                                color-scheme: light !important;
                            }
                            /* Nuclear override for Tailwind v4 modern colors */
                            * {
                                --color-zinc-900: #18181b !important;
                                --color-blue-600: #2563eb !important;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="print-container">${content}</div>
                    </body>
                </html>
            `);
            doc.close();

            // Wait for resources/styles to load
            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();

                // Cleanup after a delay to ensure print dialog opened
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    toast.success("CV Downloaded Successfully!", {
                        id: loadingId,
                        duration: 6000
                    });
                }, 1000);
            }, 500);

        } catch (err: any) {
            console.error("Selectable PDF generation failed:", err);
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

            if (res.data.profile?.id) {
                setSavedCvId(res.data.profile.id);
            }

            toast.success(savedCvId ? "Resume updated!" : "Resume saved successfully!", { id: loadingId });

            // Refresh CV list
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
            if (part?.startsWith('**') && part?.endsWith('**')) {
                return new TextRun({ text: part.slice(2, -2), bold: true });
            }
            return new TextRun(part || "");
        });
    };

    const downloadWord = async () => {
        if (!resumeData) return;
        const loadingId = toast.loading("Generating Microsoft Word file...");

        try {
            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: [
                            new Paragraph({
                                text: resumeData.fullName,
                                heading: HeadingLevel.HEADING_1,
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun(`${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                            resumeData.jobTitle ? new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 100 },
                                children: [
                                    new TextRun({ text: resumeData.jobTitle.toUpperCase(), bold: true, color: "2563eb" })
                                ]
                            }) : new Paragraph({ text: "" }),
                            new Paragraph({ text: "", spacing: { before: 200 } }),
                            new Paragraph({
                                text: "PROFESSIONAL SUMMARY",
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "666666", size: 1, space: 1, style: "single" } }
                            }),
                            new Paragraph({
                                children: docXProcessBold(resumeData.summary),
                                spacing: { before: 100 }
                            }),
                            new Paragraph({ text: "", spacing: { before: 200 } }),
                            new Paragraph({
                                text: "CORE SKILLS",
                                heading: HeadingLevel.HEADING_2,
                            }),
                            new Paragraph({ text: resumeData.skills.join(", "), spacing: { before: 100 } }),
                            new Paragraph({ text: "", spacing: { before: 200 } }),
                            new Paragraph({
                                text: "WORK EXPERIENCE",
                                heading: HeadingLevel.HEADING_2,
                            }),
                            ...resumeData.experience.flatMap(exp => [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: exp.company, bold: true }),
                                        new TextRun({ text: ` - ${exp.title}`, italics: true }),
                                        exp.duration ? new TextRun({ text: ` (${exp.duration})`, size: 18, color: "666666" }) : new TextRun({ text: "" }),
                                    ],
                                    spacing: { before: 150 }
                                }),
                                ...exp.bullets.map(bullet => new Paragraph({
                                    children: docXProcessBold(bullet),
                                    bullet: { level: 0 }
                                }))
                            ]),
                            ...resumeData.customSections.flatMap(section => [
                                new Paragraph({ text: "", spacing: { before: 200 } }),
                                new Paragraph({
                                    text: section.title.toUpperCase(),
                                    heading: HeadingLevel.HEADING_2,
                                    border: { bottom: { color: "666666", size: 1, space: 1, style: "single" } }
                                }),
                                new Paragraph({
                                    children: docXProcessBold(section.content),
                                    spacing: { before: 100 }
                                }),
                            ])
                        ],
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.docx`);
            toast.success("Word file downloaded!", { id: loadingId });
        } catch (err) {
            toast.error("Failed to generate Word file", { id: loadingId });
        }
    };

    // --- Template Components ---

    const processBold = (text: string) => {
        if (!text) return "";
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part?.startsWith('**') && part?.endsWith('**')) {
                return <span key={i} className="font-bold">{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    const RenderCustomContent = ({ content, itemClassName, listClassName, bulletPrefix }: {
        content: string,
        itemClassName?: string,
        listClassName?: string,
        bulletPrefix?: React.ReactNode
    }) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        // Require marker at start, specifically for '*', require a space after it to avoid bold conflict
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
        <div className="bg-white p-16 min-h-[1123px] w-[794px] mx-auto text-[#18181b] border border-[#e4e4e7]" style={{ fontFamily: 'serif', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="text-center border-b-2 border-[#18181b] pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-widest">{data.fullName}</h1>
                {data.jobTitle && <p className="text-lg font-bold text-[#2563eb] mt-2 uppercase tracking-widest">{data.jobTitle}</p>}
                <div className="text-sm mt-3 text-[#52525b] font-sans flex flex-wrap justify-center gap-3">
                    <span>Email: <span className="lowercase">{data.email}</span></span>
                    <span>&bull;</span>
                    <span>Phone: {data.phone}</span>
                    <span>&bull;</span>
                    <span>Location: {data.location}</span>
                    {data.links.map((link, i) => (
                        <Fragment key={i}>
                            <span>&bull;</span>
                            <span className="font-bold">{link.label}: <span className="lowercase">{link.value}</span></span>
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="space-y-10">
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">Professional Summary</h2>
                    <p className="text-[14px] leading-relaxed text-[#3f3f46]">{processBold(data.summary)}</p>
                </section>

                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">Core Expertise</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {data.skills.map((s, i) => <span key={i} className="text-[15px] font-semibold">{s}</span>)}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-4">Professional Experience</h2>
                    <div className="space-y-8">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <div>
                                        <h3 className="font-bold text-base">{exp.company}</h3>
                                        <span className="text-[13px] italic">{exp.title}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">{exp.duration}</span>
                                </div>
                                <ul className="list-disc ml-4 space-y-1.5">
                                    {exp.bullets.map((b, j) => <li key={j} className="text-[14px] text-[#3f3f46] leading-snug">{processBold(b)}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {data.customSections?.map((section, idx) => (
                    <section key={idx}>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">{section.title}</h2>
                        <RenderCustomContent
                            content={section.content}
                            itemClassName="text-[14px] text-[#3f3f46] leading-snug"
                        />
                    </section>
                ))}
            </div>
        </div>
    );

    const ModernTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-16 min-h-[1123px] w-[794px] mx-auto text-[#18181b] flex flex-col font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="border-b-2 border-[#18181b] pb-10 mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-[#18181b]">{data.fullName}</h1>
                    <p className="text-[#2563eb] font-black uppercase tracking-[0.2em] text-xs mt-3">{data.jobTitle || data.experience[0]?.title || "Professional"}</p>
                </div>
                <div className="text-right space-y-1.5 text-[#71717a] text-[10px] font-bold tracking-tight">
                    <div className="flex justify-end gap-2 items-center">
                        <span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">Email:</span>
                        <span className="text-[#18181b] lowercase font-semibold">{data.email}</span>
                    </div>
                    <div className="flex justify-end gap-2 items-center">
                        <span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">Phone:</span>
                        <span className="text-[#18181b] font-semibold">{data.phone}</span>
                    </div>
                    <div className="flex justify-end gap-2 items-center">
                        <span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">Location:</span>
                        <span className="text-[#18181b] font-semibold">{data.location}</span>
                    </div>
                    {data.links.map((link, i) => (
                        <div key={i} className="flex justify-end gap-2 items-center">
                            <span className="text-[#a1a1aa] uppercase tracking-widest text-[9px]">{link.label}:</span>
                            <span className="text-[#18181b] lowercase font-semibold">{link.value}</span>
                        </div>
                    ))}
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
                                        {exp.bullets.map((b, j) => (
                                            <li key={j} className="text-[13px] text-[#52525b] font-medium leading-relaxed flex gap-3">
                                                <span className="text-[#3b82f6] mt-1">&bull;</span>
                                                <span>{processBold(b)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                    {data.customSections?.map((section, idx) => (
                        <section key={idx} className="mt-10">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb] mb-4">{section.title}</h2>
                            <RenderCustomContent
                                content={section.content}
                                itemClassName="text-[13px] text-[#52525b] font-medium leading-relaxed"
                                bulletPrefix={<span className="text-[#3b82f6] mt-1 shrink-0">&bull;</span>}
                            />
                        </section>
                    ))}
                </div>

                <div className="col-span-4 bg-[#fcfcfc] -my-12 p-10 pt-12 border-l border-[#f4f4f5]">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a1a1aa] mb-12 border-b border-[#f4f4f5] pb-3">Expertise</h2>
                        <div className="space-y-5">
                            {data.skills.map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[rgba(37,99,235,0.2)] flex items-center justify-center">
                                        <div className="h-0.5 w-0.5 rounded-full bg-[#2563eb]" />
                                    </div>
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
        <div className="bg-white p-16 min-h-[1123px] w-[794px] mx-auto text-[#27272a] font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="mb-12">
                <h1 className="text-3xl font-light tracking-tighter text-[#18181b]">{data.fullName}</h1>
                {data.jobTitle && <p className="text-xs font-bold text-[#18181b] mt-2 uppercase tracking-[0.3em]">{data.jobTitle}</p>}
                <div className="flex flex-wrap gap-4 mt-3 text-[10px] font-medium text-[#71717a] tracking-widest">
                    <span>Email: <span className="lowercase">{data.email}</span></span>
                    <span>/</span>
                    <span>Phone: {data.phone}</span>
                    <span>/</span>
                    <span>Location: {data.location}</span>
                    {data.links.map((link, i) => (
                        <Fragment key={i}>
                            <span>/</span>
                            <span>{link.label}: <span className="lowercase">{link.value}</span></span>
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="space-y-12">
                <section>
                    <p className="text-[15px] leading-relaxed text-[#52525b] lowercase first-letter:uppercase">{processBold(data.summary)}</p>
                </section>

                <div className="space-y-10">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a1a1aa] border-b border-[#f4f4f5] pb-2">Experience</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="grid grid-cols-4 gap-8">
                            <div className="text-[10px] font-bold text-[#a1a1aa] uppercase pt-1">
                                {exp.company}
                                {exp.duration && <div className="mt-1 font-medium lowercase tracking-normal">{exp.duration}</div>}
                            </div>
                            <div className="col-span-3 space-y-3">
                                <h3 className="text-[15px] font-bold text-[#18181b]">{exp.title}</h3>
                                <ul className="space-y-2">
                                    {exp.bullets.map((b, j) => (
                                        <li key={j} className="text-[13px] text-[#52525b] leading-relaxed">{processBold(b)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {data.customSections?.map((section, idx) => (
                    <div key={idx} className="space-y-6">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a1a1aa] border-b border-[#f4f4f5] pb-2">{section.title}</h2>
                        <RenderCustomContent
                            content={section.content}
                            itemClassName="text-[13px] text-[#52525b] leading-relaxed"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const ExecutiveTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-16 min-h-[1123px] w-[794px] mx-auto text-[#1c1917] font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="border-l-8 border-[#44403c] pl-8 mb-16">
                <h1 className="text-5xl font-black tracking-tight uppercase text-[#1c1917]">{data.fullName}</h1>
                <p className="text-sm font-bold text-[#78716c] mt-2 tracking-widest uppercase">{data.jobTitle || data.experience[0]?.title || "Executive"}</p>
                <div className="flex flex-wrap gap-6 mt-6 text-[11px] font-bold text-[#a8a29e]">
                    <span>Email: <span className="lowercase">{data.email}</span></span>
                    <span>Phone: {data.phone}</span>
                    <span>Location: {data.location}</span>
                    {data.links.map((link, i) => (
                        <span key={i}>{link.label}: <span className="lowercase">{link.value}</span></span>
                    ))}
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
                                    <div>
                                        <h3 className="text-[16px] font-black text-[#1c1917]">{exp.company}</h3>
                                        <p className="text-[11px] font-black text-[#78716c] uppercase">{exp.title}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-[#44403c] tracking-widest uppercase">{exp.duration}</span>
                                </div>
                                <ul className="list-square ml-4 space-y-2">
                                    {exp.bullets.map((b, j) => (
                                        <li key={j} className="text-[13px] text-[#44403c] leading-relaxed">{processBold(b)}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="col-span-4 space-y-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">Core Assets</h2>
                        <div className="flex flex-col gap-3">
                            {data.skills.map((s, i) => (
                                <div key={i} className="text-[12px] font-bold text-[#57534e] flex items-center gap-2">
                                    <div className="h-1 w-1 bg-[#44403c] rotate-45" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.customSections?.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">{section.title}</h2>
                            <RenderCustomContent
                                content={section.content}
                                itemClassName="text-[13px] text-[#44403c] leading-relaxed"
                                bulletPrefix={<div className="h-1 w-1 bg-[#44403c] rotate-45 mt-1.5 shrink-0" />}
                            />
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );

    const CreativeTemplate = ({ data }: { data: EditableResume }) => (
        <div className="creative-template-root bg-[#fafafa] min-h-[1123px] w-[794px] mx-auto text-[#18181b] flex" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="w-1/3 bg-[#18181b] text-white p-12 flex flex-col justify-between">
                <div>
                    <div className="h-16 w-16 bg-[#3b82f6] rounded-full mb-8 flex items-center justify-center text-3xl font-black">
                        {data.fullName.charAt(0)}
                    </div>
                    <h1 className="text-3xl font-black leading-tight mb-4 uppercase">{data.fullName.split(' ').join('\n')}</h1>
                    <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.3em] mb-12">{data.jobTitle || data.experience[0]?.title || "Creative"}</p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#52525b] mb-4">Contact</h2>
                            <div className="space-y-2 text-[10px] font-medium text-[#a1a1aa]">
                                <p>Email: <span className="lowercase">{data.email}</span></p>
                                <p>Phone: {data.phone}</p>
                                <p>Location: {data.location}</p>
                                {data.links.map((link, i) => (
                                    <p key={i}>{link.label}: <span className="lowercase">{link.value}</span></p>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#52525b] mb-4">Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-[#27272a] rounded text-[9px] font-bold text-[#fafafa] border border-[#3f3f46]">{s}</span>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="text-[8px] font-bold text-[#52525b] uppercase tracking-tighter">
                    Generated by CV Optimizer &bull; 2026
                </div>
            </div>

            <div className="flex-1 p-16 bg-white flex flex-col">
                <div className="space-y-16">
                    <section>
                        <h2 className="text-4xl font-black text-[#18181b] mb-6 tracking-tighter">Hello.</h2>
                        <p className="text-[15px] border-l-4 border-[#3b82f6] pl-6 leading-relaxed font-medium text-[#3f3f46] italic">
                            {processBold(data.summary)}
                        </p>
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
                                    <ul className="space-y-2 pl-2">
                                        {exp.bullets.map((b, j) => (
                                            <li key={j} className="text-[13px] text-[#52525b] font-medium leading-relaxed">&rarr; {processBold(b)}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.customSections?.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6] mb-4">{section.title}</h2>
                            <RenderCustomContent
                                content={section.content}
                                itemClassName="text-[13px] text-[#52525b] font-medium leading-relaxed"
                                bulletPrefix={<span className="shrink-0">&rarr;</span>}
                            />
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );

    if (isEditing && resumeData) {
        return (
            <div className="w-full flex flex-col h-screen overflow-hidden -m-10">
                {/* Editor Top Bar */}
                <div className="h-24 bg-white border-b border-[#f4f4f5] flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsEditing(false)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-[#fafafa] text-[#a1a1aa]">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-[#0f172a]">Smart Architect</h2>
                            <p className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest">Polishing refactored resume</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex bg-[#fafafa] p-1.5 rounded-2xl border border-[#f4f4f5]">
                            {(['modern', 'classic', 'creative', 'minimal', 'executive'] as TemplateType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTemplate(t)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                        selectedTemplate === t
                                            ? "bg-white text-[#2563eb] shadow-[0_4px_12px_rgba(37,99,235,0.15)] ring-1 ring-[rgba(37,99,235,0.1)]"
                                            : "text-[#a1a1aa] hover:text-[#52525b]"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className="h-10 w-[1px] bg-[#f4f4f5] mx-2" />
                        <div className="flex items-center gap-3">
                            <button onClick={downloadWord} className="btn-secondary h-12 px-6 text-[10px] flex items-center gap-2">
                                <FileJson className="h-4 w-4" />
                                Word
                            </button>
                            <button onClick={downloadPDF} className="btn-primary h-12 px-6 text-[10px] flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                PDF
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="h-12 px-6 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Editing Controls */}
                    <div className="w-[450px] bg-zinc-50 border-r border-zinc-100 overflow-y-auto p-10 space-y-12">
                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-emerald-500" />
                                Resume Name / Label
                            </h3>
                            <input
                                value={cvName}
                                onChange={e => setCvName(e.target.value)}
                                className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                placeholder="e.g. Senior Frontend Dev - Google"
                            />
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Palette className="h-4 w-4 text-blue-500" />
                                Personal Info
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    value={resumeData.fullName}
                                    onChange={e => setResumeData(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                                    className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                    placeholder="Full Name"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={resumeData.email}
                                        onChange={e => setResumeData(prev => prev ? { ...prev, email: e.target.value } : null)}
                                        className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                        placeholder="Email"
                                    />
                                    <input
                                        value={resumeData.phone}
                                        onChange={e => setResumeData(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                        className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                        placeholder="Phone"
                                    />
                                </div>
                                <input
                                    value={resumeData.jobTitle}
                                    onChange={e => setResumeData(prev => prev ? { ...prev, jobTitle: e.target.value } : null)}
                                    className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                    placeholder="Professional Headline / Job Title"
                                />
                                <input
                                    value={resumeData.location}
                                    onChange={e => setResumeData(prev => prev ? { ...prev, location: e.target.value } : null)}
                                    className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                    placeholder="Location (e.g., Lagos, Nigeria)"
                                />

                                {/* Dynamic Links */}
                                <div className="space-y-3">
                                    {resumeData.links.map((link, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                value={link.label}
                                                onChange={e => setResumeData(prev => prev ? ({
                                                    ...prev,
                                                    links: prev.links.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l)
                                                }) : null)}
                                                className="w-1/3 bg-white border border-zinc-100 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300"
                                                placeholder="Label (e.g. LinkedIn)"
                                            />
                                            <input
                                                value={link.value}
                                                onChange={e => setResumeData(prev => prev ? ({
                                                    ...prev,
                                                    links: prev.links.map((l, idx) => idx === i ? { ...l, value: e.target.value } : l)
                                                }) : null)}
                                                className="flex-1 bg-white border border-zinc-100 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300"
                                                placeholder="Value/Link"
                                            />
                                            <div className="flex flex-col">
                                                <button onClick={() => moveItem('links', i, 'up')} disabled={i === 0} className="p-0.5 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                    <ChevronUp className="h-3 w-3" />
                                                </button>
                                                <button onClick={() => moveItem('links', i, 'down')} disabled={i === resumeData.links.length - 1} className="p-0.5 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                    <ChevronDown className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button onClick={() => removeLink(i)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addLink}
                                        className="w-full py-3 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-400 hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Link / Extra Info
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <AlignLeft className="h-4 w-4 text-blue-500" />
                                Professional Summary
                            </h3>
                            <textarea
                                value={resumeData.summary}
                                onChange={e => setResumeData(prev => prev ? { ...prev, summary: e.target.value } : null)}
                                className="w-full h-40 bg-white border border-zinc-100 p-4 rounded-2xl text-[12px] font-medium leading-relaxed outline-none focus:border-blue-500 transition-all resize-none"
                            />
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-blue-500" />
                                Skills / Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {resumeData.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white border border-zinc-100 p-2 pl-4 rounded-xl">
                                        <div className="flex flex-row items-center gap-1">
                                            <button onClick={() => moveItem('skills', i, 'up')} disabled={i === 0} className="p-1 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                <ChevronLeft className="h-3 w-3" />
                                            </button>
                                            <input
                                                value={skill}
                                                onChange={e => setResumeData(prev => prev ? ({
                                                    ...prev,
                                                    skills: prev.skills.map((s, idx) => idx === i ? e.target.value : s)
                                                }) : null)}
                                                className="text-[10px] font-bold text-zinc-600 outline-none w-20 bg-transparent"
                                            />
                                            <button onClick={() => moveItem('skills', i, 'down')} disabled={i === resumeData.skills.length - 1} className="p-1 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                <ChevronRight className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <button onClick={() => removeSkill(i)} className="text-zinc-300 hover:text-red-500 transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addSkill}
                                    className="h-9 px-4 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-400 hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add
                                </button>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Edit3 className="h-4 w-4 text-blue-500" />
                                Work Experience
                            </h3>
                            <div className="space-y-8">
                                {resumeData.experience.map((exp, i) => (
                                    <div key={i} className="p-6 bg-white border border-zinc-100 rounded-3xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex flex-col">
                                                    <button onClick={() => moveItem('experience', i, 'up')} disabled={i === 0} className="p-1 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                        <ChevronUp className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => moveItem('experience', i, 'down')} disabled={i === resumeData.experience.length - 1} className="p-1 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <input
                                                    value={exp.company}
                                                    onChange={e => setResumeData(prev => prev ? ({
                                                        ...prev,
                                                        experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, company: e.target.value } : ex)
                                                    }) : null)}
                                                    className="w-full text-sm font-black text-brand-blue-black outline-none bg-transparent"
                                                />
                                            </div>
                                            <button onClick={() => removeExperience(i)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                value={exp.title}
                                                onChange={e => setResumeData(prev => prev ? ({
                                                    ...prev,
                                                    experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, title: e.target.value } : ex)
                                                }) : null)}
                                                className="w-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest outline-none bg-transparent"
                                                placeholder="ROLE TITLE"
                                            />
                                            <input
                                                value={exp.duration}
                                                onChange={e => setResumeData(prev => prev ? ({
                                                    ...prev,
                                                    experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, duration: e.target.value } : ex)
                                                }) : null)}
                                                className="w-full text-[10px] font-bold text-blue-500 uppercase tracking-widest outline-none bg-transparent text-right"
                                                placeholder="DATES (EG. 2020 - PRESENT)"
                                            />
                                        </div>
                                        <div className="space-y-3 pt-4 border-t border-zinc-50">
                                            {exp.bullets.map((b, j) => (
                                                <div key={j} className="flex gap-2 group items-start">
                                                    <div className="flex flex-col mt-1">
                                                        <button onClick={() => moveBullet(i, j, 'up')} disabled={j === 0} className="p-0.5 text-zinc-200 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                            <ChevronUp className="h-3 w-3" />
                                                        </button>
                                                        <button onClick={() => moveBullet(i, j, 'down')} disabled={j === exp.bullets.length - 1} className="p-0.5 text-zinc-200 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                            <ChevronDown className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={b}
                                                        onChange={e => setResumeData(prev => prev ? ({
                                                            ...prev,
                                                            experience: prev.experience.map((ex, idx) => idx === i ? {
                                                                ...ex,
                                                                bullets: ex.bullets.map((bull, bIdx) => bIdx === j ? e.target.value : bull)
                                                            } : ex)
                                                        }) : null)}
                                                        className="flex-1 bg-[#f9f9fb] p-3 rounded-xl text-[11px] font-medium text-zinc-600 outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all resize-none min-h-[60px]"
                                                    />
                                                    <button onClick={() => removeBullet(i, j)} className="p-1 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addBullet(i)}
                                                className="w-full py-2 border border-dashed border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-400 hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Add Bullet
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={addExperience}
                                    className="w-full h-14 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400 font-bold text-xs flex items-center justify-center gap-2 hover:border-blue-200 hover:text-blue-500 hover:bg-white transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add New Experience
                                </button>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Plus className="h-4 w-4 text-blue-500" />
                                Custom Sections
                            </h3>
                            <div className="space-y-6">
                                {resumeData.customSections.map((sec, i) => (
                                    <div key={i} className="p-6 bg-white border border-zinc-100 rounded-3xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex flex-col">
                                                    <button onClick={() => moveItem('customSections', i, 'up')} disabled={i === 0} className="p-1 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                        <ChevronUp className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => moveItem('customSections', i, 'down')} disabled={i === resumeData.customSections.length - 1} className="p-1 text-zinc-300 hover:text-blue-500 disabled:opacity-0 transition-all">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <input
                                                    value={sec.title}
                                                    onChange={e => setResumeData(prev => prev ? ({
                                                        ...prev,
                                                        customSections: prev.customSections.map((s, idx) => idx === i ? { ...s, title: e.target.value } : s)
                                                    }) : null)}
                                                    className="w-full text-sm font-black text-brand-blue-black outline-none bg-transparent placeholder:text-zinc-300"
                                                    placeholder="Section Title (e.g., Education)"
                                                />
                                            </div>
                                            <button onClick={() => removeCustomSection(i)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <textarea
                                            value={sec.content}
                                            onChange={e => setResumeData(prev => prev ? ({
                                                ...prev,
                                                customSections: prev.customSections.map((s, idx) => idx === i ? { ...s, content: e.target.value } : s)
                                            }) : null)}
                                            className="w-full bg-[#f9f9fb] p-4 rounded-xl text-[11px] font-medium text-zinc-600 outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all resize-none min-h-[100px]"
                                            placeholder="Write content here..."
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={addCustomSection}
                                    className="w-full h-14 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400 font-bold text-xs flex items-center justify-center gap-2 hover:border-blue-200 hover:text-blue-500 hover:bg-white transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add New Section
                                </button>
                            </div>
                        </section>
                    </div >

                    {/* Right Panel: Live Preview */}
                    <div className="flex-1 bg-[#f1f1f4] overflow-y-auto p-20 flex justify-center">
                        <div id="resume-preview-root" ref={resumeRef} className="origin-top scale-[0.8] 2xl:scale-100 transition-all duration-500">
                            {selectedTemplate === 'modern' && <ModernTemplate data={resumeData} />}
                            {selectedTemplate === 'classic' && <ClassicTemplate data={resumeData} />}
                            {selectedTemplate === 'creative' && <CreativeTemplate data={resumeData} />}
                            {selectedTemplate === 'minimal' && <MinimalTemplate data={resumeData} />}
                            {selectedTemplate === 'executive' && <ExecutiveTemplate data={resumeData} />}
                        </div>
                    </div>
                </div >
            </div >
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-32">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <PenTool className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Smart Designer</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-blue-black uppercase">
                    Resume <span className="text-blue-600">Architect.</span>
                </h1>
                <p className="text-sm font-medium text-zinc-400 max-w-2xl">
                    Input a job description and our AI will not only rewrite your resume but also generate a professionally designed, downloadable version.
                </p>
            </header>

            <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                    <Layout className="h-40 w-40 text-blue-600" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-80 space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue-black">Step 1: Select Source</h3>
                            <div className="space-y-3">
                                {cvs.map((cv) => (
                                    <button
                                        key={cv.id}
                                        onClick={() => setSelectedCvId(cv.id)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl text-[11px] font-bold transition-all border",
                                            selectedCvId === cv.id
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100"
                                        )}
                                    >
                                        {cv.profile_name || cv.filename}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue-black">Step 2: Target Job Description</h3>
                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{jobDescription.length} chars</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                                className="w-full h-80 p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-blue-600 transition-all outline-none font-medium text-sm text-zinc-600 leading-relaxed resize-none"
                            />
                        </div>

                        <button
                            onClick={handleOptimize}
                            disabled={isOptimizing || !jobDescription.trim()}
                            className="w-full h-20 rounded-2xl bg-brand-blue text-white text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:bg-brand-blue-dark hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            {isOptimizing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                            Refactor & Enter Editor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Missing icons removed - now imported from lucide-react
