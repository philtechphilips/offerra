"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as pdfjs from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import SignaturePad from "signature_pad";
import { 
    X, 
    Download, 
    Save, 
    Sparkles, 
    PenTool, 
    Type, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Loader2,
    ZoomIn,
    ZoomOut,
    MousePointer2,
    Bold,
    Italic,
    Type as TypeIcon,
    Palette,
    Maximize2,
    Calendar,
    CheckSquare,
    Signature as SignatureIcon,
    Pencil,
    ShieldAlert,
    Copy,
    Layout,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import SignatureModal from "./SignatureModal";
import { ADDITIONAL_FONTS, type FontConfig } from "./fonts";

// Set up PDF.js worker with a stable version
const PDFJS_VERSION = '5.6.205'; 
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

interface Field {
    id: string;
    type: 'text' | 'signature' | 'date' | 'checkbox' | 'initials' | 'drawing';
    x: number; 
    y: number; 
    value: string;
    page: number;
    // New properties
    width: number; // pixels (scaled)
    height: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    isBold: boolean;
    isItalic: boolean;
}

const CUSTOM_FONTS_META: Record<string, string> = ADDITIONAL_FONTS.reduce((acc, f) => {
    acc[f.id] = f.url;
    return acc;
}, {} as Record<string, string>);

type Tool = 'hand' | 'text' | 'signature' | 'date' | 'checkbox' | 'initials' | 'drawing';

const DEFAULT_TEXT_FIELD: Partial<Field> = {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#000000',
    width: 200,
    height: 40,
    isBold: false,
    isItalic: false
};

const DEFAULT_SIG_FIELD: Partial<Field> = {
    width: 180,
    height: 60
};

const DEFAULT_CHECKBOX: Partial<Field> = {
    width: 24,
    height: 24,
    value: 'false'
};

const DEFAULT_INITIALS: Partial<Field> = {
    width: 60,
    height: 40
};

interface PdfEditorProps {
    documentId: string;
    pdfUrl: string;
    initialFields?: Field[];
    onSaved?: () => void;
    onClose?: () => void;
}

// Sub-component for individual page rendering
interface PdfPageProps {
    pdf: any;
    pageNumber: number;
    scale: number;
    fields: Field[];
    selectedFieldId: string | null;
    onFieldClick: (id: string) => void;
    onFieldRemove: (id: string, e?: React.MouseEvent) => void;
    onFieldUpdate: (id: string, updates: Partial<Field>) => void;
    onFieldPageMove: (id: string, e: any) => void;
    onCanvasClick: (page: number, x: number, y: number, dataValue?: string) => void;
    onOpenSignature: (fieldId: string) => void;
    activeTool: Tool;
}

const PdfPage = React.memo(({ 
    pdf, 
    pageNumber, 
    scale, 
    fields, 
    selectedFieldId,
    onFieldClick,
    onFieldRemove,
    onFieldUpdate,
    onFieldPageMove,
    onCanvasClick,
    onOpenSignature,
    activeTool
}: PdfPageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inkCanvasRef = useRef<HTMLCanvasElement>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRendered, setIsRendered] = useState(false);
    
    // Interaction state
    const [interaction, setInteraction] = useState<{
        id: string;
        type: 'move' | 'resize';
        startX: number;
        startY: number;
        startFieldX: number;
        startFieldY: number;
        startWidth: number;
        startHeight: number;
    } | null>(null);

    // Drawing Engine
    useEffect(() => {
        if (!inkCanvasRef.current || activeTool !== 'drawing') return;
        
        signaturePadRef.current = new SignaturePad(inkCanvasRef.current, {
            minWidth: 1.5,
            maxWidth: 4,
            penColor: "rgb(0, 0, 0)"
        });

        return () => {
            if (signaturePadRef.current) {
                signaturePadRef.current.off();
                signaturePadRef.current = null;
            }
        };
    }, [activeTool]);

    const handleInkEnd = () => {
        if (!signaturePadRef.current || signaturePadRef.current.isEmpty() || !containerRef.current) return;
        
        const dataUrl = signaturePadRef.current.toDataURL();
        // Clear immediately so it doesn't double-render
        signaturePadRef.current.clear();
        
        // Pass the dataUrl to the parent to create the field
        onCanvasClick(pageNumber, 0.5, 0.5, dataUrl); 
    };

    useEffect(() => {
        let renderTask: any = null;
        let isAborted = false;

        const render = async () => {
            if (!pdf || !canvasRef.current) return;
            
            try {
                const page = await pdf.getPage(pageNumber);
                if (isAborted) return;

                const viewport = page.getViewport({ scale });
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");

                if (!context) return;
                
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (inkCanvasRef.current) {
                    inkCanvasRef.current.height = viewport.height;
                    inkCanvasRef.current.width = viewport.width;
                }

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                renderTask = page.render(renderContext);
                await renderTask.promise;
                if (!isAborted) setIsRendered(true);
            } catch (err: any) {
                if (err.name === 'RenderingCancelledException' || isAborted) return;
                console.error(`Error rendering page ${pageNumber}:`, err);
            }
        };
        render();

        return () => {
            isAborted = true;
            if (renderTask) {
                renderTask.cancel();
            }
        };
    }, [pdf, pageNumber, scale]);

    const handleLocalClick = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        onCanvasClick(pageNumber, x, y);
    };

    const startInteraction = (id: string, type: 'move' | 'resize', e: React.MouseEvent) => {
        e.stopPropagation();
        onFieldClick(id);
        const field = fields.find(f => f.id === id);
        if (!field) return;

        setInteraction({
            id,
            type,
            startX: e.clientX,
            startY: e.clientY,
            startFieldX: field.x,
            startFieldY: field.y,
            startWidth: field.width,
            startHeight: field.height
        });
    };

    useEffect(() => {
        if (!interaction || !canvasRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            
            const dx = (e.clientX - interaction.startX);
            const dy = (e.clientY - interaction.startY);

            if (interaction.type === 'move') {
                onFieldPageMove(interaction.id, e);
            } else {
                // Resize logic
                onFieldUpdate(interaction.id, {
                    width: Math.max(50, interaction.startWidth + dx / scale),
                    height: Math.max(20, interaction.startHeight + dy / scale)
                });
            }
        };

        const handleMouseUp = () => setInteraction(null);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [interaction, scale, onFieldUpdate]);

    return (
        <div 
            ref={containerRef}
            data-page-number={pageNumber}
            className="relative shadow-2xl bg-white border border-zinc-200 rounded-sm mb-12 last:mb-0 transition-all pdf-page-container"
        >
            <div className="absolute -left-12 top-0 text-zinc-500 font-black text-[10px] uppercase opacity-40">
                P.{pageNumber}
            </div>
            
            <canvas
                ref={canvasRef}
                onClick={handleLocalClick}
                className={cn(
                    "block bg-white",
                    activeTool === 'hand' ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"
                )}
            />

            {/* Ink Layer */}
            {activeTool === 'drawing' && (
                <canvas 
                    ref={inkCanvasRef}
                    className="absolute inset-0 z-40 cursor-pencil touch-none"
                    style={{ width: '100%', height: '100%' }}
                    onMouseUp={handleInkEnd}
                />
            )}

            {/* Interactive Overlays */}
            {fields.map(field => (
                <div
                    key={field.id}
                    onMouseDown={(e) => startInteraction(field.id, 'move', e)}
                    className={cn(
                        "absolute group transition-shadow",
                        selectedFieldId === field.id ? "z-30 ring-2 ring-blue-500 rounded" : "z-20 ring-1 ring-transparent hover:ring-zinc-200"
                    )}
                    style={{ 
                        left: `${field.x * 100}%`, 
                        top: `${field.y * 100}%`,
                        width: `${field.width * scale}px`,
                        height: `${field.height * scale}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {field.type === 'text' || field.type === 'date' ? (
                        <div className="w-full h-full relative group/field">
                            <textarea
                                autoFocus
                                value={field.value}
                                onChange={(e) => onFieldUpdate(field.id, { value: e.target.value })}
                                onFocus={() => onFieldClick(field.id)}
                                spellCheck={false}
                                className={cn(
                                    "w-full h-full bg-transparent p-1 outline-none resize-none overflow-hidden leading-tight transition-all",
                                    field.isBold && "font-bold",
                                    field.isItalic && "italic"
                                )}
                                style={{ 
                                    fontSize: `${field.fontSize * scale}px`,
                                    fontFamily: `${field.fontFamily}, sans-serif`,
                                    color: field.color
                                }}
                                placeholder="..."
                            />
                            {field.type === 'date' && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                    <div className="relative">
                                        <Calendar className="h-3 w-3 text-blue-500" />
                                        <input 
                                            type="date"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => onFieldUpdate(field.id, { value: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : field.type === 'checkbox' ? (
                        <div 
                            onClick={(e) => { e.stopPropagation(); onFieldUpdate(field.id, { value: field.value === 'true' ? 'false' : 'true' }); }}
                            className={cn(
                                "w-full h-full flex items-center justify-center border border-zinc-300 rounded-md cursor-pointer transition-all",
                                field.value === 'true' ? "bg-blue-600 border-blue-600" : "bg-white hover:bg-zinc-50"
                            )}
                        >
                            {field.value === 'true' && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                    ) : field.type === 'initials' ? (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50/10 border border-dashed border-blue-200 rounded animate-in fade-in">
                            <span className="text-xs font-black text-blue-400 opacity-50 uppercase tracking-widest">Initials</span>
                            {field.value ? (
                                <img src={field.value} alt="Initials" className="max-w-full max-h-full object-contain pointer-events-none p-1" />
                            ) : null}
                        </div>
                    ) : field.type === 'signature' ? (
                        <div 
                            className="w-full h-full flex items-center justify-center p-1 bg-transparent"
                            onClick={(e) => { 
                                if (!field.value) onOpenSignature(field.id);
                            }}
                        >
                            {field.value ? (
                                <img src={field.value} className="w-full h-full object-contain pointer-events-none" />
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full border border-blue-200 border-dashed rounded-lg bg-blue-50/50">
                                    <PenTool className="h-4 w-4 text-blue-500 opacity-50" />
                                </div>
                            )}
                        </div>
                    ) : field.type === 'drawing' ? (
                        <div className="w-full h-full pointer-events-none">
                             <img src={field.value} alt="Drawing" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-full h-full" />
                    )}

                    {/* Resize handle */}
                    {selectedFieldId === field.id && (
                        <div 
                            onMouseDown={(e) => startInteraction(field.id, 'resize', e)}
                            className="absolute -bottom-1 -right-1 h-3 w-3 bg-blue-600 rounded-full cursor-nwse-resize border-2 border-white shadow-sm z-40"
                        />
                    )}

                    {/* Delete button */}
                    <button 
                        onClick={(e) => onFieldRemove(field.id, e)}
                        className={cn(
                            "absolute -top-3 -right-3 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all",
                            selectedFieldId === field.id ? "opacity-100 scale-100" : "opacity-0 scale-50"
                        )}
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            ))}
        </div>
    );
});

PdfPage.displayName = "PdfPage";

// Simple Tooltip Component
const Tooltip = ({ children, content }: { children: React.ReactNode, content: string }) => (
    <div className="group relative flex items-center">
        {children}
        <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-zinc-700">
            {content}
        </div>
    </div>
);

export default function PdfEditor({ documentId, pdfUrl, initialFields = [], onSaved, onClose }: PdfEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [pdf, setPdf] = useState<any>(null);
    const [numPages, setNumPages] = useState(0);
    const [fields, setFields] = useState<Field[]>(initialFields);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [scale, setScale] = useState(1.4);
    const [isSaving, setIsSaving] = useState(false);
    const [isAutofilling, setIsAutofilling] = useState(false);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTool, setActiveTool] = useState<Tool>('hand');
    const [watermark, setWatermark] = useState<'DRAFT' | 'CONFIDENTIAL' | null>(null);

    const selectedField = useMemo(() => fields.find(f => f.id === selectedFieldId), [fields, selectedFieldId]);

    // Initial load
    useEffect(() => {
        const loadPdf = async () => {
            try {
                const authStorage = typeof window !== 'undefined' ? localStorage.getItem('offerra-auth') : null;
                const token = authStorage ? JSON.parse(authStorage).state?.token : null;
                
                const loadingTask = pdfjs.getDocument({
                    url: pdfUrl,
                    httpHeaders: token ? { Authorization: `Bearer ${token}` } : undefined
                });
                const pdfDoc = await loadingTask.promise;
                setPdf(pdfDoc);
                setNumPages(pdfDoc.numPages);
                setIsLoaded(true);
            } catch (error) {
                console.error("Error loading PDF:", error);
                toast.error("Could not render PDF.");
            }
        };
        loadPdf();
    }, [pdfUrl]);

    const handleCanvasClick = (page: number, x: number, y: number, dataValue?: string) => {
        if (activeTool === 'hand') {
            setSelectedFieldId(null);
            return;
        }

        const id = Math.random().toString(36).substr(2, 9);
        let newField: Field;

        if (activeTool === 'text') {
            newField = { id, type: 'text', x, y, value: '', page, ...DEFAULT_TEXT_FIELD as any };
        } else if (activeTool === 'date') {
            const today = new Date().toISOString().split('T')[0];
            newField = { id, type: 'date', x, y, value: today, page, ...DEFAULT_TEXT_FIELD as any };
        } else if (activeTool === 'signature') {
            newField = { id, type: 'signature', x, y, value: '', page, ...DEFAULT_SIG_FIELD as any };
        } else if (activeTool === 'checkbox') {
            newField = { id, type: 'checkbox', x, y, value: 'false', page, ...DEFAULT_CHECKBOX as any };
        } else if (activeTool === 'initials') {
            newField = { id, type: 'initials', x, y, value: '', page, ...DEFAULT_INITIALS as any };
        } else if (activeTool === 'drawing') {
            newField = { id, type: 'drawing', x, y, value: dataValue || '', page, width: 400, height: 400 } as any;
        } else {
            return;
        }

        setFields([...fields, newField]);
        setSelectedFieldId(id);
        if (activeTool === 'signature' || activeTool === 'initials') setShowSignatureModal(true);
        setActiveTool('hand');
    };

    const updateField = useCallback((id: string, updates: Partial<Field>) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    }, []);

    const handleFieldPageMove = useCallback((id: string, e: MouseEvent) => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const pageContainer = elements.find(el => el.classList.contains('pdf-page-container')) as HTMLElement;
        
        if (pageContainer) {
            const pageNum = parseInt(pageContainer.getAttribute('data-page-number') || '1');
            const canvas = pageContainer.querySelector('canvas');
            if (!canvas) return;
            const canvasRect = canvas.getBoundingClientRect();

            const x = (e.clientX - canvasRect.left) / canvasRect.width;
            const y = (e.clientY - canvasRect.top) / canvasRect.height;

            setFields(prev => prev.map(f => f.id === id ? { 
                ...f, 
                page: pageNum, 
                x: Math.max(0, Math.min(1, x)), 
                y: Math.max(0, Math.min(1, y)) 
            } : f));
        }
    }, []);

    // Arrow Key Nudging
    useEffect(() => {
        if (!selectedFieldId) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const isTyping = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;
            if (isTyping && !e.metaKey && !e.ctrlKey) return;

            const step = e.shiftKey ? 0.01 : 0.001; 
            let dx = 0; let dy = 0;

            if (e.key === 'ArrowUp') dy = -step;
            else if (e.key === 'ArrowDown') dy = step;
            else if (e.key === 'ArrowLeft') dx = -step;
            else if (e.key === 'ArrowRight') dx = step;

            if (dx !== 0 || dy !== 0) {
                const field = fields.find(f => f.id === selectedFieldId);
                if (field) {
                    e.preventDefault();
                    updateField(selectedFieldId, { 
                        x: Math.max(0, Math.min(1, field.x + dx)), 
                        y: Math.max(0, Math.min(1, field.y + dy)) 
                    });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedFieldId, fields, updateField]);

    const handleSignatureSave = (dataUrl: string) => {
        if (selectedFieldId) updateField(selectedFieldId, { value: dataUrl });
    };

    const handleAutofill = async () => {
        if (!pdf) return;
        setIsAutofilling(true);
        const tid = toast.loading("AI is analyzing document context...");
        
        try {
            // 1. Extract all text from the PDF to provide context to the AI
            const allLabels: string[] = [];
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                textContent.items.forEach((item: any) => {
                    const text = item.str.trim();
                    if (text.length > 2 && text.length < 50) allLabels.push(text);
                });
            }

            // 2. Send labels to AI for semantic mapping
            const res = await api.post('/documents/intelligent-autofill', {
                labels: Array.from(new Set(allLabels)) // Unique labels only
            });
            const { mapping, default_signature } = res.data; 
            
            const newFieldsToAdd: Field[] = [];
            
            // 3. Apply the mapping back to the PDF's spatial locations
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const viewport = page.getViewport({ scale: 1 });

                for (const item of textContent.items as any[]) {
                    const str = item.str.trim();
                    const value = mapping[str];

                    if (value) {
                        const x = item.transform[4] / viewport.width;
                        const y = (viewport.height - item.transform[5]) / viewport.height;

                        const alreadyAdded = [...fields, ...newFieldsToAdd].some(f => 
                            f.page === i && Math.abs(f.x - (x + 0.15)) < 0.12 && Math.abs(f.y - y) < 0.04
                        );

                        if (!alreadyAdded) {
                            const isSig = value === '[SIGNATURE]';
                            const isDate = value === '[DATE]';

                            newFieldsToAdd.push({
                                id: Math.random().toString(36).substr(2, 9),
                                type: isSig ? 'signature' : (isDate ? 'date' : 'text'),
                                x: Math.min(x + (isSig ? 0.05 : 0.15), 0.9),
                                y: y - (isSig ? 0.02 : 0),
                                value: isDate ? new Date().toISOString().split('T')[0] : (isSig ? (default_signature || '') : value),
                                page: i,
                                ...(isSig ? DEFAULT_SIG_FIELD : DEFAULT_TEXT_FIELD) as any
                            });
                        }
                    }
                }
            }

            if (newFieldsToAdd.length > 0) {
                setFields(prev => [...prev, ...newFieldsToAdd]);
                toast.success(`AI successfully mapped and filled ${newFieldsToAdd.length} fields!`, { id: tid });
            } else {
                toast.info("No corresponding fields found for your persona.", { id: tid });
            }
        } catch (error) {
            console.error(error);
            toast.error("AI intelligence service is currently unavailable.", { id: tid });
        } finally {
            setIsAutofilling(false);
        }
    };

    const saveDocument = async () => {
        setIsSaving(true);
        const tid = toast.loading("Saving PDF file...");
        try {
            const response = await api.get(pdfUrl, { responseType: 'arraybuffer' });
            const pdfDoc = await PDFDocument.load(response.data);
            const pdfPages = pdfDoc.getPages();

            // Store loaded fonts
            const fonts: Record<string, any> = {};

            const getFont = async (name: string, bold = false, italic = false) => {
                const fontKey = name;
                
                // Handle Custom Fonts
                if (CUSTOM_FONTS_META[name]) {
                    if (!fonts[fontKey]) {
                        const fontBytes = await fetch(CUSTOM_FONTS_META[name]).then(res => res.arrayBuffer());
                        fonts[fontKey] = await pdfDoc.embedFont(fontBytes);
                    }
                    return fonts[fontKey];
                }

                // Handle Standard Fonts
                let standardKey = name;
                if (name === 'Helvetica') {
                    if (bold && italic) standardKey = StandardFonts.HelveticaBoldOblique;
                    else if (bold) standardKey = StandardFonts.HelveticaBold;
                    else if (italic) standardKey = StandardFonts.HelveticaOblique;
                    else standardKey = StandardFonts.Helvetica;
                } else if (name === 'Times-Roman') {
                    if (bold && italic) standardKey = StandardFonts.TimesRomanBoldItalic;
                    else if (bold) standardKey = StandardFonts.TimesRomanBold;
                    else if (italic) standardKey = StandardFonts.TimesRomanItalic;
                    else standardKey = StandardFonts.TimesRoman;
                } else { // Courier
                    if (bold && italic) standardKey = StandardFonts.CourierBoldOblique;
                    else if (bold) standardKey = StandardFonts.CourierBold;
                    else if (italic) standardKey = StandardFonts.CourierOblique;
                    else standardKey = StandardFonts.Courier;
                }
                
                if (!fonts[standardKey]) fonts[standardKey] = await pdfDoc.embedFont(standardKey as any);
                return fonts[standardKey];
            };

            // Apply Watermark if enabled
            if (watermark) {
                pdfPages.forEach(page => {
                    const { width: pWidth, height: pHeight } = page.getSize();
                    const helveticaFont = fonts['Helvetica'] || pdfDoc.embedStandardFont(StandardFonts.HelveticaBold);
                    page.drawText(watermark, {
                        x: pWidth / 2 - 150,
                        y: pHeight / 2 - 100,
                        size: 80,
                        font: helveticaFont,
                        color: rgb(0.95, 0.95, 0.95),
                        opacity: 0.15,
                        rotate: degrees(45),
                    });
                });
            }

            for (const field of fields) {
                if (!field.value || field.value === 'false') continue;
                const pageNum = field.page - 1;
                const page = pdfPages[pageNum];
                const { height: pHeight } = page.getSize();
                const drawX = field.x * page.getWidth();
                const drawY = pHeight - (field.y * pHeight);

                try {
                    if (field.type === 'text' || field.type === 'date') {
                        const font = await getFont(field.fontFamily, field.isBold, field.isItalic);
                        const hexToRgb = (hex: string) => {
                            const r = parseInt(hex.slice(1, 3), 16) / 255;
                            const g = parseInt(hex.slice(3, 5), 16) / 255;
                            const b = parseInt(hex.slice(5, 7), 16) / 255;
                            return rgb(r, g, b);
                        };
                        page.drawText(field.value, {
                            x: drawX - (field.width / 4),
                            y: drawY - (field.height / 4),
                            size: field.fontSize,
                            font,
                            color: hexToRgb(field.color || '#000000'),
                        });
                    } else if (field.type === 'checkbox') {
                        const boxSize = 14;
                        page.drawSquare({
                            x: drawX - (boxSize / 2),
                            y: drawY - (boxSize / 2),
                            size: boxSize,
                            borderColor: rgb(0.7, 0.7, 0.7),
                            borderWidth: 1,
                            color: rgb(0.1, 0.4, 0.8),
                        });
                        page.drawText('X', {
                            x: drawX - 4,
                            y: drawY - 4,
                            size: 10,
                            color: rgb(1, 1, 1),
                        });
                    } else if (field.type === 'signature' || field.type === 'initials' || field.type === 'drawing') {
                        let sigImage;
                        if (field.value.includes('image/png')) {
                            sigImage = await pdfDoc.embedPng(field.value);
                        } else if (field.value.includes('image/jpeg') || field.value.includes('image/jpg')) {
                            sigImage = await pdfDoc.embedJpg(field.value);
                        } else {
                            sigImage = await pdfDoc.embedPng(field.value);
                        }
                        page.drawImage(sigImage, {
                            x: drawX - (field.width / 2),
                            y: drawY - (field.height / 2),
                            width: field.width,
                            height: field.height,
                        });
                    }
                } catch (e) {
                    console.error("Field embed error:", e);
                }
            }

            const pdfBytes = await pdfDoc.save();
            const base64 = Buffer.from(pdfBytes).toString('base64');

            await api.post(`/documents/${documentId}/save-signed`, { 
                pdf_base64: base64, 
                fields: fields,
                field_data: fields.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {}) 
            });
            toast.success("Document saved successfully!", { id: tid });
            if (onSaved) onSaved();
            if (onClose) onClose();
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error(`Saving failed: ${error.message || 'Unknown error'}`, { id: tid });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-zinc-100 flex flex-col overflow-hidden font-sans">
            {/* Pro Header */}
            <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-zinc-100 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">DocSign Pro</span>
                </div>

                {/* Floating Properties Toolbar */}
                {selectedField && selectedField.type === 'text' && (
                    <div className="flex items-center gap-1 bg-zinc-800 p-1.5 rounded-2xl border border-zinc-700 shadow-2xl">
                        <div className="flex items-center gap-2 px-3 border-r border-zinc-700">
                            <TypeIcon className="h-3.5 w-3.5 text-zinc-500" />
                            <select 
                                value={selectedField.fontSize}
                                onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })}
                                className="bg-transparent text-[11px] font-bold text-white outline-none"
                            >
                                {[8, 10, 12, 14, 16, 18, 20, 24, 32].map(s => <option key={s} value={s}>{s}px</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-1 px-1 border-r border-zinc-700">
                            <button 
                                onClick={() => updateField(selectedField.id, { isBold: !selectedField.isBold })}
                                className={cn("p-2 rounded-lg transition-colors", selectedField.isBold ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-700")}
                            >
                                <Bold className="h-3.5 w-3.5" />
                            </button>
                            <button 
                                onClick={() => updateField(selectedField.id, { isItalic: !selectedField.isItalic })}
                                className={cn("p-2 rounded-lg transition-colors", selectedField.isItalic ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-700")}
                            >
                                <Italic className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 px-3 border-r border-zinc-700">
                            <select 
                                value={selectedField.fontFamily}
                                onChange={(e) => updateField(selectedField.id, { fontFamily: e.target.value })}
                                className="bg-transparent text-[11px] font-bold text-white outline-none max-w-[100px]"
                            >
                                <optgroup label="Standard" className="bg-zinc-800">
                                    <option value="Helvetica">Helvetica (Sans)</option>
                                    <option value="Times-Roman">Times New Roman (Serif)</option>
                                    <option value="Courier">Courier (Mono)</option>
                                </optgroup>
                                {Object.entries(
                                    ADDITIONAL_FONTS.reduce((acc, font) => {
                                        if (!acc[font.category]) acc[font.category] = [];
                                        acc[font.category].push(font);
                                        return acc;
                                    }, {} as Record<string, FontConfig[]>)
                                ).map(([category, categoryFonts]) => (
                                    <optgroup key={category} label={category} className="bg-zinc-800 text-zinc-400">
                                        {categoryFonts.map(f => (
                                            <option key={f.id} value={f.id} className="text-white">{f.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-3">
                            <Palette className="h-3.5 w-3.5 text-zinc-500" />
                            <input 
                                type="color" 
                                value={selectedField.color}
                                onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
                                className="w-5 h-5 rounded-md cursor-pointer bg-transparent border-none"
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleAutofill} 
                        className="h-10 px-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-100 transition-all"
                    >
                        <Sparkles className="h-3.5 w-3.5 fill-emerald-600/20" /> AI Magic
                    </button>
                    <button 
                        onClick={saveDocument} 
                        className="h-10 px-6 rounded-xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-zinc-900/10"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                    </button>
                </div>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Visual Toolbar (Left) */}
                <div className="w-16 flex flex-col items-center py-6 gap-4 bg-zinc-50 border-r border-zinc-100 shrink-0">
                    <Tooltip content="Hand Tool">
                        <button 
                            onClick={() => setActiveTool('hand')}
                            className={cn("p-3 rounded-xl transition-all", activeTool === 'hand' ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-white")}
                        >
                            <MousePointer2 className="h-5 w-5" />
                        </button>
                    </Tooltip>
                    
                    <div className="w-8 h-px bg-zinc-200/50 my-2" />

                    <Tooltip content="Add Text">
                        <button 
                            onClick={() => setActiveTool('text')}
                            className={cn("p-3 rounded-xl transition-all", activeTool === 'text' ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-white")}
                        >
                            <TypeIcon className="h-5 w-5" />
                        </button>
                    </Tooltip>

                    <Tooltip content="Add Signature">
                        <button 
                            onClick={() => setActiveTool('signature')}
                            className={cn("p-3 rounded-xl transition-all", activeTool === 'signature' ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-white")}
                        >
                            <SignatureIcon className="h-5 w-5" />
                        </button>
                    </Tooltip>

                    <Tooltip content="Add Date">
                        <button 
                            onClick={() => setActiveTool('date')}
                            className={cn("p-3 rounded-xl transition-all", activeTool === 'date' ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-white")}
                        >
                            <Calendar className="h-5 w-5" />
                        </button>
                    </Tooltip>

                    <Tooltip content="Add Checkbox">
                        <button 
                            onClick={() => setActiveTool('checkbox')}
                            className={cn("p-3 rounded-xl transition-all", activeTool === 'checkbox' ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-white")}
                        >
                            <CheckSquare className="h-5 w-5" />
                        </button>
                    </Tooltip>

                    <Tooltip content="Add Initials">
                        <button 
                            onClick={() => setActiveTool('initials')}
                            className={cn("p-3 rounded-xl transition-all", activeTool === 'initials' ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-white")}
                        >
                            <Layout className="h-5 w-5" />
                        </button>
                    </Tooltip>

                    <Tooltip content="Drawing/Ink">
                        <button 
                            onClick={() => setActiveTool('drawing')}
                            className={cn("p-3 rounded-xl transition-all", activeTool === 'drawing' ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-white")}
                        >
                            <Pencil className="h-5 w-5" />
                        </button>
                    </Tooltip>

                    <div className="mt-auto flex flex-col gap-4">
                        <Tooltip content="Watermark">
                            <button 
                                onClick={() => {
                                    if (!watermark) setWatermark('DRAFT');
                                    else if (watermark === 'DRAFT') setWatermark('CONFIDENTIAL');
                                    else setWatermark(null);
                                }}
                                className={cn(
                                    "p-3 rounded-xl transition-all flex flex-col items-center gap-1 overflow-hidden",
                                    watermark ? "bg-amber-50 text-amber-600 ring-1 ring-amber-100 shadow-sm" : "text-zinc-400 hover:text-zinc-600 hover:bg-white"
                                )}
                            >
                                <ShieldAlert className="h-4 w-4" />
                                {watermark && <span className="text-[6px] font-black uppercase tracking-tighter leading-none mt-1">{watermark}</span>}
                            </button>
                        </Tooltip>

                        <div className="w-8 h-px bg-zinc-200/50 my-2" />

                        <button onClick={() => setScale(s => Math.min(s + 0.1, 3))} className="p-3 text-zinc-400 hover:text-zinc-900 transition-all">
                            <ZoomIn className="h-5 w-5" />
                        </button>
                        <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-3 text-zinc-400 hover:text-zinc-900 transition-all">
                            <ZoomOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-zinc-100 overflow-auto p-12 scroll-smooth custom-scrollbar" ref={containerRef}>
                    <div className="flex flex-col items-center min-w-max">
                        {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
                            <PdfPage
                                key={pageNum}
                                pdf={pdf}
                                pageNumber={pageNum}
                                scale={scale}
                                fields={fields.filter(f => f.page === pageNum)}
                                selectedFieldId={selectedFieldId}
                                onFieldClick={setSelectedFieldId}
                                onFieldRemove={(id, e) => { e?.stopPropagation(); setFields(prev => prev.filter(f => f.id !== id)); }}
                                onFieldUpdate={updateField}
                                onFieldPageMove={handleFieldPageMove}
                                onCanvasClick={handleCanvasClick}
                                onOpenSignature={(id) => { setSelectedFieldId(id); setShowSignatureModal(true); }}
                                activeTool={activeTool}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-14 bg-white border-t border-zinc-100 flex items-center justify-between px-8 shrink-0 z-50">
                <div className="flex items-center gap-4 bg-zinc-50 rounded-xl px-2 py-1 border border-zinc-100">
                    <button onClick={() => setScale(s => Math.max(0.2, s - 0.2)) } className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"><ZoomOut className="h-4 w-4" /></button>
                    <span className="text-[10px] font-black text-zinc-800 min-w-[32px] text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(4, s + 0.2)) } className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"><ZoomIn className="h-4 w-4" /></button>
                </div>
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Layout className="h-3 w-3" />
                    {numPages} {numPages === 1 ? 'Page' : 'Pages'}
                </div>
            </div>

            <SignatureModal 
                isOpen={showSignatureModal}
                onClose={() => setShowSignatureModal(false)}
                onSave={handleSignatureSave}
                title={selectedField?.type === 'initials' ? 'Adopt your Initials' : 'Adopt your Signature'}
            />
        </div>
    );
}
