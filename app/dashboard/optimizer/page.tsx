"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, FileText, Zap, CheckCircle2, Loader2, ChevronRight,
    Search, Brain, Rocket, BrainCircuit, ArrowRight, Copy,
    PenTool, Download, Palette, Edit3, Save, X, FileJson,
    Type, Layout, Eye, ChevronLeft, Plus, Trash2, AlignLeft
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
    links: { label: string, value: string }[];
    summary: string;
    skills: string[];
    experience: {
        company: string;
        title: string;
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
    const [selectedCvId, setSelectedCvId] = useState<number | null>(null);

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [resumeData, setResumeData] = useState<EditableResume | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
            } catch (err) {
                console.error("Failed to load CVs");
            }
        };
        fetchCVs();
    }, []);

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
                links: extraLinks,
                summary: optimized.optimized_summary,
                skills: optimized.key_skills_to_highlight,
                experience: optimized.experience_optimization.map(exp => ({
                    company: exp.company,
                    title: exp.original_title,
                    bullets: exp.tailored_bullets
                })),
                customSections: (optimized as any).additional_sections || []
            };

            setResumeData(editable);
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
                { company: "New Company", title: "Job Title", bullets: ["Key achievement..."] }
            ]
        });
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
        if (!resumeRef.current) return;
        const loadingId = toast.loading("Generating multi-page PDF...");
        try {
            const element = resumeRef.current;

            // Get actual dimensions
            const actualWidth = element.scrollWidth;
            const actualHeight = element.scrollHeight;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                width: actualWidth,
                height: actualHeight,
                windowWidth: actualWidth,
                windowHeight: actualHeight,
                onclone: (clonedDoc) => {
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        :root {
                            --color-zinc-900: #18181b !important;
                            --blue-400: #60a5fa !important;
                            --blue-600: #2563eb !important;
                        }
                        #resume-preview-root {
                            transform: none !important;
                            scale: 1 !important;
                            height: auto !important;
                            min-height: auto !important;
                            overflow: visible !important;
                        }
                        .creative-template-root {
                            overflow: visible !important;
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Calculate how many mm high the whole canvas is in PDF space
            const ratio = pdfWidth / imgWidth;
            const totalCanvasHeightInMm = imgHeight * ratio;

            let heightLeft = totalCanvasHeightInMm;
            let position = 0;
            let pageCount = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalCanvasHeightInMm);
            heightLeft -= pdfHeight;

            // Handle additional pages
            while (heightLeft > 0) {
                position = heightLeft - totalCanvasHeightInMm;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalCanvasHeightInMm);
                heightLeft -= pdfHeight;
                pageCount++;
            }

            pdf.save(`${(resumeData?.fullName || "Resume").replace(/\s+/g, '_')}_Resume.pdf`);
            toast.success(`PDF Downloaded (${pageCount + 1} pages)!`, { id: loadingId });
        } catch (err: any) {
            console.error("PDF generation failed:", err);
            toast.error(`Failed to generate PDF: ${err.message}`, { id: loadingId });
        }
    };

    const handleSave = async () => {
        if (!resumeData) return;
        setIsSaving(true);
        const loadingId = toast.loading("Saving to dashboard...");
        try {
            await api.post('/cv/save-optimized', {
                resume_data: resumeData,
                profile_name: `Optimized: ${resumeData.fullName}`
            });
            toast.success("Resume saved successfully!", { id: loadingId });
            // Refresh CV list
            const res = await api.get('/cv');
            setCvs(res.data.cvs || []);
        } catch (err: any) {
            toast.error("Failed to save resume", { id: loadingId });
        } finally {
            setIsSaving(false);
        }
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
                            new Paragraph({ text: "", spacing: { before: 200 } }),
                            new Paragraph({
                                text: "PROFESSIONAL SUMMARY",
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "666666", size: 1, space: 1, style: "single" } }
                            }),
                            new Paragraph({ text: resumeData.summary, spacing: { before: 100 } }),
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
                                    ],
                                    spacing: { before: 150 }
                                }),
                                ...exp.bullets.map(bullet => new Paragraph({
                                    text: bullet,
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
                                new Paragraph({ text: section.content, spacing: { before: 100 } }),
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

    const ClassicTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-12 min-h-[1123px] w-[794px] mx-auto text-[#18181b] border border-[#e4e4e7]" style={{ fontFamily: 'serif', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="text-center border-b-2 border-[#18181b] pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-widest">{data.fullName}</h1>
                <div className="text-sm mt-2 text-[#52525b] font-sans uppercase flex flex-wrap justify-center gap-3">
                    <span>{data.email}</span>
                    <span>&bull;</span>
                    <span>{data.phone}</span>
                    <span>&bull;</span>
                    <span>{data.location}</span>
                    {data.links.map((link, i) => (
                        <Fragment key={i}>
                            <span>&bull;</span>
                            <span className="font-bold">{link.value}</span>
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="space-y-10">
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-[#3f3f46]">{data.summary}</p>
                </section>

                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">Core Expertise</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {data.skills.map((s, i) => <span key={i} className="text-sm font-semibold">{s}</span>)}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-4">Professional Experience</h2>
                    <div className="space-y-8">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="font-bold text-base">{exp.company}</h3>
                                    <span className="text-xs italic">{exp.title}</span>
                                </div>
                                <ul className="list-disc ml-4 space-y-1.5">
                                    {exp.bullets.map((b, j) => <li key={j} className="text-sm text-[#3f3f46] leading-snug">{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {data.customSections?.map((section, idx) => (
                    <section key={idx}>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-[#d4d4d8] pb-1 mb-3">{section.title}</h2>
                        <p className="text-sm leading-relaxed text-[#3f3f46] whitespace-pre-wrap">{section.content}</p>
                    </section>
                ))}
            </div>
        </div>
    );

    const ModernTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-12 min-h-[1123px] w-[794px] mx-auto text-[#18181b] flex flex-col font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="bg-[#18181b] text-white p-10 -m-12 mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{data.fullName}</h1>
                    <p className="text-[#60a5fa] font-bold uppercase tracking-widest text-[10px] mt-2">{data.experience[0]?.title || "Professional"}</p>
                </div>
                <div className="text-right space-y-1 text-[#a1a1aa] text-[10px] uppercase font-bold tracking-wider">
                    <p>{data.email}</p>
                    <p>{data.phone}</p>
                    <p>{data.location}</p>
                    {data.links.map((link, i) => (
                        <p key={i}>{link.value}</p>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-10">
                <div className="col-span-8 space-y-10">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb] mb-4">Profile</h2>
                        <p className="text-sm leading-relaxed text-[#52525b] font-medium">{data.summary}</p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb] mb-6">Experience</h2>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l border-[#f4f4f5]">
                                    <div className="absolute top-0 left-[-4.5px] h-2 w-2 rounded-full bg-[#2563eb]" />
                                    <h3 className="font-extrabold text-base tracking-tight">{exp.company}</h3>
                                    <p className="text-xs font-bold text-[#a1a1aa] mb-4">{exp.title}</p>
                                    <ul className="space-y-3">
                                        {exp.bullets.map((b, j) => (
                                            <li key={j} className="text-xs text-[#52525b] font-medium leading-relaxed flex gap-3">
                                                <span className="text-[#3b82f6] mt-1">&bull;</span>
                                                {b}
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
                            <p className="text-sm leading-relaxed text-[#52525b] font-medium whitespace-pre-wrap">{section.content}</p>
                        </section>
                    ))}
                </div>

                <div className="col-span-4 bg-[#f8f9fa] -my-12 p-8 pt-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#a1a1aa] mb-6">Skills</h2>
                        <div className="flex flex-col gap-2">
                            {data.skills.map((s, i) => (
                                <div key={i} className="bg-white border border-[#f4f4f5] p-3 rounded-xl text-[10px] font-bold text-[#3f3f46] shadow-sm">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );

    const MinimalTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-12 min-h-[1123px] w-[794px] mx-auto text-[#27272a] font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="mb-12">
                <h1 className="text-3xl font-light tracking-tighter text-[#18181b]">{data.fullName}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-medium text-[#71717a] uppercase tracking-widest">
                    <span>{data.email}</span>
                    <span>/</span>
                    <span>{data.phone}</span>
                    <span>/</span>
                    <span>{data.location}</span>
                    {data.links.map((link, i) => (
                        <Fragment key={i}>
                            <span>/</span>
                            <span>{link.value}</span>
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="space-y-12">
                <section>
                    <p className="text-sm leading-relaxed text-[#52525b] lowercase first-letter:uppercase">{data.summary}</p>
                </section>

                <div className="space-y-10">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a1a1aa] border-b border-[#f4f4f5] pb-2">Experience</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="grid grid-cols-4 gap-8">
                            <div className="text-[10px] font-bold text-[#a1a1aa] uppercase pt-1">{exp.company}</div>
                            <div className="col-span-3 space-y-3">
                                <h3 className="text-sm font-bold text-[#18181b]">{exp.title}</h3>
                                <ul className="space-y-2">
                                    {exp.bullets.map((b, j) => (
                                        <li key={j} className="text-xs text-[#52525b] leading-relaxed">{b}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {data.customSections?.map((section, idx) => (
                    <div key={idx} className="space-y-6">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a1a1aa] border-b border-[#f4f4f5] pb-2">{section.title}</h2>
                        <p className="text-xs leading-relaxed text-[#52525b] whitespace-pre-wrap">{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const ExecutiveTemplate = ({ data }: { data: EditableResume }) => (
        <div className="bg-white p-16 min-h-[1123px] w-[794px] mx-auto text-[#1c1917] font-sans" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="border-l-8 border-[#44403c] pl-8 mb-16">
                <h1 className="text-5xl font-black tracking-tight uppercase text-[#1c1917]">{data.fullName}</h1>
                <p className="text-sm font-bold text-[#78716c] mt-2 tracking-widest uppercase">{data.experience[0]?.title || "Executive"}</p>
                <div className="flex flex-wrap gap-6 mt-6 text-[11px] font-bold text-[#a8a29e] uppercase">
                    <span>{data.email}</span>
                    <span>{data.phone}</span>
                    <span>{data.location}</span>
                    {data.links.map((link, i) => (
                        <span key={i}>{link.value}</span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-8 space-y-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">Management Profile</h2>
                        <p className="text-sm leading-relaxed text-[#44403c] font-medium italic">"{data.summary}"</p>
                    </section>

                    <section className="space-y-10">
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">Professional Career</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-base font-black text-[#1c1917]">{exp.company}</h3>
                                    <span className="text-[10px] font-black text-[#78716c] uppercase">{exp.title}</span>
                                </div>
                                <ul className="list-square ml-4 space-y-2">
                                    {exp.bullets.map((b, j) => (
                                        <li key={j} className="text-xs text-[#44403c] leading-relaxed">{b}</li>
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
                                <div key={i} className="text-[11px] font-bold text-[#57534e] flex items-center gap-2">
                                    <div className="h-1 w-1 bg-[#44403c] rotate-45" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.customSections?.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#44403c] mb-6 border-b-2 border-[#e7e5e4] pb-2">{section.title}</h2>
                            <p className="text-[11px] leading-relaxed text-[#57534e] font-medium whitespace-pre-wrap">{section.content}</p>
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
                    <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.3em] mb-12">{data.experience[0]?.title || "Creative"}</p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#52525b] mb-4">Contact</h2>
                            <div className="space-y-2 text-[10px] font-medium text-[#a1a1aa]">
                                <p>{data.email}</p>
                                <p>{data.phone}</p>
                                <p>{data.location}</p>
                                {data.links.map((link, i) => (
                                    <p key={i}>{link.value}</p>
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

            <div className="flex-1 p-16 bg-white flex flex-col justify-center">
                <div className="space-y-16">
                    <section>
                        <h2 className="text-4xl font-black text-[#18181b] mb-6 tracking-tighter">Hello.</h2>
                        <p className="text-sm border-l-4 border-[#3b82f6] pl-6 leading-relaxed font-medium text-[#3f3f46] italic">
                            {data.summary}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6] mb-8">Work History</h2>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-lg font-black group-hover:text-[#3b82f6] transition-colors">{exp.company}</h3>
                                        <span className="text-[10px] font-bold text-[#a1a1aa] uppercase">{exp.title}</span>
                                    </div>
                                    <ul className="space-y-2 pl-2">
                                        {exp.bullets.map((b, j) => (
                                            <li key={j} className="text-xs text-[#52525b] font-medium leading-relaxed">&rarr; {b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.customSections?.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6] mb-4">{section.title}</h2>
                            <p className="text-xs leading-relaxed text-[#52525b] font-medium whitespace-pre-wrap">{section.content}</p>
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
                                            ? "bg-white text-[#2563eb] shadow-[0_4px_12px_rgba(37,99,235,0.15)] ring-1 ring-[#2563eb]/10"
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
                                <Palette className="h-4 w-4 text-blue-500" />
                                Personal Info
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    value={resumeData.fullName}
                                    onChange={e => setResumeData({ ...resumeData, fullName: e.target.value })}
                                    className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                    placeholder="Full Name"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={resumeData.email}
                                        onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
                                        className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                        placeholder="Email"
                                    />
                                    <input
                                        value={resumeData.phone}
                                        onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
                                        className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                        placeholder="Phone"
                                    />
                                </div>
                                <input
                                    value={resumeData.location}
                                    onChange={e => setResumeData({ ...resumeData, location: e.target.value })}
                                    className="w-full bg-white border border-zinc-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                    placeholder="Location (e.g., Lagos, Nigeria)"
                                />

                                {/* Dynamic Links */}
                                <div className="space-y-3">
                                    {resumeData.links.map((link, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                value={link.label}
                                                onChange={e => {
                                                    const newLinks = [...resumeData.links];
                                                    newLinks[i].label = e.target.value;
                                                    setResumeData({ ...resumeData, links: newLinks });
                                                }}
                                                className="w-1/3 bg-white border border-zinc-100 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300"
                                                placeholder="Label (e.g. LinkedIn)"
                                            />
                                            <input
                                                value={link.value}
                                                onChange={e => {
                                                    const newLinks = [...resumeData.links];
                                                    newLinks[i].value = e.target.value;
                                                    setResumeData({ ...resumeData, links: newLinks });
                                                }}
                                                className="flex-1 bg-white border border-zinc-100 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300"
                                                placeholder="Value/Link"
                                            />
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
                                onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                                className="w-full h-40 bg-white border border-zinc-100 p-4 rounded-2xl text-[12px] font-medium leading-relaxed outline-none focus:border-blue-500 transition-all resize-none"
                            />
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
                                            <input
                                                value={exp.company}
                                                onChange={e => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp[i].company = e.target.value;
                                                    setResumeData({ ...resumeData, experience: newExp });
                                                }}
                                                className="w-full text-sm font-black text-brand-blue-black outline-none"
                                            />
                                            <button onClick={() => removeExperience(i)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <input
                                            value={exp.title}
                                            onChange={e => {
                                                const newExp = [...resumeData.experience];
                                                newExp[i].title = e.target.value;
                                                setResumeData({ ...resumeData, experience: newExp });
                                            }}
                                            className="w-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest outline-none"
                                        />
                                        <div className="space-y-3 pt-4 border-t border-zinc-50">
                                            {exp.bullets.map((b, j) => (
                                                <div key={j} className="flex gap-2 group">
                                                    <textarea
                                                        value={b}
                                                        onChange={e => {
                                                            const newExp = [...resumeData.experience];
                                                            newExp[i].bullets[j] = e.target.value;
                                                            setResumeData({ ...resumeData, experience: newExp });
                                                        }}
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
                                            <input
                                                value={sec.title}
                                                onChange={e => {
                                                    const newSec = [...resumeData.customSections];
                                                    newSec[i].title = e.target.value;
                                                    setResumeData({ ...resumeData, customSections: newSec });
                                                }}
                                                className="w-full text-sm font-black text-brand-blue-black outline-none placeholder:text-zinc-300"
                                                placeholder="Section Title (e.g., Education)"
                                            />
                                            <button onClick={() => removeCustomSection(i)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <textarea
                                            value={sec.content}
                                            onChange={e => {
                                                const newSec = [...resumeData.customSections];
                                                newSec[i].content = e.target.value;
                                                setResumeData({ ...resumeData, customSections: newSec });
                                            }}
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
