"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Upload, 
    FileText, 
    Clock, 
    Trash2, 
    Download, 
    ShieldCheck, 
    PenTool, 
    Plus,
    Loader2,
    Search,
    History
} from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import PdfEditor from "@/components/docsign/PdfEditor";

interface Document {
    id: string;
    name: string;
    status: 'pending' | 'signed';
    created_at: string;
    signed_at: string | null;
    metadata?: { fields: any[] };
}

export default function DocSignPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [editingDocUrl, setEditingDocUrl] = useState<string | null>(null);
    const [editingFields, setEditingFields] = useState<any[]>([]);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data);
        } catch (error) {
            console.error("Failed to fetch documents");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("document", file);
        
        try {
            const res = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDocuments([res.data.document, ...documents]);
            toast.success("Document uploaded! Click 'Sign' to start.");
        } catch (error) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(documents.filter(d => d.id !== id));
            toast.success("Document deleted.");
        } catch (error) {
            toast.error("Failed to delete document.");
        }
    };

    const handleDownload = async (id: string, name: string, status: string) => {
        const type = status === 'signed' ? 'signed' : 'original';
        const tid = toast.loading("Preparing download...");
        
        try {
            const res = await api.get(`/documents/${id}/download?type=${type}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type === 'signed' ? 'signed_' : ''}${name}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success("Download started!", { id: tid });
        } catch (error) {
            console.error(error);
            toast.error("Download failed. Please try again.", { id: tid });
        }
    };

    const startSigning = (doc: Document) => {
        // We always use original as the background and overlay the saved fields
        // so that previous changes remain interactive/movable.
        const url = `${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download?type=original`;
        setEditingDocId(doc.id);
        setEditingDocUrl(url);
        setEditingFields(doc.metadata?.fields || []);
    };

    const handleClearHistory = async () => {
        if (!confirm("Are you sure you want to clear your AI auto-fill history? This cannot be undone.")) return;
        
        try {
            await api.post('/documents/clear-memory');
            toast.success("Field memory cleared successfully.");
        } catch (error) {
            toast.error("Failed to clear history.");
        }
    };

    const filteredDocs = documents.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full min-h-full pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <PenTool className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600">DocSign Pro</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">Document Signing</h1>
                    <p className="text-sm text-zinc-400 mt-1.5 max-w-xl">
                        Upload contracts, job offers, or NDAs. Fill them in seconds with AI and add your digital signature.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 h-12 px-5 rounded-2xl border border-zinc-100 text-xs font-black text-zinc-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                    >
                        <History className="h-4 w-4" />
                        Clear AI History
                    </button>
                    
                    <label className="relative flex items-center gap-2.5 h-12 px-6 rounded-2xl bg-blue-600 text-white text-xs font-black cursor-pointer hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20">
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isUploading ? "Uploading..." : "Upload PDF"}
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                </div>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900 leading-none">{documents.length}</p>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Total Docs</p>
                    </div>
                </div>
                <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900 leading-none">{documents.filter(d => d.status === 'signed').length}</p>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Signed</p>
                    </div>
                </div>
                <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900 leading-none">{documents.filter(d => d.status === 'pending').length}</p>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Pending</p>
                    </div>
                </div>
            </div>

            {/* Main List */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-sm font-black text-zinc-900">Your Documents</h3>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                        <input 
                            type="text" 
                            placeholder="Search documents..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 w-full sm:w-64 pl-10 pr-4 rounded-xl bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-200 text-xs font-bold transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                            <p className="text-xs font-bold text-zinc-300">Fetching your files...</p>
                        </div>
                    ) : filteredDocs.length > 0 ? (
                        <div className="divide-y divide-zinc-50">
                            {filteredDocs.map((doc) => (
                                <div key={doc.id} className="group px-8 py-5 flex items-center gap-6 hover:bg-zinc-50/50 transition-all">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                                        <FileText className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-zinc-900 truncate">{doc.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(doc.created_at).toLocaleDateString()}
                                            </span>
                                            <div className="h-1 w-1 rounded-full bg-zinc-200" />
                                            <span className={cn(
                                                "text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider",
                                                doc.status === 'signed' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                            )}>
                                                {doc.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <button 
                                            onClick={() => handleDownload(doc.id, doc.name, doc.status)}
                                            className="h-9 w-9 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white hover:text-blue-600 border border-transparent hover:border-zinc-100 shadow-sm transition-all"
                                            title="Download"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(doc.id)}
                                            className="h-9 w-9 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white hover:text-red-500 border border-transparent hover:border-zinc-100 shadow-sm transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => startSigning(doc)}
                                            className={cn(
                                                "h-9 px-4 rounded-xl text-white text-[11px] font-black flex items-center gap-2 transition-all shadow-lg",
                                                doc.status === 'signed' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/10"
                                            )}
                                        >
                                            <PenTool className="h-3.5 w-3.5" />
                                            {doc.status === 'signed' ? 'Edit / Sign' : 'Sign'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                            <div className="h-20 w-20 rounded-[2.5rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center mb-6">
                                <FileText className="h-8 w-8 text-zinc-200" />
                            </div>
                            <h4 className="text-base font-black text-zinc-900 mb-2">No documents yet</h4>
                            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                                Upload your first PDF to get started with AI-powered document signing.
                            </p>
                            <label className="mt-8 h-12 px-8 rounded-2xl bg-zinc-900 text-white text-xs font-black cursor-pointer hover:bg-black transition-all active:scale-95 shadow-2xl shadow-zinc-900/10 flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create your first doc
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* PDF Editor Modal */}
            <AnimatePresence>
                {editingDocId && editingDocUrl && (
                    <PdfEditor
                        documentId={editingDocId}
                        pdfUrl={editingDocUrl}
                        initialFields={editingFields}
                        onClose={() => { setEditingDocId(null); setEditingDocUrl(null); setEditingFields([]); }}
                        onSaved={() => fetchDocuments()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
